import Link from "next/link";

import { ArchiveShell, PageHero, ProductCard } from "@/components/archive-shell";
import { archiveProducts } from "@/lib/archive-data";
import { requirePageUser } from "@/server/auth/guards";

export default async function WishlistPage() {
  await requirePageUser();
  const items = archiveProducts.slice(0, 3);

  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Saved Pieces"
        title="Wishlist"
        crumb="Private Archive"
        intro="Your save-for-later list for standout drapes, price checks, and quick moves back into the cart."
      />

      <section className="editorial-section support-stack retail-reco-section">
        <div className="section-heading-row retail-section-heading">
          <div>
            <p className="eyebrow">Saved now</p>
            <h2>{items.length} pieces in your archive</h2>
          </div>
          <div className="retail-results-meta">
            <span>Watch price</span>
            <span>Move to bag</span>
          </div>
        </div>
        <div className="products-grid compact-grid">
          {items.map((product) => (
            <div className="home-product-stack" key={product.slug}>
              <ProductCard
                artClass={product.artClass}
                href={`/products/${product.slug}`}
                imageUrl={product.imageUrl}
                label={product.label}
                name={product.name}
                price={product.price}
              />
              <div className="account-link-row">
                <Link className="primary-button text-button" href="/cart">
                  Add to cart
                </Link>
                <button className="secondary-button text-button" type="button">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ArchiveShell>
  );
}
