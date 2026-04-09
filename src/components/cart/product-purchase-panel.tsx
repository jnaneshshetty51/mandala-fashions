"use client";

import { useState } from "react";

import { CartActionButtons } from "@/components/cart/cart-buttons";

type ProductPurchasePanelProps = {
  product: {
    productId?: string;
    slug: string;
    name: string;
    artClass: string;
    label: string;
    color: string;
    colorChoices: string[];
    variants: Array<{
      name: string;
      note: string;
      price: string;
    }>;
    isPurchasable: boolean;
  };
};

function parseCurrency(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || 0;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [selectedColor, setSelectedColor] = useState(product.colorChoices[0] ?? product.color);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const selectedVariant = product.variants[selectedVariantIndex] ?? product.variants[0];

  return (
    <>
      <div className="retail-choice-block">
        <div className="retail-choice-header">
          <h2>Color</h2>
          <span>{selectedColor}</span>
        </div>
        <div className="product-option-grid retail-swatch-grid">
          {product.colorChoices.map((item) => (
            <button
              className={`product-option-card ${item === selectedColor ? "is-selected" : ""}`}
              key={item}
              onClick={() => setSelectedColor(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="retail-choice-block">
        <div className="retail-choice-header">
          <h2>Variant</h2>
          <span>{selectedVariant?.name}</span>
        </div>
        <div className="product-option-grid product-variant-grid">
          {product.variants.map((variant, index) => (
            <button
              className={`product-option-card product-variant-card ${index === selectedVariantIndex ? "is-selected" : ""}`}
              key={variant.name}
              onClick={() => setSelectedVariantIndex(index)}
              type="button"
            >
              <strong>{variant.name}</strong>
              <span>{variant.note}</span>
              <em>{variant.price}</em>
            </button>
          ))}
        </div>
      </div>

      <CartActionButtons
        product={{
          productId: product.productId,
          slug: product.slug,
          name: product.name,
          price: selectedVariant?.price ?? product.variants[0]?.price ?? "",
          unitPrice: parseCurrency(selectedVariant?.price ?? product.variants[0]?.price ?? ""),
          artClass: product.artClass,
          label: product.label,
          isPurchasable: product.isPurchasable,
          selectedColor,
          selectedVariantName: selectedVariant?.name ?? "Default"
        }}
      />
    </>
  );
}
