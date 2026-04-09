"use client";

import { useRouter } from "next/navigation";

import { useCart } from "@/components/cart/cart-provider";

export function CartActionButtons({
  product
}: {
  product: {
    productId?: string;
    slug: string;
    name: string;
    price: string;
    unitPrice: number;
    artClass: string;
    label: string;
    isPurchasable: boolean;
    selectedColor?: string;
    selectedVariantName?: string;
  };
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const isDisabled = !product.isPurchasable;
  const cartKey = [
    product.slug,
    product.selectedVariantName ?? "default",
    product.selectedColor ?? "default"
  ].join("::");

  function handleAddToCart() {
    if (isDisabled) {
      return;
    }

    addItem({
      ...product,
      cartKey
    });
  }

  function handleBuyNow() {
    if (isDisabled) {
      return;
    }

    addItem({
      ...product,
      cartKey
    });
    router.push("/checkout");
  }

  return (
    <div className="detail-actions">
      <button className="primary-button" disabled={isDisabled} onClick={handleAddToCart} type="button">
        Add To Cart
      </button>
      <button className="secondary-button" disabled={isDisabled} onClick={handleBuyNow} type="button">
        Buy Now
      </button>
      {isDisabled ? <p className="cart-helper-text">This item is not currently available for purchase.</p> : null}
    </div>
  );
}
