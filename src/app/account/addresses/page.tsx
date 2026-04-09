import Link from "next/link";

import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { savedAddresses } from "@/lib/archive-data";
import { requirePageUser } from "@/server/auth/guards";

export default async function AccountAddressesPage() {
  await requirePageUser();

  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Private Archive"
        title="Saved Addresses"
        crumb="My Account"
        intro="Add, edit, and manage multiple delivery locations for home, work, gifting, and special events."
      />

      <section className="editorial-section support-stack">
        <div className="support-feature-grid">
          {savedAddresses.map((address) => (
            <article className="support-feature-card" key={address.id}>
              <p className="eyebrow">{address.label}</p>
              <h2>{address.name}</h2>
              {address.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <div className="account-link-row">
                <Link className="secondary-button text-button" href="/support">
                  Edit via Support
                </Link>
                <Link className="secondary-button text-button" href="/support">
                  Change Default
                </Link>
              </div>
            </article>
          ))}

          <article className="support-feature-card account-add-card">
            <p className="eyebrow">Address book</p>
            <h2>Add new address</h2>
            <p>Create additional addresses for gifting, alternate delivery, or office pickup coordination.</p>
            <Link className="primary-button text-button support-submit" href="/support">
              Add Address via Support
            </Link>
          </article>
        </div>
      </section>
    </ArchiveShell>
  );
}
