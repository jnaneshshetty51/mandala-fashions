import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminLayout } from "@/components/admin/admin-layout";
import { ProductDeleteButton } from "@/components/admin/product-delete-button";
import { ProductEditForm } from "@/components/admin/product-edit-form";
import { requirePageRole } from "@/server/auth/guards";
import { prisma } from "@/server/db";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export default async function AdminProductDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requirePageRole(["ADMIN"]);

  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true }
  });

  if (!product) {
    notFound();
  }

  const price = Number(product.price);
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;

  return (
    <AdminLayout
      active="products"
      eyebrow="Catalog Management"
      title={product.name}
      topNav={[
        { label: "Products", href: "/admin/products" },
        { label: "Variants", href: "/admin/products" },
        { label: "Inventory", href: "/admin/products" }
      ]}
      user={user}
    >
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link className="admin-secondary-button" href="/admin/products">
          &larr; Back to Products
        </Link>
      </nav>

      <section className="admin-metric-grid">
        <article className="admin-metric-card">
          <p>Price</p>
          <h2>{formatCurrency(price)}</h2>
          {compareAtPrice ? (
            <span className="admin-delta neutral">Compare at {formatCurrency(compareAtPrice)}</span>
          ) : (
            <span className="admin-delta neutral">No compare price set</span>
          )}
        </article>
        <article className="admin-metric-card">
          <p>Inventory</p>
          <h2>{product.inventoryCount}</h2>
          <span className={`admin-delta ${product.inventoryCount > 0 ? "positive" : "negative"}`}>
            {product.inventoryCount > 0 ? "In stock" : "Out of stock"}
          </span>
        </article>
        <article className="admin-metric-card">
          <p>Status</p>
          <h2>
            <em className={`status-${product.status.toLowerCase()}`}>{product.status}</em>
          </h2>
          <span className="admin-delta neutral">{product.variants.length} variant(s)</span>
        </article>
      </section>

      <section className="admin-settings-layout">
        <article className="admin-table-card">
          <div className="admin-card-header">
            <div>
              <h2>Product Details</h2>
              <p>SKU: {product.sku} &mdash; Slug: {product.slug}</p>
            </div>
          </div>

          <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {product.description ? (
              <p>
                <strong>Description:</strong> {product.description}
              </p>
            ) : null}
            {product.fabric ? (
              <p>
                <strong>Fabric:</strong> {product.fabric}
              </p>
            ) : null}
            {product.occasion ? (
              <p>
                <strong>Occasion:</strong> {product.occasion}
              </p>
            ) : null}
            {product.color ? (
              <p>
                <strong>Color:</strong> {product.color}
              </p>
            ) : null}
            {product.imageUrl ? (
              <p>
                <strong>Image:</strong>{" "}
                <a href={product.imageUrl} rel="noopener noreferrer" target="_blank">
                  {product.imageUrl}
                </a>
              </p>
            ) : null}
          </div>
        </article>

        <article className="admin-growth-card">
          <h2>Quick Info</h2>
          <div className="guide-link-list">
            <span>Slug and SKU are read-only; they were generated at creation time.</span>
            <span>Changing status to Archived removes the product from the storefront.</span>
            <span>Use inventory adjustment for stock corrections rather than direct edits.</span>
          </div>
        </article>
      </section>

      <article className="admin-table-card">
        <div className="admin-card-header">
          <div>
            <h2>Edit Product</h2>
            <p>Update product fields and save changes below.</p>
          </div>
        </div>
        <ProductEditForm
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price,
            compareAtPrice,
            inventoryCount: product.inventoryCount,
            imageUrl: product.imageUrl,
            fabric: product.fabric,
            occasion: product.occasion,
            color: product.color,
            status: product.status as "DRAFT" | "ACTIVE" | "ARCHIVED"
          }}
        />
      </article>

      {product.variants.length > 0 ? (
        <article className="admin-table-card">
          <div className="admin-card-header">
            <div>
              <h2>Variants</h2>
              <p>{product.variants.length} variant(s) attached to this product.</p>
            </div>
          </div>
          <div className="admin-table">
            <div className="admin-table-head admin-table-head-products">
              <span>SKU</span>
              <span>Name</span>
              <span>Color</span>
              <span>Fabric</span>
              <span>Price</span>
              <span>Stock</span>
            </div>
            {product.variants.map((variant) => (
              <div className="admin-table-row admin-table-row-products" key={variant.id}>
                <span>{variant.sku}</span>
                <strong>{variant.name}</strong>
                <span>{variant.color ?? "—"}</span>
                <span>{variant.fabric ?? "—"}</span>
                <span>{formatCurrency(Number(variant.price))}</span>
                <span>{variant.stock}</span>
              </div>
            ))}
          </div>
        </article>
      ) : null}

      <article className="admin-table-card">
        <div className="admin-card-header">
          <div>
            <h2>Danger Zone</h2>
            <p>Permanently delete this product. This action cannot be undone.</p>
          </div>
        </div>
        <div style={{ padding: "1rem 1.5rem" }}>
          <ProductDeleteButton id={product.id} name={product.name} />
        </div>
      </article>
    </AdminLayout>
  );
}
