import type { CatalogProduct } from "@/server/catalog/service";

export const collectionMatchers: Record<string, string[]> = {
  banarasi: ["silk", "banarasi", "wedding"],
  kanchipuram: ["silk", "wedding", "celebration"],
  organza: ["organza", "festive", "day"],
  cotton: ["cotton", "office", "casual", "daily"]
};

export const collectionShopLinks: Record<
  string,
  {
    eyebrow: string;
    filterHref: string;
    quickLinks: { label: string; href: string }[];
    notes: string[];
  }
> = {
  banarasi: {
    eyebrow: "Bridal and statement dressing",
    filterHref: "/shop?fabric=Silk&occasion=Wedding",
    quickLinks: [
      { label: "Wedding Silk", href: "/shop?fabric=Silk&occasion=Wedding" },
      { label: "Bridal Search", href: "/search?q=bridal+banarasi+saree" },
      { label: "View Banarasi Picks", href: "/collections/banarasi" }
    ],
    notes: ["Rich zari depth", "Best for weddings", "Statement evening drape"]
  },
  kanchipuram: {
    eyebrow: "Ceremony-first silk edits",
    filterHref: "/shop?fabric=Silk&occasion=Wedding",
    quickLinks: [
      { label: "Temple Border Styles", href: "/search?q=kanchipuram+wedding+saree" },
      { label: "Reception Looks", href: "/shop?occasion=Wedding&color=Crimson" },
      { label: "View Kanchipuram Picks", href: "/collections/kanchipuram" }
    ],
    notes: ["Structured drape", "Bridal color stories", "Classic heirloom weave"]
  },
  organza: {
    eyebrow: "Light festive and daytime wear",
    filterHref: "/shop?fabric=Organza&occasion=Festive",
    quickLinks: [
      { label: "Festive Organza", href: "/shop?fabric=Organza&occasion=Festive" },
      { label: "Pastel Search", href: "/search?q=pastel+organza+saree" },
      { label: "View Organza Picks", href: "/collections/organza" }
    ],
    notes: ["Sheer lightweight drape", "Day-event friendly", "Soft festive styling"]
  },
  cotton: {
    eyebrow: "Everyday comfort and office styling",
    filterHref: "/shop?fabric=Cotton&occasion=Office",
    quickLinks: [
      { label: "Office Wear", href: "/shop?fabric=Cotton&occasion=Office" },
      { label: "Daily Wear Search", href: "/search?q=everyday+cotton+saree" },
      { label: "View Cotton Picks", href: "/collections/cotton" }
    ],
    notes: ["Breathable all-day feel", "Easy repeat styling", "Great for workwear"]
  }
};

export function getCollectionProducts(products: CatalogProduct[], slug: string) {
  const keywords = collectionMatchers[slug] ?? [];

  return products.filter((product) =>
    keywords.some((keyword) =>
      [product.fabric, product.occasion, product.color, product.name, product.description, product.category]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    )
  );
}
