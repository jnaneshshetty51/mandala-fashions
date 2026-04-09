import Link from "next/link";
import { notFound } from "next/navigation";

import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { getOrderByNumber } from "@/server/orders/service";

export default async function OrderConfirmationPage({
  searchParams
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const { orderNumber } = await searchParams;

  if (!orderNumber) {
    notFound();
  }

  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  const whatsappShareHref = `https://wa.me/?text=${encodeURIComponent(
    `My Mandala Fashions order ${order.orderNumber} has been placed. Expected delivery is ${order.expectedDeliveryLabel}.`
  )}`;

  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Purchase Complete"
        title="Order Confirmed"
        crumb="Confirmation"
        intro="Your order has been placed successfully. We have reserved your pieces and started preparing them for dispatch."
      />

      <section className="editorial-section support-split">
        <article className="summary-card">
          <p className="eyebrow">Order summary</p>
          <h2>Order #{order.orderNumber}</h2>
          <div className="account-order-list">
            {order.items.map((item) => (
              <div className="account-order-item" key={item.id}>
                <div>
                  <strong>{item.productName}</strong>
                  <p>Qty {item.quantity}</p>
                </div>
                <div>
                  <p>{item.totalPriceLabel}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{order.subtotalLabel}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>{order.shippingAmountLabel}</span>
          </div>
          <div className="summary-row total">
            <span>Total Paid</span>
            <span>{order.totalAmountLabel}</span>
          </div>
        </article>

        <article className="support-whatsapp-panel">
          <p className="eyebrow">Expected delivery</p>
          <h2>Arriving by {order.expectedDeliveryLabel}</h2>
          <p>
            We will share dispatch updates by email and phone once the order leaves the boutique.
            You can also track progress from your account or with your order ID.
          </p>
          <div className="guide-link-list">
            <Link href="/account/orders">View order history</Link>
            <Link
              href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}&customerEmail=${encodeURIComponent(order.customerEmail)}`}
            >
              Track this order
            </Link>
          </div>
          <Link className="primary-button text-button support-whatsapp-button" href={whatsappShareHref}>
            Share on WhatsApp
          </Link>
        </article>
      </section>
    </ArchiveShell>
  );
}
