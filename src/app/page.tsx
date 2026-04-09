import Link from "next/link";

import { ArchiveShell, ProductCard } from "@/components/archive-shell";
import { EmailCaptureForm } from "@/components/forms/email-capture-form";
import { listCatalogProducts } from "@/server/catalog/service";

const quickCategories = [
  { title: "Wedding", imagePath: "/homepage-assets/0a6485e6977f363e23f9f07ab63de243.jpg", href: "/shop?occasion=Wedding" },
  { title: "Silk", imagePath: "/homepage-assets/363f2870e0392b285659524eb68ef9c0.jpg", href: "/shop?fabric=Silk" },
  { title: "Cotton", imagePath: "/homepage-assets/48e700b0980637ac4cb1a5cd262e48da.jpg", href: "/shop?fabric=Cotton" },
  { title: "Festive", imagePath: "/homepage-assets/624c40a6b367855afa0f700c361a1a84.jpg", href: "/shop?occasion=Festive" },
  { title: "Office", imagePath: "/homepage-assets/1f1049120cfa2eb983d11f1c76bbef2a.jpg", href: "/shop?occasion=Office" },
  { title: "Party", imagePath: "/homepage-assets/28b50087fef53ebe82680ed11d4eddcd.jpg", href: "/shop?occasion=Party" }
];

const brandChips = [
  { label: "Banarasi", href: "/collections/banarasi" },
  { label: "Kanchipuram", href: "/collections/kanchipuram" },
  { label: "Organza", href: "/collections/organza" },
  { label: "Cotton Classics", href: "/collections/cotton" },
  { label: "Festive Edit", href: "/shop?occasion=Festive" },
  { label: "Daily Wear", href: "/shop?occasion=Casual" }
];

const promoTiles = [
  {
    title: "Wedding Store",
    subtitle: "Flat 10% off on your first bridal order",
    imagePath: "/homepage-assets/b93301f842aed71f39492ba6d5bdd216.jpg"
  },
  {
    title: "Under ₹1,999",
    subtitle: "Affordable festive and daily-wear sarees",
    imagePath: "/homepage-assets/6761b750dbfae854650f47dc911f13af.jpg"
  },
  {
    title: "Soft Organza Edit",
    subtitle: "Pastel drapes and floral stories",
    imagePath: "/homepage-assets/6a2cbe5ce9b56f8aaf9e04935473d540.jpg"
  },
  {
    title: "Office Store",
    subtitle: "Elegant workwear sarees for daily rotation",
    imagePath: "/homepage-assets/1f1049120cfa2eb983d11f1c76bbef2a.jpg"
  }
];

const spotlightTiles = [
  {
    title: "Trending in Silk",
    subtitle: "Grand zari borders and rich festive drapes",
    imagePath: "/homepage-assets/17201f45c513ea82a55888b3c7f63b12.jpg"
  },
  {
    title: "Everyday Cotton",
    subtitle: "Easy silhouettes for repeat styling",
    imagePath: "/homepage-assets/79c318b77172d6052bc1bb59bbda66d0.jpg"
  }
];

const supportTiles = [
  {
    title: "Track Order",
    copy: "Guest-friendly tracking with order ID plus email or phone.",
    href: "/track-order"
  },
  {
    title: "Custom Stitching",
    copy: "Request blouse stitching, fall, pico, and finishing support.",
    href: "/custom-services"
  },
  {
    title: "WhatsApp Assist",
    copy: "Talk directly with the boutique when you need quick help choosing.",
    href: "/whatsapp-assist"
  }
];

