import { prisma } from "@/server/db";

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
  qty?: number;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
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

function composeProductDescription(description: string, length?: string) {
  const cleanDescription = description.trim();
  const cleanLength = length?.trim();
  return cleanLength ? `${cleanDescription}\n\nLength: ${cleanLength}` : cleanDescription;
}

function splitProductDescription(description: string) {
  const match = description.match(/\n\nLength:\s*(.+)$/);

  if (!match) {
    return {
      description: description.trim(),
      length: ""
    };
  }

  return {
    description: description.replace(/\n\nLength:\s*.+$/, "").trim(),
    length: match[1]?.trim() ?? ""
  };
}

export async function getAdminProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true }
  });

  if (!product) return null;

  const nameParts = splitProductName(product.name);
  const descriptionParts = splitProductDescription(product.description);

  return {
    ...product,
    category: product.occasion,
    material: product.fabric,
    type: nameParts.type,
    variant: nameParts.variant,
    description: descriptionParts.description,
    length: descriptionParts.length,
    colors: product.color,
    qty: product.inventoryCount,
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
  const existingDescriptionParts = splitProductDescription(existing.description);
  const nextType = input.type ?? existingNameParts.type;
  const nextVariant = input.variant ?? existingNameParts.variant;
  const nextDescription = input.description ?? existingDescriptionParts.description;
  const nextLength = input.length ?? existingDescriptionParts.length;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...((input.type !== undefined || input.variant !== undefined) && {
        name: composeProductName(nextType, nextVariant)
      }),
      ...((input.description !== undefined || input.length !== undefined) && {
        description: composeProductDescription(nextDescription, nextLength)
      }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.sku !== undefined && { sku: input.sku.trim() }),
      ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
      ...(input.material !== undefined && { fabric: input.material.trim() }),
      ...(input.category !== undefined && { occasion: input.category.trim() }),
      ...(input.colors !== undefined && { color: input.colors.trim() }),
      ...(input.qty !== undefined && { inventoryCount: input.qty }),
      ...(input.status !== undefined && { status: input.status })
    }
  });

  const nameParts = splitProductName(product.name);
  const descriptionParts = splitProductDescription(product.description);

  return {
    ...product,
    category: product.occasion,
    material: product.fabric,
    type: nameParts.type,
    variant: nameParts.variant,
    description: descriptionParts.description,
    length: descriptionParts.length,
    colors: product.color,
    qty: product.inventoryCount,
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
  qty?: number;
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
  const name = composeProductName(input.type, input.variant);
  const description = composeProductDescription(input.description, input.length);

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
      imageUrl: input.imageUrl,
      fabric: input.material.trim(),
      occasion: input.category.trim(),
      color: input.colors?.trim(),
      inventoryCount: input.qty ?? 0,
      status: "ACTIVE"
    }
  });

  const nameParts = splitProductName(product.name);
  const descriptionParts = splitProductDescription(product.description);

  return {
    ...product,
    category: product.occasion,
    material: product.fabric,
    type: nameParts.type,
    variant: nameParts.variant,
    description: descriptionParts.description,
    length: descriptionParts.length,
    colors: product.color,
    qty: product.inventoryCount,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null
  };
}
