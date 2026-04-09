import Link from "next/link";

import { ArchiveShell, PageHero } from "@/components/archive-shell";

export default function PaymentCancelledPage() {
  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Checkout Paused"
        title="Payment Cancelled"
        crumb="Checkout"
        intro="Your payment attempt was cancelled before completion. Your cart remains available for a fresh attempt."
      />

      <section className="editorial-section support-split">
        <article className="summary-card">
          <p className="eyebrow">Your cart is safe</p>
          <h2>Resume whenever you are ready.</h2>
          <p>You can return to the cart, review your selection again, or continue shopping before retrying checkout.</p>
          <div className="status-actions">
            <Link className="primary-button text-button" href="/cart">
              Return to Cart
            </Link>
            <Link className="secondary-button text-button" href="/shop">
              Continue Browsing
            </Link>
          </div>
        </article>

        <article className="support-feature-card">
          <h2>Need help?</h2>
          <p>If checkout was interrupted unexpectedly, our boutique support team can help you finish the purchase.</p>
          <Link className="text-link" href="/whatsapp-assist">
            Open WhatsApp assistance
          </Link>
        </article>
      </section>
    </ArchiveShell>
  );
}

