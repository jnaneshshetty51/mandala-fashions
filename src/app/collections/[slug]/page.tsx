import Link from "next/link";
import { notFound } from "next/navigation";

import { ArchiveShell, PageHero, ProductCard } from "@/components/archive-shell";
import { collectionCards } from "@/lib/archive-data";
import { collectionShopLinks, getCollectionProducts } from "@/lib/collection-catalog";
import { listCatalogProducts } from "@/server/catalog/service";

export async function generateStaticParams() {
  return collectionCards.map((collection) => ({ slug: collection.slug }));
}

export default async function CollectionDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = collectionCards.find((item) => item.slug === slug);

  if (!collection) {
    notFound();
  }

  const products = await listCatalogProducts();
  const filtered = getCollectionProducts(products, slug);
  const collectionMeta = collectionShopLinks[slug];

  return (
    <ArchiveShell activeNav="collections">
      <PageHero
        eyebrow={collectionMeta?.eyebrow ?? "Collection Chapter"}
        title={collection.title}
        crumb="Collections"
        intro={collection.description}
        actions={
          <>
            <Link className="secondary-button text-button" href="/collections">
              View All Collections
            </Link>
            <Link className="primary-button text-button" href={collectionMeta?.filterHref ?? "/shop"}>
              Shop This Edit
            </Link>
          </>
        }
      />

      <section className="editorial-section support-split">
        <article className={`collection-hero-panel ${collection.artClass}`}>
          <div className="collection-hero-copy">
            <p className="eyebrow">Curated Edit</p>
            <h2>{collection.title}</h2>
            <p>{collection.description}</p>
          </div>
        </article>

        <article className="summary-card">
          <p className="eyebrow">Collection Snapshot</p>
          <h2>How to shop this edit faster</h2>
          <div className="collection-stat-row collection-stat-column">
            <span>{filtered.length} curated pieces</span>
            {collectionMeta?.notes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
          <div className="guide-link-list">
            <span>Start here if you already know the weave or wearing occasion.</span>
            <span>Open the filtered shop when you want more colors and price comparisons.</span>
            <span>Use WhatsApp assistance for blouse, drape, and styling guidance.</span>
          </div>
        </article>
      </section>

      <section className="editorial-section">
        <div className="search-chip-strip">
          {collectionMeta?.quickLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="editorial-section collection-insight-grid">
        <article className="collection-insight-card">
          <p className="eyebrow">Best for</p>
          <h2>{collectionMeta?.eyebrow ?? "Intentional saree shopping"}</h2>
          <p>
            This collection is ideal when you want a more focused shortlist before diving into individual product pages.
          </p>
        </article>
        <article className="collection-insight-card">
          <p className="eyebrow">Next step</p>
          <h2>Move from collection browsing to product comparison.</h2>
          <p>
            Open the filtered shop to compare more pieces by color, occasion, and fabric, then use reviews and variants
            on the PDP to make the final decision.
          </p>
        </article>
      </section>

      <section className="editorial-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">In this collection</p>
            <h2>{filtered.length} curated pieces</h2>
          </div>
          <Link className="text-link" href="/shop">
            Open full shop
          </Link>
        </div>
        <div className="products-grid compact-grid">
          {(filtered.length > 0 ? filtered : products.slice(0, 4)).map((product) => (
            <ProductCard
              artClass={product.artClass}
              href={`/products/${product.slug}`}
              imageUrl={product.imageUrl}
              key={product.slug}
              label={product.label}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
        <div className="load-more">
          <p>Want more options in this saree family?</p>
          <Link className="secondary-button text-button" href={collectionMeta?.filterHref ?? "/shop"}>
            View more in shop
          </Link>
        </div>
      </section>
    </ArchiveShell>
  );
}
