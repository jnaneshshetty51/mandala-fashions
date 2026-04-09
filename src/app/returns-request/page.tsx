import { MailtoForm } from "@/components/forms/mailto-form";
import { ArchiveShell, PageHero } from "@/components/archive-shell";

export default function ReturnsRequestPage() {
  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="Post-Purchase Support"
        title="Return Request"
        crumb="Assistance"
        intro="Submit the details required for a return review, including order information and product condition notes."
      />

      <section className="editorial-section support-split">
        <MailtoForm
          subject="Mandala return approval request"
          submitLabel="Email Return Request"
          title="Request return approval"
          fields={[
            { label: "Order Number", name: "orderNumber", placeholder: "MND-8210", required: true },
            { label: "Email Address", name: "email", type: "email", placeholder: "info@example.com", required: true },
            {
              label: "Reason for return",
              name: "reason",
              placeholder: "Damaged item / incorrect item / other approved request",
              required: true,
              className: "field-span"
            },
            {
              label: "Notes",
              name: "notes",
              type: "textarea",
              placeholder: "Share all relevant details, including opening video and tag condition requirements.",
              className: "field-span"
            }
          ]}
          extraBodyLines={["Please attach the required opening video, tag photos, and bill details when sending this email."]}
        />

        <article className="support-feature-card">
          <h2>Before you submit</h2>
          <div className="guide-link-list">
            <span>Keep the original bill, price tag, and silk mark tag intact.</span>
            <span>Opening video is mandatory for damaged or incorrect items.</span>
            <span>Return approval is issued only by email after review.</span>
          </div>
        </article>
      </section>
    </ArchiveShell>
  );
}
