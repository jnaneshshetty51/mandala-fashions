import { MailtoForm } from "@/components/forms/mailto-form";
import { ArchiveShell, PageHero } from "@/components/archive-shell";

const services = [
  {
    title: "Blouse Stitching",
    copy: "Share blouse length, sleeve preference, neckline style, and fit notes for a boutique-guided finish."
  },
  {
    title: "Fall & Pico",
    copy: "Add drape-ready finishing so your saree arrives prepared for immediate wear and easier movement."
  },
  {
    title: "Styling Guidance",
    copy: "Request pairing suggestions for jewelry, blouse fabric, and occasion-based draping direction."
  }
];

export default function CustomServicesPage() {
  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="Bespoke Services"
        title="Custom Saree Finishing"
        crumb="Boutique Services"
        intro="Add blouse stitching, fall and pico finishing, or styling guidance before your order is completed."
      />

      <section className="editorial-section support-stack">
        <div className="support-feature-grid">
          {services.map((service) => (
            <article className="support-feature-card" key={service.title}>
              <h2>{service.title}</h2>
              <p>{service.copy}</p>
            </article>
          ))}
        </div>

        <div className="support-split">
          <MailtoForm
            subject="Mandala custom service request"
            submitLabel="Email Service Request"
            title="Request Service Details"
            fields={[
              { label: "Name", name: "name", placeholder: "Your name", required: true },
              { label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true },
              { label: "Order / Product", name: "orderOrProduct", placeholder: "Order ID or saree name", required: true },
              { label: "Service Needed", name: "serviceNeeded", placeholder: "Blouse stitching, fall & pico...", required: true },
              {
                label: "Notes",
                name: "notes",
                type: "textarea",
                placeholder: "Measurements, delivery date, color preferences...",
                className: "field-span"
              }
            ]}
          />

          <div className="contact-card support-card">
            <h2>Turnaround Notes</h2>
            <p>Service timelines may vary based on design complexity and current order volume.</p>
            <p>Our team confirms final requirements before any finishing work begins.</p>
            <p>For urgent bridal timelines, contact the boutique directly after submitting your request.</p>
          </div>
        </div>
      </section>
    </ArchiveShell>
  );
}
