import Link from "next/link";

import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { lookbookPages } from "@/lib/archive-data";

export default function LookbooksPage() {
  return (
    <ArchiveShell activeNav="collections">
      <PageHero
        eyebrow="Marketing & Growth"
        title="Collections & Lookbooks"
        crumb="Editorial Collections"
        intro="A merchandised browse layer for bridal, office, and seasonal discovery."
      />

      <section className="editorial-section support-stack">
        <div className="support-feature-grid">
          {lookbookPages.map((page) => (
            <article className="support-feature-card" key={page.slug}>
              <p className="eyebrow">{page.eyebrow}</p>
              <h2>{page.title}</h2>
              <p>{page.intro}</p>
              <Link className="text-link" href={`/lookbooks/${page.slug}`}>
                View Lookbook
              </Link>
            </article>
          ))}
        </div>
      </section>
    </ArchiveShell>
  );
}
