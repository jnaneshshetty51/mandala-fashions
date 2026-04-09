import type { MetadataRoute } from "next";

import { archiveProducts, collectionCards, lookbookPages, styleGuidePosts } from "@/lib/archive-data";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/shop",
    "/collections",
    "/lookbooks",
    "/style-guide",
    "/offers",
    "/our-story",
    "/artisanship",
    "/custom-services",
    "/support",
    "/faq",
    "/track-order",
    "/returns-request",
    "/whatsapp-assist",
    "/contact",
    "/shipping-policy",
    "/shipping-returns",
    "/refund-policy",
    "/privacy-policy",
    "/terms",
    "/accessibility",
    "/site-map"
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7
  }));

  const collectionEntries: MetadataRoute.Sitemap = collectionCards.map((collection) => ({
    url: `${siteConfig.siteUrl}/collections/${collection.slug}`,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const lookbookEntries: MetadataRoute.Sitemap = lookbookPages.map((page) => ({
    url: `${siteConfig.siteUrl}/lookbooks/${page.slug}`,
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const styleGuideEntries: MetadataRoute.Sitemap = styleGuidePosts.map((post) => ({
    url: `${siteConfig.siteUrl}/style-guide/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const productEntries: MetadataRoute.Sitemap = archiveProducts.map((product) => ({
    url: `${siteConfig.siteUrl}/products/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  return [
    ...staticEntries,
    ...collectionEntries,
    ...lookbookEntries,
    ...styleGuideEntries,
    ...productEntries
  ];
}
