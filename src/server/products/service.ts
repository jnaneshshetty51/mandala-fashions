import { InventoryMovementType } from "@prisma/client";

import { prisma } from "@/server/db";
import {
  composeProductContent,
  normalizeProductMetadata,
  splitProductContent,
  type ProductContentMetadata
} from "@/server/products/content";
import { normalizeStorageUrl } from "@/server/storage/service";

type UpdateProductInput = {
  category?: string;
  material?: string;
  type?: string;
  variant?: string;
  description?: string;
  length?: string;
  colors?: string;
  price?: number;
  sku?: string;
  imageUrl?: string;
  imageUrls?: string[];
  qty?: number;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  vendor?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  publishAt?: string;
};

function composeProductName(type: string, variant?: string) {
  const cleanType = type.trim();
  const cleanVariant = variant?.trim();
  return cleanVariant ? `${cleanType} - ${cleanVariant}` : cleanType;
}

function splitProductName(name: string) {
  const [type, ...rest] = name.split(" - ");
  return {
    type: type.trim(),
    variant: rest.join(" - ").trim()
  };
}

export async function getAdminProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true }
  });

  if (!product) return null;

  const nameParts = splitProductName(product.name);
  const contentParts = splitProductContent(product.description);

  return {
    ...product,
    category: product.occasion,
    material: product.fabric,
    type: nameParts.type,
    variant: nameParts.variant,
    description: contentParts.description,
    length: contentParts.length,
    colors: product.color,
    qty: product.inventoryCount,
    vendor: contentParts.metadata.vendor ?? "",
    tags: contentParts.metadata.tags ?? [],
    seoTitle: contentParts.metadata.seoTitle ?? "",
    seoDescription: contentParts.metadata.seoDescription ?? "",
    publishAt: contentParts.metadata.publishAt ?? "",
    imageUrls:
      contentParts.imageUrls.length > 0
        ? contentParts.imageUrls.map((item) => normalizeStorageUrl(item)).filter((item): item is string => Boolean(item))
        : product.imageUrl
          ? [normalizeStorageUrl(product.imageUrl)].filter((item): item is string => Boolean(item))
          : [],
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null
  };
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const existing = await prisma.product.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new Error("Product not found.");
  }

  const existingNameParts = splitProductName(existing.name);
  const existingContentParts = splitProductContent(existing.description);
  const nextType = input.type ?? existingNameParts.type;
  const nextVariant = input.variant ?? existingNameParts.variant;
  const nextDescription = input.description ?? existingContentParts.description;
  const nextLength = input.length ?? existingContentParts.length;
  const nextMetadata = normalizeProductMetadata({
    vendor: input.vendor ?? existingContentParts.metadata.vendor,
    tags: input.tags ?? existingContentParts.metadata.tags,
    seoTitle: input.seoTitle ?? existingContentParts.metadata.seoTitle,
    seoDescription: input.seoDescription ?? existingContentParts.metadata.seoDescription,
    publishAt: input.publishAt ?? existingContentParts.metadata.publishAt
  });
  const nextImageUrls =
    input.imageUrls !== undefined
      ? input.imageUrls.map((item) => normalizeStorageUrl(item)).filter((item): item is string => Boolean(item))
      : existingContentParts.imageUrls.length > 0
        ? existingContentParts.imageUrls.map((item) => normalizeStorageUrl(item)).filter((item): item is string => Boolean(item))
        : existing.imageUrl
          ? [normalizeStorageUrl(existing.imageUrl)].filter((item): item is string => Boolean(item))
          : [];

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...((input.type !== undefined || input.variant !== undefined) && {
        name: composeProductName(nextType, nextVariant)
      }),
      ...((input.description !== undefined || input.length !== undefined || input.imageUrls !== undefined) && {
        description: composeProductContent({
          description: nextDescription,
          length: nextLength,
          imageUrls: nextImageUrls,
          metadata: nextMetadata
        })
      }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.sku !== undefined && { sku: input.sku.trim() }),
      ...((input.imageUrl !== undefined || input.imageUrls !== undefined) && {
        imageUrl: nextImageUrls[0] ?? normalizeStorageUrl(input.imageUrl) ?? null
      }),
      ...(input.material !== undefined && { fabric: input.material.trim() }),
      ...(input.category !== undefined && { occasion: input.category.trim() }),
      ...(input.colors !== undefined && { color: input.colors.trim() }),
      ...(input.qty !== undefined && { inventoryCount: input.qty }),
      ...(input.status !== undefined && { status: input.status })
    }
  });

  if (input.qty !== undefined && input.qty !== existing.inventoryCount) {
    await prisma.inventoryMovement.create({
      data: {
        productId: id,
        type: InventoryMovementType.ADJUSTMENT,
        quantity: input.qty - existing.inventoryCount,
        note: `Stock updated from product editor. New stock: ${input.qty}.`
      }
    });
  }

  const nameParts = splitProductName(product.name);
  const contentParts = splitProductContent(product.description);

  return {
    ...product,
    category: product.occasion,
    material: product.fabric,
    type: nameParts.type,
    variant: nameParts.variant,
    description: contentParts.description,
    length: contentParts.length,
    colors: product.color,
    qty: product.inventoryCount,
    vendor: contentParts.metadata.vendor ?? "",
    tags: contentParts.metadata.tags ?? [],
    seoTitle: contentParts.metadata.seoTitle ?? "",
    seoDescription: contentParts.metadata.seoDescription ?? "",
    publishAt: contentParts.metadata.publishAt ?? "",
    imageUrls:
      contentParts.imageUrls.length > 0
        ? contentParts.imageUrls.map((item) => normalizeStorageUrl(item)).filter((item): item is string => Boolean(item))
        : product.imageUrl
          ? [normalizeStorageUrl(product.imageUrl)].filter((item): item is string => Boolean(item))
          : [],
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null
  };
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2003"
    ) {
      throw new Error(
        "Product cannot be deleted because it has associated orders. Archive it instead."
      );
    }
    throw error;
  }
}

