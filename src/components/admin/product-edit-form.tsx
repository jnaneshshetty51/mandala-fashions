"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

type ProductEditFormProps = {
  product: {
    id: string;
    category: string | null;
    material: string | null;
    type: string;
    variant: string;
    description: string;
    length: string;
    colors: string | null;
    price: number;
    sku: string;
    qty: number;
    imageUrl: string | null;
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

  const [imageUrl, setImageUrl] = useState<string>(product.imageUrl ?? "");
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(product.imageUrl ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setImageUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/uploads", { method: "POST", body: formData });
    const result = (await response.json().catch(() => null)) as { data?: { url: string }; error?: string } | null;

    setImageUploading(false);

    if (!response.ok || !result?.data?.url) {
      setState((s) => ({ ...s, error: result?.error ?? "Image upload failed." }));
      setImagePreview(product.imageUrl ?? null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setImageUrl(result.data.url);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ isSubmitting: true, error: null, success: null });

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {
      category: String(formData.get("category") ?? ""),
      material: String(formData.get("material") ?? ""),
      type: String(formData.get("type") ?? ""),
      variant: String(formData.get("variant") ?? ""),
      description: String(formData.get("description") ?? ""),
      length: String(formData.get("length") ?? ""),
      colors: String(formData.get("colors") ?? ""),
      price: Number(formData.get("price") ?? 0),
      sku: String(formData.get("sku") ?? ""),
      status: String(formData.get("status") ?? "DRAFT"),
      qty: Number(formData.get("qty") ?? 0)
    };

    if (imageUrl) payload.imageUrl = imageUrl;

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
          <span>Category</span>
          <input defaultValue={product.category ?? undefined} name="category" required type="text" />
        </label>
        <label>
          <span>Material</span>
          <input defaultValue={product.material ?? undefined} name="material" required type="text" />
        </label>
        <label>
          <span>Type</span>
          <input defaultValue={product.type} name="type" required type="text" />
        </label>
        <label>
          <span>Variant</span>
          <input defaultValue={product.variant || undefined} name="variant" type="text" />
        </label>
        <label>
          <span>Description</span>
          <input defaultValue={product.description} name="description" required type="text" />
        </label>
        <label>
          <span>Length</span>
          <input defaultValue={product.length || undefined} name="length" type="text" />
        </label>
        <label>
          <span>Colors</span>
          <input defaultValue={product.colors ?? undefined} name="colors" type="text" />
        </label>
        <label>
          <span>Price</span>
          <input defaultValue={product.price} min="1" name="price" required type="number" />
        </label>
        <label>
          <span>SKU</span>
          <input defaultValue={product.sku} name="sku" required type="text" />
        </label>
        <label>
          <span>Qty</span>
          <input defaultValue={product.qty} min="0" name="qty" type="number" />
        </label>
        <label>
          <span>Product Image</span>
          <input
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            disabled={imageUploading}
            onChange={handleImageChange}
            ref={fileInputRef}
            type="file"
          />
        </label>
        {imageUploading ? <p className="admin-form-message">Uploading image...</p> : null}
        {imagePreview && !imageUploading ? (
          <div style={{ marginBottom: "0.5rem" }}>
            <img alt="Preview" src={imagePreview} style={{ maxHeight: 120, maxWidth: 200, borderRadius: 6, border: "1px solid var(--admin-border)" }} />
          </div>
        ) : null}
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
