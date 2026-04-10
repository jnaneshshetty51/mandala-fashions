"use client";

import { useState, type FormEvent } from "react";

type ShiprocketSettingsFormProps = {
  initialEmail: string;
  initialPickupLocation: string;
  initialChannelId: string;
  initialDefaultCity: string;
  initialDefaultState: string;
  initialDefaultPincode: string;
  isConfigured: boolean;
};

export function ShiprocketSettingsForm({
  initialEmail,
  initialPickupLocation,
  initialChannelId,
  initialDefaultCity,
  initialDefaultState,
  initialDefaultPincode,
  isConfigured
}: ShiprocketSettingsFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [pickupLocation, setPickupLocation] = useState(initialPickupLocation || "Primary");
  const [channelId, setChannelId] = useState(initialChannelId);
  const [defaultCity, setDefaultCity] = useState(initialDefaultCity);
  const [defaultState, setDefaultState] = useState(initialDefaultState);
  const [defaultPincode, setDefaultPincode] = useState(initialDefaultPincode);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTest() {
    if (!email || !password) {
      setError("Enter email and password before testing.");
      return;
    }
    setIsTesting(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/admin/settings/shiprocket/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const result = (await response.json().catch(() => null)) as { data?: { success: boolean }; error?: string } | null;
    setIsTesting(false);

    if (result?.data?.success) {
      setMessage("Connection successful. Credentials are valid.");
    } else {
      setError(result?.error ?? "Login failed. Check email and password.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password) {
      setError("Enter your Shiprocket password to save credentials.");
      return;
    }

    setIsSaving(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/admin/settings/shiprocket", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        pickupLocation,
        channelId,
        defaultCity,
        defaultState,
        defaultPincode
      })
    });

    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    setIsSaving(false);

    if (!response.ok) {
      setError(result?.error ?? "Unable to save Shiprocket settings.");
      return;
    }

    setPassword("");
    setMessage("Shiprocket settings saved successfully.");
  }

  return (
    <form className="admin-settings-form" onSubmit={handleSubmit}>
      {isConfigured ? (
        <p className="admin-form-message success" style={{ marginBottom: 0 }}>
          Shiprocket is connected. Update credentials below to change them.
        </p>
      ) : (
        <p className="admin-form-message" style={{ marginBottom: 0, background: "var(--admin-surface-alt, #f9f9f9)" }}>
          Enter your Shiprocket account credentials to enable shipping label creation from order pages.
        </p>
      )}

      <label>
        <span>Shiprocket Email</span>
        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
      </label>

      <label>
        <span>Password</span>
        <input
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isConfigured ? "Enter password to update credentials" : "Your Shiprocket password"}
          required
          type="password"
          value={password}
        />
      </label>

      <label>
        <span>Pickup Location</span>
        <input
          onChange={(e) => setPickupLocation(e.target.value)}
          placeholder="Primary"
          required
          type="text"
          value={pickupLocation}
        />
      </label>
      <p style={{ fontSize: "0.8rem", color: "var(--admin-muted)", marginTop: "-0.75rem" }}>
        Must match a pickup location name in your Shiprocket dashboard exactly.
      </p>

      <label>
        <span>Channel ID (optional)</span>
        <input
          onChange={(e) => setChannelId(e.target.value)}
          placeholder="Leave blank to use default channel"
          type="text"
          value={channelId}
        />
      </label>

      <div style={{ borderTop: "1px solid var(--admin-border)", paddingTop: "1rem", marginTop: "0.25rem" }}>
        <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem" }}>
          Default Shipping Address Fallbacks
        </p>
        <p style={{ fontSize: "0.8rem", color: "var(--admin-muted)", marginBottom: "0.75rem" }}>
          Used when city, state, or pincode cannot be parsed from the customer's address automatically.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
        <label>
          <span>Default City</span>
          <input
            onChange={(e) => setDefaultCity(e.target.value)}
            placeholder="Mumbai"
            type="text"
            value={defaultCity}
          />
        </label>
        <label>
          <span>Default State</span>
          <input
            onChange={(e) => setDefaultState(e.target.value)}
            placeholder="Maharashtra"
            type="text"
            value={defaultState}
          />
        </label>
        <label>
          <span>Default Pincode</span>
          <input
            maxLength={6}
            onChange={(e) => setDefaultPincode(e.target.value)}
            pattern="[0-9]{6}"
            placeholder="400001"
            type="text"
            value={defaultPincode}
          />
        </label>
      </div>

      {message ? <p className="admin-form-message success">{message}</p> : null}
      {error ? <p className="admin-form-message error">{error}</p> : null}

      <div className="admin-settings-actions">
        <button
          className="admin-ghost-button"
          disabled={isTesting || isSaving}
          onClick={handleTest}
          type="button"
        >
          {isTesting ? "Testing..." : "Test Connection"}
        </button>
        <button className="admin-primary-button" disabled={isSaving || isTesting} type="submit">
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
