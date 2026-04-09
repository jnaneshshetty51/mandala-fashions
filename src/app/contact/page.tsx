import { MailtoForm } from "@/components/forms/mailto-form";
import { ArchiveShell, PageHero } from "@/components/archive-shell";

export default function ContactPage() {
  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="Appointment Room"
        title="Contact"
        crumb="Studio Assistance"
        intro="For sourcing, styling appointments, bridal consultations, or collection previews, write to the studio."
      />

      <section className="editorial-section contact-grid">
        <div className="contact-card">
          <h2>Mandala Fashions</h2>
          <p>Shop #1, Site #9, Gubbalala Main Road</p>
          <p>Subramanyapura Post, Bangalore - 560061</p>
          <p>Opposite IndusInd Bank, Gubbalala Branch</p>
          <p>Monday to Saturday, 11 AM to 7 PM</p>
          <p>info@mandalafashions.com</p>
          <p>+91 9620315511</p>
        </div>

        <MailtoForm
          subject="Mandala consultation request"
          submitLabel="Email Consultation Request"
          title="Request a consultation"
          fields={[
            { label: "Name", name: "name", placeholder: "Your name", required: true },
            { label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true },
            {
              label: "What are you shopping for?",
              name: "shoppingFor",
              placeholder: "Wedding trousseau, festive edit, archival gifting...",
              required: true,
              className: "field-span"
            }
          ]}
        />
      </section>
    </ArchiveShell>
  );
}
