import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminLayout } from "@/components/admin/admin-layout";
import { ShiprocketShipmentPanel } from "@/components/admin/shiprocket-shipment-panel";
import { requirePageRole } from "@/server/auth/guards";
import { prisma } from "@/server/db";
import { getShiprocketSettings } from "@/server/shiprocket/service";

import { OrderStatusForm } from "./order-status-form";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(value: Date) {
  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export default async function AdminOrderDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePageRole(["ADMIN"]);
  const { id } = await params;

  const [order, shiprocketSettings] = await Promise.all([
    prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true }
        }
      }
    }),
    getShiprocketSettings()
  ]);

  if (!order) {
    notFound();
  }

  const subtotal = Number(order.subtotal);
  const shippingAmount = Number(order.shippingAmount);
  const discountAmount = Number(order.discountAmount);
  const totalAmount = Number(order.totalAmount);

  return (
    <AdminLayout
      active="orders"
      eyebrow="Order Operations"
      title={`Order ${order.orderNumber}`}
      topNav={[
        { label: "All Orders", href: "/admin/orders" },
        { label: "Processing", href: "/admin/orders?status=PROCESSING" }
      ]}
      user={user}
    >
      <div style={{ marginBottom: "1rem" }}>
        <Link className="admin-secondary-button" href="/admin/orders">
          &larr; Back to Orders
        </Link>
      </div>

      <section className="admin-metric-grid">
        <article className="admin-metric-card">
          <p>Order Number</p>
          <h2>{order.orderNumber}</h2>
          <span className="admin-delta neutral">Placed {formatDate(order.placedAt)}</span>
        </article>
        <article className="admin-metric-card">
          <p>Order Total</p>
          <h2>{formatCurrency(totalAmount)}</h2>
          <span className="admin-delta neutral">{order.items.length} line item(s)</span>
        </article>
        <article className="admin-metric-card">
          <p>Status</p>
          <h2>
            <em className={`status-${order.status.toLowerCase()}`}>{order.status}</em>
          </h2>
          <span className="admin-delta neutral">Current fulfillment stage</span>
        </article>
        {order.shiprocketAwb ? (
          <article className="admin-metric-card">
            <p>AWB</p>
            <h2 style={{ fontSize: "1rem" }}>{order.shiprocketAwb}</h2>
            <span className="admin-delta positive">Shiprocket shipment active</span>
          </article>
        ) : null}
      </section>

      <div className="admin-settings-layout">
        <article className="admin-table-card">
          <div className="admin-card-header">
            <div>
              <h2>Customer Details</h2>
              <p>Contact and shipping information for this order.</p>
            </div>
          </div>
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <strong>Name</strong>
              <p>{order.customerName}</p>
            </div>
            <div>
              <strong>Email</strong>
              <p>{order.customerEmail}</p>
            </div>
            {order.customerPhone && (
              <div>
                <strong>Phone</strong>
                <p>{order.customerPhone}</p>
              </div>
            )}
            {order.shippingAddress && (
              <div>
                <strong>Shipping Address</strong>
                <p style={{ whiteSpace: "pre-line" }}>{order.shippingAddress}</p>
              </div>
            )}
            {order.paymentMethod && (
              <div>
                <strong>Payment</strong>
                <p style={{ textTransform: "uppercase" }}>{order.paymentMethod}</p>
              </div>
            )}
          </div>
        </article>

        <article className="admin-table-card">
          <div className="admin-card-header">
            <div>
              <h2>Update Status</h2>
              <p>Change the fulfillment status of this order.</p>
            </div>
          </div>
          <OrderStatusForm currentStatus={order.status} orderId={order.id} />
        </article>
      </div>

      {/* Shiprocket shipping */}
      <article className="admin-table-card" style={{ marginTop: "1.5rem" }}>
        <div className="admin-card-header">
          <div>
            <h2>Shiprocket Shipping</h2>
            <p>
              {order.shiprocketOrderId
                ? `Shipment #${order.shiprocketOrderId} — AWB: ${order.shiprocketAwb ?? "Pending"}`
                : "Push this order to Shiprocket to generate a shipping label and AWB."}
            </p>
          </div>
          {order.shiprocketOrderId ? (
            <span className="admin-delta positive" style={{ fontSize: "0.8rem" }}>Shipment created</span>
          ) : (
            <span className="admin-delta neutral" style={{ fontSize: "0.8rem" }}>Not shipped</span>
          )}
        </div>
        <ShiprocketShipmentPanel
          isShiprocketConfigured={shiprocketSettings.isConfigured}
          orderId={order.id}
          orderNumber={order.orderNumber}
          shiprocketAwb={order.shiprocketAwb}
          shiprocketOrderId={order.shiprocketOrderId}
          shiprocketStatus={order.shiprocketStatus}
        />
      </article>

      <article className="admin-table-card" style={{ marginTop: "1.5rem" }}>
        <div className="admin-card-header">
          <div>
            <h2>Order Items</h2>
            <p>Products included in this order.</p>
          </div>
        </div>
        <div className="admin-table">
          <div className="admin-table-head" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
            <span>Product</span>
            <span>Qty</span>
            <span>Unit Price</span>
            <span>Total</span>
          </div>
          {order.items.map((item) => (
            <div
              className="admin-table-row"
              key={item.id}
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
            >
              <strong>{item.product.name}</strong>
              <span>{item.quantity}</span>
              <span>{formatCurrency(Number(item.unitPrice))}</span>
              <strong>{formatCurrency(Number(item.totalPrice))}</strong>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "1.5rem",
            borderTop: "1px solid var(--border, #e5e7eb)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0.5rem"
          }}
        >
          <div style={{ display: "flex", gap: "2rem", justifyContent: "flex-end", width: "100%", maxWidth: "20rem" }}>
            <span style={{ color: "var(--muted, #6b7280)" }}>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          {shippingAmount > 0 && (
            <div style={{ display: "flex", gap: "2rem", justifyContent: "flex-end", width: "100%", maxWidth: "20rem" }}>
              <span style={{ color: "var(--muted, #6b7280)" }}>Shipping</span>
              <strong>{formatCurrency(shippingAmount)}</strong>
            </div>
          )}
          {discountAmount > 0 && (
            <div style={{ display: "flex", gap: "2rem", justifyContent: "flex-end", width: "100%", maxWidth: "20rem" }}>
              <span style={{ color: "var(--muted, #6b7280)" }}>Discount</span>
              <strong style={{ color: "var(--success, #16a34a)" }}>-{formatCurrency(discountAmount)}</strong>
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              justifyContent: "flex-end",
              width: "100%",
              maxWidth: "20rem",
              borderTop: "1px solid var(--border, #e5e7eb)",
              paddingTop: "0.5rem",
              marginTop: "0.25rem"
            }}
          >
            <span>Total</span>
            <strong style={{ fontSize: "1.125rem" }}>{formatCurrency(totalAmount)}</strong>
          </div>
        </div>
      </article>
    </AdminLayout>
  );
}
