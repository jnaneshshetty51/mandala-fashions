import Link from "next/link";

import { ArchiveShell, PageHero, ProductCard } from "@/components/archive-shell";
import { listCatalogProducts } from "@/server/catalog/service";

const fabricFilters = ["Silk", "Cotton", "Georgette", "Organza", "Tussar"];

const occasionFilters = ["Wedding", "Festive", "Casual", "Evening", "Office", "Party"];

const colorSwatches = [
  { name: "Deep green", className: "swatch-deep-green" },
  { name: "Crimson", className: "swatch-crimson" },
  { name: "Espresso", className: "swatch-espresso" },
  { name: "Saffron", className: "swatch-saffron" },
  { name: "Ivory", className: "swatch-ivory" }
];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function makeShopHref({
  fabric,
  occasion,
  color
}: {
  fabric?: string;
  occasion?: string;
  color?: string;
}) {
  const params = new URLSearchParams();

  if (fabric) params.set("fabric", fabric);
  if (occasion) params.set("occasion", occasion);
  if (color) params.set("color", color);

  const queryString = params.toString();
  return queryString ? `/shop?${queryString}` : "/shop";
}

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{
    fabric?: string;
    occasion?: string;
    color?: string;
  }>;
}) {
  const products = await listCatalogProducts();
  const { fabric = "", occasion = "", color = "" } = await searchParams;
  const activeFabric = fabric.trim();
  const activeOccasion = occasion.trim();
  const activeColor = color.trim();

  const filteredProducts = products.filter((product) => {
    const matchesFabric = !activeFabric || normalize(product.fabric).includes(normalize(activeFabric));
    const matchesOccasion =
      !activeOccasion ||
      normalize(product.occasion).includes(normalize(activeOccasion)) ||
      product.occasions.some((item) => normalize(item).includes(normalize(activeOccasion)));
    const matchesColor = !activeColor || normalize(product.color).includes(normalize(activeColor));

    return matchesFabric && matchesOccasion && matchesColor;
  });

  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Mandala Fashions"
        title="Traditional Weaves"
        crumb="Sarees"
        intro="Browse the full catalog by fabric, occasion, and color with working filters designed for everyday shopping."
      />

      <section className="retail-toolbar">
        <div className="retail-toolbar-copy">
          <strong>Retail-style shopping</strong>
          <span>Pick sarees by occasion, budget, fabric, and color without digging through the full catalog.</span>
        </div>
        <div className="retail-toolbar-chips">
          <span>Best Seller</span>
          <span>New Arrivals</span>
          <span>Wedding Edit</span>
          <span>Workwear</span>
        </div>
      </section>

      <section className="search-chip-strip">
        <Link href="/shop?occasion=Wedding&fabric=Silk">Bridal Sarees</Link>
        <Link href="/shop?occasion=Office&fabric=Cotton">Office Wear</Link>
        <Link href="/shop?occasion=Festive">Light Festive</Link>
        <Link href="/shop?occasion=Party&fabric=Georgette">Party Wear</Link>
        <Link href="/shop?color=Ivory&occasion=Festive">Pastel Picks</Link>
      </section>

      <section className="archive-layout">
        <aside className="filter-rail" aria-label="Filters">
          <div className="filter-group">
            <h2>Fabric</h2>
            <div className="filter-options">
              {fabricFilters.map((label) => (
                <Link
                  className={`filter-link ${label === activeFabric ? "is-active" : ""}`}
                  href={makeShopHref({
                    fabric: label === activeFabric ? "" : label,
                    occasion: activeOccasion,
                    color: activeColor
                  })}
                  key={label}
                >
                  <span className="filter-checkbox" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h2>Occasion</h2>
            <div className="filter-options">
              {occasionFilters.map((label) => (
                <Link
                  className={`filter-link ${label === activeOccasion ? "is-active" : ""}`}
                  href={makeShopHref({
                    fabric: activeFabric,
                    occasion: label === activeOccasion ? "" : label,
                    color: activeColor
                  })}
                  key={label}
                >
                  <span className="filter-checkbox" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h2>Color</h2>
            <div className="swatch-row" aria-label="Available colors">
              {colorSwatches.map((swatch) => (
                <Link
                  aria-label={swatch.name}
                  className={`color-swatch ${swatch.className} ${swatch.name === activeColor ? "is-active" : ""}`}
                  href={makeShopHref({
                    fabric: activeFabric,
                    occasion: activeOccasion,
                    color: swatch.name === activeColor ? "" : swatch.name
                  })}
                  key={swatch.name}
                />
              ))}
            </div>
          </div>

          {activeFabric || activeOccasion || activeColor ? (
            <Link className="text-link" href="/shop">
              Clear filters
            </Link>
          ) : null}
        </aside>

        <div className="products-panel">
          <div className="section-heading-row retail-section-heading">
            <div>
              <p className="eyebrow">Shop catalog</p>
              <h2>{filteredProducts.length} available pieces</h2>
            </div>
            <div className="retail-results-meta">
              <span>Retail Grid</span>
              <span>Top picks first</span>
              {(activeFabric || activeOccasion || activeColor) && <span>Filtered for your need</span>}
            </div>
          </div>
          <div className="products-grid">
            {(filteredProducts.length > 0 ? filteredProducts : products).map((product) => (
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
            <p>
              {filteredProducts.length > 0
                ? `Showing ${filteredProducts.length} filtered results`
                : `Showing ${products.length} catalog pieces`}
            </p>
            <Link className="secondary-button text-button" href="/search">
              Search Mandala Fashions
            </Link>
          </div>
        </div>
      </section>
    </ArchiveShell>
  );
}
