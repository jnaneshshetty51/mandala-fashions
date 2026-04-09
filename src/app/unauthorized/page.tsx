import Link from "next/link";

import { ArchiveShell } from "@/components/archive-shell";

export default function UnauthorizedPage() {
  return (
    <ArchiveShell activeNav="shop">
      <section className="status-page">
        <p className="eyebrow">Restricted Access</p>
        <h1>You do not have permission to open this page.</h1>
        <p className="status-copy">
          This section of the archive is limited to the appropriate account role or membership level.
        </p>
        <div className="status-actions">
          <Link className="primary-button text-button" href="/account">
            Return to Account
          </Link>
          <Link className="secondary-button text-button" href="/auth/sign-in">
            Sign In Again
          </Link>
        </div>
      </section>
    </ArchiveShell>
  );
}
