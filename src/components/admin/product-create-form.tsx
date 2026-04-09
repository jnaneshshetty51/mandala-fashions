"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type FormState = {
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
};

export function ProductCreateForm() {
  const router = useRouter();
  const [state, setState] = useState<FormState>({
    isSubmitting: false,
    error: null,
    success: null
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ isSubmitting: true, error: null, success: null });

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price") ?? 0),
      compareAtPrice: Number(formData.get("compareAtPrice") ?? 0) || undefined,
      inventoryCount: Number(formData.get("inventoryCount") ?? 0),
      imageUrl: String(formData.get("imageUrl") ?? "") || undefined,
      fabric: String(formData.get("fabric") ?? "") || undefined,
      occasion: String(formData.get("occasion") ?? "") || undefined,
      color: String(formData.get("color") ?? "") || undefined
    };

    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setState({
        isSubmitting: false,
        error: result?.error ?? "Unable to create product right now.",
        success: null
      });
      return;
    }

    event.currentTarget.reset();
    setState({
      isSubmitting: false,
      error: null,
      success: "Product created successfully. It is now available in the storefront catalog."
    });
    router.refresh();
  }

  return (
    <form className="admin-settings-form" onSubmit={handleSubmit}>
      <label>
        <span>Product Name</span>
        <input name="name" placeholder="Midnight Emerald Silk" required type="text" />
      </label>
      <label>
        <span>Description</span>
        <input name="description" placeholder="Describe the weave, finish, and occasion." required type="text" />
      </label>
      <label>
        <span>Price</span>
        <input min="1" name="price" placeholder="42500" required type="number" />
      </label>
      <label>
        <span>Compare At Price</span>
        <input min="1" name="compareAtPrice" placeholder="51000" type="number" />
      </label>
      <label>
        <span>Inventory Count</span>
        <input min="0" name="inventoryCount" placeholder="6" type="number" />
      </label>
      <label>
        <span>Image URL</span>
        <input name="imageUrl" placeholder="https://..." type="url" />
      </label>
      <label>
        <span>Fabric</span>
        <input name="fabric" placeholder="Silk" type="text" />
      </label>
      <label>
        <span>Occasion</span>
        <input name="occasion" placeholder="Wedding" type="text" />
      </label>
      <label>
        <span>Color</span>
        <input name="color" placeholder="Deep Green" type="text" />
      </label>

      {state.success ? <p className="admin-form-message success">{state.success}</p> : null}
      {state.error ? <p className="admin-form-message error">{state.error}</p> : null}

      <div className="admin-settings-actions">
        <button className="admin-primary-button" disabled={state.isSubmitting} type="submit">
          {state.isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </div>
    </form>
  );
}
