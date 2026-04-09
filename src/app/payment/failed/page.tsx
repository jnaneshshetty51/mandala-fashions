import Link from "next/link";

import { ArchiveShell, PageHero } from "@/components/archive-shell";

export default function PaymentFailedPage() {
  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Payment Required"
        title="Payment Failed"
        crumb="Checkout"
        intro="We could not complete your transaction. No worries, your selection can still be retried."
      />

      <section className="editorial-section support-split">
        <article className="support-feature-card">
          <h2>Common reasons</h2>
          <p>UPI session timeout, bank verification failure, card authentication issues, or temporary gateway interruption.</p>
        </article>

        <article className="summary-card">
          <p className="eyebrow">Next step</p>
          <h2>Retry securely</h2>
          <div className="guide-link-list">
            <span>Try a different payment method.</span>
            <span>Reconfirm network and bank approval prompts.</span>
            <span>Contact support if the issue repeats.</span>
          </div>
          <div className="status-actions">
            <Link className="primary-button text-button" href="/checkout">
              Retry Payment
            </Link>
            <Link className="secondary-button text-button" href="/support">
              Contact Support
            </Link>
          </div>
        </article>
      </section>
    </ArchiveShell>
  );
}

