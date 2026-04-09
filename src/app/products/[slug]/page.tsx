import Link from "next/link";
import { notFound } from "next/navigation";

import { ArchiveShell, ProductCard } from "@/components/archive-shell";
import { ProductPurchasePanel } from "@/components/cart/product-purchase-panel";
import { archiveProducts } from "@/lib/archive-data";
import { listCatalogProducts } from "@/server/catalog/service";

function buildProductReviews(product: Awaited<ReturnType<typeof listCatalogProducts>>[number]) {
  return [
    {
      name: "Aditi S.",
      title: `Loved the ${product.color.toLowerCase()} tone`,
      tag: product.occasion,
      stars: 5,
      body: `The ${product.fabric.toLowerCase()} drape looked premium in person and worked beautifully for my ${product.occasion.toLowerCase()} event. The finish felt neat and boutique-level.`,
      date: "Reviewed 2 weeks ago"
    },
    {
      name: "Neha R.",
      title: "Great fall and easy to style",
      tag: product.fabric,
      stars: 4,
      body: `I wanted something that photographed well without feeling too heavy. This one had a flattering fall, and the blouse guidance made styling much easier.`,
      date: "Reviewed 1 month ago"
    },
    {
      name: "Priya M.",
      title: "Matched the requirement perfectly",
      tag: product.category,
      stars: 5,
      body: `I was specifically shopping for a ${product.category.toLowerCase()} option and this fit the brief. The color was close to the pictures and delivery updates were clear.`,
      date: "Reviewed 6 weeks ago"
    }
  ];
}

function buildRatingsBreakdown(totalReviews: number) {
  const fiveStar = Math.max(1, Math.round(totalReviews * 0.62));
  const fourStar = Math.max(1, Math.round(totalReviews * 0.24));
  const threeStar = Math.max(0, Math.round(totalReviews * 0.09));
  const twoStar = Math.max(0, Math.round(totalReviews * 0.03));
  const oneStar = Math.max(0, totalReviews - fiveStar - fourStar - threeStar - twoStar);

  return [
    { label: "5", count: fiveStar },
    { label: "4", count: fourStar },
    { label: "3", count: threeStar },
    { label: "2", count: twoStar },
    { label: "1", count: oneStar }
  ];
}

