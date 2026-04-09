import Link from "next/link";

import { ArchiveShell, PageHero } from "@/components/archive-shell";

export default function PaymentSuccessPage() {
  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Payment Captured"
        title="Payment Successful"
        crumb="Checkout"
        intro="Your payment has been received. We are now securing your order and preparing confirmation details."
      />

      <section className="editorial-section support-split">
        <article className="summary-card">
          <p className="eyebrow">What happens next</p>
          <h2>Your archive purchase is moving forward.</h2>
          <div className="guide-link-list">
            <span>Order confirmation is generated after verification.</span>
            <span>Inventory is reserved for your purchase.</span>
            <span>Dispatch updates will follow by email and phone.</span>
          </div>
        </article>

        <article className="support-feature-card">
          <h2>Continue</h2>
          <p>You can return to the storefront or proceed to the confirmation page once your order is finalized.</p>
          <div className="account-link-row">
            <Link className="primary-button text-button" href="/order-confirmation">
              View Confirmation
            </Link>
            <Link className="secondary-button text-button" href="/shop">
              Keep Shopping
            </Link>
          </div>
        </article>
      </section>
    </ArchiveShell>
  );
}

