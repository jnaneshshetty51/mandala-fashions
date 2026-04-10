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

const homeBrowseOccasionFilters = [
  { label: "All", value: "all" },
  { label: "Wedding", value: "Wedding" },
  { label: "Festive", value: "Festive" },
  { label: "Office", value: "Office" },
  { label: "Party", value: "Party" }
] as const;

const homeBrowseTrendFilters = [
  { label: "All", value: "all" },
  { label: "Silk Icons", value: "silk-icons" },
  { label: "Soft Pastels", value: "soft-pastels" },
  { label: "Office Classics", value: "office-classics" },
  { label: "Evening Glam", value: "evening-glam" }
] as const;

const homeBrowseBudgetFilters = [
  { label: "All", value: "all" },
  { label: "Under ₹5k", value: "under-5000" },
  { label: "₹5k-₹15k", value: "5000-15000" },
  { label: "₹15k-₹30k", value: "15000-30000" },
  { label: "₹30k+", value: "30000-plus" }
] as const;

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

function parsePriceValue(price: string) {
  const numericValue = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function buildHomeBrowseHref(
  currentFilters: { occasion: string; trend: string; budget: string },
  updates: Partial<{ occasion: string; trend: string; budget: string }>
) {
  const nextFilters = { ...currentFilters, ...updates };
  const params = new URLSearchParams();

  if (nextFilters.occasion !== "all") params.set("browseOccasion", nextFilters.occasion);
  if (nextFilters.trend !== "all") params.set("browseTrend", nextFilters.trend);
  if (nextFilters.budget !== "all") params.set("browseBudget", nextFilters.budget);

  const queryString = params.toString();
  return queryString.length > 0 ? `/?${queryString}#shop-by-filters` : "/#shop-by-filters";
}

function buildShopBrowseHref(filters: { occasion: string; trend: string; budget: string }) {
  const params = new URLSearchParams();

  if (filters.occasion !== "all") params.set("occasion", filters.occasion);

  if (filters.trend === "silk-icons") {
    params.set("fabric", "Silk");
  } else if (filters.trend === "soft-pastels") {
    params.set("color", "Ivory");
  } else if (filters.trend === "office-classics") {
    params.set("occasion", "Office");
    params.set("fabric", "Cotton");
  } else if (filters.trend === "evening-glam") {
    params.set("occasion", filters.occasion !== "all" ? filters.occasion : "Party");
  }

  const queryString = params.toString();
  return queryString.length > 0 ? `/shop?${queryString}` : "/shop";
}

function matchesHomeTrend(
  trend: string,
  product: { fabric: string; occasion: string; occasions: string[]; color: string; name: string; description: string; label: string }
) {
  if (trend === "all") return true;

  const searchableText = [
    product.fabric,
    product.occasion,
    product.color,
    product.name,
    product.description,
    product.label,
    ...product.occasions
  ]
    .join(" ")
    .toLowerCase();

  if (trend === "silk-icons") {
    return normalizeValue(product.fabric).includes("silk") || searchableText.includes("banarasi") || searchableText.includes("kanchipuram");
  }

  if (trend === "soft-pastels") {
    return ["ivory", "blush", "pink", "peach", "mint", "sage", "powder", "lavender", "floral", "pastel", "beige", "cream"]
      .some((term) => searchableText.includes(term));
  }

  if (trend === "office-classics") {
    return ["office", "casual", "daily wear", "cotton", "travel", "meeting"].some((term) =>
      searchableText.includes(term)
    );
  }

  if (trend === "evening-glam") {
    return ["evening", "party", "reception", "cocktail", "zari", "celebration", "glam"].some((term) =>
      searchableText.includes(term)
    );
  }

  return true;
}

function matchesHomeBudget(budget: string, priceValue: number) {
  if (budget === "all") return true;
  if (budget === "under-5000") return priceValue < 5000;
  if (budget === "5000-15000") return priceValue >= 5000 && priceValue <= 15000;
  if (budget === "15000-30000") return priceValue > 15000 && priceValue <= 30000;
  if (budget === "30000-plus") return priceValue > 30000;
  return true;
}

export default async function HomePage({
  searchParams
}: {
  searchParams?: Promise<{ browseOccasion?: string; browseTrend?: string; browseBudget?: string }>;
}) {
  const products = await listCatalogProducts();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const activeOccasion = homeBrowseOccasionFilters.some((item) => item.value === resolvedSearchParams.browseOccasion)
    ? resolvedSearchParams.browseOccasion ?? "all"
    : "all";
  const activeTrend = homeBrowseTrendFilters.some((item) => item.value === resolvedSearchParams.browseTrend)
    ? resolvedSearchParams.browseTrend ?? "all"
    : "all";
  const activeBudget = homeBrowseBudgetFilters.some((item) => item.value === resolvedSearchParams.browseBudget)
    ? resolvedSearchParams.browseBudget ?? "all"
    : "all";
  const activeBrowseFilters = {
    occasion: activeOccasion,
    trend: activeTrend,
    budget: activeBudget
  };
  const featuredBrowseProducts = products
    .filter((product) => {
      const matchesOccasion =
        activeOccasion === "all" ||
        normalizeValue(product.occasion).includes(normalizeValue(activeOccasion)) ||
        product.occasions.some((item) => normalizeValue(item).includes(normalizeValue(activeOccasion)));

      return (
        matchesOccasion &&
        matchesHomeTrend(activeTrend, product) &&
        matchesHomeBudget(activeBudget, parsePriceValue(product.price))
      );
    })
    .slice(0, 5);

  // New arrivals = most recently added (DB returns newest first)
  const newArrivals = products.slice(0, 8);
  // Best sellers = next batch (different products, no overlap)
  const bestSellers = products.slice(8, 16);
  // Remaining catalog = everything not shown above
  const remainingCatalog = products.slice(16);
  // If catalog is small (< 16 products), show all products in the catalog grid to guarantee visibility
  const allForCatalogGrid = products.length <= 16 ? products : remainingCatalog;

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

      <section className="fashion-section home-browse-section" id="shop-by-filters">
        <div className="fashion-title-block">
          <p className="eyebrow">Big deals</p>
          <h2>Shop by occasion, trend, and budget</h2>
        </div>
        <div className="home-browse-layout">
          <aside className="home-browse-panel">
            <div className="home-browse-filter-group">
              <p>Occasion</p>
              <div className="home-browse-chip-row">
                {homeBrowseOccasionFilters.map((filter) => (
                  <Link
                    className={filter.value === activeOccasion ? "is-active" : undefined}
                    href={buildHomeBrowseHref(activeBrowseFilters, { occasion: filter.value })}
                    key={filter.value}
                  >
                    {filter.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="home-browse-filter-group">
              <p>Trend</p>
              <div className="home-browse-chip-row">
                {homeBrowseTrendFilters.map((filter) => (
                  <Link
                    className={filter.value === activeTrend ? "is-active" : undefined}
                    href={buildHomeBrowseHref(activeBrowseFilters, { trend: filter.value })}
                    key={filter.value}
                  >
                    {filter.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="home-browse-filter-group">
              <p>Budget</p>
              <div className="home-browse-chip-row">
                {homeBrowseBudgetFilters.map((filter) => (
                  <Link
                    className={filter.value === activeBudget ? "is-active" : undefined}
                    href={buildHomeBrowseHref(activeBrowseFilters, { budget: filter.value })}
                    key={filter.value}
                  >
                    {filter.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link className="text-link" href={buildShopBrowseHref(activeBrowseFilters)}>
              Browse all matching sarees
            </Link>
          </aside>

          <div className="home-browse-results">
            <div className="section-heading-row home-browse-results-header">
              <div>
                <p className="eyebrow">Live results</p>
                <h2>{featuredBrowseProducts.length > 0 ? "Matching picks for you" : "No exact match yet"}</h2>
              </div>
              <span className="home-browse-results-count">
                {featuredBrowseProducts.length} product{featuredBrowseProducts.length === 1 ? "" : "s"}
              </span>
            </div>

            {featuredBrowseProducts.length > 0 ? (
              <div className="products-grid compact-grid">
                {featuredBrowseProducts.map((product) => (
                  <div className="home-product-stack" key={product.slug}>
                    <ProductCard
                      artClass={product.artClass}
                      href={`/products/${product.slug}`}
                      imageUrl={product.imageUrl}
                      label={product.fabric}
                      name={product.name}
                      price={product.price}
                    />
                    <p className="fashion-discount-line">{product.occasion} edit</p>
                  </div>
                ))}
              </div>
            ) : (
              <article className="home-browse-empty">
                <h3>No products match this exact combination.</h3>
                <p>Try broadening one filter to see more wedding, festive, office, and trend-led picks.</p>
                <Link className="text-link" href="/#shop-by-filters">
                  Reset homepage filters
                </Link>
              </article>
            )}

            {featuredBrowseProducts.length > 0 ? (
              <div className="home-browse-footer">
                <Link className="primary-button text-button" href={buildShopBrowseHref(activeBrowseFilters)}>
                  View all in shop
                </Link>
              </div>
            ) : null}
          </div>
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
            <p className="eyebrow">Fresh finds</p>
            <h2>New arrivals</h2>
          </div>
          <Link className="text-link" href="/shop">
            View all
          </Link>
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

      {bestSellers.length > 0 ? (
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
      ) : null}

      {allForCatalogGrid.length > 0 ? (
        <section className="fashion-section">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Complete collection</p>
              <h2>Explore the full catalog</h2>
            </div>
            <Link className="text-link" href="/shop">
              Shop all
            </Link>
          </div>
          <div className="products-grid compact-grid">
            {allForCatalogGrid.map((product) => (
              <div className="home-product-stack" key={product.slug}>
                <ProductCard
                  artClass={product.artClass}
                  href={`/products/${product.slug}`}
                  imageUrl={product.imageUrl}
                  label={product.label}
                  name={product.name}
                  price={product.price}
                />
              </div>
            ))}
          </div>
          {products.length > 16 ? (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Link className="secondary-button text-button" href="/shop">
                View all {products.length} products
              </Link>
            </div>
          ) : null}
        </section>
      ) : null}

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
