import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import { requireRequestRole } from "@/server/auth/guards";
import { prisma } from "@/server/db";
import { listAdminCustomers } from "@/server/admin/service";

function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next);
  };
}

const addNoteSchema = z.object({
  note: z.string().min(1).max(500)
});

const updateRoleSchema = z.object({
  role: z.enum(["USER", "STYLIST", "ADMIN"])
});

export const adminCustomersRouter = Router();

// GET / — list customers
adminCustomersRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const customers = await listAdminCustomers();
    res.json({ data: customers });
  })
);

// GET /:id — get single customer
adminCustomersRouter.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);

    const customer = await prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          include: { items: { include: { product: true } } },
          orderBy: { placedAt: "desc" },
          take: 10
        },
        notes: { orderBy: { createdAt: "desc" } }
      }
    });

    if (!customer) {
      res.status(404).json({ error: "Customer not found." });
      return;
    }

    // Strip passwordHash
    const { passwordHash: _passwordHash, ...safeCustomer } = customer as typeof customer & {
      passwordHash?: string;
    };
    void _passwordHash;

    res.json({ data: safeCustomer });
  })
);

// POST /:id/notes — add CRM note
adminCustomersRouter.post(
  "/:id/notes",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);

    const parsed = addNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input.", details: parsed.error.flatten() });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Customer not found." });
      return;
    }

    const note = await prisma.customerNote.create({
      data: {
        userId: id,
        note: parsed.data.note
      }
    });

    res.status(201).json({ data: note });
  })
);

// DELETE /:id/notes/:noteId — delete note
adminCustomersRouter.delete(
  "/:id/notes/:noteId",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);
    const noteId = String(req.params["noteId"]);

    const note = await prisma.customerNote.findUnique({ where: { id: noteId } });

    if (!note || note.userId !== id) {
      res.status(404).json({ error: "Note not found." });
      return;
    }

    await prisma.customerNote.delete({ where: { id: noteId } });
    res.json({ data: { deleted: true } });
  })
);

// PATCH /:id/role — update customer role
adminCustomersRouter.patch(
  "/:id/role",
  asyncHandler(async (req: Request, res: Response) => {
    const adminUser = requireRequestRole(req, res, ["ADMIN"]);
    if (!adminUser) return;

    const id = String(req.params["id"]);

    if (adminUser.id === id) {
      res.status(400).json({ error: "You cannot change your own role." });
      return;
    }

    const parsed = updateRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid role value.", details: parsed.error.flatten() });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Customer not found." });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: parsed.data.role }
    });

    res.json({ data: { id: updated.id, role: updated.role } });
  })
);
