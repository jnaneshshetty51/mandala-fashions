import Link from "next/link";

import { SignOutButton } from "@/components/auth/auth-forms";
import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { savedAddresses } from "@/lib/archive-data";
import { requirePageUser } from "@/server/auth/guards";
import { listOrdersForUser } from "@/server/orders/service";

export default async function AccountPage() {
  const user = await requirePageUser();
  const orders = await listOrdersForUser(user.id).catch(() => []);
  const recentOrders = orders.slice(0, 2);

  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Private Archive"
        title={`Welcome, ${user.name}`}
        crumb="My Account"
        intro="Review orders, manage saved addresses, revisit your wishlist, and keep your archive details up to date."
      />

      <section className="editorial-section account-dashboard">
        <article className="summary-card">
          <p className="eyebrow">Profile</p>
          <h2>Collector details</h2>
          <div className="summary-row">
            <span>Name</span>
            <span>{user.name}</span>
          </div>
          <div className="summary-row">
            <span>Email</span>
            <span>{user.email}</span>
          </div>
          <div className="summary-row total">
            <span>Role</span>
            <span>{user.role}</span>
          </div>
        </article>

        <article className="summary-card">
          <p className="eyebrow">Overview</p>
          <h2>At a glance</h2>
          <div className="summary-row">
            <span>Orders</span>
            <span>{orders.length}</span>
          </div>
          <div className="summary-row">
            <span>Saved addresses</span>
            <span>{savedAddresses.length}</span>
          </div>
          <div className="summary-row total">
            <span>Wishlist items</span>
            <span>3</span>
          </div>
        </article>
      </section>

      <section className="editorial-section account-dashboard">
        <article className="summary-card">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Orders overview</p>
              <h2>Recent orders</h2>
            </div>
            <Link className="text-link" href="/account/orders">
              View all
            </Link>
          </div>
          <div className="account-order-list">
            {recentOrders.map((order) => (
              <div className="account-order-item" key={order.id}>
                <div>
                  <strong>{order.orderNumber}</strong>
                  <p>{order.placedAtLabel}</p>
                </div>
                <div>
                  <span className={`account-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <p>{order.totalAmountLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="summary-card">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Saved addresses</p>
              <h2>Default delivery details</h2>
            </div>
            <Link className="text-link" href="/account/addresses">
              Manage
            </Link>
          </div>
          <div className="guide-link-list">
            {savedAddresses.map((address) => (
              <div className="account-address-preview" key={address.id}>
                <strong>{address.label}</strong>
                <span>{address.lines[0]}</span>
                <span>{address.lines[2]}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="editorial-section account-grid">
        <div className="summary-card">
          <p className="eyebrow">Quick access</p>
          <h2>What you can do</h2>
          <div className="guide-link-list">
            <Link href="/account/orders">View full order history</Link>
            <Link href="/track-order">Track a guest order</Link>
            <Link href="/wishlist">Open wishlist</Link>
            <Link href="/account/addresses">Manage addresses</Link>
            {user.role === "ADMIN" ? <Link href="/admin">Open admin workspace</Link> : null}
          </div>
        </div>

        <div className="summary-card">
          <p className="eyebrow">Access</p>
          <h2>Session controls</h2>
          <div className="guide-link-list">
            <span>Your membership session is active.</span>
            <span>Use sign out on shared or public devices.</span>
          </div>
          <div className="account-actions">
            <SignOutButton />
          </div>
        </div>
      </section>
    </ArchiveShell>
  );
}
