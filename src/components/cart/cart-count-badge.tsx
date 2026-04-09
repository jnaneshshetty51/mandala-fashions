"use client";

import { useCart } from "@/components/cart/cart-provider";

export function CartCountBadge() {
  const { itemCount } = useCart();
  return <span className="cart-count">{itemCount}</span>;
}
