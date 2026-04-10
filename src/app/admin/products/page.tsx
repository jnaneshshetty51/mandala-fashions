import Link from "next/link";

import { AdminLayout } from "@/components/admin/admin-layout";
import { BulkActivateButton } from "@/components/admin/bulk-activate-button";
import { BulkImportForm } from "@/components/admin/bulk-import-form";
import { ProductCatalogTable } from "@/components/admin/product-catalog-table";
import { ProductCreateForm } from "@/components/admin/product-create-form";
import { requirePageRole } from "@/server/auth/guards";
import { prisma } from "@/server/db";

const VALID_STATUSES = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

function isValidStatus(value: string): value is ValidStatus {
  return (VALID_STATUSES as readonly string[]).includes(value);
}

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const user = await requirePageRole(["ADMIN"]);
  const { status, q = "" } = await searchParams;

  const statusFilter = status && isValidStatus(status.toUpperCase())
    ? (status.toUpperCase() as ValidStatus)
    : undefined;
  const searchQuery = q.trim();

  const rawProducts = await prisma.product.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery, mode: "insensitive" } },
              { sku: { contains: searchQuery, mode: "insensitive" } },
              { fabric: { contains: searchQuery, mode: "insensitive" } },
              { occasion: { contains: searchQuery, mode: "insensitive" } }
            ]
          }
        : {})
    },
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
    material: p.fabric ?? "Unassigned",
    category: p.occasion ?? "Unassigned",
    imageUrl: p.imageUrl,
    updatedAt: p.updatedAt
  }));

  const allProducts = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { updatedAt: "desc" }
  });

  const totalVariants = allProducts.reduce((sum, p) => sum + p.variants.length, 0);
  const totalStock = allProducts.reduce((sum, p) => sum + p.inventoryCount, 0);
  const activeCount = allProducts.filter((product) => product.status === "ACTIVE").length;
  const draftCount = allProducts.filter((product) => product.status === "DRAFT").length;
  const archivedCount = allProducts.filter((product) => product.status === "ARCHIVED").length;
  const filteredStock = products.reduce((sum, product) => sum + product.inventoryCount, 0);
  const lowStockCount = allProducts.filter((product) => product.inventoryCount > 0 && product.inventoryCount <= 3).length;

  function formatUpdatedAt(value: Date) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(value);
  }

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
      <section className="admin-products-shell">
        <div className="admin-products-header">
          <div>
            <p className="admin-eyebrow">Catalog Workspace</p>
            <h2>Manage products, inventory, and merchandising from one place.</h2>
            <p>
              Browse the current catalog, add new products quickly, bulk import sheet data, and jump
              into edits without leaving the page.
            </p>
          </div>
          <div className="admin-products-actions">
            <Link className="admin-primary-button" href="#create-product">
              Add Product
            </Link>
            <Link className="admin-ghost-button" href="#catalog-table">
              Browse Catalog
            </Link>
          </div>
        </div>

        <section className="admin-products-stats">
          <article className="admin-products-stat-card">
            <span>Total products</span>
            <strong>{allProducts.length}</strong>
            <small>Base products in catalog</small>
          </article>
          <article className="admin-products-stat-card">
            <span>Variants</span>
            <strong>{totalVariants}</strong>
            <small>Attached variant records</small>
          </article>
          <article className="admin-products-stat-card">
            <span>Total qty</span>
            <strong>{totalStock}</strong>
            <small>Inventory units across catalog</small>
          </article>
          <article className="admin-products-stat-card">
            <span>Live products</span>
            <strong>{activeCount}</strong>
            <small>{draftCount} draft, {archivedCount} archived</small>
            {draftCount > 0 ? <BulkActivateButton draftCount={draftCount} /> : null}
          </article>
          <article className="admin-products-stat-card">
            <span>Low stock</span>
            <strong>{lowStockCount}</strong>
            <small>Products with 1 to 3 units left</small>
          </article>
        </section>

        <section className="admin-products-grid">
          <article className="admin-products-surface" id="create-product">
            <div className="admin-card-header">
              <div>
                <h2>Create Product</h2>
                <p>Use your inventory-sheet fields and publish directly to the storefront.</p>
              </div>
            </div>
            <ProductCreateForm />
          </article>

          <article className="admin-products-surface">
            <div className="admin-card-header">
              <div>
                <h2>Bulk Import</h2>
                <p>Paste or upload rows from your sheet with the same product structure.</p>
              </div>
            </div>
            <BulkImportForm />
          </article>
        </section>

        <article className="admin-products-surface" id="catalog-table">
          <div className="admin-card-header">
            <div>
              <h2>Product Catalog</h2>
              <p>Filter by status, search by product/SKU/material, and jump to edits quickly.</p>
            </div>
          </div>

          <div className="admin-products-toolbar">
            <form action="/admin/products" className="admin-products-search">
              {statusFilter ? <input name="status" type="hidden" value={statusFilter} /> : null}
              <span className="icon-search" />
              <input defaultValue={searchQuery} name="q" placeholder="Search by product, SKU, material..." type="text" />
              <button className="admin-ghost-button admin-products-search-button" type="submit">
                Search
              </button>
            </form>

            <div className="admin-products-filters">
              <Link
                className={!statusFilter ? "admin-products-filter is-active" : "admin-products-filter"}
                href={searchQuery ? `/admin/products?q=${encodeURIComponent(searchQuery)}` : "/admin/products"}
              >
                All
              </Link>
              <Link
                className={statusFilter === "ACTIVE" ? "admin-products-filter is-active" : "admin-products-filter"}
                href={searchQuery ? `/admin/products?status=ACTIVE&q=${encodeURIComponent(searchQuery)}` : "/admin/products?status=ACTIVE"}
              >
                Active
              </Link>
              <Link
                className={statusFilter === "DRAFT" ? "admin-products-filter is-active" : "admin-products-filter"}
                href={searchQuery ? `/admin/products?status=DRAFT&q=${encodeURIComponent(searchQuery)}` : "/admin/products?status=DRAFT"}
              >
                Draft
              </Link>
              <Link
                className={statusFilter === "ARCHIVED" ? "admin-products-filter is-active" : "admin-products-filter"}
                href={searchQuery ? `/admin/products?status=ARCHIVED&q=${encodeURIComponent(searchQuery)}` : "/admin/products?status=ARCHIVED"}
              >
                Archived
              </Link>
            </div>
          </div>

          <div className="admin-products-table-meta">
            <span>{products.length} result{products.length === 1 ? "" : "s"}</span>
            <span>{filteredStock} visible units</span>
            {searchQuery ? <span>Searching for "{searchQuery}"</span> : null}
            {statusFilter ? <span>Status: {statusFilter}</span> : null}
          </div>

          <ProductCatalogTable
            products={products.map((product) => ({
              ...product,
              updatedAtLabel: formatUpdatedAt(product.updatedAt)
            }))}
          />
        </article>
      </section>
    </AdminLayout>
  );
}
