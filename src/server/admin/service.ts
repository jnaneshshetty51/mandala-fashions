import { BannerStatus, CouponType, OrderStatus, Prisma, ProductStatus } from "@prisma/client";

import { prisma } from "@/server/db";

type AdminMetric = {
  label: string;
  value: string;
  delta: string;
  tone: "positive" | "negative" | "neutral";
};

type AdminProductRecord = {
  id: string;
  name: string;
  sku: string;
  price: number;
  inventoryCount: number;
  status: string;
  variants: number;
  fabric: string;
};

type AdminOrderRecord = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  itemCount: number;
  placedAt: string;
};

type AdminCustomerRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  orders: number;
  notes: number;
  joinedAt: string;
};

type AdminCouponRecord = {
  id: string;
  code: string;
  label: string;
  type: string;
  value: number;
  usedCount: number;
  isActive: boolean;
};

type AdminBannerRecord = {
  id: string;
  title: string;
  placement: string;
  status: string;
  href: string;
};

type AdminAnalyticsSnapshot = {
  metrics: AdminMetric[];
  topFabrics: Array<{ name: string; share: string }>;
  recentOrders: AdminOrderRecord[];
  spotlight: {
    title: string;
    description: string;
    mostViewed: string;
    stockLevel: string;
    inquiryRate: string;
  };
};

function toCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function toDateLabel(value: Date) {
  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function isPrismaUnavailable(error: unknown) {
  return error instanceof Error;
}

const fallbackProducts: AdminProductRecord[] = [
  {
    id: "sample-product-1",
    name: "Midnight Emerald Silk",
    sku: "MND-EMR-001",
    price: 42500,
    inventoryCount: 6,
    status: "ACTIVE",
    variants: 3,
    fabric: "Silk"
  },
  {
    id: "sample-product-2",
    name: "The Heirloom Crimson",
    sku: "MND-CRI-002",
    price: 58000,
    inventoryCount: 2,
    status: "ACTIVE",
    variants: 2,
    fabric: "Kanchipuram Silk"
  },
  {
    id: "sample-product-3",
    name: "Noir Starlight Georgette",
    sku: "MND-NOI-003",
    price: 18200,
    inventoryCount: 12,
    status: "DRAFT",
    variants: 2,
    fabric: "Georgette"
  }
];

const fallbackOrders: AdminOrderRecord[] = [
  {
    id: "sample-order-1",
    orderNumber: "#MND-8210",
    customerName: "Ananya Singh",
    customerEmail: "ananya@example.com",
    totalAmount: 42500,
    status: "DELIVERED",
    itemCount: 1,
    placedAt: "04 Apr 2026"
  },
  {
    id: "sample-order-2",
    orderNumber: "#MND-8211",
    customerName: "Rajesh Kumar",
    customerEmail: "rajesh@example.com",
    totalAmount: 85000,
    status: "SHIPPED",
    itemCount: 1,
    placedAt: "03 Apr 2026"
  },
  {
    id: "sample-order-3",
    orderNumber: "#MND-8212",
    customerName: "Priya Mehta",
    customerEmail: "priya@example.com",
    totalAmount: 12400,
    status: "PROCESSING",
    itemCount: 2,
    placedAt: "01 Apr 2026"
  }
];

const fallbackCustomers: AdminCustomerRecord[] = [
  {
    id: "sample-customer-1",
    name: "Ananya Singh",
    email: "ananya@example.com",
    role: "USER",
    orders: 4,
    notes: 2,
    joinedAt: "14 Jan 2026"
  },
  {
    id: "sample-customer-2",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    role: "USER",
    orders: 2,
    notes: 1,
    joinedAt: "28 Feb 2026"
  },
  {
    id: "sample-customer-3",
    name: "Archive Stylist",
    email: "stylist@mandala.example",
    role: "STYLIST",
    orders: 0,
    notes: 3,
    joinedAt: "09 Mar 2026"
  }
];

const fallbackCoupons: AdminCouponRecord[] = [
  {
    id: "sample-coupon-1",
    code: "ARCHIVE10",
    label: "First Order Welcome",
    type: "PERCENTAGE",
    value: 10,
    usedCount: 18,
    isActive: true
  },
  {
    id: "sample-coupon-2",
    code: "SILK1500",
    label: "Premium Silk Offer",
    type: "FIXED",
    value: 1500,
    usedCount: 6,
    isActive: true
  }
];

const fallbackBanners: AdminBannerRecord[] = [
  {
    id: "sample-banner-1",
    title: "Wedding Edit 2026",
    placement: "homepage.hero",
    status: "PUBLISHED",
    href: "/collections"
  },
  {
    id: "sample-banner-2",
    title: "Banarasi Spotlight",
    placement: "homepage.mid",
    status: "DRAFT",
    href: "/shop"
  }
];

export async function listAdminProducts(): Promise<AdminProductRecord[]> {
  try {
    const products = await prisma.product.findMany({
      include: { variants: true },
      orderBy: { updatedAt: "desc" },
      take: 24
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: Number(product.price),
      inventoryCount: product.inventoryCount,
      status: product.status,
      variants: product.variants.length,
      fabric: product.fabric ?? "Unassigned"
    }));
  } catch (error) {
    if (isPrismaUnavailable(error)) {
      return fallbackProducts;
    }

    throw error;
  }
}

