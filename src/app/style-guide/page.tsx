import Link from "next/link";

import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { styleGuidePosts } from "@/lib/archive-data";

export default function StyleGuidePage() {
  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="Marketing & Growth"
        title="Style Guide"
        crumb="Editorial Journal"
        intro="SEO-friendly editorial guidance for draping, fabric choices, and occasion-led saree shopping."
      />

      <section className="editorial-section support-stack">
        {styleGuidePosts.map((post) => (
          <article className="support-feature-card" key={post.slug}>
            <p className="eyebrow">{post.category}</p>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <p>{post.readTime}</p>
            <Link className="text-link" href={`/style-guide/${post.slug}`}>
              Read Article
            </Link>
          </article>
        ))}
      </section>
    </ArchiveShell>
  );
}
