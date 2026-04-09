import { AdminLayout } from "@/components/admin/admin-layout";
import { requirePageRole } from "@/server/auth/guards";
import { listAdminCoupons } from "@/server/admin/service";
import { CouponCreateForm, CouponActions } from "@/components/admin/coupon-create-form";

export default async function AdminMarketingPage() {
  const user = await requirePageRole(["ADMIN"]);
  const coupons = await listAdminCoupons();

  return (
    <AdminLayout
      active="marketing"
      createLabel="Create Coupon"
      eyebrow="Marketing Engine"
      title="Coupons & Offers"
      topNav={[
        { label: "Coupons", href: "/admin/marketing" },
        { label: "Offers", href: "/admin/marketing" },
        { label: "Campaigns", href: "/admin/marketing" }
      ]}
      user={user}
    >
      <article className="admin-table-card">
        <div className="admin-card-header">
          <div>
            <h2>Create Coupon</h2>
            <p>Add a new promotional code to your marketing engine.</p>
          </div>
        </div>
        <CouponCreateForm />
      </article>

      <article className="admin-table-card">
        <div className="admin-card-header">
          <div>
            <h2>Coupon Engine</h2>
            <p>Manage promotional codes, redemption counts, and active offer states.</p>
          </div>
        </div>
        <div className="admin-table">
          <div className="admin-table-head admin-table-head-marketing">
            <span>Code</span>
            <span>Campaign</span>
            <span>Type</span>
            <span>Value</span>
            <span>Min Order</span>
            <span>Used</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {coupons.map((coupon) => (
            <div className="admin-table-row admin-table-row-marketing" key={coupon.id}>
              <strong>{coupon.code}</strong>
              <span>{coupon.label}</span>
              <span>{coupon.type}</span>
              <span>
                {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `₹${coupon.value}`}
              </span>
              <span>{"minOrder" in coupon && coupon.minOrder != null ? `₹${coupon.minOrder}` : "—"}</span>
              <span>{coupon.usedCount}</span>
              <em className={coupon.isActive ? "status-delivered" : "status-cancelled"}>
                {coupon.isActive ? "ACTIVE" : "INACTIVE"}
              </em>
              <CouponActions id={coupon.id} isActive={coupon.isActive} />
            </div>
          ))}
        </div>
      </article>
    </AdminLayout>
  );
}
