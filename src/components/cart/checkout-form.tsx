"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/cart/cart-provider";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

type RazorpayOptions = {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  modal: { ondismiss: () => void };
  theme: { color: string };
};

type RazorpayInstance = { open: () => void };

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; discountAmount: number; label: string } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = couponApplied?.discountAmount ?? 0;
  const total = Math.max(subtotal - discount, 0);

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError(null);
    setCouponApplied(null);

    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode.trim(), subtotal })
    });

    const result = await res.json().catch(() => null) as { data?: { valid: boolean; discountAmount: number; error?: string; coupon?: { code: string } } } | null;
    setIsValidatingCoupon(false);

    if (!res.ok || !result?.data?.valid) {
      setCouponError(result?.data?.error ?? "Invalid coupon code.");
      return;
    }

    setCouponApplied({
      code: result.data.coupon?.code ?? couponCode.toUpperCase(),
      discountAmount: result.data.discountAmount,
      label: `Coupon applied: -₹${result.data.discountAmount.toLocaleString("en-IN")}`
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const paymentMethod = String(formData.get("payment") ?? "UPI");
    const shippingMethod = String(formData.get("shipping") ?? "standard");
    const shippingAmount = shippingMethod === "priority" ? 350 : 0;

    const customerName = String(formData.get("customerName") ?? "");
    const customerEmail = String(formData.get("customerEmail") ?? "");
    const customerPhone = String(formData.get("customerPhone") ?? "");
    const shippingAddress = [
      String(formData.get("address") ?? ""),
      String(formData.get("city") ?? ""),
      String(formData.get("postalCode") ?? "")
    ].filter(Boolean).join(", ");

    const orderItems = items.map((item) => ({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      color: item.selectedColor,
      variantName: item.selectedVariantName,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }));

    // Cash on Delivery path
    if (paymentMethod === "Cash on Delivery") {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName, customerEmail, customerPhone, shippingAddress,
          shippingAmount, discountAmount: couponApplied?.discountAmount ?? 0,
          couponCode: couponApplied?.code,
          paymentMethod: "cod",
          items: orderItems
        })
      });

      const result = await res.json().catch(() => null) as { error?: string; data?: { orderNumber?: string } } | null;

      if (!res.ok) {
        setError(result?.error ?? "Unable to place order.");
        setIsSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/order-confirmation?orderNumber=${encodeURIComponent(result?.data?.orderNumber ?? "")}`);
      return;
    }

    // Razorpay path (UPI, Cards, Netbanking)
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Payment gateway failed to load. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const orderRes = await fetch("/api/payments/create-razorpay-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          shippingAmount,
          discountAmount: couponApplied?.discountAmount ?? 0
      })
    });

    const orderResult = await orderRes.json().catch(() => null) as {
      data?: { razorpayOrderId: string; amount: number; currency: string; keyId: string };
      error?: string;
    } | null;

    if (!orderRes.ok || !orderResult?.data) {
      setError(orderResult?.error ?? "Unable to initiate payment.");
      setIsSubmitting(false);
      return;
    }

    const { razorpayOrderId, amount, currency, keyId } = orderResult.data;

    const rzp = new window.Razorpay({
      key: keyId,
      order_id: razorpayOrderId,
      amount,
      currency,
      name: "Mandala Fashions",
      description: "Saree Purchase",
      prefill: { name: customerName, email: customerEmail, contact: customerPhone },
      handler: async (response) => {
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            customerName, customerEmail, customerPhone, shippingAddress,
            shippingAmount,
            discountAmount: couponApplied?.discountAmount ?? 0,
            couponCode: couponApplied?.code,
            items: orderItems
          })
        });

        const verifyResult = await verifyRes.json().catch(() => null) as {
          data?: { orderNumber: string };
          error?: string;
        } | null;

        if (!verifyRes.ok || !verifyResult?.data?.orderNumber) {
          setError(verifyResult?.error ?? "Payment verified but order confirmation failed. Contact support.");
          setIsSubmitting(false);
          return;
        }

        clearCart();
        router.push(`/order-confirmation?orderNumber=${encodeURIComponent(verifyResult.data.orderNumber)}`);
      },
      modal: {
        ondismiss: () => {
          setIsSubmitting(false);
        }
      },
      theme: { color: "#1a1a1a" }
    });

    rzp.open();
  }

  return (
    <form className="checkout-form-stack" onSubmit={handleSubmit}>
      <section className="form-card">
        <h2>Address</h2>
        <div className="field-grid">
          <label>Full Name<input name="customerName" required placeholder="Aarohi Mehta" type="text" /></label>
          <label>Email<input name="customerEmail" required placeholder="aarohi@example.com" type="email" /></label>
          <label className="field-span">Address Line<input name="address" required placeholder="12 Heritage Lane, JP Nagar" type="text" /></label>
          <label>City<input name="city" required placeholder="Bengaluru" type="text" /></label>
          <label>Postal Code<input name="postalCode" required placeholder="560001" type="text" /></label>
          <label className="field-span">Phone<input name="customerPhone" required placeholder="+91 90000 00000" type="text" /></label>
        </div>
      </section>

      <section className="form-card">
        <h2>Shipping Method</h2>
        <div className="checkout-option-list">
          <label className="checkout-option">
            <input defaultChecked name="shipping" type="radio" value="standard" />
            <div><strong>Complimentary Boutique Delivery</strong><span>Estimated 3–5 business days</span></div>
            <em>Free</em>
          </label>
          <label className="checkout-option">
            <input name="shipping" type="radio" value="priority" />
            <div><strong>Priority Dispatch</strong><span>1–2 business days</span></div>
            <em>₹350</em>
          </label>
        </div>
      </section>

      <section className="form-card">
        <h2>Coupon Code</h2>
        <div className="field-grid">
          <label className="field-span">
            Promo / Coupon
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                disabled={!!couponApplied}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code"
                type="text"
                value={couponCode}
              />
              {couponApplied ? (
                <button type="button" className="secondary-button text-button" onClick={() => { setCouponApplied(null); setCouponCode(""); }}>
                  Remove
                </button>
              ) : (
                <button type="button" className="secondary-button text-button" disabled={isValidatingCoupon || !couponCode.trim()} onClick={applyCoupon}>
                  {isValidatingCoupon ? "..." : "Apply"}
                </button>
              )}
            </div>
          </label>
        </div>
        {couponApplied ? <p className="auth-message" style={{ color: "green" }}>{couponApplied.label}</p> : null}
        {couponError ? <p className="auth-message auth-error">{couponError}</p> : null}
      </section>

      <section className="form-card">
        <h2>Payment</h2>
        <div className="checkout-payment-grid">
          {["UPI", "Cards", "Cash on Delivery", "Netbanking"].map((method, index) => (
            <label className="checkout-payment-card" key={method}>
              <input defaultChecked={index === 0} name="payment" type="radio" value={method} />
              <span>{method}</span>
            </label>
          ))}
        </div>
        <p style={{ fontSize: "0.8rem", marginTop: "8px", opacity: 0.6 }}>
          UPI, Cards, and Netbanking are processed securely via Razorpay. Cash on Delivery available for all orders.
        </p>
      </section>

      <section className="form-card">
        <h2>Order Review</h2>
        <div className="guide-link-list">
          <span>{items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "item" : "items"} in cart</span>
          <span>Subtotal: ₹{subtotal.toLocaleString("en-IN")}</span>
          {couponApplied ? <span>Discount: -₹{couponApplied.discountAmount.toLocaleString("en-IN")}</span> : null}
          <span>Total: ₹{total.toLocaleString("en-IN")}</span>
        </div>
      </section>

      {error ? <p className="auth-message auth-error">{error}</p> : null}

      <button className="primary-button text-button" disabled={items.length === 0 || isSubmitting} type="submit">
        {isSubmitting ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}
