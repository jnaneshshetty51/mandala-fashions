"use client";

import { useState } from "react";

type ShiprocketShipmentPanelProps = {
  orderId: string;
  orderNumber: string;
  shiprocketOrderId: string | null;
  shiprocketAwb: string | null;
  shiprocketStatus: string | null;
  isShiprocketConfigured: boolean;
};

type TrackingActivity = {
  date: string;
  activity: string;
  location: string;
};

type TrackingResult = {
  currentStatus: string;
  estimatedDelivery: string | null;
  activities: TrackingActivity[];
};

export function ShiprocketShipmentPanel({
  orderId,
  orderNumber,
  shiprocketOrderId,
  shiprocketAwb,
  shiprocketStatus,
  isShiprocketConfigured
}: ShiprocketShipmentPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentAwb, setCurrentAwb] = useState(shiprocketAwb);
  const [currentShiprocketId, setCurrentShiprocketId] = useState(shiprocketOrderId);
  const [currentStatus, setCurrentStatus] = useState(shiprocketStatus);
  const [tracking, setTracking] = useState<TrackingResult | null>(null);
  const [showTracking, setShowTracking] = useState(false);

  const isShipped = Boolean(currentShiprocketId);

  async function handleCreateShipment() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch(`/api/admin/orders/${orderId}/ship`, { method: "POST" });
    const result = (await response.json().catch(() => null)) as {
      data?: { shiprocketOrderId: string; awb: string | null; status: string; courierName: string | null };
      error?: string;
    } | null;

    setLoading(false);

    if (!response.ok) {
      setError(result?.error ?? "Failed to create shipment.");
      return;
    }

    const data = result?.data;
    if (data) {
      setCurrentShiprocketId(data.shiprocketOrderId);
      setCurrentAwb(data.awb);
      setCurrentStatus(data.status);
      setSuccess(
        data.awb
          ? `Shipment created! AWB: ${data.awb}${data.courierName ? ` via ${data.courierName}` : ""}`
          : "Shipment created successfully. AWB will be assigned shortly."
      );
    }
  }

  async function handleCancelShipment() {
    if (!confirm(`Cancel the Shiprocket shipment for order ${orderNumber}? This cannot be undone.`)) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch(`/api/admin/orders/${orderId}/ship`, { method: "DELETE" });
    const result = (await response.json().catch(() => null)) as { error?: string } | null;

    setLoading(false);

    if (!response.ok) {
      setError(result?.error ?? "Failed to cancel shipment.");
      return;
    }

    setCurrentShiprocketId(null);
    setCurrentAwb(null);
    setCurrentStatus(null);
    setTracking(null);
    setShowTracking(false);
    setSuccess("Shipment cancelled successfully.");
  }

  async function handleFetchTracking() {
    setLoading(true);
    setError(null);
    setShowTracking(true);

    const response = await fetch(`/api/admin/orders/${orderId}/tracking`);
    const result = (await response.json().catch(() => null)) as {
      data?: TrackingResult;
      error?: string;
    } | null;

    setLoading(false);

    if (!response.ok) {
      setError(result?.error ?? "Failed to fetch tracking.");
      return;
    }

    if (result?.data) {
      setTracking(result.data);
    }
  }

  if (!isShiprocketConfigured) {
    return (
      <div style={{ padding: "1rem 1.5rem" }}>
        <p style={{ color: "var(--admin-muted)", fontSize: "0.875rem" }}>
          Shiprocket is not configured.{" "}
          <a href="/admin/settings" style={{ color: "var(--admin-accent)" }}>
            Set up in Settings
          </a>{" "}
          to create shipments directly from orders.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {isShipped ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <article className="admin-metric-card" style={{ padding: "0.75rem 1rem" }}>
              <p style={{ fontSize: "0.8rem" }}>Shiprocket Order ID</p>
              <h3 style={{ fontSize: "1rem" }}>{currentShiprocketId}</h3>
            </article>
            <article className="admin-metric-card" style={{ padding: "0.75rem 1rem" }}>
              <p style={{ fontSize: "0.8rem" }}>AWB Number</p>
              <h3 style={{ fontSize: "1rem" }}>{currentAwb ?? "Pending assignment"}</h3>
            </article>
            {currentStatus ? (
              <article className="admin-metric-card" style={{ padding: "0.75rem 1rem" }}>
                <p style={{ fontSize: "0.8rem" }}>Shiprocket Status</p>
                <h3 style={{ fontSize: "1rem" }}>{currentStatus}</h3>
              </article>
            ) : null}
          </div>
        </div>
      ) : (
        <p style={{ color: "var(--admin-muted)", fontSize: "0.875rem" }}>
          No shipment created yet. Click below to push this order to Shiprocket and get a shipping label.
        </p>
      )}

      {success ? <p className="admin-form-message success">{success}</p> : null}
      {error ? <p className="admin-form-message error">{error}</p> : null}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {!isShipped ? (
          <button
            className="admin-primary-button"
            disabled={loading}
            onClick={handleCreateShipment}
            type="button"
          >
            {loading ? "Creating..." : "Create Shipment"}
          </button>
        ) : (
          <>
            {currentAwb ? (
              <button
                className="admin-ghost-button"
                disabled={loading}
                onClick={handleFetchTracking}
                type="button"
              >
                {loading && showTracking ? "Fetching..." : "Refresh Tracking"}
              </button>
            ) : null}
            <button
              className="admin-secondary-button"
              disabled={loading}
              onClick={handleCancelShipment}
              style={{ color: "#c0392b", borderColor: "#c0392b" }}
              type="button"
            >
              {loading && !showTracking ? "Cancelling..." : "Cancel Shipment"}
            </button>
          </>
        )}
      </div>

      {showTracking && tracking ? (
        <div style={{ marginTop: "0.5rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <strong style={{ fontSize: "0.875rem" }}>{tracking.currentStatus}</strong>
            {tracking.estimatedDelivery ? (
              <span style={{ marginLeft: "1rem", fontSize: "0.8rem", color: "var(--admin-muted)" }}>
                Est. delivery: {tracking.estimatedDelivery}
              </span>
            ) : null}
          </div>
          {tracking.activities.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {tracking.activities.slice(0, 8).map((act, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr 1fr",
                    gap: "0.5rem",
                    fontSize: "0.8rem",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid var(--admin-border)"
                  }}
                >
                  <span style={{ color: "var(--admin-muted)" }}>{act.date}</span>
                  <span>{act.activity}</span>
                  <span style={{ color: "var(--admin-muted)", textAlign: "right" }}>{act.location}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "0.8rem", color: "var(--admin-muted)" }}>No tracking activity yet.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
