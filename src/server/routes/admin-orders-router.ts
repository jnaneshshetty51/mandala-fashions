import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import { requireRequestRole } from "@/server/auth/guards";
import { prisma } from "@/server/db";
import { listAdminOrders } from "@/server/admin/service";

function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next);
  };
}

const statusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
});

export const adminOrdersRouter = Router();

// GET / — list all orders
adminOrdersRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const orders = await listAdminOrders();
    res.json({ data: orders });
  })
);

// GET /:id — get single order by DB id
adminOrdersRouter.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      res.status(404).json({ error: "Order not found." });
      return;
    }

    res.json({ data: order });
  })
);

// PATCH /:id/status — update order status
adminOrdersRouter.patch(
  "/:id/status",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);

    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid status value.", details: parsed.error.flatten() });
      return;
    }

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Order not found." });
      return;
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status }
    });

    res.json({ data: { id: updated.id, status: updated.status } });
  })
);
