"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function CouponActions({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();

  async function handleToggle() {
    await fetch(`/api/admin/coupons/${id}/toggle`, { method: "PATCH" });
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this coupon? This cannot be undone.")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <span style={{ display: "flex", gap: "0.5rem" }}>
      <button
        onClick={() => void handleToggle()}
        style={{ cursor: "pointer", fontSize: "0.75rem" }}
        type="button"
      >
        {isActive ? "Deactivate" : "Activate"}
      </button>
      <button
        onClick={() => void handleDelete()}
        style={{ color: "var(--color-error, #b91c1c)", cursor: "pointer", fontSize: "0.75rem" }}
        type="button"
      >
        Delete
      </button>
    </span>
  );
}

export function CouponCreateForm() {
  const router = useRouter();
  const [state, setState] = useState({
    isSubmitting: false,
    error: null as string | null,
    success: null as string | null
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ isSubmitting: true, error: null, success: null });

    const formData = new FormData(event.currentTarget);

    const minOrderRaw = formData.get("minOrder") as string;
    const usageLimitRaw = formData.get("usageLimit") as string;
    const expiresAtRaw = formData.get("expiresAt") as string;

    const body: Record<string, unknown> = {
      code: (formData.get("code") as string).toUpperCase(),
      label: formData.get("label") as string,
      type: formData.get("type") as string,
      value: Number(formData.get("value")),
      isActive: formData.get("isActive") === "on"
    };

    if (minOrderRaw.trim() !== "") {
      body.minOrder = Number(minOrderRaw);
    }

    if (usageLimitRaw.trim() !== "") {
      body.usageLimit = Number(usageLimitRaw);
    }

    if (expiresAtRaw.trim() !== "") {
      body.expiresAt = new Date(expiresAtRaw).toISOString();
    }

    const response = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setState({ isSubmitting: false, error: result?.error ?? "Failed to create coupon.", success: null });
      return;
    }

    event.currentTarget.reset();
    setState({ isSubmitting: false, error: null, success: "Coupon created successfully." });
    router.refresh();
  }

  return (
    <form className="admin-settings-form" onSubmit={handleSubmit}>
      <div className="admin-settings-layout">
        <div>
          <label htmlFor="coupon-code">Code</label>
          <input
            id="coupon-code"
            name="code"
            placeholder="e.g. WELCOME10"
            required
            style={{ textTransform: "uppercase" }}
            type="text"
          />
        </div>
        <div>
          <label htmlFor="coupon-label">Campaign Label</label>
          <input
            id="coupon-label"
            name="label"
            placeholder="e.g. First Order Welcome"
            required
            type="text"
          />
        </div>
        <div>
          <label htmlFor="coupon-type">Type</label>
          <select id="coupon-type" name="type" required>
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED">Fixed Amount (₹)</option>
          </select>
        </div>
        <div>
          <label htmlFor="coupon-value">Value</label>
          <input
            id="coupon-value"
            min="0.01"
            name="value"
            placeholder="e.g. 10"
            required
            step="0.01"
            type="number"
          />
        </div>
        <div>
          <label htmlFor="coupon-min-order">Min Order Amount (optional)</label>
          <input
            id="coupon-min-order"
            min="0"
            name="minOrder"
            placeholder="e.g. 5000"
            step="0.01"
            type="number"
          />
        </div>
        <div>
          <label htmlFor="coupon-usage-limit">Usage Limit (optional)</label>
          <input
            id="coupon-usage-limit"
            min="1"
            name="usageLimit"
            placeholder="e.g. 100"
            step="1"
            type="number"
          />
        </div>
        <div>
          <label htmlFor="coupon-expires-at">Expires At (optional)</label>
          <input id="coupon-expires-at" name="expiresAt" type="date" />
        </div>
        <div>
          <label htmlFor="coupon-is-active">Active</label>
          <input defaultChecked id="coupon-is-active" name="isActive" type="checkbox" />
        </div>
      </div>

      {state.success ? <p className="admin-form-message success">{state.success}</p> : null}
      {state.error ? <p className="admin-form-message error">{state.error}</p> : null}

      <div className="admin-settings-actions">
        <button className="admin-primary-button" disabled={state.isSubmitting} type="submit">
          {state.isSubmitting ? "Saving..." : "Create Coupon"}
        </button>
      </div>
    </form>
  );
}
