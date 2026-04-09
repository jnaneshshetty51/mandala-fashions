"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type ProductEditFormProps = {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    compareAtPrice: number | null;
    inventoryCount: number;
    imageUrl: string | null;
    fabric: string | null;
    occasion: string | null;
    color: string | null;
    status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  };
};

type FormState = {
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
};

export function ProductEditForm({ product }: ProductEditFormProps) {
  const router = useRouter();
  const [state, setState] = useState<FormState>({
    isSubmitting: false,
    error: null,
    success: null
  });

  const [inventoryState, setInventoryState] = useState<FormState>({
    isSubmitting: false,
    error: null,
    success: null
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ isSubmitting: true, error: null, success: null });

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price") ?? 0),
      status: String(formData.get("status") ?? "DRAFT"),
      inventoryCount: Number(formData.get("inventoryCount") ?? 0)
    };

    const compareAtPrice = Number(formData.get("compareAtPrice") ?? 0);
    if (compareAtPrice > 0) payload.compareAtPrice = compareAtPrice;

    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    if (imageUrl) payload.imageUrl = imageUrl;

    const fabric = String(formData.get("fabric") ?? "").trim();
    if (fabric) payload.fabric = fabric;

    const occasion = String(formData.get("occasion") ?? "").trim();
    if (occasion) payload.occasion = occasion;

    const color = String(formData.get("color") ?? "").trim();
    if (color) payload.color = color;

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setState({
        isSubmitting: false,
        error: result?.error ?? "Unable to update product right now.",
        success: null
      });
      return;
    }

    setState({
      isSubmitting: false,
      error: null,
      success: "Product updated successfully."
    });
    router.refresh();
  }

  async function handleInventoryAdjust(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInventoryState({ isSubmitting: true, error: null, success: null });

    const formData = new FormData(event.currentTarget);
    const delta = Number(formData.get("delta") ?? 0);

    if (!Number.isInteger(delta)) {
      setInventoryState({ isSubmitting: false, error: "Delta must be a whole number.", success: null });
      return;
    }

    const response = await fetch(`/api/admin/products/${product.id}/inventory`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta })
    });

    const result = (await response.json().catch(() => null)) as {
      error?: string;
      data?: { inventoryCount: number };
    } | null;

    if (!response.ok) {
      setInventoryState({
        isSubmitting: false,
        error: result?.error ?? "Unable to adjust inventory right now.",
        success: null
      });
      return;
    }

    setInventoryState({
      isSubmitting: false,
      error: null,
      success: `Inventory adjusted. New count: ${result?.data?.inventoryCount ?? "updated"}.`
    });
    router.refresh();
  }

  return (
    <>
      <form className="admin-settings-form" onSubmit={handleSubmit}>
        <label>
          <span>Product Name</span>
          <input defaultValue={product.name} name="name" required type="text" />
        </label>
        <label>
          <span>Description</span>
          <input defaultValue={product.description} name="description" required type="text" />
        </label>
        <label>
          <span>Price</span>
          <input defaultValue={product.price} min="1" name="price" required type="number" />
        </label>
        <label>
          <span>Compare At Price</span>
          <input
            defaultValue={product.compareAtPrice ?? undefined}
            min="1"
            name="compareAtPrice"
            type="number"
          />
        </label>
        <label>
          <span>Inventory Count</span>
          <input
            defaultValue={product.inventoryCount}
            min="0"
            name="inventoryCount"
            type="number"
          />
        </label>
        <label>
          <span>Image URL</span>
          <input defaultValue={product.imageUrl ?? undefined} name="imageUrl" type="url" />
        </label>
        <label>
          <span>Fabric</span>
          <input defaultValue={product.fabric ?? undefined} name="fabric" type="text" />
        </label>
        <label>
          <span>Occasion</span>
          <input defaultValue={product.occasion ?? undefined} name="occasion" type="text" />
        </label>
        <label>
          <span>Color</span>
          <input defaultValue={product.color ?? undefined} name="color" type="text" />
        </label>
        <label>
          <span>Status</span>
          <select defaultValue={product.status} name="status">
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>

        {state.success ? <p className="admin-form-message success">{state.success}</p> : null}
        {state.error ? <p className="admin-form-message error">{state.error}</p> : null}

        <div className="admin-settings-actions">
          <button className="admin-primary-button" disabled={state.isSubmitting} type="submit">
            {state.isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <form className="admin-settings-form" onSubmit={handleInventoryAdjust}>
        <label>
          <span>Adjust Stock</span>
          <input
            defaultValue={0}
            name="delta"
            placeholder="e.g. 5 to add, -3 to remove"
            required
            step={1}
            type="number"
          />
        </label>

        {inventoryState.success ? (
          <p className="admin-form-message success">{inventoryState.success}</p>
        ) : null}
        {inventoryState.error ? (
          <p className="admin-form-message error">{inventoryState.error}</p>
        ) : null}

        <div className="admin-settings-actions">
          <button
            className="admin-secondary-button"
            disabled={inventoryState.isSubmitting}
            type="submit"
          >
            {inventoryState.isSubmitting ? "Adjusting..." : "Adjust Inventory"}
          </button>
        </div>
      </form>
    </>
  );
}