export async function adjustInventory(id: string, delta: number) {
  const existing = await prisma.product.findUnique({
    where: { id },
    select: { id: true, inventoryCount: true }
  });

  if (!existing) {
    throw new Error("Product not found.");
  }

  const nextInventoryCount = existing.inventoryCount + delta;

  if (nextInventoryCount < 0) {
    throw new Error("Inventory adjustment would make stock negative.");
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      inventoryCount: nextInventoryCount
    }
  });

  await prisma.inventoryMovement.create({
    data: {
      productId: id,
      type: InventoryMovementType.ADJUSTMENT,
      quantity: delta,
      note: `Manual admin adjustment. New stock: ${nextInventoryCount}.`
    }
  });

  return { id: product.id, inventoryCount: product.inventoryCount };
}

type CreateProductInput = {
  category: string;
  material: string;
  type: string;
  variant?: string;
  description: string;
  length?: string;
  colors?: string;
  price: number;
  sku: string;
  imageUrl?: string;
  imageUrls?: string[];
  qty?: number;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  vendor?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  publishAt?: string;
};

export async function listProducts() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return products.map((product) => ({
    ...product,
    price: Number(product.price)
  }));
}

type BulkImportRow = {
  Category?: string;
  Material?: string;
  Type: string;
  Variant?: string;
  Description?: string;
  Length?: string;
  Colors?: string;
  Price: number;
  SKU?: string;
  Qty: number;
};

