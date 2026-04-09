import Link from "next/link";
import { notFound } from "next/navigation";

import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { PrintButton } from "@/components/ui/print-button";
import { requirePageUser } from "@/server/auth/guards";
import { getOrderByNumberForUser } from "@/server/orders/service";

export default async function InvoicePage({
  params
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const user = await requirePageUser();
  const { orderNumber } = await params;
  const order = await getOrderByNumberForUser(orderNumber, user.id).catch(() => null);

  if (!order) {
    notFound();
  }

  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Invoice"
        title={`Invoice for ${order.orderNumber}`}
        crumb="My Account"
        intro="A print-friendly billing summary for your archive purchase."
      />

      <section className="editorial-section support-split">
        <article className="summary-card invoice-card">
          <p className="eyebrow">Billing summary</p>
          <h2>Mandala Fashions</h2>
          <div className="summary-row">
            <span>Order Number</span>
            <span>{order.orderNumber}</span>
          </div>
          <div className="summary-row">
            <span>Customer</span>
            <span>{order.customerName}</span>
          </div>
          <div className="summary-row">
            <span>Placed On</span>
            <span>{order.placedAtLabel}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{order.totalAmountLabel}</span>
          </div>
          <div className="invoice-line-items">
            {order.items.map((item) => (
              <div className="summary-row" key={item.id}>
                <span>
                  {item.productName} x {item.quantity}
                </span>
                <span>{item.totalPriceLabel}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="support-feature-card">
          <h2>Invoice actions</h2>
          <p>Use this page for billing reference, customer support, and boutique verification.</p>
          <div className="account-link-row">
            <PrintButton />
            <Link className="secondary-button text-button" href="/account/orders">
              Back to Orders
            </Link>
          </div>
        </article>
      </section>
    </ArchiveShell>
  );
}
