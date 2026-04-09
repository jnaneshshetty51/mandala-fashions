import { prisma } from "@/server/db";
import { archiveProducts } from "@/lib/archive-data";

type PurchasableItemInput = {
  productId?: string | null;
  slug?: string | null;
  name: string;
  quantity: number;
  unitPrice: number;
  color?: string | null;
  variantName?: string | null;
};

function parseCurrency(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || 0;
}

function makeArchiveSku(slug: string) {
  return `ARCHIVE-${slug.replace(/[^a-z0-9]+/gi, "-").toUpperCase()}`.slice(0, 60);
}

async function ensureArchiveProductRecord(slug: string, color?: string | null) {
  const archiveProduct = archiveProducts.find((item) => item.slug === slug);

  if (!archiveProduct) {
    return null;
  }

  return prisma.product.upsert({
    where: { slug: archiveProduct.slug },
    update: {
      status: "ACTIVE",
      imageUrl: archiveProduct.imageUrl,
      fabric: archiveProduct.fabric,
      occasion: archiveProduct.occasion,
      color: color ?? archiveProduct.color,
      description: archiveProduct.description
    },
    create: {
      name: archiveProduct.name,
      slug: archiveProduct.slug,
      sku: makeArchiveSku(archiveProduct.slug),
      description: archiveProduct.description,
      price: parseCurrency(archiveProduct.price),
      compareAtPrice: parseCurrency(archiveProduct.originalPrice),
      imageUrl: archiveProduct.imageUrl,
      fabric: archiveProduct.fabric,
      occasion: archiveProduct.occasion,
      color: color ?? archiveProduct.color,
      inventoryCount: 9999,
      status: "ACTIVE"
    }
  });
}

export async function resolvePurchasableCartItems(items: PurchasableItemInput[]) {
  const resolved = await Promise.all(items.map(async (item) => {
    if (item.productId) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      return product ? { item, product } : null;
    }

    if (!item.slug) {
      return null;
    }

    const existingProduct = await prisma.product.findUnique({
      where: { slug: item.slug }
    });

    if (existingProduct) {
      return { item: { ...item, productId: existingProduct.id }, product: existingProduct };
    }

    const archiveProduct = await ensureArchiveProductRecord(item.slug, item.color);

    if (!archiveProduct) {
      return null;
    }

    return {
      item: { ...item, productId: archiveProduct.id },
      product: archiveProduct
    };
  }));

  return resolved;
}
