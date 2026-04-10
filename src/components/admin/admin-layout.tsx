"use client";

import { useEffect, useState, type ReactNode } from "react";
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

const sidebarGroups: Array<{
  heading: string;
  items: Array<{ key: AdminNavKey; label: string; href: string; icon: string }>;
}> = [
  {
    heading: "Overview",
    items: [{ key: "analytics", label: "Home", href: "/admin", icon: "home" }]
  },
  {
    heading: "Commerce",
    items: [
      { key: "orders", label: "Orders", href: "/admin/orders", icon: "orders" },
      { key: "products", label: "Products", href: "/admin/products", icon: "products" },
      { key: "customers", label: "Customers", href: "/admin/customers", icon: "customers" },
      { key: "marketing", label: "Marketing", href: "/admin/marketing", icon: "marketing" }
    ]
  },
  {
    heading: "Storefront",
    items: [
      { key: "content", label: "Content", href: "/admin/content", icon: "content" },
      { key: "settings", label: "Settings", href: "/admin/settings", icon: "settings" }
    ]
  }
];

const SIDEBAR_STORAGE_KEY = "mandala-admin-sidebar-collapsed";

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedPreference = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (savedPreference === "true") {
      setIsSidebarCollapsed(true);
    }
  }, []);

  function handleSidebarToggle() {
    setIsSidebarCollapsed((currentValue) => {
      const nextValue = !currentValue;
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextValue));
      return nextValue;
    });
  }

  return (
    <main className={`admin-shell${isSidebarCollapsed ? " is-sidebar-collapsed" : ""}`}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-inner">
          <div className="admin-brand">
            <Link className="admin-brand-link" href="/">
              <BrandLogo className="brand-logo admin-brand-logo" width={136} />
            </Link>

            <button
              aria-expanded={!isSidebarCollapsed}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="admin-sidebar-toggle"
              onClick={handleSidebarToggle}
              type="button"
            >
              <span aria-hidden="true">{isSidebarCollapsed ? ">" : "<"}</span>
            </button>
          </div>

          <button
            aria-label={isSidebarCollapsed ? createLabel : undefined}
            className="admin-create-button"
            type="button"
          >
            <span className="admin-create-button-icon" aria-hidden="true">
              +
            </span>
            <span className="admin-sidebar-label">{createLabel}</span>
          </button>

          <div className="admin-nav-groups">
            {sidebarGroups.map((group) => (
              <div className="admin-nav-group" key={group.heading}>
                <p className="admin-nav-heading admin-sidebar-label">{group.heading}</p>
                <nav className="admin-nav" aria-label={group.heading}>
                  {group.items.map((item) => (
                    <Link
                      aria-label={isSidebarCollapsed ? item.label : undefined}
                      className={item.key === active ? "is-active" : undefined}
                      href={item.href}
                      key={item.key}
                    >
                      <span className={`admin-nav-icon admin-nav-icon-${item.icon}`} aria-hidden="true" />
                      <span className="admin-sidebar-label">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          <div className="admin-sidebar-footer">
            <Link aria-label={isSidebarCollapsed ? "Store settings" : undefined} href="/admin/settings">
              <span className="admin-nav-icon admin-nav-icon-settings" aria-hidden="true" />
              <span className="admin-sidebar-label">Store settings</span>
            </Link>
            <Link aria-label={isSidebarCollapsed ? "Support" : undefined} href="/contact">
              <span className="admin-nav-icon admin-nav-icon-support" aria-hidden="true" />
              <span className="admin-sidebar-label">Support</span>
            </Link>
          </div>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-search">
            <span className="icon-search" />
            <input placeholder="Search products, orders, or customers" type="text" />
            <span className="admin-search-shortcut">/</span>
          </div>

          <nav className="admin-topnav" aria-label="Admin section navigation">
            {(topNav ?? []).map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="admin-userbar">
            <span className="admin-store-pill">Online store</span>
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
