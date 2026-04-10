import Link from "next/link";

import { AdminLayout, AdminStatCard } from "@/components/admin/admin-layout";
import { requirePageRole } from "@/server/auth/guards";
import { getAdminAnalyticsSnapshot } from "@/server/admin/service";

const toneMap = {
  Silk: "tone-silk",
  Cotton: "tone-cotton",
  Georgette: "tone-georgette"
} as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export default async function AdminPage() {
  const user = await requirePageRole(["ADMIN"]);
  const snapshot = await getAdminAnalyticsSnapshot();
  const totalRevenue = snapshot.recentOrders.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalItems = snapshot.recentOrders.reduce((sum, item) => sum + item.itemCount, 0);
  const { catalogSummary, recentProducts } = snapshot;

  return (
    <AdminLayout
      active="analytics"
      createLabel="Create Product"
      eyebrow="Admin Workspace"
      title="Dashboard Overview"
      topNav={[
        { label: "Orders", href: "/admin/orders" },
        { label: "Products", href: "/admin/products" },
        { label: "Customers", href: "/admin/customers" }
      ]}
      user={user}
    >
      <section className="admin-hero-panel">
        <div className="admin-hero-copy">
          <p className="admin-eyebrow">Today at a glance</p>
          <h2>Everything important is one scroll away.</h2>
          <p>
            Monitor sales, inventory movement, customer activity, and merchandising health from one
            workspace designed for day-to-day store operations.
          </p>

          <div className="admin-action-row">
            <Link className="admin-primary-button" href="/admin/products">
              Add Product
            </Link>
            <Link className="admin-ghost-button" href="/admin/orders">
              Review Orders
            </Link>
            <Link className="admin-ghost-button" href="/admin/customers">
              Open Customers
            </Link>
          </div>
        </div>

        <div className="admin-hero-meta">
          <div className="admin-kpi-strip">
            <article className="admin-kpi-item">
              <span>Revenue Snapshot</span>
              <strong>
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0
                }).format(totalRevenue)}
              </strong>
              <small>From the latest listed orders</small>
            </article>
            <article className="admin-kpi-item">
              <span>Units Moving</span>
              <strong>{totalItems}</strong>
              <small>Items across recent orders</small>
            </article>
            <article className="admin-kpi-item">
              <span>Best Selling Fabric</span>
              <strong>{snapshot.topFabrics[0]?.name ?? "Silk"}</strong>
              <small>{snapshot.topFabrics[0]?.share ?? "Stable mix"}</small>
            </article>
          </div>

          <div className="admin-chip-list">
            <span>Live catalog monitoring</span>
            <span>Quick order handling</span>
            <span>Customer context visible</span>
          </div>
        </div>
      </section>

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

      {/* Catalog Health */}
      <section className="admin-catalog-health-section">
        <article className="admin-table-card">
          <div className="admin-card-header">
            <div>
              <h2>Catalog Health</h2>
              <p>Live product status across your entire catalog.</p>
            </div>
            <Link href="/admin/products">Manage Catalog</Link>
          </div>
          <div className="admin-catalog-health-grid">
            <article className="admin-metric-card">
              <p>Total Products</p>
              <h2>{catalogSummary.total}</h2>
              <span className="admin-delta neutral">In your catalog</span>
            </article>
            <article className="admin-metric-card">
              <p>Active</p>
              <h2 style={{ color: "var(--admin-positive)" }}>{catalogSummary.active}</h2>
              <span className="admin-delta positive">Live on storefront</span>
            </article>
            <article className="admin-metric-card">
              <p>Draft</p>
              <h2>{catalogSummary.draft}</h2>
              <span className="admin-delta neutral">Not yet published</span>
            </article>
            <article className="admin-metric-card">
              <p>Low Stock</p>
              <h2 style={{ color: catalogSummary.lowStock > 0 ? "var(--admin-warning, #e6861a)" : undefined }}>
                {catalogSummary.lowStock}
              </h2>
              <span className={`admin-delta ${catalogSummary.lowStock > 0 ? "negative" : "neutral"}`}>
                {catalogSummary.lowStock > 0 ? "Need restocking" : "All well stocked"}
              </span>
            </article>
            <article className="admin-metric-card">
              <p>Out of Stock</p>
              <h2 style={{ color: catalogSummary.outOfStock > 0 ? "#c0392b" : undefined }}>
                {catalogSummary.outOfStock}
              </h2>
              <span className={`admin-delta ${catalogSummary.outOfStock > 0 ? "negative" : "positive"}`}>
                {catalogSummary.outOfStock > 0 ? "Unavailable to buyers" : "No stockouts"}
              </span>
            </article>
          </div>

          {catalogSummary.total === 0 ? (
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--admin-border)" }}>
              <p style={{ color: "var(--admin-muted)", fontSize: "0.875rem" }}>
                Your catalog is empty.{" "}
                <Link href="/admin/products" style={{ color: "var(--admin-accent)" }}>
                  Add your first product
                </Link>{" "}
                to start selling.
              </p>
            </div>
          ) : null}
        </article>
      </section>

      {/* Recent Products */}
      {recentProducts.length > 0 ? (
        <article className="admin-table-card" style={{ marginBottom: "1.5rem" }}>
          <div className="admin-card-header">
            <div>
              <h2>Recently Added Products</h2>
              <p>The last {recentProducts.length} products added to your catalog.</p>
            </div>
            <Link href="/admin/products">View All</Link>
          </div>
          <div className="admin-table">
            <div className="admin-table-head admin-table-head-products admin-products-table-head">
              <span>Product</span>
              <span>Material</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Status</span>
              <span>Added</span>
              <span>Actions</span>
            </div>
            {recentProducts.map((product) => (
              <div className="admin-table-row admin-products-table-row" key={product.id}>
                <div className="admin-products-identity">
                  <div
                    className="admin-products-thumb"
                    style={product.imageUrl ? { backgroundImage: `url('${product.imageUrl}')` } : undefined}
                  />
                  <strong>
                    <Link href={`/admin/products/${product.id}`}>{product.name}</Link>
                  </strong>
                </div>
                <span>{product.fabric}</span>
                <strong>{formatCurrency(product.price)}</strong>
                <span className={product.inventoryCount <= 3 ? "admin-stock-pill is-low" : "admin-stock-pill"}>
                  {product.inventoryCount}
                </span>
                <em className={`status-${product.status.toLowerCase()}`}>{product.status}</em>
                <span>{product.createdAt}</span>
                <span>
                  <Link className="admin-secondary-button" href={`/admin/products/${product.id}`}>
                    Edit
                  </Link>
                </span>
              </div>
            ))}
          </div>
        </article>
      ) : null}

      <section className="admin-workbench">
        <article className="admin-chart-card admin-sales-card">
          <div className="admin-card-header">
            <div>
              <h2>Sales Performance</h2>
              <p>Track order movement, revenue direction, and month-on-month demand changes.</p>
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
          <div className="admin-chart-footer">
            <div>
              <strong>Conversion momentum</strong>
              <span>Healthy repeat activity across current catalog traffic.</span>
            </div>
            <div>
              <strong>Primary focus</strong>
              <span>Protect top sellers from low-stock drop-offs.</span>
            </div>
          </div>
        </article>

        <div className="admin-side-stack">
          <article className="admin-topweaves-card">
            <div className="admin-card-header">
              <div>
                <h2>Product Mix</h2>
                <p>Top materials and merchandising balance across active catalog demand.</p>
              </div>
              <Link href="/admin/products">Catalog</Link>
            </div>
            <div className="admin-weave-list">
              {snapshot.topFabrics.length > 0 ? snapshot.topFabrics.map((item) => (
                <div className="admin-weave-row" key={item.name}>
                  <span>
                    <i className={toneMap[item.name as keyof typeof toneMap] ?? "tone-silk"} /> {item.name}
                  </span>
                  <strong>{item.share}</strong>
                </div>
              )) : (
                <div className="admin-weave-row">
                  <span>No products yet</span>
                  <strong>—</strong>
                </div>
              )}
            </div>
          </article>

          <article className="admin-growth-card">
            <h2>Operational Focus</h2>
            <p>Fast links for the tasks the team is most likely to handle next.</p>
            <div className="admin-quick-links">
              <Link href="/admin/orders">Process pending orders</Link>
              <Link href="/admin/products">Update inventory and pricing</Link>
              <Link href="/admin/customers">Review customer activity</Link>
              <Link href="/admin/content">Refresh banners and content</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="admin-lower-grid">
        <article className="admin-growth-card">
          <div className="admin-card-header">
            <div>
              <h2>Customer Growth</h2>
              <p>New member movement and CRM expansion over the current cycle.</p>
            </div>
          </div>
          <div className="admin-bar-chart">
            <span className="bar-1" />
            <span className="bar-2" />
            <span className="bar-3" />
            <span className="bar-4" />
            <span className="bar-5" />
          </div>
          <div className="admin-mini-list">
            <div>
              <strong>Stronger mid-month growth</strong>
              <span>Customer acquisition peaks after campaign pushes.</span>
            </div>
          </div>
        </article>

        <article className="admin-table-card">
          <div className="admin-card-header">
            <div>
              <h2>Recent Orders</h2>
              <p>Most recent transactions that may need fulfillment or follow-up.</p>
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
            {snapshot.recentOrders.length === 0 ? (
              <div style={{ padding: "1.5rem", color: "var(--admin-muted)", fontSize: "0.875rem" }}>
                No orders yet. Orders will appear here as customers shop.
              </div>
            ) : snapshot.recentOrders.map((item) => (
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
        <div className="admin-spotlight-copy">
          <p className="admin-eyebrow">Merchandising Spotlight</p>
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
        <div className="admin-spotlight-summary">
          <div className="admin-mini-list">
            <div>
              <strong>Recommended action</strong>
              <span>Replenish high-intent products before the next marketing push.</span>
            </div>
            <div>
              <strong>Why it matters</strong>
              <span>Traffic is already there, so inventory and response speed will decide conversion.</span>
            </div>
          </div>
          <Link className="admin-primary-button" href="/admin/products">
            Open Product Inventory
          </Link>
        </div>
      </section>
    </AdminLayout>
  );
}
