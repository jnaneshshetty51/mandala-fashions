"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId?: string;
  slug: string;
  name: string;
  price: string;
  unitPrice: number;
  artClass: string;
  label: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (slug: string) => void;
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
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
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
          const existing = current.find((entry) => entry.slug === item.slug);

          if (existing) {
            return current.map((entry) =>
              entry.slug === item.slug ? { ...entry, quantity: entry.quantity + 1 } : entry
            );
          }

          return [...current, { ...item, quantity: 1 }];
        });
      },
      removeItem: (slug) => {
        setItems((current) => current.filter((item) => item.slug !== slug));
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
