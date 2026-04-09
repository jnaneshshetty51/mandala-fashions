import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { createOrder, OrderServiceError } from "@/server/orders/service";
import { createRazorpayOrder, verifyRazorpayPayment, validateCartAndComputeTotal, PaymentError } from "@/server/payments/service";

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => void fn(req, res, next).catch(next);
}

const cartItemSchema = z.object({
  productId: z.string().optional(),
  slug: z.string().optional(),
  name: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  unitPrice: z.coerce.number().positive(),
  color: z.string().optional(),
  variantName: z.string().optional()
});

const createRazorpayOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  shippingAmount: z.coerce.number().min(0).default(0),
  discountAmount: z.coerce.number().min(0).default(0)
});

const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(8),
  shippingAddress: z.string().min(5),
  shippingAmount: z.coerce.number().min(0).default(0),
  discountAmount: z.coerce.number().min(0).default(0),
  couponCode: z.string().optional(),
  items: z.array(cartItemSchema).min(1)
});

export const paymentsRouter = Router();

// POST /api/payments/create-razorpay-order
paymentsRouter.post("/create-razorpay-order", asyncHandler(async (req, res) => {
  const parsed = createRazorpayOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request.", details: parsed.error.flatten() });
  }

  const result = await createRazorpayOrder(
    parsed.data.items,
    parsed.data.shippingAmount,
    parsed.data.discountAmount
  );

  return res.json({ data: result });
}));

// POST /api/payments/verify
paymentsRouter.post("/verify", asyncHandler(async (req, res) => {
  const parsed = verifyPaymentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request.", details: parsed.error.flatten() });
  }

  const d = parsed.data;
  await verifyRazorpayPayment(d.razorpayOrderId, d.razorpayPaymentId, d.razorpaySignature);

  const order = await createOrder({
    customerName: d.customerName,
    customerEmail: d.customerEmail,
    customerPhone: d.customerPhone,
    shippingAddress: d.shippingAddress,
    shippingAmount: d.shippingAmount,
    couponCode: d.couponCode,
    paymentMethod: "razorpay",
    razorpayOrderId: d.razorpayOrderId,
    razorpayPaymentId: d.razorpayPaymentId,
    items: d.items
  });

  // Trigger confirmation email (non-blocking, service created by separate agent)
  void (async () => {
    try {
      const { sendOrderConfirmationEmail } = await import("@/server/email/service");
      await sendOrderConfirmationEmail(order);
    } catch { /* email not configured */ }
  })();

  return res.json({ data: { orderNumber: order.orderNumber } });
}));
