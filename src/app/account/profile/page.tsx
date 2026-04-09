import Link from "next/link";

import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { requirePageUser } from "@/server/auth/guards";

export default async function AccountProfilePage() {
  const user = await requirePageUser();

  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Private Archive"
        title="Profile Settings"
        crumb="My Account"
        intro="Manage your personal details, communication preferences, and account security settings."
      />

      <section className="editorial-section support-split">
        <article className="form-card">
          <h2>Profile details</h2>
          <div className="field-grid">
            <label>
              Full Name
              <input defaultValue={user.name} type="text" />
            </label>
            <label>
              Email
              <input defaultValue={user.email} type="email" />
            </label>
            <label>
              Phone Number
              <input defaultValue="+91 90000 00000" type="tel" />
            </label>
            <label>
              Preferred Language
              <input defaultValue="English" type="text" />
            </label>
          </div>
          <div className="account-link-row">
            <Link className="primary-button text-button" href="/support">
              Contact Support to Update
            </Link>
            <Link className="secondary-button text-button" href="/auth/forgot-password">
              Reset Password
            </Link>
          </div>
        </article>

        <article className="support-feature-card">
          <h2>Communication preferences</h2>
          <div className="guide-link-list">
            <span>Order updates by email and SMS</span>
            <span>New collection releases</span>
            <span>Festival campaigns and private previews</span>
          </div>
          <Link className="secondary-button text-button" href="/support">
            Update Preferences via Support
          </Link>
        </article>
      </section>
    </ArchiveShell>
  );
}
