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

const quickFilters = [
  { label: "All", href: "/shop" },
  { label: "Bridal", href: "/shop?occasion=Wedding&fabric=Silk" },
  { label: "Festive", href: "/shop?occasion=Festive" },
  { label: "Office Wear", href: "/shop?occasion=Office&fabric=Cotton" },
  { label: "Party", href: "/shop?occasion=Party&fabric=Georgette" },
  { label: "Pastels", href: "/shop?color=Ivory&occasion=Festive" }
];

const colorKeywords: Record<string, string[]> = {
  "deep green": ["green", "emerald", "jade", "forest", "teal", "olive"],
  "crimson": ["red", "crimson", "maroon", "ruby", "rose", "pink", "magenta"],
  "espresso": ["brown", "espresso", "chocolate", "coffee", "earth", "tan", "beige"],
  "saffron": ["yellow", "saffron", "gold", "amber", "mustard", "turmeric", "orange"],
  "ivory": ["ivory", "white", "cream", "off-white", "beige", "pearl", "silver", "grey", "gray"]
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function matchesColor(productColor: string, activeColor: string): boolean {
  const normalizedProduct = normalize(productColor);
  const normalizedActive = normalize(activeColor);
  const keywords = colorKeywords[normalizedActive] ?? [normalizedActive];
  return keywords.some((keyword) => normalizedProduct.includes(keyword)) || normalizedProduct.includes(normalizedActive);
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

  const hasActiveFilter = Boolean(activeFabric || activeOccasion || activeColor);

  const filteredProducts = products.filter((product) => {
    const matchesFabric = !activeFabric || normalize(product.fabric).includes(normalize(activeFabric));
    const matchesOccasion =
      !activeOccasion ||
      normalize(product.occasion).includes(normalize(activeOccasion));
    const matchesColorFilter = !activeColor || matchesColor(product.color, activeColor);

    return matchesFabric && matchesOccasion && matchesColorFilter;
  });

  const displayProducts = hasActiveFilter ? filteredProducts : products;

  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Mandala Fashions"
        title="The Full Collection"
        crumb="Shop"
        intro="Browse every saree by fabric, occasion, and color — with filters that work."
      />

      <nav className="shop-quick-filters" aria-label="Quick filters">
        {quickFilters.map((filter) => {
          const isAll = filter.href === "/shop";
          const isActive = isAll ? !hasActiveFilter : false;
          return (
            <Link
              className={`shop-quick-chip${isActive ? " is-active" : ""}`}
              href={filter.href}
              key={filter.label}
            >
              {filter.label}
            </Link>
          );
        })}
      </nav>

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

          {hasActiveFilter ? (
            <Link className="text-link" href="/shop">
              Clear filters
            </Link>
          ) : null}
        </aside>

        <div className="products-panel">
          <div className="shop-results-bar">
            <div>
              <p className="eyebrow">
                {hasActiveFilter
                  ? `${filteredProducts.length} result${filteredProducts.length !== 1 ? "s" : ""} found`
                  : `${products.length} piece${products.length !== 1 ? "s" : ""} in catalog`}
              </p>
              {hasActiveFilter && (
                <div className="active-filters-row">
                  {activeFabric && <span className="active-filter-tag">{activeFabric}</span>}
                  {activeOccasion && <span className="active-filter-tag">{activeOccasion}</span>}
                  {activeColor && <span className="active-filter-tag">{activeColor}</span>}
                  <Link className="clear-filters-link" href="/shop">Clear all</Link>
                </div>
              )}
            </div>
          </div>

          {displayProducts.length > 0 ? (
            <div className="products-grid">
              {displayProducts.map((product) => (
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
          ) : (
            <div className="shop-empty-state">
              <p>No sarees found matching your filters.</p>
              <Link className="secondary-button" href="/shop">Browse all sarees</Link>
            </div>
          )}

          <div className="load-more">
            {hasActiveFilter && filteredProducts.length === 0 ? null : (
              <p>
                {hasActiveFilter
                  ? `${filteredProducts.length} filtered results`
                  : `${products.length} pieces in the collection`}
              </p>
            )}
            <Link className="secondary-button text-button" href="/search">
              Search Mandala Fashions
            </Link>
          </div>
        </div>
      </section>
    </ArchiveShell>
  );
}
