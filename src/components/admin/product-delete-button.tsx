"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductDeleteButtonProps = {
  id: string;
  name: string;
};

export function ProductDeleteButton({ id, name }: ProductDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setError(null);

    const response = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE"
    });

    const result = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setIsDeleting(false);
      setError(result?.error ?? "Unable to delete product right now.");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div>
      {error ? <p className="admin-form-message error" style={{ marginBottom: "1rem" }}>{error}</p> : null}
      <button
        className="admin-primary-button"
        disabled={isDeleting}
        onClick={() => void handleDelete()}
        style={{ background: "var(--color-error, #c0392b)" }}
        type="button"
      >
        {isDeleting ? "Deleting..." : "Delete Product"}
      </button>
    </div>
  );
}
