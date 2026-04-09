import Link from "next/link";

import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { MailtoForm } from "@/components/forms/mailto-form";

export default function SupportPage() {
  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="Client Care"
        title="Support Centre"
        crumb="Assistance"
        intro="Get help with orders, returns, product guidance, boutique appointments, and post-purchase concerns."
      />

      <section className="editorial-section support-feature-grid">
        <article className="support-feature-card">
          <h2>Order assistance</h2>
          <p>Track active orders, verify delivery timelines, or request boutique follow-up.</p>
          <Link className="text-link" href="/track-order">
            Track an order
          </Link>
        </article>
        <article className="support-feature-card">
          <h2>Returns and exchanges</h2>
          <p>Start a return request and review the boutique approval process.</p>
          <Link className="text-link" href="/returns-request">
            Open returns request
          </Link>
        </article>
        <article className="support-feature-card">
          <h2>Styling and WhatsApp help</h2>
          <p>Get direct assistance choosing the right saree, blouse, or occasion styling.</p>
          <Link className="text-link" href="/whatsapp-assist">
            Chat with our team
          </Link>
        </article>
      </section>

      <section className="editorial-section support-split">
        <MailtoForm
          subject="Mandala support request"
          submitLabel="Email Support Request"
          title="Raise a support ticket"
          fields={[
            { label: "Full Name", name: "name", placeholder: "Your name", required: true },
            { label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true },
            {
              label: "Subject",
              name: "subjectLine",
              placeholder: "Order issue / return / product question",
              required: true,
              className: "field-span"
            },
            {
              label: "Message",
              name: "message",
              type: "textarea",
              placeholder: "Share the issue in detail so our team can respond faster.",
              required: true,
              className: "field-span"
            }
          ]}
        />

        <article className="summary-card">
          <p className="eyebrow">Direct boutique contact</p>
          <h2>Mandala client care</h2>
          <div className="guide-link-list">
            <span>Phone: +91 9620315511</span>
            <span>Email: info@mandalafashions.com</span>
            <span>Store: Gubbalala Main Road, Bengaluru</span>
          </div>
        </article>
      </section>
    </ArchiveShell>
  );
}
