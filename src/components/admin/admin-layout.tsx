import type { ReactNode } from "react";
import Link from "next/link";

import { BrandLogo } from "@/components/ui/brand-logo";

type AdminNavKey =
  | "analytics"
  | "products"
  | "orders"
  | "customers"
  | "marketing"
  | "content"
  | "settings";

const sidebarLinks: Array<{ key: AdminNavKey; label: string; href: string }> = [
  { key: "analytics", label: "Analytics", href: "/admin" },
  { key: "products", label: "Products", href: "/admin/products" },
  { key: "orders", label: "Orders", href: "/admin/orders" },
  { key: "customers", label: "Customers", href: "/admin/customers" },
  { key: "marketing", label: "Marketing", href: "/admin/marketing" },
  { key: "content", label: "Content", href: "/admin/content" },
  { key: "settings", label: "Settings", href: "/admin/settings" }
];

export function AdminLayout({
  active,
  user,
  title,
  eyebrow,
  topNav,
  children,
  createLabel = "Create New Listing"
}: {
  active: AdminNavKey;
  user: { name: string; role: string };
  title: string;
  eyebrow: string;
  topNav?: Array<{ label: string; href: string }>;
  children: ReactNode;
  createLabel?: string;
}) {
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-inner">
          <div className="admin-brand">
            <Link href="/">
              <BrandLogo className="brand-logo admin-brand-logo" width={170} />
            </Link>
          </div>

          <button className="admin-create-button" type="button">
            {createLabel}
          </button>

          <nav className="admin-nav" aria-label="Admin navigation">
            {sidebarLinks.map((item) => (
              <Link className={item.key === active ? "is-active" : undefined} href={item.href} key={item.key}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <Link href="/admin/settings">Settings</Link>
            <Link href="/contact">Support</Link>
          </div>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-search">
            <span className="icon-search" />
            <input placeholder="Search archive..." type="text" />
          </div>

          <nav className="admin-topnav" aria-label="Admin section navigation">
            {(topNav ?? []).map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="admin-userbar">
            <button className="admin-icon-button" type="button" aria-label="Notifications">
              <span className="admin-bell" />
            </button>
            <div className="admin-usercard">
              <strong>{user.name}</strong>
              <span>{user.role.toLowerCase()}</span>
            </div>
            <Link className="admin-avatar" href="/account">
              {user.name.slice(0, 1)}
            </Link>
          </div>
        </header>

        <section className="admin-content">
          <div className="admin-heading-row">
            <div>
              <p>{eyebrow}</p>
              <h1>{title}</h1>
            </div>
          </div>

          {children}
        </section>
      </section>
    </main>
  );
}

export function AdminStatCard({
  label,
  value,
  helper,
  tone = "neutral"
}: {
  label: string;
  value: string;
  helper: string;
  tone?: "positive" | "negative" | "neutral";
}) {
  return (
    <article className="admin-metric-card">
      <p>{label}</p>
      <h2>{value}</h2>
      <span className={`admin-delta ${tone}`}>{helper}</span>
    </article>
  );
}
