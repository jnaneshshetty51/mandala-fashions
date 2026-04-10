"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  price: number;
  inventoryCount: number;
  status: string;
  variants: number;
  material: string;
  category: string;
  imageUrl: string | null;
  updatedAtLabel: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function ProductCatalogTable({ products }: { products: ProductRow[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const allSelected = products.length > 0 && selectedIds.length === products.length;
  const selectedCount = selectedIds.length;

  const selectedNames = useMemo(() => {
    const namesById = new Map(products.map((product) => [product.id, product.name]));
    return selectedIds.map((id) => namesById.get(id)).filter((value): value is string => Boolean(value));
  }, [products, selectedIds]);

  function toggleProduct(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
    setState("idle");
    setMessage("");
  }

  function toggleAll() {
    setSelectedIds(allSelected ? [] : products.map((product) => product.id));
    setState("idle");
    setMessage("");
  }

  async function handleBulkDelete() {
    if (selectedCount === 0 || state === "loading") return;

    const preview = selectedNames.slice(0, 3).join(", ");
    const moreCount = selectedNames.length > 3 ? ` and ${selectedNames.length - 3} more` : "";
    const confirmed = window.confirm(
      `Delete ${selectedCount} product${selectedCount !== 1 ? "s" : ""}? ${preview ? `This includes ${preview}${moreCount}. ` : ""}This cannot be undone.`
    );

    if (!confirmed) return;

    setState("loading");
    setMessage("");

    const response = await fetch("/api/admin/products/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds })
    });

    const result = (await response.json().catch(() => null)) as
      | { data?: { deleted: number; failed: Array<{ id: string; error: string }> }; error?: string }
      | null;

    if (response.ok && result?.data) {
      const failureCount = result.data.failed.length;
      setState("done");
      setMessage(
        failureCount > 0
          ? `${result.data.deleted} deleted, ${failureCount} could not be deleted. Refreshing...`
          : `${result.data.deleted} product${result.data.deleted !== 1 ? "s" : ""} deleted. Refreshing...`
      );
      setSelectedIds([]);
      window.setTimeout(() => window.location.reload(), 1200);
      return;
    }

    setState("error");
    setMessage(result?.error ?? "Bulk delete failed. Try again.");
  }

  return (
    <>
      {products.length > 0 ? (
        <div className="admin-bulk-bar">
          <label className="admin-bulk-select-all">
            <input checked={allSelected} onChange={toggleAll} type="checkbox" />
            <span>Select all visible</span>
          </label>

          <div className="admin-bulk-actions">
            <span className="admin-bulk-count">
              {selectedCount} selected
            </span>
            <button
              className="admin-secondary-button admin-danger-button"
              disabled={selectedCount === 0 || state === "loading"}
              onClick={handleBulkDelete}
              type="button"
            >
              {state === "loading" ? "Deleting..." : "Delete selected"}
            </button>
          </div>
        </div>
      ) : null}

      {message ? (
        <p className={`admin-form-message ${state === "error" ? "error" : "success"}`}>{message}</p>
      ) : null}

      <div className="admin-table admin-products-table">
        <div className="admin-table-head admin-products-table-head admin-products-table-head-selectable">
          <span />
          <span>Product</span>
          <span>SKU</span>
          <span>Material</span>
          <span>Variants</span>
          <span>Qty</span>
          <span>Status</span>
          <span>Price</span>
          <span>Actions</span>
        </div>
        {products.length === 0 ? (
          <div className="admin-products-empty">
            <strong>No products match the current filters.</strong>
            <span>Try a different search, or clear the filter to view the full catalog.</span>
          </div>
        ) : (
          products.map((product) => (
            <div className="admin-table-row admin-products-table-row admin-products-table-row-selectable" key={product.id}>
              <label className="admin-row-checkbox">
                <input
                  checked={selectedIds.includes(product.id)}
                  onChange={() => toggleProduct(product.id)}
                  type="checkbox"
                />
              </label>
              <div className="admin-products-main-cell">
                <div className="admin-products-identity">
                  <div
                    className="admin-products-thumb"
                    style={product.imageUrl ? { backgroundImage: `url('${product.imageUrl}')` } : undefined}
                  />
                  <div className="admin-products-main-copy">
                    <strong>
                      <Link href={`/admin/products/${product.id}`}>{product.name}</Link>
                    </strong>
                    <span>{product.category} · {product.material}</span>
                    <small>Updated {product.updatedAtLabel}</small>
                  </div>
                </div>
              </div>
              <span>{product.sku}</span>
              <span>{product.material}</span>
              <span>{product.variants}</span>
              <span className={product.inventoryCount <= 3 ? "admin-stock-pill is-low" : "admin-stock-pill"}>
                {product.inventoryCount}
              </span>
              <em className={`status-${product.status.toLowerCase()}`}>{product.status}</em>
              <strong>{formatCurrency(product.price)}</strong>
              <span>
                <Link className="admin-secondary-button" href={`/admin/products/${product.id}`}>
                  Edit
                </Link>
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
}
