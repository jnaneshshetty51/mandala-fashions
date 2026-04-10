import { InventoryMovementType, OrderStatus, Prisma } from "@prisma/client";

import { resolvePurchasableCartItems } from "@/server/catalog/purchasing";
import { prisma } from "@/server/db";

export class OrderServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "OrderServiceError";
    this.statusCode = statusCode;
  }
}

type OrderLineInput = {
  productId?: string | null;
  slug?: string | null;
  quantity: number;
  unitPrice: number;
  name: string;
  color?: string | null;
  variantName?: string | null;
};

type CreateOrderInput = {
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  shippingAmount?: number;
  discountAmount?: number;
  couponCode?: string;
  paymentMethod?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  items: OrderLineInput[];
};

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

function formatCurrency(value: Prisma.Decimal | number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value));
}

function formatDate(value: Date) {
  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function getExpectedDeliveryDate(placedAt: Date) {
  return new Date(placedAt.getTime() + 5 * 24 * 60 * 60 * 1000);
}

function getTrackingMessage(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "Your order has been received and is awaiting boutique confirmation.";
    case "PROCESSING":
      return "Your order is being prepared and quality checked by the boutique.";
    case "SHIPPED":
      return "Your order has been dispatched and is in transit.";
    case "DELIVERED":
      return "Your order has been delivered successfully.";
    case "CANCELLED":
      return "This order has been cancelled. Contact support if you need assistance.";
    default:
      return "Your order is being processed.";
  }
}

function toOrderSummary(order: OrderWithRelations) {
  const expectedDelivery = getExpectedDeliveryDate(order.placedAt);

  return {
    id: order.id,
    userId: order.userId,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    status: order.status,
    placedAt: order.placedAt.toISOString(),
    placedAtLabel: formatDate(order.placedAt),
    expectedDelivery: expectedDelivery.toISOString(),
    expectedDeliveryLabel: formatDate(expectedDelivery),
    trackingMessage: getTrackingMessage(order.status),
    subtotal: Number(order.subtotal),
    subtotalLabel: formatCurrency(order.subtotal),
    shippingAmount: Number(order.shippingAmount),
    shippingAmountLabel: order.shippingAmount.gt(0) ? formatCurrency(order.shippingAmount) : "Complimentary",
    discountAmount: Number(order.discountAmount),
    discountAmountLabel: order.discountAmount.gt(0) ? formatCurrency(order.discountAmount) : formatCurrency(0),
    totalAmount: Number(order.totalAmount),
    totalAmountLabel: formatCurrency(order.totalAmount),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      unitPriceLabel: formatCurrency(item.unitPrice),
      totalPrice: Number(item.totalPrice),
      totalPriceLabel: formatCurrency(item.totalPrice)
    }))
  };
}

