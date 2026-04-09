import Link from "next/link";

import { ArchiveShell, PageHero } from "@/components/archive-shell";

const whatsappHref =
  "https://wa.me/919620315511?text=Hello%20Mandala%20Fashions%2C%20I%20need%20help%20choosing%20a%20saree.";

export default function WhatsAppAssistPage() {
  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="Instant Styling Help"
        title="WhatsApp Shopping Assist"
        crumb="Live Concierge"
        intro="Need help choosing the right saree for a wedding, festive event, or gifting moment? Start a direct WhatsApp conversation with the boutique."
      />

      <section className="editorial-section support-split">
        <div className="support-whatsapp-panel">
          <p className="eyebrow">Direct conversion tool</p>
          <h2>Talk to a stylist in minutes.</h2>
          <p>
            Share your occasion, budget, preferred colors, and delivery timeline. We will guide
            you toward the right collection faster than browsing alone.
          </p>
          <Link className="primary-button text-button support-whatsapp-button" href={whatsappHref}>
            Chat on WhatsApp
          </Link>
        </div>

        <div className="contact-card support-card">
          <h2>Best For</h2>
          <p>Wedding and trousseau selection.</p>
          <p>Budget-based recommendations.</p>
          <p>Last-minute event shopping help.</p>
          <p>Custom service coordination for blouse stitching and finishing.</p>
        </div>
      </section>
    </ArchiveShell>
  );
}