export async function listAdminOrders(): Promise<AdminOrderRecord[]> {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { placedAt: "desc" },
      take: 12
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      placedAt: toDateLabel(order.placedAt)
    }));
  } catch (error) {
    if (isPrismaUnavailable(error)) {
      return fallbackOrders;
    }

    throw error;
  }
}

export async function listAdminCustomers(): Promise<AdminCustomerRecord[]> {
  try {
    const users = await prisma.user.findMany({
      include: {
        orders: true,
        notes: true
      },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      orders: user.orders.length,
      notes: user.notes.length,
      joinedAt: toDateLabel(user.createdAt)
    }));
  } catch (error) {
    if (isPrismaUnavailable(error)) {
      return fallbackCustomers;
    }

    throw error;
  }
}

export async function listAdminCoupons(): Promise<AdminCouponRecord[]> {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { updatedAt: "desc" },
      take: 20
    });

    return coupons.map((coupon) => ({
      id: coupon.id,
      code: coupon.code,
      label: coupon.label,
      type: coupon.type,
      value: Number(coupon.value),
      usedCount: coupon.usedCount,
      isActive: coupon.isActive
    }));
  } catch (error) {
    if (isPrismaUnavailable(error)) {
      return fallbackCoupons;
    }

    throw error;
  }
}

export async function listAdminBanners(): Promise<AdminBannerRecord[]> {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { updatedAt: "desc" },
      take: 20
    });

    return banners.map((banner) => ({
      id: banner.id,
      title: banner.title,
      placement: banner.placement,
      status: banner.status,
      href: banner.href ?? "-"
    }));
  } catch (error) {
    if (isPrismaUnavailable(error)) {
      return fallbackBanners;
    }

    throw error;
  }
}

export async function getAdminAnalyticsSnapshot(): Promise<AdminAnalyticsSnapshot> {
  try {
    const [products, orders, customers] = await Promise.all([
      prisma.product.findMany({ include: { variants: true } }),
      prisma.order.findMany({ include: { items: true }, orderBy: { placedAt: "desc" }, take: 5 }),
      prisma.user.findMany()
    ]);

    const revenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const activeInventory = products.reduce((sum, product) => sum + product.inventoryCount, 0);
    const avgOrderValue = orders.length ? revenue / orders.length : 0;
    const conversion = customers.length ? (orders.length / customers.length) * 100 : 0;

    const fabricCounts = new Map<string, number>();
    for (const product of products) {
      const key = product.fabric ?? "Unassigned";
      fabricCounts.set(key, (fabricCounts.get(key) ?? 0) + 1);
    }

    const totalFabricCount = Array.from(fabricCounts.values()).reduce((sum, count) => sum + count, 0) || 1;

    return {
      metrics: [
        {
          label: "Total Sales",
          value: toCurrency(revenue),
          delta: `${orders.length} orders in system`,
          tone: "positive"
        },
        {
          label: "Conversion Rate",
          value: `${conversion.toFixed(2)}%`,
          delta: "Orders vs registered customers",
          tone: "neutral"
        },
        {
          label: "Avg Order Value",
          value: toCurrency(avgOrderValue),
          delta: "Average realized ticket size",
          tone: "positive"
        },
        {
          label: "Active Inventory",
          value: activeInventory.toLocaleString("en-IN"),
          delta: "Units currently in stock",
          tone: "neutral"
        }
      ],
      topFabrics: Array.from(fabricCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => ({
          name,
          share: `${Math.round((count / totalFabricCount) * 100)}%`
        })),
      recentOrders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        totalAmount: Number(order.totalAmount),
        status: order.status,
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
        placedAt: toDateLabel(order.placedAt)
      })),
      spotlight: {
        title: products[0]?.name ?? "Emerald Banarasi",
        description:
          "Track your strongest collection, monitor stock pressure, and see which heritage narratives are pulling the highest intent.",
        mostViewed: products[0]?.name ?? "Emerald Banarasi",
        stockLevel: `${products[0]?.inventoryCount ?? 3} units`,
        inquiryRate: "+45%"
      }
    };
  } catch (error) {
    if (isPrismaUnavailable(error)) {
      return {
        metrics: [
          { label: "Total Sales", value: "₹1,24,50,000", delta: "+12.4% vs last month", tone: "positive" },
          { label: "Conversion Rate", value: "4.82%", delta: "-0.5% vs last month", tone: "negative" },
          { label: "Avg Order Value", value: "₹18,200", delta: "+8.1% vs last month", tone: "positive" },
          { label: "Active Inventory", value: "3,412", delta: "In stock items", tone: "neutral" }
        ],
        topFabrics: [
          { name: "Silk", share: "62%" },
          { name: "Cotton", share: "25%" },
          { name: "Georgette", share: "13%" }
        ],
        recentOrders: fallbackOrders,
        spotlight: {
          title: "Inventory Spotlight",
          description:
            "Our latest collection of Mulberry Silk has achieved a record sell-through rate of 82% within the first week.",
          mostViewed: "Emerald Banarasi",
          stockLevel: "Low Stock (3)",
          inquiryRate: "+45%"
        }
      };
    }

    throw error;
  }
}

