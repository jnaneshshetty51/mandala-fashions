import { AdminLayout } from "@/components/admin/admin-layout";
import { RazorpaySettingsForm } from "@/components/admin/razorpay-settings-form";
import { requirePageRole } from "@/server/auth/guards";
import { getRazorpaySettings } from "@/server/settings/service";

export default async function AdminSettingsPage() {
  const user = await requirePageRole(["ADMIN"]);
  const settings = await getRazorpaySettings();

  return (
    <AdminLayout
      active="settings"
      createLabel="Save Payment Config"
      eyebrow="Configuration"
      title="Payment Settings"
      topNav={[
        { label: "Payments", href: "/admin/settings" },
        { label: "Access", href: "/account" },
        { label: "Inventory", href: "/admin/products" }
      ]}
      user={user}
    >
      <section className="admin-settings-layout">
        <article className="admin-table-card">
          <div className="admin-card-header">
            <div>
              <h2>Razorpay Integration</h2>
              <p>Manage the live API credentials used for payment gateway operations.</p>
            </div>
          </div>

          <RazorpaySettingsForm
            hasStoredSecret={settings.hasStoredSecret}
            initialKeyId={settings.keyId}
          />
        </article>

        <article className="admin-growth-card">
          <h2>Security Notes</h2>
          <p>Only administrators can update payment settings.</p>
          <div className="guide-link-list">
            <span>Key secret values are never shown back once saved.</span>
            <span>Rotate keys immediately after suspected exposure.</span>
            <span>Restart long-lived payment workers after key rotation.</span>
          </div>
        </article>
      </section>
    </AdminLayout>
  );
}
