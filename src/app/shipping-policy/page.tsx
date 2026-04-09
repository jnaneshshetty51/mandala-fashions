import { ArchiveShell, PageHero } from "@/components/archive-shell";

export default function ShippingPolicyPage() {
  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="Client Service"
        title="Shipping Policy"
        crumb="Assistance"
        intro="Shipping timelines, packaging standards, and domestic and international dispatch details for Mandala Fashions."
      />

      <section className="editorial-section prose-page">
        <h2>Domestic Shipping</h2>
        <p>
          Mandala Fashions offers shipping across India through reliable courier partners. Courier
          charges are borne by the customer.
        </p>
        <p>
          Orders are shipped within 2 to 5 business days from the date of purchase, and shipping
          timelines are communicated in advance.
        </p>

        <h2>Packaging Standards</h2>
        <p>
          All products are packed in secure tamper-proof packaging. If a package appears tampered
          with, please do not accept delivery from the carrier.
        </p>
        <p>
          If delivery is accepted, it will be deemed that the product arrived in tamper-proof
          condition.
        </p>

        <h2>Shipping Addresses</h2>
        <p>
          All products placed in one cart will be shipped to a single shipping address. If multiple
          shipping addresses are required, separate orders must be placed for each address.
        </p>

        <h2>International Shipping</h2>
        <p>
          For international shipping, customers may connect on WhatsApp at `+91 9620315511`.
        </p>
        <p>
          International shipping charges are payable by the customer. Orders are normally shipped
          within 10 to 15 business days from the order date, and timelines are communicated in
          advance.
        </p>
        <p>
          Local taxes, customs duties, and any import charges must be borne by the customer.
        </p>
      </section>
    </ArchiveShell>
  );
}