export function generateStaticParams() {
  return archiveProducts.map((product) => ({
    slug: product.slug
  }));
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await listCatalogProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const productReviews = buildProductReviews(product);
  const ratingsBreakdown = buildRatingsBreakdown(product.reviews);
  const relatedProducts = products.filter((item) => item.slug !== slug).slice(0, 4);
  const complementaryProducts = products.filter((item) => item.slug !== slug && item.category !== product.category).slice(0, 5);

  return (
    <ArchiveShell activeNav="shop">
      <section className="retail-breadcrumb-bar">
        <div className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/shop">Shop</Link>
          <span aria-hidden="true">›</span>
          <Link href="/collections">Sarees</Link>
          <span aria-hidden="true">›</span>
          <span>{product.name}</span>
        </div>
      </section>

      <section className="product-detail-shell product-detail-rich-shell">
        <div className="product-gallery">
          <div
            className={`product-detail-visual ${product.artClass}`}
            style={
              product.imageUrl
                ? {
                    backgroundImage: `url('${product.imageUrl}')`,
                    backgroundPosition: "center",
                    backgroundSize: "cover"
                  }
                : undefined
            }
          >
            <span className="product-media-pill">Zoom</span>
          </div>
          <div className="product-gallery-grid">
            {product.galleryImages.slice(0, 3).map((image, index) => (
              <div
                className={`product-gallery-thumb ${product.artClass}`}
                key={`${image}-${index}`}
                style={{
                  backgroundImage: `url('${image}')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover"
                }}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-copy product-buy-panel">
          <div className="product-retail-header">
            <p className="product-brand-line">{product.label}</p>
            <h1>{product.name}</h1>
            <p className="product-category-line">
              {product.category} | {product.fabric} | {product.occasion}
            </p>
          </div>

          <div className="product-rating-row retail-rating-row">
            <strong>{product.rating} ★</strong>
            <Link href="#reviews">{product.reviews} Ratings</Link>
            <span>Assured boutique finish</span>
          </div>

          <div className="product-price-stack retail-price-card">
            <div className="product-price-inline retail-price-inline">
              <p className="product-price product-price-large">{product.price}</p>
              <span className="product-original-price">{product.originalPrice}</span>
              <span className="product-discount-badge">{product.discountLabel}</span>
            </div>
            <p className="product-tax-note">Inclusive of all taxes. Free boutique packaging included.</p>
          </div>

          <div className="retail-offer-card">
            <p className="eyebrow">Best offers</p>
            <div className="retail-offer-list">
              <span>10% off on first order with ARCHIVE10</span>
              <span>Extra savings on festive cart value above ₹4,999</span>
              <span>Styling help included on WhatsApp for bridal and gifting orders</span>
            </div>
          </div>

          <p className="product-detail-note">{product.note}</p>
          <p className="product-detail-description">{product.description}</p>

          <ProductPurchasePanel
            product={{
              productId: product.source === "database" ? product.id : undefined,
              slug: product.slug,
              name: product.name,
              artClass: product.artClass,
              label: product.label,
              color: product.color,
              colorChoices: product.colorChoices,
              variants: product.variants,
              isPurchasable: product.isPurchasable
            }}
          />

          <div className="product-occasion-row retail-tag-row">
            {product.occasions.map((item) => (
              <span className="product-chip" key={item}>
                {item}
              </span>
            ))}
          </div>

          <div className="retail-service-strip">
            <div>
              <strong>Delivery</strong>
              <span>{product.delivery}</span>
            </div>
            <div>
              <strong>Returns</strong>
              <span>Easy review flow through support</span>
            </div>
            <div>
              <strong>Assistance</strong>
              <span>WhatsApp styling help available</span>
            </div>
          </div>

          <div className="detail-panel retail-info-panel">
            <h2>Delivery & Services</h2>
            <p className="cart-helper-text">{product.codNote}</p>
            <div className="account-link-row">
              <Link className="secondary-button text-button" href="/shipping-policy">
                View Shipping Policy
              </Link>
              <Link className="secondary-button text-button" href="/whatsapp-assist">
                Ask on WhatsApp
              </Link>
            </div>
          </div>

          <dl className="product-specs product-specs-rich retail-specs-card">
            <div>
              <dt>Category</dt>
              <dd>{product.category}</dd>
            </div>
            <div>
              <dt>Fabric</dt>
              <dd>{product.fabric}</dd>
            </div>
            <div>
              <dt>Length</dt>
              <dd>{product.length}</dd>
            </div>
            <div>
              <dt>Blouse</dt>
              <dd>{product.blouse}</dd>
            </div>
            <div>
              <dt>Occasion</dt>
              <dd>{product.occasion}</dd>
            </div>
            <div>
              <dt>Color</dt>
              <dd>{product.color}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="editorial-section retail-info-grid">
        <article className="support-feature-card">
          <h2>Product Details</h2>
          <ul className="detail-list">
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </article>
        <article className="support-feature-card">
          <h2>Styling Suggestions</h2>
          <div className="guide-link-list">
            {product.styling.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
        <article className="support-feature-card">
          <h2>Complete The Look</h2>
          <div className="guide-link-list">
            <Link href="/custom-services">Matching blouse piece</Link>
            <Link href="/custom-services">Blouse stitching request</Link>
            <Link href="/whatsapp-assist">Jewelry and styling consultation</Link>
          </div>
        </article>
      </section>

      <section className="editorial-section reviews-section" id="reviews">
        <div className="section-heading-row retail-section-heading">
          <div>
            <p className="eyebrow">Customer reviews</p>
            <h2>What shoppers are saying</h2>
          </div>
          <div className="retail-results-meta">
            <span>{product.rating} out of 5</span>
            <span>{product.reviews} verified ratings</span>
          </div>
        </div>

        <div className="reviews-summary-grid">
          <article className="review-summary-card">
            <strong>{product.rating} ★</strong>
            <span>Based on {product.reviews} ratings</span>
            <p>Most shoppers highlight drape quality, event suitability, and boutique finishing.</p>
          </article>

          <article className="review-summary-card rating-breakdown">
            {ratingsBreakdown.map((item) => (
              <div className="rating-breakdown-row" key={item.label}>
                <span>{item.label} ★</span>
                <div className="rating-bar-track" aria-hidden="true">
                  <span
                    className="rating-bar-fill"
                    style={{ width: `${Math.max(6, Math.round((item.count / product.reviews) * 100))}%` }}
                  />
                </div>
                <strong>{item.count}</strong>
              </div>
            ))}
          </article>
        </div>

        <div className="review-card-grid">
          {productReviews.map((review) => (
            <article className="review-card" key={`${product.slug}-${review.name}-${review.title}`}>
              <div className="review-meta-row">
                <div>
                  <strong>{review.name}</strong>
                  <p>{review.date}</p>
                </div>
                <span className="product-chip">{review.tag}</span>
              </div>
              <div className="review-star-row" aria-label={`${review.stars} star review`}>
                {"★".repeat(review.stars)}
              </div>
              <h3>{review.title}</h3>
              <p>{review.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section retail-reco-section">
        <div className="section-heading-row retail-section-heading">
          <div>
            <p className="eyebrow">More like this</p>
            <h2>Similar styles you may like</h2>
          </div>
          <Link className="text-link" href="/shop">
            View all styles
          </Link>
        </div>
        <div className="products-grid compact-grid">
          {relatedProducts.map((item) => (
            <ProductCard
              artClass={item.artClass}
              href={`/products/${item.slug}`}
              imageUrl={item.imageUrl}
              key={item.slug}
              label={item.label}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      </section>

      <section className="editorial-section retail-reco-section">
        <div className="section-heading-row retail-section-heading">
          <div>
            <p className="eyebrow">Shoppers also explored</p>
            <h2>Trending across categories</h2>
          </div>
          <Link className="text-link" href="/shop">
            Browse catalog
          </Link>
        </div>
        <div className="products-grid compact-grid">
          {complementaryProducts.map((item) => (
            <ProductCard
              artClass={item.artClass}
              href={`/products/${item.slug}`}
              imageUrl={item.imageUrl}
              key={item.slug}
              label={item.label}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      </section>
    </ArchiveShell>
  );
}
