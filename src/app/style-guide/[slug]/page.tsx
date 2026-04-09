import { notFound } from "next/navigation";

import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { styleGuidePosts } from "@/lib/archive-data";

export function generateStaticParams() {
  return styleGuidePosts.map((post) => ({ slug: post.slug }));
}

export default async function StyleGuideArticlePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = styleGuidePosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <ArchiveShell activeNav="about">
      <PageHero eyebrow={post.category} title={post.title} crumb="Style Guide" intro={post.excerpt} />

      <section className="editorial-section prose-page">
        <p>{post.readTime}</p>
        {post.sections.map((section) => (
          <div key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.copy}</p>
          </div>
        ))}
      </section>
    </ArchiveShell>
  );
}
