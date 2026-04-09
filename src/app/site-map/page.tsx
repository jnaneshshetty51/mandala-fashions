import Link from "next/link";

import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { siteDirectory } from "@/lib/site";

export default function SitemapPage() {
  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="Site Directory"
        title="Sitemap"
        crumb="Browse All Pages"
        intro="A complete directory of the key customer-facing pages so every part of the storefront is easy to discover from one place."
      />

      <section className="editorial-section support-feature-grid">
        {siteDirectory.map((section) => (
          <article className="support-feature-card" key={section.title}>
            <h2>{section.title}</h2>
            <div className="guide-link-list">
              {section.links.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </ArchiveShell>
  );
}
