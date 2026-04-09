import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import { requireRequestRole } from "@/server/auth/guards";
import { listAdminCoupons } from "@/server/admin/service";
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
  validateCoupon
} from "@/server/coupons/service";

function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next);
  };
}

const createCouponSchema = z.object({
  code: z.string().min(2).max(30),
  label: z.string().min(2),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().positive(),
  minOrder: z.coerce.number().positive().optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true)
});

const updateCouponSchema = createCouponSchema.partial();

const validateCouponSchema = z.object({
  code: z.string(),
  subtotal: z.coerce.number()
});

export const adminCouponsRouter = Router();

// GET / — list all coupons
adminCouponsRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const coupons = await listAdminCoupons();
    res.json({ data: coupons });
  })
);

// POST / — create coupon
adminCouponsRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const parsed = createCouponSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid coupon data.", details: parsed.error.flatten() });
      return;
    }

    const coupon = await createCoupon(parsed.data);
    res.status(201).json({ data: coupon });
  })
);

// PATCH /:id — update coupon
adminCouponsRouter.patch(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);

    const parsed = updateCouponSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid coupon data.", details: parsed.error.flatten() });
      return;
    }

    const coupon = await updateCoupon(id, parsed.data);
    res.json({ data: coupon });
  })
);

// DELETE /:id — delete coupon
adminCouponsRouter.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);
    await deleteCoupon(id);
    res.json({ data: { deleted: true } });
  })
);

// PATCH /:id/toggle — toggle active status
adminCouponsRouter.patch(
  "/:id/toggle",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);
    const coupon = await toggleCoupon(id);
    res.json({ data: { id: coupon.id, isActive: coupon.isActive } });
  })
);

// Public router — no auth required
export const couponPublicRouter = Router();

// POST /validate — validate coupon for checkout (public)
couponPublicRouter.post(
  "/validate",
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = validateCouponSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request.", details: parsed.error.flatten() });
      return;
    }

    const result = await validateCoupon(parsed.data.code, parsed.data.subtotal);
    res.json({ data: result });
  })
);
