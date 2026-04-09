import { ArchiveShell, PageHero } from "@/components/archive-shell";

export default function AccessibilityPage() {
  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="Client Service"
        title="Accessibility"
        crumb="Site Support"
        intro="Mandala Fashions is working to make the storefront easier to browse, read, and use across devices, input methods, and connection conditions."
      />

      <section className="editorial-section prose-page">
        <h2>Our approach</h2>
        <p>
          We aim to keep the website usable with keyboards, touch devices, screen zoom, and modern
          assistive technologies. Core shopping journeys such as browsing collections, reading
          product details, checking policies, and contacting support are designed to remain
          available without requiring advanced interactions.
        </p>

        <h2>What we prioritize</h2>
        <p>
          We review page structure, heading hierarchy, color contrast, link clarity, focus states,
          readable typography, and mobile responsiveness as part of ongoing site improvements.
        </p>
        <p>
          We also work to reduce broken links, unclear button labels, and incomplete navigation so
          visitors can reach support, policy, and product information without confusion.
        </p>

        <h2>Need help using the site?</h2>
        <p>
          If you face any accessibility barrier while browsing Mandala Fashions, please contact our
          team and we will help you place an order, answer product questions, or share information
          in an alternate format wherever possible.
        </p>
        <p>Email: info@mandalafashions.com</p>
        <p>Phone: +91 9620315511</p>
        <p>Store hours: Monday to Saturday, 11 AM to 7 PM</p>
      </section>
    </ArchiveShell>
  );
}
