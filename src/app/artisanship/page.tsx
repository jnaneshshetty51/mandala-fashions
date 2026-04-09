import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { artisanRegions } from "@/lib/archive-data";

export default function ArtisanshipPage() {
  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="Living Craft"
        title="Artisanship"
        crumb="Weaving Regions"
        intro="Our collections are shaped through long-running relationships with weaving clusters that carry both technique and memory."
      />

      <section className="editorial-section artisan-grid">
        {artisanRegions.map((region) => (
          <article className="artisan-card" key={region.name}>
            <div className="artisan-visual" />
            <p className="eyebrow">{region.craft}</p>
            <h2>{region.name}</h2>
            <p>{region.copy}</p>
          </article>
        ))}
      </section>
    </ArchiveShell>
  );
}
