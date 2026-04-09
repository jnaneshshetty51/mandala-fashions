import Link from "next/link";

import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { collectionCards } from "@/lib/archive-data";
import { collectionShopLinks, getCollectionProducts } from "@/lib/collection-catalog";
import { listCatalogProducts } from "@/server/catalog/service";

const collectionNeeds = [
  {
    title: "Bridal Sarees",
    copy: "Start with rich silk collections for weddings, receptions, and family ceremonies.",
    href: "/shop?fabric=Silk&occasion=Wedding"
  },
  {
    title: "Light Festive",
    copy: "Browse airy organza and softer occasion sarees for daytime celebrations.",
    href: "/shop?fabric=Organza&occasion=Festive"
  },
  {
    title: "Office Wear",
    copy: "Find repeat-wear cotton sarees that stay elegant through long workdays.",
    href: "/shop?fabric=Cotton&occasion=Office"
  }
];

export default async function CollectionsPage() {
  const products = await listCatalogProducts();

  return (
    <ArchiveShell activeNav="collections">
      <PageHero
        eyebrow="Curated Saree Collections"
        title="Collections"
        crumb="Editions"
        intro="Browse Mandala Fashions by weave, occasion, and how you actually plan to wear the saree, from bridal silk to breathable everyday cotton."
      />

      <section className="editorial-section">
        <div className="retail-requirement-grid">
          {collectionNeeds.map((item) => (
            <Link className="retail-requirement-card" href={item.href} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
              <span>Shop this need</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="editorial-section">
        <div className="collections-board collections-board-rich">
          {collectionCards.map((collection) => (
            <article className={`collection-editorial-card ${collection.artClass}`} key={collection.slug}>
              <div className="collection-editorial-copy">
                <p className="eyebrow">{collectionShopLinks[collection.slug]?.eyebrow ?? collection.slug}</p>
                <h2>{collection.title}</h2>
                <p>{collection.description}</p>
                <div className="collection-stat-row">
                  <span>{getCollectionProducts(products, collection.slug).length} styles</span>
                  {collectionShopLinks[collection.slug]?.notes.map((note) => (
                    <span key={note}>{note}</span>
                  ))}
                </div>
                <div className="collection-action-row">
                  <Link href={`/collections/${collection.slug}`}>View Collection</Link>
                  <Link href={collectionShopLinks[collection.slug]?.filterHref ?? "/shop"}>Shop Now</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section collection-insight-grid">
        <article className="collection-insight-card">
          <p className="eyebrow">How to use collections</p>
          <h2>Start with the saree requirement, then refine by color and occasion.</h2>
          <p>
            Collections are the fastest way to narrow the storefront before moving into the full shop, search,
            and product detail pages.
          </p>
        </article>
        <article className="collection-insight-card">
          <p className="eyebrow">Need help deciding?</p>
          <h2>Use WhatsApp or search when you know the event but not the weave.</h2>
          <p>
            If you are shopping for a wedding, office rotation, or light festive look, jump into the requirement-led
            links above and refine from there.
          </p>
        </article>
      </section>
    </ArchiveShell>
  );
}
