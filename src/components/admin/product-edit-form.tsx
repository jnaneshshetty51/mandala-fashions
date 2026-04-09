"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AdminImageManager } from "@/components/admin/admin-image-manager";

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
    imageUrls?: string[];
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

  const [imageUrls, setImageUrls] = useState<string[]>(product.imageUrls ?? (product.imageUrl ? [product.imageUrl] : []));
  const [imageUploading, setImageUploading] = useState(false);
  const [currentQty, setCurrentQty] = useState(product.qty);
  const [inventoryDelta, setInventoryDelta] = useState(0);

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setImageUploading(true);
    setState((s) => ({ ...s, error: null }));
    try {
      const uploadResults = await Promise.all(files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/uploads", { method: "POST", body: formData });
        const result = (await response.json().catch(() => null)) as { data?: { url: string }; error?: string } | null;

        if (!response.ok || !result?.data?.url) {
          throw new Error(result?.error ?? "Image upload failed.");
        }

        return result.data.url;
      }));

      const nextImageUrls = [...imageUrls, ...uploadResults];
      setImageUrls(nextImageUrls);
    } catch (error) {
      setState((s) => ({ ...s, error: error instanceof Error ? error.message : "Image upload failed." }));
    } finally {
      setImageUploading(false);
    }
  }

  function handleImageUrlTextChange(value: string) {
    setImageUrls(
      value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    );
  }

  function handleRemoveImage(index: number) {
    setImageUrls((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function handleMakePrimary(index: number) {
    setImageUrls((current) => {
      const selected = current[index];

      if (!selected) {
        return current;
      }

      return [selected, ...current.filter((_, itemIndex) => itemIndex !== index)];
    });
  }

  function handleReorderImages(fromIndex: number, toIndex: number) {
    setImageUrls((current) => {
      const next = [...current];
      const [movedImage] = next.splice(fromIndex, 1);

      if (!movedImage) {
        return current;
      }

      next.splice(toIndex, 0, movedImage);
      return next;
    });
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

    payload.imageUrls = imageUrls;
    payload.imageUrl = imageUrls[0];

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
    setCurrentQty(Number(formData.get("qty") ?? currentQty));
    router.refresh();
  }

  async function handleInventoryAdjust(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInventoryState({ isSubmitting: true, error: null, success: null });

    const delta = inventoryDelta;

    if (!Number.isInteger(delta)) {
      setInventoryState({ isSubmitting: false, error: "Delta must be a whole number.", success: null });
      return;
    }

    if (delta === 0) {
      setInventoryState({ isSubmitting: false, error: "Enter a positive or negative stock change.", success: null });
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
    setCurrentQty(result?.data?.inventoryCount ?? currentQty);
    setInventoryDelta(0);
    router.refresh();
  }

  return (
    <>
      <form className="admin-settings-form" onSubmit={handleSubmit}>
        <div className="admin-form-section">
          <div className="admin-form-section-header">
            <h3>Catalog details</h3>
            <p>Keep the product story, naming, and storefront presentation accurate.</p>
          </div>
          <div className="admin-form-grid admin-form-grid-two">
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
            <label className="admin-form-grid-span-2">
              <span>Description</span>
              <textarea defaultValue={product.description} name="description" required rows={5} />
            </label>
          </div>
        </div>

        <div className="admin-form-section">
          <div className="admin-form-section-header">
            <h3>Commerce settings</h3>
            <p>Update pricing, stock, status, and operational details in one place.</p>
          </div>
          <div className="admin-form-grid admin-form-grid-three">
            <label>
              <span>Length</span>
              <input defaultValue={product.length || undefined} name="length" type="text" />
            </label>
            <label>
              <span>Colors</span>
              <input defaultValue={product.colors ?? undefined} name="colors" type="text" />
            </label>
            <label>
              <span>Status</span>
              <select defaultValue={product.status} name="status">
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
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
              <span>Qty Snapshot</span>
              <input defaultValue={product.qty} min="0" name="qty" type="number" />
            </label>
          </div>
        </div>

        <AdminImageManager
          imageUploading={imageUploading}
          imageUrls={imageUrls}
        onImageChange={handleImageChange}
        onImageUrlTextChange={handleImageUrlTextChange}
        onMakePrimary={handleMakePrimary}
        onReorderImages={handleReorderImages}
        onRemoveImage={handleRemoveImage}
      />

        {state.success ? <p className="admin-form-message success">{state.success}</p> : null}
        {state.error ? <p className="admin-form-message error">{state.error}</p> : null}

        <div className="admin-settings-actions">
          <button className="admin-primary-button" disabled={state.isSubmitting || imageUploading} type="submit">
            {state.isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <form className="admin-settings-form" onSubmit={handleInventoryAdjust}>
        <div className="admin-form-section">
          <div className="admin-form-section-header">
            <h3>Inventory control</h3>
            <p>Apply stock corrections without editing the main product record.</p>
          </div>
          <div className="admin-stock-summary">
            <div>
              <span>Current stock</span>
              <strong>{currentQty}</strong>
            </div>
            <div className="admin-stock-shortcuts">
              <button className="admin-secondary-button" onClick={() => setInventoryDelta((value) => value + 1)} type="button">
                +1
              </button>
              <button className="admin-secondary-button" onClick={() => setInventoryDelta((value) => value + 5)} type="button">
                +5
              </button>
              <button className="admin-secondary-button" onClick={() => setInventoryDelta((value) => value - 1)} type="button">
                -1
              </button>
              <button className="admin-secondary-button" onClick={() => setInventoryDelta((value) => value - 5)} type="button">
                -5
              </button>
            </div>
          </div>
          <label>
            <span>Adjust Stock</span>
            <input
              name="delta"
              onChange={(event) => setInventoryDelta(Number(event.target.value))}
              placeholder="e.g. 5 to add, -3 to remove"
              required
              step={1}
              type="number"
              value={inventoryDelta}
            />
          </label>
        </div>

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
