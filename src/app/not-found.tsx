import Link from "next/link";

import { ArchiveShell } from "@/components/archive-shell";

export default function NotFound() {
  return (
    <ArchiveShell activeNav="shop">
      <section className="status-page">
        <p className="eyebrow">Archive Missing</p>
        <h1>This page is not in the collection.</h1>
        <p className="status-copy">
          The page you were looking for may have moved, expired, or never entered the archive.
        </p>
        <div className="status-actions">
          <Link className="primary-button text-button" href="/shop">
            Return to Shop
          </Link>
          <Link className="secondary-button text-button" href="/collections">
            Browse Collections
          </Link>
        </div>
      </section>
    </ArchiveShell>
  );
}