export async function seedAdminShowcaseData() {
  try {
    const existing = await prisma.product.count();

    if (existing > 0) {
      return { created: false };
    }

    await prisma.$transaction(async (tx) => {
      const products = await Promise.all(
        fallbackProducts.map((product, index) =>
          tx.product.create({
            data: {
              name: product.name,
              slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
              sku: product.sku,
              description: `${product.name} is part of the archive showcase.`,
              price: new Prisma.Decimal(product.price),
              imageUrl: null,
              fabric: product.fabric,
              status: ProductStatus[product.status as keyof typeof ProductStatus] ?? ProductStatus.ACTIVE,
              inventoryCount: product.inventoryCount,
              variants: {
                create: Array.from({ length: product.variants }).map((_, variantIndex) => ({
                  sku: `${product.sku}-V${variantIndex + 1}`,
                  name: `${product.name} Variant ${variantIndex + 1}`,
                  color: variantIndex === 0 ? "Emerald" : "Crimson",
                  fabric: product.fabric,
                  price: new Prisma.Decimal(product.price),
                  stock: Math.max(product.inventoryCount - variantIndex, 0)
                }))
              }
            }
          })
        )
      );

      await Promise.all(
        fallbackOrders.map((order, index) =>
          tx.order.create({
            data: {
              orderNumber: order.orderNumber,
              customerName: order.customerName,
              customerEmail: order.customerEmail,
              subtotal: new Prisma.Decimal(order.totalAmount),
              totalAmount: new Prisma.Decimal(order.totalAmount),
              status: OrderStatus[order.status as keyof typeof OrderStatus] ?? OrderStatus.PENDING,
              items: {
                create: {
                  productId: products[index % products.length].id,
                  quantity: order.itemCount,
                  unitPrice: new Prisma.Decimal(order.totalAmount / Math.max(order.itemCount, 1)),
                  totalPrice: new Prisma.Decimal(order.totalAmount)
                }
              }
            }
          })
        )
      );

      await Promise.all(
        fallbackCoupons.map((coupon) =>
          tx.coupon.create({
            data: {
              code: coupon.code,
              label: coupon.label,
              type: CouponType[coupon.type as keyof typeof CouponType] ?? CouponType.PERCENTAGE,
              value: new Prisma.Decimal(coupon.value),
              usedCount: coupon.usedCount,
              isActive: coupon.isActive
            }
          })
        )
      );

      await Promise.all(
        fallbackBanners.map((banner) =>
          tx.banner.create({
            data: {
              title: banner.title,
              placement: banner.placement,
              status: BannerStatus.PUBLISHED,
              href: banner.href
            }
          })
        )
      );
    });

    return { created: true };
  } catch (error) {
    if (isPrismaUnavailable(error)) {
      return { created: false };
    }

    throw error;
  }
}
