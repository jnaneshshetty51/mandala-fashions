import Link from "next/link";

import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { trackOrder } from "@/server/orders/service";

export default async function TrackOrderPage({
  searchParams
}: {
  searchParams: Promise<{
    orderNumber?: string;
    customerEmail?: string;
    customerPhone?: string;
  }>;
}) {
  const { orderNumber = "", customerEmail = "", customerPhone = "" } = await searchParams;
  const hasSubmitted = Boolean(orderNumber && (customerEmail || customerPhone));
  const order = hasSubmitted
    ? await trackOrder({
        orderNumber,
        customerEmail: customerEmail || undefined,
        customerPhone: customerPhone || undefined
      }).catch(() => null)
    : null;

  return (
    <ArchiveShell activeNav="about">
      <PageHero
        eyebrow="Guest Services"
        title="Track Your Order"
        crumb="Order Assistance"
        intro="Enter your order ID with the email address or phone number used at checkout to view the latest fulfillment status."
      />

      <section className="editorial-section support-split">
        <form action="/track-order" className="form-card" method="get">
          <h2>Track as Guest</h2>
          <div className="field-grid">
            <label>
              Order ID
              <input defaultValue={orderNumber} name="orderNumber" placeholder="MND-8210" required type="text" />
            </label>
            <label>
              Email Address
              <input defaultValue={customerEmail} name="customerEmail" placeholder="you@example.com" type="email" />
            </label>
            <label className="field-span">
              Or Phone Number
              <input defaultValue={customerPhone} name="customerPhone" placeholder="+91 98765 43210" type="tel" />
            </label>
          </div>
          <button className="primary-button text-button support-submit" type="submit">
            Track Order
          </button>
          {hasSubmitted && !order ? (
            <p className="auth-message auth-error">
              We could not find a matching order for the details provided.
            </p>
          ) : null}
        </form>

        <div className="contact-card support-card">
          {order ? (
            <>
              <h2>Order {order.orderNumber}</h2>
              <p>Status: {order.status}</p>
              <p>{order.trackingMessage}</p>
              <p>Placed on {order.placedAtLabel}</p>
              <p>Expected delivery by {order.expectedDeliveryLabel}</p>
              <div className="guide-link-list">
                {order.items.map((item) => (
                  <span key={item.id}>
                    {item.productName} x {item.quantity}
                  </span>
                ))}
              </div>
              <Link
                className="text-link"
                href={`/order-confirmation?orderNumber=${encodeURIComponent(order.orderNumber)}`}
              >
                View order summary
              </Link>
            </>
          ) : (
            <>
              <h2>What You Can Check</h2>
              <p>Order confirmation and payment status.</p>
              <p>Processing, dispatch, and delivery progress.</p>
              <p>Courier updates for domestic shipments.</p>
              <p>Return-support routing if an issue needs boutique attention.</p>
            </>
          )}
        </div>
      </section>
    </ArchiveShell>
  );
}
