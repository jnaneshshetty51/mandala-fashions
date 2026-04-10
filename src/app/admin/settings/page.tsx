import { AdminLayout } from "@/components/admin/admin-layout";
import { RazorpaySettingsForm } from "@/components/admin/razorpay-settings-form";
import { ResendSettingsForm } from "@/components/admin/resend-settings-form";
import { ShiprocketSettingsForm } from "@/components/admin/shiprocket-settings-form";
import { requirePageRole } from "@/server/auth/guards";
import { getRazorpaySettings, getResendSettings } from "@/server/settings/service";
import { getShiprocketSettings } from "@/server/shiprocket/service";

export default async function AdminSettingsPage() {
  const user = await requirePageRole(["ADMIN"]);
  const [razorpay, shiprocket, resend] = await Promise.all([
    getRazorpaySettings(),
    getShiprocketSettings(),
    getResendSettings()
  ]);

  return (
    <AdminLayout
      active="settings"
      createLabel="Save Config"
      createHref="/admin/settings#razorpay"
      eyebrow="Configuration"
      title="Integrations & Settings"
      topNav={[
        { label: "Payments", href: "/admin/settings#razorpay" },
        { label: "Shipping", href: "/admin/settings#shiprocket" },
        { label: "Email", href: "/admin/settings#resend" }
      ]}
      user={user}
    >
      {/* Razorpay */}
      <section className="admin-settings-layout" id="razorpay" style={{ marginBottom: "2rem" }}>
        <article className="admin-table-card">
          <div className="admin-card-header">
            <div>
              <h2>Razorpay Integration</h2>
              <p>API credentials used for payment gateway operations.</p>
            </div>
          </div>
          <RazorpaySettingsForm
            hasStoredSecret={razorpay.hasStoredSecret}
            initialKeyId={razorpay.keyId}
          />
        </article>

        <article className="admin-growth-card">
          <h2>Payment Security</h2>
          <p>Only administrators can update payment settings.</p>
          <div className="guide-link-list">
            <span>Key secret values are never shown back once saved.</span>
            <span>Rotate keys immediately after suspected exposure.</span>
            <span>Restart long-lived payment workers after key rotation.</span>
          </div>
        </article>
      </section>

      {/* Shiprocket */}
      <section className="admin-settings-layout" id="shiprocket">
        <article className="admin-table-card">
          <div className="admin-card-header">
            <div>
              <h2>Shiprocket Integration</h2>
              <p>Connect your Shiprocket account to create shipments directly from order pages.</p>
            </div>
            {shiprocket.isConfigured ? (
              <span className="admin-delta positive" style={{ fontSize: "0.8rem" }}>Connected</span>
            ) : (
              <span className="admin-delta neutral" style={{ fontSize: "0.8rem" }}>Not configured</span>
            )}
          </div>
          <ShiprocketSettingsForm
            initialChannelId={shiprocket.channelId}
            initialDefaultCity={shiprocket.defaultCity}
            initialDefaultPincode={shiprocket.defaultPincode}
            initialDefaultState={shiprocket.defaultState}
            initialEmail={shiprocket.email}
            initialPickupLocation={shiprocket.pickupLocation}
            isConfigured={shiprocket.isConfigured}
          />
        </article>

        <article className="admin-growth-card">
          <h2>Shiprocket Setup Guide</h2>
          <div className="guide-link-list">
            <span>Use the same email and password you use to log in to shiprocket.in.</span>
            <span>Set the Pickup Location name exactly as it appears in your Shiprocket dashboard under Settings → Manage Pickup.</span>
            <span>Channel ID is optional — leave blank to use the default channel.</span>
            <span>Default city, state and pincode are used as fallbacks when the customer address cannot be parsed automatically.</span>
            <span>Click Test Connection before saving to verify your credentials work.</span>
          </div>
        </article>
      </section>

      {/* Resend */}
      <section className="admin-settings-layout" id="resend" style={{ marginTop: "2rem" }}>
        <article className="admin-table-card">
          <div className="admin-card-header">
            <div>
              <h2>Resend Email Integration</h2>
              <p>Send transactional emails — order confirmations, shipping updates, and notifications.</p>
            </div>
            {resend.isConfigured ? (
              <span className="admin-delta positive" style={{ fontSize: "0.8rem" }}>Connected</span>
            ) : (
              <span className="admin-delta neutral" style={{ fontSize: "0.8rem" }}>Not configured</span>
            )}
          </div>
          <ResendSettingsForm
            apiKeyMasked={resend.apiKeyMasked}
            initialFromEmail={resend.fromEmail}
            initialFromName={resend.fromName}
            isConfigured={resend.isConfigured}
          />
        </article>

        <article className="admin-growth-card">
          <h2>Resend Setup Guide</h2>
          <div className="guide-link-list">
            <span>Create a free account at resend.com and generate an API key under API Keys.</span>
            <span>Add and verify your sending domain in Resend's dashboard under Domains.</span>
            <span>Set From Email to an address on your verified domain, e.g. orders@mandalafashions.com.</span>
            <span>The From Name appears as the sender name in the customer's inbox.</span>
            <span>API keys start with re_ — never share them publicly.</span>
            <span>Use Test API Key to confirm the key is valid before saving.</span>
          </div>
        </article>
      </section>
    </AdminLayout>
  );
}
