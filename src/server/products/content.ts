import { normalizeStorageUrl } from "@/server/storage/service";

export type ProductContentMetadata = {
  vendor?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  publishAt?: string;
};

export type ParsedProductContent = {
  description: string;
  length: string;
  imageUrls: string[];
  metadata: ProductContentMetadata;
};

function normalizeTags(tags?: string[]) {
  return (tags ?? [])
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeProductMetadata(metadata?: ProductContentMetadata): ProductContentMetadata {
  const normalized: ProductContentMetadata = {};

  if (metadata?.vendor?.trim()) {
    normalized.vendor = metadata.vendor.trim();
  }

  const tags = normalizeTags(metadata?.tags);
  if (tags.length > 0) {
    normalized.tags = tags;
  }

  if (metadata?.seoTitle?.trim()) {
    normalized.seoTitle = metadata.seoTitle.trim();
  }

  if (metadata?.seoDescription?.trim()) {
    normalized.seoDescription = metadata.seoDescription.trim();
  }

  if (metadata?.publishAt?.trim()) {
    normalized.publishAt = metadata.publishAt.trim();
  }

  return normalized;
}

export function composeProductContent(input: {
  description: string;
  length?: string;
  imageUrls?: string[];
  metadata?: ProductContentMetadata;
}) {
  const cleanDescription = input.description.trim();
  const cleanLength = input.length?.trim();
  const cleanImageUrls = (input.imageUrls ?? [])
    .map((item) => normalizeStorageUrl(item))
    .filter((item): item is string => Boolean(item));
  const metadata = normalizeProductMetadata(input.metadata);
  const parts = [cleanDescription];

  if (cleanLength) {
    parts.push(`Length: ${cleanLength}`);
  }

  if (cleanImageUrls.length > 0) {
    parts.push(`Gallery: ${JSON.stringify(cleanImageUrls)}`);
  }

  if (Object.keys(metadata).length > 0) {
    parts.push(`Metadata: ${JSON.stringify(metadata)}`);
  }

  return parts.join("\n\n");
}

export function splitProductContent(content: string): ParsedProductContent {
  const sections = content.split(/\n\n+/);
  let description = "";
  let length = "";
  let imageUrls: string[] = [];
  let metadata: ProductContentMetadata = {};

  for (const section of sections) {
    if (section.startsWith("Length: ")) {
      length = section.replace("Length: ", "").trim();
      continue;
    }

    if (section.startsWith("Gallery: ")) {
      try {
        const parsed = JSON.parse(section.replace("Gallery: ", "").trim()) as string[];
        imageUrls = parsed
          .map((item) => normalizeStorageUrl(item))
          .filter((item): item is string => Boolean(item));
      } catch {
        imageUrls = [];
      }
      continue;
    }

    if (section.startsWith("Metadata: ")) {
      try {
        metadata = normalizeProductMetadata(
          JSON.parse(section.replace("Metadata: ", "").trim()) as ProductContentMetadata
        );
      } catch {
        metadata = {};
      }
      continue;
    }

    description = description ? `${description}\n\n${section}` : section;
  }

  return {
    description: description.trim(),
    length,
    imageUrls,
    metadata
  };
}
