import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import { requireRequestRole } from "@/server/auth/guards";
import { listAdminProducts } from "@/server/admin/service";
import {
  adjustInventory,
  bulkImportProducts,
  createProduct,
  deleteProduct,
  getAdminProduct,
  updateProduct
} from "@/server/products/service";

function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next);
  };
}

function optionalTrimmedString(minLength = 0) {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, minLength > 0 ? z.string().min(minLength).optional() : z.string().optional());
}

function optionalUrlString() {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().url().optional());
}

function mediaUrlString() {
  return z.string().refine((value) => value.startsWith("/media/") || z.string().url().safeParse(value).success, {
    message: "Must be a valid URL or media path."
  });
}

function optionalMediaUrlString() {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, mediaUrlString().optional());
}

function optionalNumber() {
  return z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    return value;
  }, z.coerce.number().optional());
}

function optionalInteger(minValue?: number) {
  return z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    return value;
  }, typeof minValue === "number" ? z.coerce.number().int().min(minValue).optional() : z.coerce.number().int().optional());
}

const createProductSchema = z.object({
  category: z.string().min(2),
  material: z.string().min(2),
  type: z.string().min(2),
  variant: z.string().optional(),
  description: z.string().min(10),
  length: z.string().optional(),
  colors: z.string().optional(),
  price: z.coerce.number().positive(),
  sku: z.string().min(2),
  qty: z.coerce.number().int().min(0).optional(),
  imageUrl: optionalMediaUrlString(),
  imageUrls: z.array(mediaUrlString()).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional()
});

const updateProductSchema = z
  .object({
    category: optionalTrimmedString(1),
    material: optionalTrimmedString(1),
    type: optionalTrimmedString(1),
    variant: optionalTrimmedString(),
    description: optionalTrimmedString(1),
    length: optionalTrimmedString(),
    colors: optionalTrimmedString(),
    price: optionalNumber().pipe(z.number().positive().optional()),
    sku: optionalTrimmedString(1),
    imageUrl: optionalMediaUrlString(),
    imageUrls: z.array(mediaUrlString()).optional(),
    qty: optionalInteger(0),
    status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided."
  });

const statusSchema = z.object({
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"])
});

const inventorySchema = z.object({
  delta: z.number().int()
});

export const adminProductsRouter = Router();

// POST / — create product
adminProductsRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid product payload.", details: parsed.error.flatten() });
      return;
    }

    const product = await createProduct(parsed.data);
    res.status(201).json({ data: product });
  })
);

// GET / — list all products
adminProductsRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const products = await listAdminProducts();
    res.json({ data: products });
  })
);

// GET /:id — get single product
adminProductsRouter.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);
    const product = await getAdminProduct(id);

    if (!product) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    res.json({ data: product });
  })
);

// PUT /:id — update product
adminProductsRouter.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);

    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input.", details: parsed.error.flatten() });
      return;
    }

    const existing = await getAdminProduct(id);
    if (!existing) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    const product = await updateProduct(id, parsed.data);
    res.json({ data: product });
  })
);

// DELETE /:id — delete product
adminProductsRouter.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);

    const existing = await getAdminProduct(id);
    if (!existing) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    try {
      await deleteProduct(id);
      res.json({ data: { deleted: true } });
    } catch (error) {
      if (error instanceof Error && error.message.includes("cannot be deleted")) {
        res.status(409).json({ error: error.message });
        return;
      }
      throw error;
    }
  })
);

// PATCH /:id/status — update status only
adminProductsRouter.patch(
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

    const existing = await getAdminProduct(id);
    if (!existing) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    const product = await updateProduct(id, { status: parsed.data.status });
    res.json({ data: product });
  })
);

// POST /bulk-import — import multiple products from parsed CSV rows
const bulkImportRowSchema = z.object({
  Category: z.string().optional(),
  Material: z.string().optional(),
  Type: z.string().min(1),
  Variant: z.string().optional(),
  Description: z.string().optional(),
  Length: z.string().optional(),
  Colors: z.string().optional(),
  Price: z.coerce.number().positive(),
  SKU: z.string().optional(),
  Qty: z.coerce.number().int().min(0).default(0)
});

const bulkImportSchema = z.object({
  rows: z.array(bulkImportRowSchema).min(1).max(500)
});

adminProductsRouter.post(
  "/bulk-import",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const parsed = bulkImportSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid import payload.", details: parsed.error.flatten() });
      return;
    }

    const result = await bulkImportProducts(parsed.data.rows);
    res.status(201).json({ data: result });
  })
);

// PATCH /:id/inventory — adjust inventory by delta
adminProductsRouter.patch(
  "/:id/inventory",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);

    const parsed = inventorySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid delta value.", details: parsed.error.flatten() });
      return;
    }

    const existing = await getAdminProduct(id);
    if (!existing) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    try {
      const result = await adjustInventory(id, parsed.data.delta);
      res.json({ data: result });
    } catch (error) {
      if (error instanceof Error && error.message === "Inventory adjustment would make stock negative.") {
        res.status(400).json({ error: error.message });
        return;
      }

      throw error;
    }
  })
);
