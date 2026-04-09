"use client";

import { useState, type FormEvent } from "react";

type RazorpaySettingsFormProps = {
  initialKeyId: string;
  hasStoredSecret: boolean;
};

export function RazorpaySettingsForm({
  initialKeyId,
  hasStoredSecret
}: RazorpaySettingsFormProps) {
  const [keyId, setKeyId] = useState(initialKeyId);
  const [keySecret, setKeySecret] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/admin/settings/razorpay", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        keyId,
        keySecret
      })
    });

    const result = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setError(result?.error ?? "Unable to save Razorpay settings right now.");
      setIsSaving(false);
      return;
    }

    setMessage("Razorpay API keys updated successfully.");
    setKeySecret("");
    setIsSaving(false);
  }

  return (
    <form className="admin-settings-form" onSubmit={handleSubmit}>
      <label>
        <span>Razorpay Key ID</span>
        <input
          onChange={(event) => setKeyId(event.target.value)}
          placeholder="rzp_live_xxxxx"
          type="text"
          value={keyId}
        />
      </label>

      <label>
        <span>Razorpay Key Secret</span>
        <input
          onChange={(event) => setKeySecret(event.target.value)}
          placeholder={hasStoredSecret ? "Stored secret exists. Enter a new one to replace it." : "rzp_live_secret_xxxxx"}
          type="password"
          value={keySecret}
        />
      </label>

      {message ? <p className="admin-form-message success">{message}</p> : null}
      {error ? <p className="admin-form-message error">{error}</p> : null}

      <div className="admin-settings-actions">
        <button className="admin-primary-button" disabled={isSaving} type="submit">
          {isSaving ? "Saving..." : "Update Keys"}
        </button>
      </div>
    </form>
  );
}
