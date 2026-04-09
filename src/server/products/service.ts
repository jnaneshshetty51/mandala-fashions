import { prisma } from "@/server/db";

type UpdateProductInput = {
  name?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  imageUrl?: string;
  fabric?: string;
  occasion?: string;
  color?: string;
  inventoryCount?: number;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
};

export async function getAdminProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true }
  });

  if (!product) return null;

  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null
  };
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.compareAtPrice !== undefined && { compareAtPrice: input.compareAtPrice }),
      ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
      ...(input.fabric !== undefined && { fabric: input.fabric }),
      ...(input.occasion !== undefined && { occasion: input.occasion }),
      ...(input.color !== undefined && { color: input.color }),
      ...(input.inventoryCount !== undefined && { inventoryCount: input.inventoryCount }),
      ...(input.status !== undefined && { status: input.status })
    }
  });

  return {
    ...product,
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
  const product = await prisma.product.update({
    where: { id },
    data: {
      inventoryCount: {
        increment: delta
      }
    }
  });

  return { id: product.id, inventoryCount: product.inventoryCount };
}

type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  fabric?: string;
  occasion?: string;
  color?: string;
  compareAtPrice?: number;
  inventoryCount?: number;
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
  const baseSlug = input.name
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
      name: input.name,
      slug,
      sku: `SKU-${Date.now()}-${Math.floor(Math.random() * 90 + 10)}`,
      description: input.description,
      price: input.price,
      compareAtPrice: input.compareAtPrice,
      imageUrl: input.imageUrl,
      fabric: input.fabric,
      occasion: input.occasion,
      color: input.color,
      inventoryCount: input.inventoryCount ?? 0,
      status: "ACTIVE"
    }
  });

  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null
  };
}
