"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BannerActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handlePublishToggle() {
    setBusy(true);
    const action = status === "PUBLISHED" ? "unpublish" : "publish";
    await fetch(`/api/admin/banners/${id}/${action}`, { method: "PATCH" });
    setBusy(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this banner? This cannot be undone.")) return;
    setBusy(true);
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <span style={{ display: "flex", gap: "0.5rem" }}>
      <button
        className="admin-secondary-button"
        disabled={busy}
        onClick={handlePublishToggle}
        type="button"
      >
        {status === "PUBLISHED" ? "Unpublish" : "Publish"}
      </button>
      <button
        className="admin-secondary-button"
        disabled={busy}
        onClick={handleDelete}
        style={{ color: "var(--danger, #c0392b)" }}
        type="button"
      >
        Delete
      </button>
    </span>
  );
}
