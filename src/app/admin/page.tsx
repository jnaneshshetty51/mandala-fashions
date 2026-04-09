import Link from "next/link";

import { AdminLayout, AdminStatCard } from "@/components/admin/admin-layout";
import { requirePageRole } from "@/server/auth/guards";
import { getAdminAnalyticsSnapshot } from "@/server/admin/service";

const toneMap = {
  Silk: "tone-silk",
  Cotton: "tone-cotton",
  Georgette: "tone-georgette"
} as const;

export default async function AdminPage() {
  const user = await requirePageRole(["ADMIN"]);
  const snapshot = await getAdminAnalyticsSnapshot();

  return (
    <AdminLayout
      active="analytics"
      createLabel="Seed Archive Data"
      eyebrow="Performance Oversight"
      title="Heritage Analytics"
      topNav={[
        { label: "Inventory", href: "/admin/products" },
        { label: "Variants", href: "/admin/products" },
        { label: "Suppliers", href: "/admin/content" }
      ]}
      user={user}
    >
      <div className="admin-header-actions">
        <button className="admin-ghost-button" type="button">
          Last 30 Days
        </button>
        <button className="admin-primary-button" type="button">
          Export Report
        </button>
      </div>

      <section className="admin-metric-grid">
        {snapshot.metrics.map((metric) => (
          <AdminStatCard
            helper={metric.delta}
            key={metric.label}
            label={metric.label}
            tone={metric.tone}
            value={metric.value}
          />
        ))}
      </section>

      <section className="admin-chart-row">
        <article className="admin-chart-card admin-sales-card">
          <div className="admin-card-header">
            <div>
              <h2>Sales Heritage</h2>
              <p>Track order movement, collection performance, and retail health.</p>
            </div>
            <div className="admin-legend">
              <span>
                <i className="is-current" /> This Month
              </span>
              <span>
                <i /> Previous Month
              </span>
            </div>
          </div>
          <div className="admin-line-chart">
            <div className="chart-line chart-current" />
            <div className="chart-line chart-last" />
            <div className="chart-months">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </article>

        <article className="admin-topweaves-card">
          <h2>Top Weaves</h2>
          <p>Live product mix across current inventory.</p>
          <div className="admin-topweaves-visual">
            <div className="weave-shape" />
            <strong>{snapshot.topFabrics.length || 3}</strong>
            <span>Segments</span>
          </div>
          <div className="admin-weave-list">
            {snapshot.topFabrics.map((item) => (
              <div className="admin-weave-row" key={item.name}>
                <span>
                  <i className={toneMap[item.name as keyof typeof toneMap] ?? "tone-silk"} /> {item.name}
                </span>
                <strong>{item.share}</strong>
              </div>
            ))}
          </div>
          <Link className="admin-floating-plus" href="/admin/products">
            +
          </Link>
        </article>
      </section>

      <section className="admin-lower-grid">
        <article className="admin-growth-card">
          <h2>Patron Growth</h2>
          <p>New account registrations and CRM growth.</p>
          <div className="admin-bar-chart">
            <span className="bar-1" />
            <span className="bar-2" />
            <span className="bar-3" />
            <span className="bar-4" />
            <span className="bar-5" />
          </div>
        </article>

        <article className="admin-table-card">
          <div className="admin-card-header">
            <div>
              <h2>Recent Orders</h2>
            </div>
            <Link href="/admin/orders">View All Orders</Link>
          </div>
          <div className="admin-table">
            <div className="admin-table-head">
              <span>Order ID</span>
              <span>Client</span>
              <span>Status</span>
              <span>Items</span>
              <span>Value</span>
            </div>
            {snapshot.recentOrders.map((item) => (
              <div className="admin-table-row" key={item.id}>
                <span>{item.orderNumber}</span>
                <span className="admin-client-cell">
                  <i>{item.customerName.slice(0, 2).toUpperCase()}</i>
                  {item.customerName}
                </span>
                <em className={`status-${item.status.toLowerCase()}`}>{item.status}</em>
                <span>{item.itemCount}</span>
                <strong>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0
                  }).format(item.totalAmount)}
                </strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="admin-spotlight-card">
        <div className="admin-spotlight-image" />
        <div className="admin-spotlight-copy">
          <h2>{snapshot.spotlight.title}</h2>
          <p>{snapshot.spotlight.description}</p>
          <div className="admin-spotlight-stats">
            <div>
              <span>Most Viewed</span>
              <strong>{snapshot.spotlight.mostViewed}</strong>
            </div>
            <div>
              <span>Stock Level</span>
              <strong className="is-alert">{snapshot.spotlight.stockLevel}</strong>
            </div>
            <div>
              <span>Inquiry Rate</span>
              <strong>{snapshot.spotlight.inquiryRate}</strong>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
