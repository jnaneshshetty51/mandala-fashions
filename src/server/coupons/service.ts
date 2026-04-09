import { Prisma } from "@prisma/client";

import { prisma } from "@/server/db";

export type CreateCouponInput = {
  code: string;
  label: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrder?: number;
  usageLimit?: number;
  expiresAt?: string;
  isActive?: boolean;
};

export type UpdateCouponInput = Partial<CreateCouponInput>;

export async function createCoupon(input: CreateCouponInput) {
  return prisma.coupon.create({
    data: {
      code: input.code.toUpperCase(),
      label: input.label,
      type: input.type,
      value: new Prisma.Decimal(input.value),
      minOrder: input.minOrder != null ? new Prisma.Decimal(input.minOrder) : null,
      usageLimit: input.usageLimit ?? null,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      isActive: input.isActive ?? true
    }
  });
}

export async function updateCoupon(id: string, input: UpdateCouponInput) {
  return prisma.coupon.update({
    where: { id },
    data: {
      ...(input.code !== undefined && { code: input.code.toUpperCase() }),
      ...(input.label !== undefined && { label: input.label }),
      ...(input.type !== undefined && { type: input.type }),
      ...(input.value !== undefined && { value: new Prisma.Decimal(input.value) }),
      ...(input.minOrder !== undefined && {
        minOrder: input.minOrder != null ? new Prisma.Decimal(input.minOrder) : null
      }),
      ...(input.usageLimit !== undefined && { usageLimit: input.usageLimit ?? null }),
      ...(input.expiresAt !== undefined && {
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null
      }),
      ...(input.isActive !== undefined && { isActive: input.isActive })
    }
  });
}

export async function deleteCoupon(id: string) {
  return prisma.coupon.delete({ where: { id } });
}

export async function toggleCoupon(id: string) {
  const coupon = await prisma.coupon.findUnique({ where: { id }, select: { isActive: true } });

  if (!coupon) {
    throw new Error("Coupon not found.");
  }

  return prisma.coupon.update({
    where: { id },
    data: { isActive: !coupon.isActive }
  });
}

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<{
  valid: boolean;
  discountAmount: number;
  error?: string;
  coupon?: { id: string; code: string; type: string; value: number };
}> {
  const coupon = await prisma.coupon.findFirst({
    where: { code: { equals: code.toUpperCase() } }
  });

  if (!coupon) {
    return { valid: false, discountAmount: 0, error: "Invalid coupon code." };
  }

  if (!coupon.isActive) {
    return { valid: false, discountAmount: 0, error: "This coupon is no longer active." };
  }

  const now = new Date();

  if (coupon.expiresAt && coupon.expiresAt < now) {
    return { valid: false, discountAmount: 0, error: "This coupon has expired." };
  }

  if (coupon.startsAt && coupon.startsAt > now) {
    return { valid: false, discountAmount: 0, error: "This coupon is not yet valid." };
  }

  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, discountAmount: 0, error: "This coupon has reached its usage limit." };
  }

  if (coupon.minOrder != null && subtotal < Number(coupon.minOrder)) {
    return {
      valid: false,
      discountAmount: 0,
      error: `Minimum order of ₹${Number(coupon.minOrder)} required.`
    };
  }

  const discountAmount =
    coupon.type === "PERCENTAGE"
      ? Math.floor((subtotal * Number(coupon.value)) / 100)
      : Math.min(Number(coupon.value), subtotal);

  return {
    valid: true,
    discountAmount,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: Number(coupon.value)
    }
  };
}

export async function incrementCouponUsage(code: string) {
  return prisma.coupon.update({
    where: { code: code.toUpperCase() },
    data: { usedCount: { increment: 1 } }
  });
}
