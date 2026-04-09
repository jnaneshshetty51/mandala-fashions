import { ArchiveShell, PageHero } from "@/components/archive-shell";

export default function ShippingReturnsPage() {
  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="Client Service"
        title="Shipping & Returns"
        crumb="Assistance"
        intro="A combined overview of shipping, return approval, and store-support policies. You can also review the dedicated shipping and refund pages for quicker reference."
      />
      <section className="editorial-section prose-page">
        <h2>Quick Links</h2>
        <p>
          For a focused version of these policies, visit the dedicated Shipping Policy and Return &
          Refund Policy pages from the footer assistance section.
        </p>

        <h2>Refund Policy</h2>
        <p>
          Mandala Fashions does not issue refunds on any orders. If a return is approved after
          review, a gift card will be issued only for the product value. The gift card does not
          include convenience fees charged by the payment gateway or any other costs incurred for
          the order by the customer or the company.
        </p>

        <h2>Returns</h2>
        <p>
          To request a return, customers must email `info@mandalafashions.com` with the order
          details and reason for return. For damaged, defective, or incorrect items, an opening
          video of the product is mandatory along with the price tag, packing cover, and delivered
          bill barcode.
        </p>
        <p>
          Our support team will review the request and confirm approval only through email. Once the
          return is approved, the item must be packed and shipped to:
        </p>
        <p>
          Shop #1, Site #9, Gubbalala Main Road, Subramanyapura Post, Bangalore - 560061
        </p>
        <p>
          Products must be returned in original condition: unused, unaltered, with proper folding,
          original bill, price tag, and silk mark tag if applicable. Missing tags, improper
          folding, or any signs of use will lead to rejection of the return request.
        </p>
        <p>
          Reverse pickup is not available for damaged, defective, or incorrect items in selected pin
          codes. In such cases, customers must courier the parcel back to the store address.
        </p>

        <h2>Domestic Shipping</h2>
        <p>
          Mandala Fashions offers shipping across India through reliable courier partners. Courier
          charges are borne by the customer. Orders are shipped within 2 to 5 business days from the
          date of purchase, and shipping timelines are communicated in advance.
        </p>
        <p>
          All products are packed in secure tamper-proof packaging. If a package appears tampered
          with, please do not accept delivery from the carrier. If delivery is accepted, it will be
          deemed that the product arrived in tamper-proof condition.
        </p>
        <p>
          All products placed in one cart will be shipped to a single shipping address. If multiple
          shipping addresses are required, separate orders must be placed for each address.
        </p>

        <h2>International Shipping</h2>
        <p>
          We do not accept returns for orders from countries outside India. For international
          shipping, customers may connect on WhatsApp at `+91 9620315511`.
        </p>
        <p>
          International shipping charges are payable by the customer. Orders are normally shipped
          within 10 to 15 business days from the order date, and timelines are communicated in
          advance.
        </p>
        <p>
          Local taxes, customs duties, and any import charges must be borne by the customer.
          International shipments are also packed in secure tamper-proof packaging, and the same
          delivery acceptance conditions apply.
        </p>

        <h2>Store Location</h2>
        <p>
          Shop #1, Site #9, Gubbalala Main Road, Subramanyapura Post, Bangalore - 560061
        </p>
        <p>
          Opposite IndusInd Bank, Gubbalala Branch.
        </p>
      </section>
    </ArchiveShell>
  );
}
