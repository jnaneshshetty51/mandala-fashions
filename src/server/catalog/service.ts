import { cache } from "react";

import { archiveProducts, type ArchiveProduct } from "@/lib/archive-data";
import { prisma } from "@/server/db";

export type CatalogProduct = ArchiveProduct & {
  id: string;
  source: "archive" | "database";
  inventoryCount: number;
  isPurchasable: boolean;
};

function normalizeLabel(value?: string | null) {
  return value ? value.toUpperCase() : "MANDALA ARCHIVE";
}

function inferArtClass(index: number) {
  const classes = [
    "art-emerald",
    "art-crimson",
    "art-floral",
    "art-indigo",
    "art-noir",
    "art-saffron"
  ];

  return classes[index % classes.length];
}

function inferOccasion(occasion?: string | null) {
  return occasion ?? "Festive";
}

function inferColor(color?: string | null) {
  return color ?? "Heritage";
}

function inferFabric(fabric?: string | null) {
  return fabric ?? "Craft Textile";
}

function inferDescription(description: string) {
  return description.length > 0 ? description : "An archive addition crafted for ceremonial and everyday elegance.";
}

function splitCatalogContent(content: string) {
  const sections = content.split(/\n\n+/);
  let description = "";
  let length = "";
  let imageUrls: string[] = [];

  for (const section of sections) {
    if (section.startsWith("Length: ")) {
      length = section.replace("Length: ", "").trim();
      continue;
    }

    if (section.startsWith("Gallery: ")) {
      try {
        imageUrls = (JSON.parse(section.replace("Gallery: ", "").trim()) as string[]).filter(Boolean);
      } catch {
        imageUrls = [];
      }
      continue;
    }

    description = description ? `${description}\n\n${section}` : section;
  }

  return {
    description: description.trim(),
    length,
    imageUrls
  };
}

function toCatalogProduct(product: {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  inventoryCount: number;
  imageUrl: string | null;
  fabric?: string | null;
  occasion?: string | null;
  color?: string | null;
}, index: number): CatalogProduct {
  const content = splitCatalogContent(product.description);
  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(product.price);

  const compareAt = Math.round(product.price * 1.18);

  return {
    id: product.id,
    source: "database",
    slug: product.slug,
    label: normalizeLabel(product.fabric),
    name: product.name,
    price,
    originalPrice: new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(compareAt),
    discountLabel: `${Math.max(10, Math.round(((compareAt - product.price) / compareAt) * 100))}% off`,
    artClass: inferArtClass(index),
    imageUrl: content.imageUrls[0] ?? product.imageUrl,
    galleryImages: content.imageUrls.length > 0 ? content.imageUrls : product.imageUrl ? [product.imageUrl, product.imageUrl, product.imageUrl] : [],
    category: `${inferOccasion(product.occasion)} Sarees`,
    fabric: inferFabric(product.fabric),
    occasion: inferOccasion(product.occasion),
    color: inferColor(product.color),
    colorChoices: [inferColor(product.color), "Custom Request"],
    variants: [
      {
        name: "Saree Only",
        note: "Archive catalog drape with boutique quality assurance.",
        price
      },
      {
        name: "Saree + Finishing",
        note: "Add finishing support and blouse guidance.",
        price: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0
        }).format(product.price + 750)
      }
    ],
    length: content.length || "5.5 metres",
    blouse: "Unstitched blouse piece available on request",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.7",
    reviews: 18 + index * 7,
    note: `${product.name} is part of the Mandala archive catalog.`,
    description: inferDescription(content.description),
    details: [inferFabric(product.fabric), "Archive-finished drape", "Boutique quality assurance"],
    styling: [
      "Pair with a matching blouse piece",
      "Style with occasion-led jewelry",
      "Consult our team for draping suggestions"
    ],
    occasions: [inferOccasion(product.occasion), "Festive", "Celebration"],
    inventoryCount: product.inventoryCount,
    isPurchasable: product.inventoryCount > 0
  };
}

function toArchiveCatalogProduct(product: ArchiveProduct, index: number): CatalogProduct {
  return {
    id: `archive-${index}`,
    source: "archive",
    ...product,
    inventoryCount: 12,
    isPurchasable: true
  };
}

const archiveCatalog = archiveProducts.map(toArchiveCatalogProduct);
const DATABASE_RETRY_WINDOW_MS = 60_000;
const preferArchiveCatalog =
  process.env.NODE_ENV !== "production" && process.env.CATALOG_SOURCE !== "database";

let databaseRetryAt = 0;

function shouldSkipDatabaseReads() {
  return Date.now() < databaseRetryAt;
}

function markDatabaseFailure() {
  databaseRetryAt = Date.now() + DATABASE_RETRY_WINDOW_MS;
}

async function loadDatabaseCatalogProducts() {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE"
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if (products.length === 0) {
    return archiveCatalog;
  }

  return products.map((product, index) =>
    toCatalogProduct(
      {
        ...product,
        price: Number(product.price),
        inventoryCount: product.inventoryCount
      },
      index
    )
  );
}

export const listCatalogProducts = cache(async (): Promise<CatalogProduct[]> => {
  if (preferArchiveCatalog || shouldSkipDatabaseReads()) {
    return archiveCatalog;
  }

  try {
    return await loadDatabaseCatalogProducts();
  } catch {
    markDatabaseFailure();
    return archiveCatalog;
  }
});

export const findCatalogProductBySlug = cache(async (slug: string): Promise<CatalogProduct | null> => {
  const products = await listCatalogProducts();
  return products.find((product) => product.slug === slug) ?? null;
});
