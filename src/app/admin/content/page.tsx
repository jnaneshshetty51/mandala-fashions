import { AdminLayout } from "@/components/admin/admin-layout";
import { BannerCreateForm } from "@/components/admin/banner-create-form";
import { requirePageRole } from "@/server/auth/guards";
import { listAdminBanners } from "@/server/admin/service";
import { BannerActions } from "./banner-actions";

export default async function AdminContentPage() {
  const user = await requirePageRole(["ADMIN"]);
  const banners = await listAdminBanners();

  return (
    <AdminLayout
      active="content"
      createLabel="Create Banner"
      createHref="/admin/content#create-banner"
      eyebrow="Content Studio"
      title="Banners & Merchandising"
      topNav={[
        { label: "Banners", href: "/admin/content" },
        { label: "Homepage", href: "/admin/content" },
        { label: "Collections", href: "/collections" }
      ]}
      user={user}
    >
      <div className="admin-settings-layout">
        {/* Left: Create form */}
        <article className="admin-table-card" id="create-banner">
          <div className="admin-card-header">
            <div>
              <h2>Create Banner</h2>
              <p>Add a new promotional banner to your storefront.</p>
            </div>
          </div>
          <div style={{ padding: "1rem 1.5rem" }}>
            <BannerCreateForm />
          </div>
        </article>

        {/* Right: Placement guide */}
        <aside className="admin-table-card" style={{ alignSelf: "start" }}>
          <div className="admin-card-header">
            <div>
              <h2>Placement Guide</h2>
              <p>Use these keys to target the correct storefront zone.</p>
            </div>
          </div>
          <ul
            style={{
              padding: "1rem 1.5rem",
              listStyle: "none",
              lineHeight: 2,
              fontSize: "0.9rem"
            }}
          >
            <li>
              <code>homepage.hero</code> — Full-width hero, above the fold
            </li>
            <li>
              <code>homepage.mid</code> — Mid-page editorial strip
            </li>
            <li>
              <code>collections.top</code> — Banner above collection grid
            </li>
          </ul>
        </aside>
      </div>

      {/* Banners table */}
      <article className="admin-table-card" style={{ marginTop: "1.5rem" }}>
        <div className="admin-card-header">
          <div>
            <h2>Banner Management</h2>
            <p>Control placement, publishing status, and on-site campaign links.</p>
          </div>
        </div>
        <div className="admin-table">
          <div
            className="admin-table-head admin-table-head-content"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}
          >
            <span>Title</span>
            <span>Placement</span>
            <span>Status</span>
            <span>Destination</span>
            <span>Actions</span>
          </div>
          {banners.map((banner) => (
            <div
              className="admin-table-row admin-table-row-content"
              key={banner.id}
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}
            >
              <strong>{banner.title}</strong>
              <span>{banner.placement}</span>
              <em className={`status-${banner.status.toLowerCase()}`}>{banner.status}</em>
              <span>{banner.href}</span>
              <BannerActions id={banner.id} status={banner.status} />
            </div>
          ))}
        </div>
      </article>
    </AdminLayout>
  );
}
