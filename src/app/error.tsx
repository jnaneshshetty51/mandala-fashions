"use client";

import Link from "next/link";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="archive-page">
      <section className="status-page">
        <p className="eyebrow">Boutique Interruption</p>
        <h1>Something interrupted this page.</h1>
        <p className="status-copy">
          We could not finish loading this part of the archive. You can try again or continue browsing.
        </p>
        <div className="status-actions">
          <button className="primary-button text-button" onClick={reset} type="button">
            Try Again
          </button>
          <Link className="secondary-button text-button" href="/shop">
            Continue Shopping
          </Link>
        </div>
        <p className="status-note">{error.digest ? `Reference: ${error.digest}` : "Please try again shortly."}</p>
      </section>
    </main>
  );
}
