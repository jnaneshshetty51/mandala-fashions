import Link from "next/link";

import { AdminLayout, AdminStatCard } from "@/components/admin/admin-layout";
import { requirePageRole } from "@/server/auth/guards";
import { listAdminCustomers } from "@/server/admin/service";

export default async function AdminCustomersPage() {
  const user = await requirePageRole(["ADMIN"]);
  const customers = await listAdminCustomers();

  const totalMembers = customers.filter((c) => c.role === "USER").length;
  const totalStylists = customers.filter((c) => c.role === "STYLIST").length;
  const totalAdmins = customers.filter((c) => c.role === "ADMIN").length;

  return (
    <AdminLayout
      active="customers"
      createLabel="Add CRM Note"
      eyebrow="Customer CRM"
      title="Customers"
      topNav={[
        { label: "Members", href: "/admin/customers" },
        { label: "Stylists", href: "/admin/customers" },
        { label: "Loyalty", href: "/admin/customers" }
      ]}
      user={user}
    >
      {/* Stat cards */}
      <div className="admin-metric-grid" style={{ marginBottom: "1.5rem" }}>
        <AdminStatCard
          helper={`${customers.length} total customers`}
          label="Total Members"
          tone="neutral"
          value={String(totalMembers)}
        />
        <AdminStatCard
          helper="Personal styling team"
          label="Total Stylists"
          tone="neutral"
          value={String(totalStylists)}
        />
        <AdminStatCard
          helper="Platform administrators"
          label="Total Admins"
          tone="neutral"
          value={String(totalAdmins)}
        />
      </div>

      <article className="admin-table-card">
        <div className="admin-card-header">
          <div>
            <h2>Customer Ledger</h2>
            <p>Track role, order count, and note activity for concierge follow-up.</p>
          </div>
        </div>
        <div className="admin-table">
          <div className="admin-table-head admin-table-head-customers">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Orders</span>
            <span>Notes</span>
            <span>Joined</span>
          </div>
          {customers.map((customer) => (
            <div className="admin-table-row admin-table-row-customers" key={customer.id}>
              <strong>
                <Link href={`/admin/customers/${customer.id}`}>{customer.name}</Link>
              </strong>
              <span>{customer.email}</span>
              <em className={`status-${customer.role.toLowerCase()}`}>{customer.role}</em>
              <span>{customer.orders}</span>
              <span>{customer.notes}</span>
              <span>{customer.joinedAt}</span>
            </div>
          ))}
        </div>
      </article>
    </AdminLayout>
  );
}
