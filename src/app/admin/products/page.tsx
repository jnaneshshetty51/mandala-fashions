import Link from "next/link";

import { AdminLayout } from "@/components/admin/admin-layout";
import { ProductCreateForm } from "@/components/admin/product-create-form";
import { requirePageRole } from "@/server/auth/guards";
import { prisma } from "@/server/db";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

const VALID_STATUSES = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

function isValidStatus(value: string): value is ValidStatus {
  return (VALID_STATUSES as readonly string[]).includes(value);
}

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requirePageRole(["ADMIN"]);
  const { status } = await searchParams;

  const statusFilter = status && isValidStatus(status.toUpperCase())
    ? (status.toUpperCase() as ValidStatus)
    : undefined;

  const rawProducts = await prisma.product.findMany({
    where: statusFilter ? { status: statusFilter } : {},
    include: { variants: true },
    orderBy: { updatedAt: "desc" },
    take: 50
  });

  const products = rawProducts.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    price: Number(p.price),
    inventoryCount: p.inventoryCount,
    status: p.status as string,
    variants: p.variants.length,
    fabric: p.fabric ?? "Unassigned"
  }));

  const allProducts = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { updatedAt: "desc" }
  });

  const totalVariants = allProducts.reduce((sum, p) => sum + p.variants.length, 0);
  const totalStock = allProducts.reduce((sum, p) => sum + p.inventoryCount, 0);

  return (
    <AdminLayout
      active="products"
      createLabel="Create Product"
      eyebrow="Catalog Management"
      title="Products & Variants"
      topNav={[
        { label: "Products", href: "/admin/products" },
        { label: "Variants", href: "/admin/products" },
        { label: "Inventory", href: "/admin/products" }
      ]}
      user={user}
    >
      <section className="admin-metric-grid">
        <article className="admin-metric-card">
          <p>Total SKUs</p>
          <h2>{allProducts.length}</h2>
          <span className="admin-delta neutral">Base products in catalog</span>
        </article>
        <article className="admin-metric-card">
          <p>Total Variants</p>
          <h2>{totalVariants}</h2>
          <span className="admin-delta neutral">Color and fabric combinations</span>
        </article>
        <article className="admin-metric-card">
          <p>Total Stock</p>
          <h2>{totalStock}</h2>
          <span className="admin-delta positive">Inventory units across catalog</span>
        </article>
      </section>

      <section className="admin-settings-layout">
        <article className="admin-table-card">
          <div className="admin-card-header">
            <div>
              <h2>Create Product</h2>
              <p>Add a new catalog item that becomes available in the storefront and checkout flow.</p>
            </div>
          </div>
          <ProductCreateForm />
        </article>

        <article className="admin-growth-card">
          <h2>Publishing Notes</h2>
          <p>New products are created as active storefront items.</p>
          <div className="guide-link-list">
            <span>Slug and SKU are generated automatically.</span>
            <span>Use image URLs now; upload workflow can be layered in after.</span>
            <span>Inventory count controls store availability and checkout usage.</span>
          </div>
        </article>
      </section>

      <article className="admin-table-card">
        <div className="admin-card-header">
          <div>
            <h2>Archive Catalog</h2>
            <p>Manage products, merchandising state, and variant density.</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Link
              className={!statusFilter ? "admin-primary-button" : "admin-secondary-button"}
              href="/admin/products"
            >
              All
            </Link>
            <Link
              className={statusFilter === "DRAFT" ? "admin-primary-button" : "admin-secondary-button"}
              href="/admin/products?status=DRAFT"
            >
              Draft
            </Link>
            <Link
              className={statusFilter === "ACTIVE" ? "admin-primary-button" : "admin-secondary-button"}
              href="/admin/products?status=ACTIVE"
            >
              Active
            </Link>
            <Link
              className={statusFilter === "ARCHIVED" ? "admin-primary-button" : "admin-secondary-button"}
              href="/admin/products?status=ARCHIVED"
            >
              Archived
            </Link>
          </div>
        </div>
        <div className="admin-table">
          <div className="admin-table-head admin-table-head-products">
            <span>Product</span>
            <span>SKU</span>
            <span>Fabric</span>
            <span>Variants</span>
            <span>Stock</span>
            <span>Status</span>
            <span>Price</span>
            <span>Actions</span>
          </div>
          {products.map((product) => (
            <div className="admin-table-row admin-table-row-products" key={product.id}>
              <strong>
                <Link href={`/admin/products/${product.id}`}>{product.name}</Link>
              </strong>
              <span>{product.sku}</span>
              <span>{product.fabric}</span>
              <span>{product.variants}</span>
              <span>{product.inventoryCount}</span>
              <em className={`status-${product.status.toLowerCase()}`}>{product.status}</em>
              <strong>{formatCurrency(product.price)}</strong>
              <span>
                <Link className="admin-secondary-button" href={`/admin/products/${product.id}`}>
                  Edit
                </Link>
              </span>
            </div>
          ))}
        </div>
      </article>
    </AdminLayout>
  );
}
