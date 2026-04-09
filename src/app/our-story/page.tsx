import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { storyMoments } from "@/lib/archive-data";

export default function OurStoryPage() {
  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="The Studio"
        title="Our Story"
        crumb="Mandala Fashions"
        intro="Mandala is built around the belief that clothing can hold memory: of ceremony, of region, of a family archive renewed."
      />

      <section className="editorial-section story-grid">
        <div className="story-lead">
          <div className="story-visual story-visual-book" />
          <div className="story-copy-block">
            <h2>Where tradition meets refined elegance</h2>
            <p>
              Mandala Fashions is where tradition meets refined elegance. We celebrate the timeless
              beauty of Indian sarees through thoughtfully curated collections that honor heritage
              while embracing modern grace. From luxurious Banarasi silks to classic handloom
              weaves, every piece reflects fine craftsmanship, intricate detailing, and enduring
              style.
            </p>
            <p>
              Created for the modern woman who values tradition, our sarees are designed to make
              every moment special, whether it is a grand celebration or an intimate gathering. At
              Mandala Fashions, each saree is more than attire; it is a statement of grace,
              sophistication, and the rich artistry of Indian textiles.
            </p>
          </div>
        </div>

        <div className="timeline">
          {storyMoments.map((moment) => (
            <article className="timeline-item" key={moment.year}>
              <p className="timeline-year">{moment.year}</p>
              <h3>{moment.title}</h3>
              <p>{moment.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </ArchiveShell>
  );
}