export async function bulkImportProducts(rows: BulkImportRow[]) {
  const created: string[] = [];
  const skipped: string[] = [];
  const errors: string[] = [];

  for (const row of rows) {
    try {
      const name = row.Variant ? `${row.Type} - ${row.Variant}` : row.Type;
      const color = row.Colors || row.Variant || undefined;
      const description = [
        row.Description,
        row.Length ? `Length: ${row.Length}` : ""
      ].filter(Boolean).join(". ") || `${name} — ${row.Material ?? "handcrafted"} saree.`;

      const baseSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // Check SKU conflict
      if (row.SKU) {
        const existing = await prisma.product.findUnique({ where: { sku: row.SKU } });
        if (existing) {
          skipped.push(`${row.SKU} (duplicate SKU)`);
          continue;
        }
      }

      // Check slug conflict and make unique
      const slugCount = await prisma.product.count({
        where: { slug: { startsWith: baseSlug } }
      });
      const slug = slugCount === 0 ? baseSlug : `${baseSlug}-${slugCount + 1}`;

      const sku = row.SKU?.trim() || `SKU-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

      await prisma.product.create({
        data: {
          name,
          slug,
          sku,
          description,
          price: row.Price,
          fabric: row.Material || undefined,
          occasion: row.Category || undefined,
          color,
          inventoryCount: row.Qty,
          status: "ACTIVE"
        }
      }).then(async (product) => {
        if (row.Qty > 0) {
          await prisma.inventoryMovement.create({
            data: {
              productId: product.id,
              type: InventoryMovementType.IN,
              quantity: row.Qty,
              note: "Initial stock added during bulk import."
            }
          });
        }
      });

      created.push(sku);
    } catch (error) {
      const label = row.SKU || row.Type;
      errors.push(`${label}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  return { created: created.length, skipped: skipped.length, errors };
}

export async function createProduct(input: CreateProductInput) {
  const name = composeProductName(input.type, input.variant);
  const imageUrls = (input.imageUrls ?? [])
    .map((item) => normalizeStorageUrl(item))
    .filter((item): item is string => Boolean(item));
  const description = composeProductContent({
    description: input.description,
    length: input.length,
    imageUrls,
    metadata: {
      vendor: input.vendor,
      tags: input.tags,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      publishAt: input.publishAt
    }
  });

  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const existingCount = await prisma.product.count({
    where: {
      slug: {
        startsWith: baseSlug
      }
    }
  });

  const slug = existingCount === 0 ? baseSlug : `${baseSlug}-${existingCount + 1}`;

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      sku: input.sku.trim(),
      description,
      price: input.price,
      imageUrl: imageUrls[0] ?? normalizeStorageUrl(input.imageUrl) ?? null,
      fabric: input.material.trim(),
      occasion: input.category.trim(),
      color: input.colors?.trim(),
      inventoryCount: input.qty ?? 0,
      status: input.status ?? "ACTIVE"
    }
  });

  if ((input.qty ?? 0) > 0) {
    await prisma.inventoryMovement.create({
      data: {
        productId: product.id,
        type: InventoryMovementType.IN,
        quantity: input.qty ?? 0,
        note: "Initial stock added during product creation."
      }
    });
  }

  const nameParts = splitProductName(product.name);
  const contentParts = splitProductContent(product.description);

  return {
    ...product,
    category: product.occasion,
    material: product.fabric,
    type: nameParts.type,
    variant: nameParts.variant,
    description: contentParts.description,
    length: contentParts.length,
    colors: product.color,
    qty: product.inventoryCount,
    vendor: contentParts.metadata.vendor ?? "",
    tags: contentParts.metadata.tags ?? [],
    seoTitle: contentParts.metadata.seoTitle ?? "",
    seoDescription: contentParts.metadata.seoDescription ?? "",
    publishAt: contentParts.metadata.publishAt ?? "",
    imageUrls:
      contentParts.imageUrls.length > 0
        ? contentParts.imageUrls.map((item) => normalizeStorageUrl(item)).filter((item): item is string => Boolean(item))
        : product.imageUrl
          ? [normalizeStorageUrl(product.imageUrl)].filter((item): item is string => Boolean(item))
          : [],
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null
  };
}

export async function getProductInventoryMovements(productId: string) {
  const movements = await prisma.inventoryMovement.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    take: 12
  });

  return movements.map((movement) => ({
    id: movement.id,
    type: movement.type,
    quantity: movement.quantity,
    note: movement.note,
    createdAt: movement.createdAt.toISOString()
  }));
}
