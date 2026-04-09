import Link from "next/link";

import { AdminLayout } from "@/components/admin/admin-layout";
import { CustomerNoteForm } from "@/components/admin/customer-note-form";
import { requirePageRole } from "@/server/auth/guards";
import { prisma } from "@/server/db";
import { CustomerRoleForm } from "./customer-role-form";

export default async function AdminCustomerDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requirePageRole(["ADMIN"]);

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        include: { items: true },
        orderBy: { placedAt: "desc" },
        take: 10
      },
      notes: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!customer) {
    return <div>Customer not found</div>;
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  return (
    <AdminLayout
      active="customers"
      eyebrow="Customer CRM"
      title={customer.name}
      topNav={[
        { label: "Members", href: "/admin/customers" },
        { label: "Stylists", href: "/admin/customers" },
        { label: "Loyalty", href: "/admin/customers" }
      ]}
      user={user}
    >
      {/* Back link */}
      <div style={{ marginBottom: "1rem" }}>
        <Link className="admin-secondary-button" href="/admin/customers">
          &larr; Back to Customers
        </Link>
      </div>

      {/* Customer info card */}
      <article className="admin-table-card" style={{ marginBottom: "1.5rem" }}>
        <div className="admin-card-header">
          <div>
            <h2>{customer.name}</h2>
            <p>{customer.email}</p>
          </div>
        </div>
        <div style={{ padding: "1rem 1.5rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>Role</p>
            <em className={`status-${customer.role.toLowerCase()}`}>{customer.role}</em>
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>Joined</p>
            <strong>{formatDate(customer.createdAt)}</strong>
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>Total Orders</p>
            <strong>{customer.orders.length}</strong>
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>CRM Notes</p>
            <strong>{customer.notes.length}</strong>
          </div>
        </div>
      </article>

      <div className="admin-settings-layout">
        {/* Left column: orders + notes */}
        <div>
          {/* Recent orders table */}
          <article className="admin-table-card" style={{ marginBottom: "1.5rem" }}>
            <div className="admin-card-header">
              <div>
                <h2>Recent Orders</h2>
                <p>Last {customer.orders.length} orders for this customer.</p>
              </div>
            </div>
            <div className="admin-table">
              <div
                className="admin-table-head"
                style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
              >
                <span>Order #</span>
                <span>Status</span>
                <span>Total</span>
                <span>Date</span>
              </div>
              {customer.orders.length === 0 ? (
                <div style={{ padding: "1rem 1.5rem", opacity: 0.6 }}>No orders yet.</div>
              ) : (
                customer.orders.map((order) => (
                  <div
                    className="admin-table-row"
                    key={order.id}
                    style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
                  >
                    <Link href={`/admin/orders/${order.id}`}>
                      <strong>{order.orderNumber}</strong>
                    </Link>
                    <em className={`status-${order.status.toLowerCase()}`}>{order.status}</em>
                    <span>
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0
                      }).format(Number(order.totalAmount))}
                    </span>
                    <span>{formatDate(order.placedAt)}</span>
                  </div>
                ))
              )}
            </div>
          </article>

          {/* CRM Notes section */}
          <article className="admin-table-card">
            <div className="admin-card-header">
              <div>
                <h2>CRM Notes</h2>
                <p>Internal notes for concierge and follow-up.</p>
              </div>
            </div>

            {customer.notes.length > 0 && (
              <div style={{ padding: "0 1.5rem 1rem" }}>
                {customer.notes.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      padding: "0.75rem",
                      borderBottom: "1px solid var(--border, #eee)",
                      fontSize: "0.9rem"
                    }}
                  >
                    <p style={{ marginBottom: "0.25rem" }}>{note.note}</p>
                    <span style={{ fontSize: "0.75rem", opacity: 0.5 }}>
                      {formatDate(note.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ padding: "1rem 1.5rem" }}>
              <CustomerNoteForm customerId={id} />
            </div>
          </article>
        </div>

        {/* Right column: role change */}
        <div>
          <article className="admin-table-card">
            <div className="admin-card-header">
              <div>
                <h2>Change Role</h2>
                <p>Promote or demote this customer&apos;s platform access level.</p>
              </div>
            </div>
            <div style={{ padding: "1rem 1.5rem" }}>
              <CustomerRoleForm currentRole={customer.role} customerId={id} />
            </div>
          </article>
        </div>
      </div>
    </AdminLayout>
  );
}
