import Link from "next/link";

import { ArchiveShell, PageHero, ProductCard } from "@/components/archive-shell";
import { listCatalogProducts } from "@/server/catalog/service";

const suggestionQueries = [
  "red silk saree",
  "bridal banarasi saree",
  "summer cotton saree",
  "office wear saree",
  "black georgette saree",
  "organza festive saree"
];

const fabricOptions = ["Silk", "Cotton", "Georgette", "Organza", "Tussar"];
const occasionOptions = ["Wedding", "Festive", "Casual", "Evening", "Office", "Party"];
const colorSwatches = [
  { name: "Deep Green", className: "swatch-deep-green" },
  { name: "Crimson", className: "swatch-crimson" },
  { name: "Espresso", className: "swatch-espresso" },
  { name: "Saffron", className: "swatch-saffron" },
  { name: "Ivory", className: "swatch-ivory" }
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function levenshtein(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  return dp[a.length][b.length];
}

function getProductSearchText(product: Awaited<ReturnType<typeof listCatalogProducts>>[number]) {
  return normalize(
    [
      product.name,
      product.label,
      product.fabric,
      product.occasion,
      product.color,
      product.category,
      product.note,
      product.description,
      ...product.colorChoices,
      ...product.variants.map((variant) => `${variant.name} ${variant.note} ${variant.price}`),
      ...product.details,
      ...product.occasions,
      ...product.styling
    ].join(" ")
  );
}

function getBestSuggestion(query: string) {
  if (!query) return "";

  const normalizedQuery = normalize(query);
  return suggestionQueries.reduce((best, current) => {
    const currentDistance = levenshtein(normalizedQuery, normalize(current));
    const bestDistance = best ? levenshtein(normalizedQuery, normalize(best)) : Number.POSITIVE_INFINITY;

    return currentDistance < bestDistance ? current : best;
  }, "");
}

function makeSearchHref({
  q,
  fabric,
  occasion,
  color
}: {
  q?: string;
  fabric?: string;
  occasion?: string;
  color?: string;
}) {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (fabric) params.set("fabric", fabric);
  if (occasion) params.set("occasion", occasion);
  if (color) params.set("color", color);

  const queryString = params.toString();
  return queryString ? `/search?${queryString}` : "/search";
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{
    q?: string;
    fabric?: string;
    occasion?: string;
    color?: string;
  }>;
}) {
  const catalogProducts = await listCatalogProducts();
  const { q = "", fabric = "", occasion = "", color = "" } = await searchParams;
  const query = q.trim();
  const activeFabric = fabric.trim();
  const activeOccasion = occasion.trim();
  const activeColor = color.trim();
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery ? normalizedQuery.split(" ") : [];

  const scored = catalogProducts
    .map((product) => {
      const searchText = getProductSearchText(product);
      let score = 0;

      if (!normalizedQuery) {
        score = 1;
      } else {
        if (searchText.includes(normalizedQuery)) score += 10;

        for (const token of tokens) {
          if (searchText.includes(token)) score += 2;
          else {
            const words = searchText.split(" ");
            if (words.some((word) => levenshtein(token, word) <= 2)) score += 1;
          }
        }
      }

      const matchesFabric = !activeFabric || normalize(product.fabric).includes(normalize(activeFabric));
      const matchesOccasion =
        !activeOccasion ||
        normalize(product.occasion).includes(normalize(activeOccasion)) ||
        product.occasions.some((item) => normalize(item).includes(normalize(activeOccasion)));
      const matchesColor = !activeColor || normalize(product.color).includes(normalize(activeColor));

      return {
        product,
        score,
        matchesFilters: matchesFabric && matchesOccasion && matchesColor
      };
    })
    .filter((item) => item.score > 0 && item.matchesFilters)
    .sort((a, b) => b.score - a.score);

  const results = scored.map((item) => item.product);
  const bestSuggestion = query && results.length === 0 ? getBestSuggestion(query) : "";

  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Archive Search"
        title={query ? `Results for "${query}"` : "Search The Archive"}
        crumb="Search"
        intro="Find sarees by color, fabric, occasion, or style. Search is typo-tolerant and tuned for natural phrases like “red silk saree”."
        actions={
          <form action="/search" className="search-form">
            <input
              defaultValue={query}
              list="search-suggestions"
              name="q"
              placeholder="Search red silk saree, bridal banarasi..."
              type="search"
            />
            <input name="fabric" type="hidden" value={activeFabric} />
            <input name="occasion" type="hidden" value={activeOccasion} />
            <input name="color" type="hidden" value={activeColor} />
            <button className="primary-button text-button" type="submit">
              Search
            </button>
            <datalist id="search-suggestions">
              {suggestionQueries.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
          </form>
        }
      />

      <section className="search-chip-strip">
        {suggestionQueries.map((suggestion) => (
          <Link
            href={makeSearchHref({
              q: suggestion,
              fabric: activeFabric,
              occasion: activeOccasion,
              color: activeColor
            })}
            key={suggestion}
          >
            {suggestion}
          </Link>
        ))}
      </section>

      <section className="retail-toolbar retail-toolbar-search">
        <div className="retail-toolbar-copy">
          <strong>Search like a shopper</strong>
          <span>Use fabric, occasion, color, or natural phrases to narrow the catalog quickly.</span>
        </div>
      </section>

      {bestSuggestion ? (
        <section className="editorial-section search-message">
          <p>
            No exact matches for <strong>{query}</strong>. Try{" "}
            <Link
              href={makeSearchHref({
                q: bestSuggestion,
                fabric: activeFabric,
                occasion: activeOccasion,
                color: activeColor
              })}
            >
              {bestSuggestion}
            </Link>
            .
          </p>
        </section>
      ) : null}

      <section className="archive-layout">
        <aside className="filter-rail" aria-label="Filters">
          <div className="filter-group">
            <h2>Fabric</h2>
            <div className="filter-options">
              {fabricOptions.map((label) => {
                const isActive = label === activeFabric;
                return (
                  <Link
                    className={`filter-link ${isActive ? "is-active" : ""}`}
                    href={makeSearchHref({
                      q: query,
                      fabric: isActive ? "" : label,
                      occasion: activeOccasion,
                      color: activeColor
                    })}
                    key={label}
                  >
                    <span className="filter-checkbox" aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <h2>Occasion</h2>
            <div className="filter-options">
              {occasionOptions.map((label) => {
                const isActive = label === activeOccasion;
                return (
                  <Link
                    className={`filter-link ${isActive ? "is-active" : ""}`}
                    href={makeSearchHref({
                      q: query,
                      fabric: activeFabric,
                      occasion: isActive ? "" : label,
                      color: activeColor
                    })}
                    key={label}
                  >
                    <span className="filter-checkbox" aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <h2>Color</h2>
            <div className="swatch-row" aria-label="Available colors">
              {colorSwatches.map((swatch) => {
                const isActive = swatch.name === activeColor;
                return (
                  <Link
                    aria-label={swatch.name}
                    className={`color-swatch ${swatch.className} ${isActive ? "is-active" : ""}`}
                    href={makeSearchHref({
                      q: query,
                      fabric: activeFabric,
                      occasion: activeOccasion,
                      color: isActive ? "" : swatch.name
                    })}
                    key={swatch.name}
                  />
                );
              })}
            </div>
          </div>

          {activeFabric || activeOccasion || activeColor ? (
            <Link className="text-link" href={makeSearchHref({ q: query })}>
              Clear filters
            </Link>
          ) : null}
        </aside>

        <div className="products-panel">
          <div className="section-heading-row retail-section-heading">
            <div>
              <p className="eyebrow">Smart results</p>
              <h2>{results.length} matching pieces</h2>
            </div>
            <div className="retail-results-meta">
              <span>Relevant first</span>
              <span>Typo tolerant</span>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="products-grid">
              {results.map((product) => (
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
            <div className="detail-panel">
              <h2>No matches found</h2>
              <p>
                Try broader phrases like <strong>silk saree</strong>, <strong>wedding saree</strong>, or{" "}
                <strong>cotton office wear</strong>.
              </p>
            </div>
          )}
        </div>
      </section>
    </ArchiveShell>
  );
}