const shoppingNeeds = [
  {
    title: "Bridal Sarees",
    copy: "Heavy silk, rich zari, and ceremony-ready drapes for weddings and receptions.",
    href: "/search?q=bridal+saree&occasion=Wedding&fabric=Silk"
  },
  {
    title: "Office Wear",
    copy: "Light, elegant sarees that stay comfortable through long workdays.",
    href: "/search?q=office+wear+saree&occasion=Office&fabric=Cotton"
  },
  {
    title: "Light Festive",
    copy: "Easy festive options for pujas, family lunches, and small celebrations.",
    href: "/search?q=light+festive+saree&occasion=Festive"
  },
  {
    title: "Party Wear",
    copy: "Statement georgette and evening drapes for events, dinners, and receptions.",
    href: "/search?q=party+wear+saree&occasion=Party"
  }
];

export default async function HomePage() {
  const products = await listCatalogProducts();
  const bestSellers = products.slice(0, 4);
  const newArrivals = [...products].reverse().slice(0, 4);

  return (
    <ArchiveShell activeNav="shop">
      <section className="fashion-top-strip">
        <p>Big festive sale live now</p>
        <p>Free shipping above ₹1,499</p>
        <p>Easy returns on eligible products</p>
      </section>

      <section className="fashion-hero-banner">
        <div
          className="fashion-hero-image"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(9, 35, 29, 0.82), rgba(9, 35, 29, 0.28) 48%, rgba(9, 35, 29, 0.08)), url('/homepage-assets/7060f58d2c93c01f661f4e6ee0012645.jpg')"
          }}
        >
          <div className="fashion-hero-copy">
            <p className="eyebrow">Mandala festive drop</p>
            <h1>Endless elegance, sale-ready styles.</h1>
            <p>
              Shop wedding sarees, festive favourites, and everyday drapes in a faster,
              high-visibility retail layout.
            </p>
            <div className="fashion-hero-actions">
              <Link className="primary-button text-button" href="/shop">
                Shop Sarees
              </Link>
              <Link className="secondary-button text-button" href="/search?q=bridal+saree">
                Find My Saree
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="fashion-section">
        <div className="fashion-title-block">
          <p className="eyebrow">Shop by requirement</p>
          <h2>Choose sarees based on how you actually plan to wear them</h2>
        </div>
        <div className="retail-requirement-grid">
          {shoppingNeeds.map((need) => (
            <Link className="retail-requirement-card" href={need.href} key={need.title}>
              <strong>{need.title}</strong>
              <p>{need.copy}</p>
              <span>Start shopping</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="fashion-section">
        <div className="fashion-quick-grid">
          {quickCategories.map((category) => (
            <Link className="fashion-quick-card" href={category.href} key={category.title}>
              <div
                className="fashion-quick-image"
                style={{
                  backgroundImage: `url('${category.imagePath}')`
                }}
              />
              <span>{category.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="fashion-chip-strip">
        {brandChips.map((chip) => (
          <Link href={chip.href} key={chip.label}>
            {chip.label}
          </Link>
        ))}
      </section>

      <section className="fashion-section">
        <div className="support-feature-grid">
          {supportTiles.map((tile) => (
            <Link className="support-feature-card" href={tile.href} key={tile.title}>
              <h2>{tile.title}</h2>
              <p>{tile.copy}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="fashion-section">
        <div className="fashion-title-block">
          <p className="eyebrow">Big deals</p>
          <h2>Shop by occasion, trend, and budget</h2>
        </div>
        <div className="fashion-promo-grid dense-promo-grid">
          {promoTiles.map((tile) => (
            <article className="fashion-promo-card" key={tile.title}>
              <div
                className="fashion-promo-image"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(20, 12, 9, 0.04), rgba(20, 12, 9, 0.18)), url('${tile.imagePath}')`
                }}
              />
              <div className="fashion-promo-copy">
                <h3>{tile.title}</h3>
                <p>{tile.subtitle}</p>
                <Link href={tile.title === "Wedding Store" ? "/shop?occasion=Wedding" : tile.title === "Office Store" ? "/shop?occasion=Office" : "/shop"}>
                  Shop Now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="fashion-section">
        <div className="fashion-deal-mosaic">
          <article
            className="fashion-wide-deal"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(9, 35, 29, 0.86), rgba(9, 35, 29, 0.16) 62%), url('/homepage-assets/b93301f842aed71f39492ba6d5bdd216.jpg')"
            }}
          >
            <div>
              <p className="eyebrow">AJIO-style spotlight</p>
              <h2>Min. 40% off on festive favourites</h2>
              <p>Curated drapes across wedding, festive, and premium silk edits.</p>
              <Link className="primary-button text-button" href="/shop">
                Shop The Sale
              </Link>
            </div>
          </article>
          <article
            className="fashion-mini-deal"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(18, 12, 9, 0.14), rgba(18, 12, 9, 0.18)), url('/homepage-assets/6761b750dbfae854650f47dc911f13af.jpg')"
            }}
          >
            <div>
              <span>Starting at</span>
              <strong>₹999</strong>
              <p>Budget saree store</p>
            </div>
          </article>
          <article
            className="fashion-mini-deal"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(18, 12, 9, 0.12), rgba(18, 12, 9, 0.2)), url('/homepage-assets/79c318b77172d6052bc1bb59bbda66d0.jpg')"
            }}
          >
            <div>
              <span>Top rated</span>
              <strong>Daily Wear</strong>
              <p>Easy cotton drapes</p>
            </div>
          </article>
        </div>
      </section>

      <section className="fashion-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Best sellers</p>
            <h2>Most loved right now</h2>
          </div>
          <Link className="text-link" href="/shop">
            View all
          </Link>
        </div>
        <div className="products-grid compact-grid">
          {bestSellers.map((product) => (
            <div className="home-product-stack" key={product.slug}>
              <ProductCard
                artClass={product.artClass}
                href={`/products/${product.slug}`}
                imageUrl={product.imageUrl}
                label="Best Seller"
                name={product.name}
                price={product.price}
              />
              <p className="fashion-discount-line">40-60% off</p>
              <div className="home-product-meta">
                <span>Trending</span>
                <span>Fast moving</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="fashion-section fashion-spotlight-grid">
        {spotlightTiles.map((tile) => (
          <article className="fashion-spotlight-card" key={tile.title}>
            <div
              className="fashion-spotlight-image"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(15, 11, 9, 0.06), rgba(15, 11, 9, 0.2)), url('${tile.imagePath}')`
              }}
            />
            <div className="fashion-spotlight-copy">
              <p className="eyebrow">Shop edit</p>
              <h3>{tile.title}</h3>
              <p>{tile.subtitle}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="fashion-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Fresh finds</p>
            <h2>New arrivals</h2>
          </div>
        </div>
        <div className="products-grid compact-grid">
          {newArrivals.map((product) => (
            <div className="home-product-stack" key={product.slug}>
              <ProductCard
                artClass={product.artClass}
                href={`/products/${product.slug}`}
                imageUrl={product.imageUrl}
                label="Just In"
                name={product.name}
                price={product.price}
              />
              <p className="fashion-discount-line">New season pick</p>
            </div>
          ))}
        </div>
      </section>

      <section className="fashion-section fashion-service-grid">
        <article className="fashion-service-card">
          <h3>Easy shopping</h3>
          <p>Cash on delivery, quick support, and easy returns.</p>
        </article>
        <article className="fashion-service-card">
          <h3>Craft-first selections</h3>
          <p>Handpicked sarees across silk, cotton, festive, and bridal edits.</p>
        </article>
        <article className="fashion-service-card">
          <h3>Style assistance</h3>
          <p>Need help choosing? Connect with us directly for quick recommendations.</p>
        </article>
      </section>

      <section className="fashion-section fashion-newsletter">
        <p className="eyebrow">Join the list</p>
        <h2>Unlock sale alerts and new arrival drops.</h2>
        <EmailCaptureForm
          buttonLabel="Join Now"
          source="homepage"
          subject="Mandala homepage newsletter signup"
        />
      </section>
    </ArchiveShell>
  );
}
