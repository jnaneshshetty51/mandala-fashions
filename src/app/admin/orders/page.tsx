import Link from "next/link";

import { AdminLayout } from "@/components/admin/admin-layout";
import { requirePageRole } from "@/server/auth/guards";
import { prisma } from "@/server/db";
import type { OrderStatus } from "@prisma/client";

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

const STATUS_FILTERS: Array<{ label: string; value: string | undefined }> = [
  { label: "All", value: undefined },
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" }
];

const VALID_STATUSES = new Set<string>([
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
]);

export default async function AdminOrdersPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requirePageRole(["ADMIN"]);
  const { status } = await searchParams;

  const activeStatus =
    status && VALID_STATUSES.has(status.toUpperCase())
      ? (status.toUpperCase() as OrderStatus)
      : undefined;

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { placedAt: "desc" },
    where: activeStatus ? { status: activeStatus } : undefined,
    take: 50
  });

  const orderRecords = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    totalAmount: Number(order.totalAmount),
    status: order.status as string,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    placedAt: formatDate(order.placedAt)
  }));

  return (
    <AdminLayout
      active="orders"
      createLabel="Create Manual Order"
      eyebrow="Order Operations"
      title="Orders"
      topNav={[
        { label: "All Orders", href: "/admin/orders" },
        { label: "Processing", href: "/admin/orders?status=PROCESSING" },
        { label: "Returns", href: "/shipping-returns" }
      ]}
      user={user}
    >
      <article className="admin-table-card">
        <div className="admin-card-header">
          <div>
            <h2>Fulfillment Queue</h2>
            <p>
              {orderRecords.length > 0
                ? `${orderRecords.length} order${orderRecords.length === 1 ? "" : "s"} ${activeStatus ? `with status ${activeStatus}` : "total"}.`
                : "No orders match the current filter."}
            </p>
          </div>
          <nav aria-label="Filter by status" className="admin-orders-filters">
            {STATUS_FILTERS.map(({ label, value }) => {
              const href = value ? `/admin/orders?status=${value}` : "/admin/orders";
              const isActive = activeStatus === value || (!activeStatus && !value);
              return (
                <Link
                  className={isActive ? "admin-orders-filter is-active" : "admin-orders-filter"}
                  href={href}
                  key={label}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="admin-table">
          <div className="admin-table-head admin-table-head-orders">
            <span>Order</span>
            <span>Customer</span>
            <span>Email</span>
            <span>Placed</span>
            <span>Items</span>
            <span>Status</span>
            <span>Total</span>
          </div>

          {orderRecords.length === 0 ? (
            <div
              style={{
                padding: "3rem 1.5rem",
                textAlign: "center",
                color: "var(--muted, #6b7280)"
              }}
            >
              <p>No orders yet{activeStatus ? ` with status ${activeStatus}` : ""}.</p>
              {activeStatus && (
                <Link className="admin-secondary-button" href="/admin/orders" style={{ marginTop: "1rem", display: "inline-block" }}>
                  View all orders
                </Link>
              )}
            </div>
          ) : (
            orderRecords.map((order) => (
              <div className="admin-table-row admin-table-row-orders" key={order.id}>
                <strong>
                  <Link href={`/admin/orders/${order.id}`}>{order.orderNumber}</Link>
                </strong>
                <span>{order.customerName}</span>
                <span>{order.customerEmail}</span>
                <span>{order.placedAt}</span>
                <span>{order.itemCount}</span>
                <em className={`status-${order.status.toLowerCase()}`}>{order.status}</em>
                <strong>{formatCurrency(order.totalAmount)}</strong>
              </div>
            ))
          )}
        </div>
      </article>
    </AdminLayout>
  );
}
