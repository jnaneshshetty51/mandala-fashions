import { notFound } from "next/navigation";

import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { lookbookPages } from "@/lib/archive-data";

export function generateStaticParams() {
  return lookbookPages.map((page) => ({ slug: page.slug }));
}

export default async function LookbookDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lookbook = lookbookPages.find((page) => page.slug === slug);

  if (!lookbook) {
    notFound();
  }

  return (
    <ArchiveShell activeNav="collections">
      <PageHero
        eyebrow={lookbook.eyebrow}
        title={lookbook.title}
        crumb="Lookbook"
        intro={lookbook.intro}
      />

      <section className="editorial-section support-stack">
        <article className="support-whatsapp-panel">
          <h2>Why This Edit Works</h2>
          <p>{lookbook.intro}</p>
        </article>

        <div className="support-feature-grid">
          {lookbook.highlights.map((item) => (
            <article className="support-feature-card" key={item}>
              <h2>Collection Note</h2>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
    </ArchiveShell>
  );
}
