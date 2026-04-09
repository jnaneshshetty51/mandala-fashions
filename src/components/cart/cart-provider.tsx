"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  cartKey: string;
  productId?: string;
  slug: string;
  name: string;
  price: string;
  unitPrice: number;
  artClass: string;
  label: string;
  selectedColor?: string;
  selectedVariantName?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (cartKey: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "mandala_cart";

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    return (JSON.parse(raw) as Array<Partial<CartItem> & Pick<CartItem, "slug" | "name" | "price" | "unitPrice" | "artClass" | "label">>).map((item) => ({
      cartKey: item.cartKey ?? [item.slug, item.selectedVariantName ?? "default", item.selectedColor ?? "default"].join("::"),
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      price: item.price,
      unitPrice: item.unitPrice,
      artClass: item.artClass,
      label: item.label,
      selectedColor: item.selectedColor,
      selectedVariantName: item.selectedVariantName,
      quantity: item.quantity ?? 1
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readStoredCart());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem: (item) => {
        setItems((current) => {
          const existing = current.find((entry) => entry.cartKey === item.cartKey);

          if (existing) {
            return current.map((entry) =>
              entry.cartKey === item.cartKey ? { ...entry, quantity: entry.quantity + 1 } : entry
            );
          }

          return [...current, { ...item, quantity: 1 }];
        });
      },
      removeItem: (cartKey) => {
        setItems((current) => current.filter((item) => item.cartKey !== cartKey));
      },
      clearCart: () => {
        setItems([]);
      }
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
