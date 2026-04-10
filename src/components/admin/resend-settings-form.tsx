"use client";

import { useState, type FormEvent } from "react";

type ResendSettingsFormProps = {
  initialFromEmail: string;
  initialFromName: string;
  apiKeyMasked: string;
  isConfigured: boolean;
};

export function ResendSettingsForm({
  initialFromEmail,
  initialFromName,
  apiKeyMasked,
  isConfigured
}: ResendSettingsFormProps) {
  const [apiKey, setApiKey] = useState("");
  const [fromEmail, setFromEmail] = useState(initialFromEmail);
  const [fromName, setFromName] = useState(initialFromName || "Mandala Fashions");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTest() {
    if (!apiKey) {
      setError("Enter the API key before testing.");
      return;
    }
    setIsTesting(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/admin/settings/resend/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey })
    });

    const result = (await response.json().catch(() => null)) as {
      data?: { success: boolean };
      error?: string;
    } | null;

    setIsTesting(false);

    if (result?.data?.success) {
      setMessage("API key is valid. Resend connection successful.");
    } else {
      setError(result?.error ?? "Invalid API key. Check and try again.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!apiKey) {
      setError("Enter the Resend API key to save.");
      return;
    }

    setIsSaving(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/admin/settings/resend", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, fromEmail, fromName })
    });

    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    setIsSaving(false);

    if (!response.ok) {
      setError(result?.error ?? "Unable to save Resend settings.");
      return;
    }

    setApiKey("");
    setMessage("Resend settings saved. Emails will now be sent via Resend.");
  }

  return (
    <form className="admin-settings-form" onSubmit={handleSubmit}>
      {isConfigured ? (
        <p className="admin-form-message success" style={{ marginBottom: 0 }}>
          Resend is connected. Current key: <strong>{apiKeyMasked}</strong>. Enter a new key to replace it.
        </p>
      ) : (
        <p className="admin-form-message" style={{ marginBottom: 0, background: "var(--admin-surface-alt, #f9f9f9)" }}>
          Connect Resend to send order confirmation, shipping, and notification emails from your own domain.
        </p>
      )}

      <label>
        <span>Resend API Key</span>
        <input
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={isConfigured ? "Enter new key to replace the existing one" : "re_xxxxxxxxxxxxxxxxxxxx"}
          required
          type="password"
          value={apiKey}
        />
      </label>

      <label>
        <span>From Email</span>
        <input
          onChange={(e) => setFromEmail(e.target.value)}
          placeholder="orders@mandalafashions.com"
          required
          type="email"
          value={fromEmail}
        />
      </label>
      <p style={{ fontSize: "0.8rem", color: "var(--admin-muted)", marginTop: "-0.75rem" }}>
        Must be a verified domain or email in your Resend dashboard.
      </p>

      <label>
        <span>From Name</span>
        <input
          onChange={(e) => setFromName(e.target.value)}
          placeholder="Mandala Fashions"
          required
          type="text"
          value={fromName}
        />
      </label>

      {message ? <p className="admin-form-message success">{message}</p> : null}
      {error ? <p className="admin-form-message error">{error}</p> : null}

      <div className="admin-settings-actions">
        <button
          className="admin-ghost-button"
          disabled={isTesting || isSaving}
          onClick={handleTest}
          type="button"
        >
          {isTesting ? "Testing..." : "Test API Key"}
        </button>
        <button className="admin-primary-button" disabled={isSaving || isTesting} type="submit">
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
