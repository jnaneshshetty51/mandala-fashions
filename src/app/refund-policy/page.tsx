import { ArchiveShell, PageHero } from "@/components/archive-shell";

export default function RefundPolicyPage() {
  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="Client Service"
        title="Return & Refund Policy"
        crumb="Assistance"
        intro="Review our return process, approval conditions, and gift-card-only refund handling before placing an order."
      />

      <section className="editorial-section prose-page">
        <h2>Refund Policy</h2>
        <p>
          Mandala Fashions does not issue refunds on any orders. If a return is approved after
          review, a gift card will be issued only for the product value.
        </p>
        <p>
          The gift card does not include convenience fees charged by the payment gateway or any
          other cost incurred for the order by the customer or the company.
        </p>

        <h2>How to Request a Return</h2>
        <p>
          Customers must email `info@mandalafashions.com` with the order details and return reason.
          For damaged, defective, or incorrect items, an opening video is mandatory along with the
          price tag, packing cover, and delivered bill barcode.
        </p>
        <p>
          Our support team will review the request, and return confirmation is given only through
          email.
        </p>

        <h2>Return Address</h2>
        <p>
          Shop #1, Site #9, Gubbalala Main Road, Subramanyapura Post, Bangalore - 560061
        </p>

        <h2>Return Conditions</h2>
        <p>
          Products must be returned in original condition: unused, unaltered, with intact folding,
          original bill, price tag, and silk mark tag if applicable.
        </p>
        <p>
          Missing tags, improper folding, or signs of use will result in rejection of the return
          request by Mandala Fashions.
        </p>
        <p>
          Reverse pickup is not available for damaged, defective, or incorrect items in selected
          pin codes. In such cases, customers must courier the parcel back to the store address.
        </p>

        <h2>International Orders</h2>
        <p>
          We do not accept returns for orders from countries outside India.
        </p>
      </section>
    </ArchiveShell>
  );
}
