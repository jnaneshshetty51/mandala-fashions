"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";

export function CartPageView() {
  const { items, removeItem } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <section className="editorial-section commerce-grid">
      <div className="commerce-list">
        {items.length === 0 ? (
          <article className="detail-panel">
            <h2>Your cart is empty</h2>
            <p>Add a product from the archive to begin checkout.</p>
            <Link className="primary-button text-button" href="/shop">
              Browse Products
            </Link>
          </article>
        ) : (
          items.map((item) => (
            <article className="commerce-item" key={item.cartKey}>
              <div className={`commerce-thumb ${item.artClass}`} />
              <div>
                <p className="product-label">{item.label}</p>
                <h2>{item.name}</h2>
                <p>
                  Saved in your cart and ready for checkout.
                  {item.selectedVariantName ? ` ${item.selectedVariantName}` : ""}
                  {item.selectedColor ? ` in ${item.selectedColor}` : ""}
                  .
                </p>
              </div>
              <div className="commerce-meta">
                <span>{item.price}</span>
                <span>Qty {item.quantity}</span>
                <button className="text-link" onClick={() => removeItem(item.cartKey)} type="button">
                  Remove
                </button>
              </div>
            </article>
          ))
        )}

        <article className="detail-panel cart-coupon-panel">
          <h2>Apply coupon</h2>
          <p className="cart-helper-text">Review active boutique offers before checkout and use the matching code during assisted ordering.</p>
          <Link className="secondary-button text-button" href="/offers">
            View Active Offers
          </Link>
        </article>

        <article className="detail-panel cart-delivery-panel">
          <h2>Delivery estimate</h2>
          <p className="cart-helper-text">Estimated delivery to Bangalore: 3-5 business days.</p>
          <Link className="secondary-button text-button" href="/shipping-policy">
            Review Shipping Policy
          </Link>
        </article>

        <article className="detail-panel cart-upsell-panel">
          <p className="eyebrow">Add-on recommendation</p>
          <h2>Add a matching blouse piece</h2>
          <p>Complete the look with a coordinated blouse fabric and boutique finishing support.</p>
          <div className="account-link-row">
            <Link className="primary-button text-button" href="/custom-services">
              Request This Add-On
            </Link>
            <Link className="text-link" href="/custom-services">
              View custom services
            </Link>
          </div>
        </article>
      </div>

      <aside className="summary-card">
        <p className="eyebrow">Summary</p>
        <h2>Bag total</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0
            }).format(subtotal)}
          </span>
        </div>
        <div className="summary-row">
          <span>Coupon discount</span>
          <span>See offers</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>Calculated by pincode</span>
        </div>
        <div className="summary-row">
          <span>Expected delivery</span>
          <span>3-5 business days</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0
            }).format(subtotal)}
          </span>
        </div>
        <div className="retail-checkout-note">
          <strong>Why shoppers convert here</strong>
          <span>Clear pricing, quick support, and boutique finishing help before checkout.</span>
        </div>
        <Link
          aria-disabled={items.length === 0}
          className="primary-button text-button"
          href={items.length === 0 ? "/cart" : "/checkout"}
        >
          {items.length === 0 ? "Browse products" : "Proceed to checkout"}
        </Link>
      </aside>
    </section>
  );
}
