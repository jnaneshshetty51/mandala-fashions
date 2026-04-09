import { ArchiveShell, PageHero } from "@/components/archive-shell";

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Domestic orders are usually shipped within 2 to 5 business days. International orders generally ship within 10 to 15 business days, and timelines are shared with the customer in advance."
  },
  {
    question: "Do you accept returns or refunds?",
    answer:
      "Mandala Fashions does not issue refunds. If a return is approved after review, a gift card is issued for the product value only. Return approval is confirmed only through email."
  },
  {
    question: "How do I request a return?",
    answer:
      "Email info@mandalafashions.com with your order details and the reason for return. For damaged, defective, or incorrect items, an opening video plus tag and packing details are mandatory."
  },
  {
    question: "How should I care for my saree fabric?",
    answer:
      "Store sarees folded in a dry space, avoid prolonged direct sunlight, and use fabric-appropriate cleaning. For silk, zari, and delicate organza pieces, professional dry cleaning is recommended."
  },
  {
    question: "Do you offer blouse stitching or finishing services?",
    answer:
      "Yes. You can request blouse stitching, fall and pico finishing, and styling guidance through our custom services page before your order is finalized."
  },
  {
    question: "Can I get help choosing a saree?",
    answer:
      "Yes. You can contact the boutique directly by phone, email, or WhatsApp for styling guidance, occasion-based recommendations, and bridal support."
  }
];

export default function FaqPage() {
  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="Client Service"
        title="Frequently Asked Questions"
        crumb="Assistance"
        intro="Quick answers on delivery, returns, care, and boutique support."
      />

      <section className="editorial-section support-stack">
        {faqs.map((item) => (
          <article className="support-feature-card" key={item.question}>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>
    </ArchiveShell>
  );
}
