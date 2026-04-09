import Link from "next/link";

import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { offerCampaigns } from "@/lib/archive-data";

export default function OffersPage() {
  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Marketing & Growth"
        title="Offers & Deals"
        crumb="Promotions"
        intro="Seasonal campaigns, festive deals, and boutique coupon moments designed to convert high-intent shoppers."
      />

      <section className="editorial-section support-stack">
        <div className="support-feature-grid">
          {offerCampaigns.map((offer) => (
            <article className="support-feature-card" key={offer.slug}>
              <p className="eyebrow">{offer.eyebrow}</p>
              <h2>{offer.title}</h2>
              <p>{offer.subtitle}</p>
              <p>
                Coupon: <strong>{offer.coupon}</strong>
              </p>
              <p>{offer.period}</p>
              <Link className="text-link" href="/shop">
                Shop This Offer
              </Link>
            </article>
          ))}
        </div>
      </section>
    </ArchiveShell>
  );
}
