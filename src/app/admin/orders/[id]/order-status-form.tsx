"use client";

import { useState } from "react";
import type { OrderStatus } from "@prisma/client";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
];

export function OrderStatusForm({
  orderId,
  currentStatus
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [selected, setSelected] = useState<OrderStatus>(currentStatus);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selected })
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to update status.");
      }

      setMessage({ type: "success", text: `Status updated to ${selected}.` });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An unexpected error occurred."
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="admin-settings-form" onSubmit={handleSubmit}>
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label htmlFor="order-status">Fulfillment Status</label>
          <select
            disabled={pending}
            id="order-status"
            value={selected}
            onChange={(e) => setSelected(e.target.value as OrderStatus)}
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {message && (
          <p className={`admin-form-message ${message.type}`}>{message.text}</p>
        )}

        <div className="admin-settings-actions">
          <button
            className="admin-primary-button"
            disabled={pending || selected === currentStatus}
            type="submit"
          >
            {pending ? "Saving…" : "Save Status"}
          </button>
        </div>
      </div>
    </form>
  );
}
