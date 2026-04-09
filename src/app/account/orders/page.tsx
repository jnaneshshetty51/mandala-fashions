import Link from "next/link";

import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { requirePageUser } from "@/server/auth/guards";
import { listOrdersForUser } from "@/server/orders/service";

export default async function AccountOrdersPage() {
  const user = await requirePageUser();
  const orders = await listOrdersForUser(user.id).catch(() => []);

  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Private Archive"
        title="Order History"
        crumb="My Account"
        intro="Review every order, monitor current fulfillment, and keep invoice access in one place."
      />

      <section className="editorial-section support-stack">
        {orders.length === 0 ? (
          <article className="support-feature-card account-order-card">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">No orders yet</p>
                <h2>Your archive is waiting</h2>
              </div>
            </div>
            <p>Once you place your first order, tracking updates and delivery timelines will appear here.</p>
            <div className="account-link-row">
              <Link className="text-link" href="/shop">
                Explore the collection
              </Link>
            </div>
          </article>
        ) : null}

        {orders.map((order) => (
          <article className="support-feature-card account-order-card" key={order.id}>
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">Order {order.orderNumber}</p>
                <h2>{order.status}</h2>
              </div>
              <span className={`account-badge status-${order.status.toLowerCase()}`}>{order.totalAmountLabel}</span>
            </div>
            <p>Placed on {order.placedAtLabel}</p>
            <p>{order.trackingMessage}</p>
            <div className="account-link-row">
              <Link
                className="text-link"
                href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}&customerEmail=${encodeURIComponent(order.customerEmail)}`}
              >
                Track shipment
              </Link>
              <Link
                className="secondary-button text-button"
                href={`/order-confirmation?orderNumber=${encodeURIComponent(order.orderNumber)}`}
              >
                View summary
              </Link>
            </div>
          </article>
        ))}
      </section>
    </ArchiveShell>
  );
}
