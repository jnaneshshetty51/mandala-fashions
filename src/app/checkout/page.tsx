import { CheckoutForm } from "@/components/cart/checkout-form";
import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { requirePageUser } from "@/server/auth/guards";

const checkoutSteps = [
  { number: "01", title: "Address", note: "Delivery details and contact information" },
  { number: "02", title: "Shipping Method", note: "Choose speed and handling" },
  { number: "03", title: "Payment", note: "UPI, cards, COD, or netbanking" },
  { number: "04", title: "Order Review", note: "Final confirmation before placing the order" }
];

export default async function CheckoutPage() {
  await requirePageUser();

  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Secure Purchase"
        title="Checkout"
        crumb="Client Details"
        intro="A guided purchase flow covering address, shipping, payment, and final review in one place."
      />

      <section className="editorial-section checkout-grid">
        <div className="checkout-flow">
          <div className="checkout-step-list">
            {checkoutSteps.map((step, index) => (
              <article className={`checkout-step-card ${index === 0 ? "is-active" : ""}`} key={step.number}>
                <p className="eyebrow">{step.number}</p>
                <h2>{step.title}</h2>
                <p>{step.note}</p>
              </article>
            ))}
          </div>

          <CheckoutForm />
        </div>

        <aside className="summary-card">
          <p className="eyebrow">Order summary</p>
          <h2>Two archived pieces</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹ 1,00,500</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Complimentary</span>
          </div>
          <div className="summary-row">
            <span>Payment</span>
            <span>UPI</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹ 1,00,500</span>
          </div>
          <p className="cart-helper-text">Use the final button in the checkout form to place your order.</p>
        </aside>
      </section>
    </ArchiveShell>
  );
}
