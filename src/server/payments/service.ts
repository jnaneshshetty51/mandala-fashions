import Razorpay from "razorpay";
import crypto from "node:crypto";

import { resolvePurchasableCartItems } from "@/server/catalog/purchasing";
import { getRazorpaySettings } from "@/server/settings/service";

export class PaymentError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "PaymentError";
    this.statusCode = statusCode;
  }
}

function getRazorpayInstance(keyId: string, keySecret: string) {
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// Validate cart items against DB and compute server-side total (never trust client prices)
export async function validateCartAndComputeTotal(
  items: Array<{ productId?: string; slug?: string; quantity: number; unitPrice: number; name: string; color?: string; variantName?: string }>,
  shippingAmount = 0,
  discountAmount = 0
) {
  const resolvedItems = await resolvePurchasableCartItems(items);
  const missingProduct = resolvedItems.find((entry) => !entry?.product);

  if (missingProduct) {
    throw new PaymentError("Some products in your cart are no longer available.");
  }

  const productMap = new Map(resolvedItems.map((entry) => [entry!.product.id, entry!.product]));

  for (const entry of resolvedItems) {
    const item = entry!.item;
    const product = entry!.product;
    if (!product) throw new PaymentError("Some products in your cart are no longer available.");
    if (product.inventoryCount < item.quantity) {
      throw new PaymentError(`"${product.name}" has limited stock. Please update your cart.`);
    }
  }

  const subtotal = resolvedItems.reduce((sum, entry) => {
    const item = entry!.item;
    return sum + item.unitPrice * item.quantity;
  }, 0);

  const total = Math.max(subtotal + shippingAmount - discountAmount, 0);
  return { subtotal, total, productMap };
}

export async function createRazorpayOrder(
  items: Array<{ productId?: string; slug?: string; quantity: number; unitPrice: number; name: string; color?: string; variantName?: string }>,
  shippingAmount = 0,
  discountAmount = 0
) {
  const settings = await getRazorpaySettings();
  if (!settings.keyId || !settings.keySecret) {
    throw new PaymentError("Payment gateway is not configured. Please contact support.", 503);
  }

  const { total } = await validateCartAndComputeTotal(items, shippingAmount, discountAmount);

  const razorpay = getRazorpayInstance(settings.keyId, settings.keySecret);
  const order = await razorpay.orders.create({
    amount: Math.round(total * 100), // paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`
  });

  return {
    razorpayOrderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: settings.keyId
  };
}

export async function verifyRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  const settings = await getRazorpaySettings();
  if (!settings.keySecret) throw new PaymentError("Payment gateway not configured.", 503);

  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto.createHmac("sha256", settings.keySecret).update(body).digest("hex");

  if (expected !== razorpaySignature) {
    throw new PaymentError("Payment verification failed. Please contact support.", 400);
  }
}
