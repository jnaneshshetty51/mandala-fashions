import Link from "next/link";

import { ArchiveShell } from "@/components/archive-shell";

export default function MaintenancePage() {
  return (
    <ArchiveShell activeNav="shop">
      <section className="status-page">
        <p className="eyebrow">Archive Maintenance</p>
        <h1>We are refining the boutique.</h1>
        <p className="status-copy">
          The website is temporarily unavailable while we complete a scheduled update. Please return shortly.
        </p>
        <div className="status-actions">
          <Link className="primary-button text-button" href="/contact">
            Contact Boutique
          </Link>
          <Link className="secondary-button text-button" href="/whatsapp-assist">
            WhatsApp Assistance
          </Link>
        </div>
      </section>
    </ArchiveShell>
  );
}