async function generateUniqueOrderNumber(tx: Prisma.TransactionClient) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const orderNumber = `MND-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
    const existing = await tx.order.findUnique({
      where: { orderNumber },
      select: { id: true }
    });

    if (!existing) {
      return orderNumber;
    }
  }

  throw new OrderServiceError("Unable to generate a unique order number. Please try again.", 500);
}

export async function createOrder(input: CreateOrderInput) {
  if (input.items.length === 0) {
    throw new OrderServiceError("Your cart is empty.");
  }

  const resolvedItems = await resolvePurchasableCartItems(input.items);
  const missingProductReference = resolvedItems.find((item) => !item?.product);

  if (missingProductReference) {
    throw new OrderServiceError(
      "One or more cart items are no longer purchasable. Please refresh your cart and try again."
    );
  }

  const quantityByProduct = new Map<string, number>();

  resolvedItems.forEach((entry) => {
    const productId = entry!.product.id;
    const item = entry!.item;
    quantityByProduct.set(productId, (quantityByProduct.get(productId) ?? 0) + item.quantity);
  });

  const productIds = [...quantityByProduct.keys()];

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      status: "ACTIVE"
    }
  });

  if (products.length !== productIds.length) {
    throw new OrderServiceError("Some products in your cart are no longer available.");
  }

  const productMap = new Map(products.map((product) => [product.id, product]));

  for (const [productId, requestedQuantity] of quantityByProduct.entries()) {
    const product = productMap.get(productId);

    if (!product) {
      throw new OrderServiceError("Some products in your cart are no longer available.");
    }

    if (product.inventoryCount < requestedQuantity) {
      throw new OrderServiceError(`"${product.name}" has limited stock left. Please update your cart.`);
    }
  }

  // Coupon validation
  let couponDiscount = input.discountAmount ?? 0;
  let validatedCouponCode: string | undefined;

  if (input.couponCode) {
    const { validateCoupon } = await import("@/server/coupons/service");
    const subtotalForCoupon = resolvedItems.reduce((sum, entry) => {
      const item = entry!.item;
      return sum + item.unitPrice * item.quantity;
    }, 0);
    const couponResult = await validateCoupon(input.couponCode, subtotalForCoupon);
    if (!couponResult.valid) {
      throw new OrderServiceError(couponResult.error ?? "Invalid coupon.");
    }
    couponDiscount = couponResult.discountAmount;
    validatedCouponCode = input.couponCode;
  }

  const shippingAmount = input.shippingAmount ?? 0;
  const discountAmount = couponDiscount;

  const subtotal = resolvedItems.reduce((sum, entry) => {
    const item = entry!.item;
    return sum + item.unitPrice * item.quantity;
  }, 0);

  const totalAmount = Math.max(subtotal + shippingAmount - discountAmount, 0);

  const order = await prisma.$transaction(async (tx) => {
    for (const [productId, requestedQuantity] of quantityByProduct.entries()) {
      const updated = await tx.product.updateMany({
        where: {
          id: productId,
          status: "ACTIVE",
          inventoryCount: { gte: requestedQuantity }
        },
        data: {
          inventoryCount: { decrement: requestedQuantity }
        }
      });

      if (updated.count === 0) {
        const product = productMap.get(productId);
        throw new OrderServiceError(
          product ? `"${product.name}" sold out while you were checking out.` : "A product became unavailable during checkout."
        );
      }
    }

    const orderNumber = await generateUniqueOrderNumber(tx);

    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        userId: input.userId,
        customerName: input.customerName.trim(),
        customerEmail: input.customerEmail.trim().toLowerCase(),
        customerPhone: input.customerPhone?.trim(),
        shippingAddress: input.shippingAddress.trim(),
        paymentMethod: input.paymentMethod ?? "cod",
        razorpayOrderId: input.razorpayOrderId,
        razorpayPaymentId: input.razorpayPaymentId,
        subtotal: new Prisma.Decimal(subtotal),
        shippingAmount: new Prisma.Decimal(shippingAmount),
        discountAmount: new Prisma.Decimal(discountAmount),
        totalAmount: new Prisma.Decimal(totalAmount),
        items: {
          create: resolvedItems.map((entry) => {
            const item = entry!.item;
            const product = entry!.product;
            const unitPrice = item.unitPrice;

            return {
              productId: product.id,
              quantity: item.quantity,
              unitPrice: new Prisma.Decimal(unitPrice),
              totalPrice: new Prisma.Decimal(unitPrice * item.quantity)
            };
          })
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    for (const [productId, requestedQuantity] of quantityByProduct.entries()) {
      await tx.inventoryMovement.create({
        data: {
          productId,
          type: InventoryMovementType.OUT,
          quantity: -requestedQuantity,
          note: `Reserved by order ${createdOrder.orderNumber}.`
        }
      });
    }

    return createdOrder;
  });

  if (validatedCouponCode) {
    const { incrementCouponUsage } = await import("@/server/coupons/service");
    await incrementCouponUsage(validatedCouponCode).catch(() => {
      // Non-critical — don't fail the order
    });
  }

  return toOrderSummary(order);
}

export async function getOrderByNumber(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return order ? toOrderSummary(order) : null;
}

export async function getOrderByNumberForUser(orderNumber: string, userId: string) {
  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      userId
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return order ? toOrderSummary(order) : null;
}

export async function listOrdersForUser(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { placedAt: "desc" }
  });

  return orders.map(toOrderSummary);
}

export async function trackOrder(input: {
  orderNumber: string;
  customerEmail?: string;
  customerPhone?: string;
}) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: input.orderNumber.trim() },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order) {
    return null;
  }

  const normalizedEmail = input.customerEmail?.trim().toLowerCase();
  const normalizedPhone = input.customerPhone?.trim();
  const emailMatches = normalizedEmail ? order.customerEmail.toLowerCase() === normalizedEmail : false;
  const phoneMatches = normalizedPhone ? order.customerPhone === normalizedPhone : false;

  if (!emailMatches && !phoneMatches) {
    return null;
  }

  return toOrderSummary(order);
}
