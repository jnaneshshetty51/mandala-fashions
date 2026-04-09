import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminLayout } from "@/components/admin/admin-layout";
import { ProductDeleteButton } from "@/components/admin/product-delete-button";
import { ProductEditForm } from "@/components/admin/product-edit-form";
import { requirePageRole } from "@/server/auth/guards";
import { getAdminProduct } from "@/server/products/service";

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

  const product = await getAdminProduct(id);

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
          <span className="admin-delta neutral">SKU: {product.sku}</span>
        </article>
        <article className="admin-metric-card">
          <p>Qty</p>
          <h2>{product.inventoryCount}</h2>
          <span className={`admin-delta ${product.inventoryCount > 0 ? "positive" : "negative"}`}>
            {product.inventoryCount > 0 ? "Available" : "Out of stock"}
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
            {product.category ? (
              <p>
                <strong>Category:</strong> {product.category}
              </p>
            ) : null}
            {product.material ? (
              <p>
                <strong>Material:</strong> {product.material}
              </p>
            ) : null}
            <p>
              <strong>Type:</strong> {product.type}
            </p>
            {product.variant ? (
              <p>
                <strong>Variant:</strong> {product.variant}
              </p>
            ) : null}
            {product.description ? (
              <p>
                <strong>Description:</strong> {product.description}
              </p>
            ) : null}
            {product.length ? (
              <p>
                <strong>Length:</strong> {product.length}
              </p>
            ) : null}
            {product.colors ? (
              <p>
                <strong>Colors:</strong> {product.colors}
              </p>
            ) : null}
            {product.imageUrls.length > 0 ? (
              <div>
                <strong>Image Gallery:</strong>
                <div className="admin-image-grid" style={{ marginTop: "0.75rem" }}>
                  {product.imageUrls.map((url, index) => (
                    <article className="admin-image-card" key={url}>
                      <div
                        className="admin-image-preview"
                        style={{
                          backgroundImage: `url('${url}')`,
                          backgroundPosition: "center",
                          backgroundSize: "cover"
                        }}
                      />
                      <div className="admin-image-meta">
                        <span>{index === 0 ? "Primary image" : `Image ${index + 1}`}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </article>

        <article className="admin-growth-card">
          <h2>Quick Info</h2>
          <div className="guide-link-list">
            <span>Slug is generated automatically from Type and Variant.</span>
            <span>SKU can be set directly to match your inventory sheet.</span>
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
            category: product.category,
            material: product.material,
            type: product.type,
            variant: product.variant,
            description: product.description,
            length: product.length,
            colors: product.colors,
            price,
            sku: product.sku,
            qty: product.inventoryCount,
            imageUrl: product.imageUrl,
            imageUrls: product.imageUrls,
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
