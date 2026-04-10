"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AdminImageManager } from "@/components/admin/admin-image-manager";

type FormState = {
  isSubmitting: boolean;
  isRedirecting: boolean;
  error: string | null;
  success: string | null;
};

export function ProductCreateForm() {
  const router = useRouter();
  const [state, setState] = useState<FormState>({
    isSubmitting: false,
    isRedirecting: false,
    error: null,
    success: null
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);

  function parseTags(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

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
    setState({ isSubmitting: true, isRedirecting: false, error: null, success: null });

    const formData = new FormData(event.currentTarget);
    const payload = {
      category: String(formData.get("category") ?? ""),
      material: String(formData.get("material") ?? ""),
      type: String(formData.get("type") ?? ""),
      variant: String(formData.get("variant") ?? "") || undefined,
      description: String(formData.get("description") ?? ""),
      length: String(formData.get("length") ?? "") || undefined,
      colors: String(formData.get("colors") ?? "") || undefined,
      price: Number(formData.get("price") ?? 0),
      sku: String(formData.get("sku") ?? ""),
      qty: Number(formData.get("qty") ?? 0),
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      status: String(formData.get("status") ?? "DRAFT"),
      vendor: String(formData.get("vendor") ?? "") || undefined,
      tags: parseTags(String(formData.get("tags") ?? "")),
      seoTitle: String(formData.get("seoTitle") ?? "") || undefined,
      seoDescription: String(formData.get("seoDescription") ?? "") || undefined,
      publishAt: String(formData.get("publishAt") ?? "") || undefined
    };

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = (await response.json().catch(() => null)) as { error?: string; data?: { id?: string } } | null;

    if (!response.ok) {
      setState({
        isSubmitting: false,
        isRedirecting: false,
        error: result?.error ?? "Unable to create product right now.",
        success: null
      });
      return;
    }

    event.currentTarget.reset();
    setImageUrls([]);

    if (result?.data?.id) {
      setState({
        isSubmitting: false,
        isRedirecting: true,
        error: null,
        success: "Product created successfully. Opening the editor..."
      });
      window.location.assign(`/admin/products/${result.data.id}`);
      return;
    }

    setState({
      isSubmitting: false,
      isRedirecting: false,
      error: null,
      success: "Product created successfully. It is now available in the storefront catalog."
    });
    router.refresh();
  }

  return (
    <form className="admin-settings-form" onSubmit={handleSubmit}>
      <div className="admin-form-section">
        <div className="admin-form-section-header">
          <h3>Core details</h3>
          <p>Set the basic catalog fields used across the storefront and inventory tools.</p>
        </div>
        <div className="admin-form-grid admin-form-grid-two">
          <label>
            <span>Category</span>
            <input name="category" placeholder="Wedding Sarees" required type="text" />
          </label>
          <label>
            <span>Material</span>
            <input name="material" placeholder="Silk" required type="text" />
          </label>
          <label>
            <span>Type</span>
            <input name="type" placeholder="Banarasi Saree" required type="text" />
          </label>
          <label>
            <span>Variant</span>
            <input name="variant" placeholder="Emerald Bridal Edit" type="text" />
          </label>
          <label className="admin-form-grid-span-2">
            <span>Description</span>
            <textarea
              name="description"
              placeholder="Describe the weave, finish, styling notes, and what makes this piece special."
              required
              rows={5}
            />
          </label>
        </div>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-header">
          <h3>Merchandising</h3>
          <p>Control pricing, availability, and publishing state before this product goes live.</p>
        </div>
        <div className="admin-form-grid admin-form-grid-three">
          <label>
            <span>Length</span>
            <input name="length" placeholder="5.5 metres" type="text" />
          </label>
          <label>
            <span>Colors</span>
            <input name="colors" placeholder="Deep Green, Gold" type="text" />
          </label>
          <label>
            <span>Status</span>
            <select defaultValue="DRAFT" name="status">
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
          <label>
            <span>Price</span>
            <input min="1" name="price" placeholder="42500" required type="number" />
          </label>
          <label>
            <span>SKU</span>
            <input name="sku" placeholder="MANDALA-001" required type="text" />
          </label>
          <label>
            <span>Opening Qty</span>
            <input min="0" name="qty" placeholder="6" type="number" />
          </label>
        </div>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-header">
          <h3>Search & organization</h3>
          <p>Add vendor, tags, SEO details, and a scheduled publish time for better merchandising control.</p>
        </div>
        <div className="admin-form-grid admin-form-grid-two">
          <label>
            <span>Vendor</span>
            <input name="vendor" placeholder="Mandala Atelier" type="text" />
          </label>
          <label>
            <span>Publish At</span>
            <input name="publishAt" type="datetime-local" />
          </label>
          <label className="admin-form-grid-span-2">
            <span>Tags</span>
            <input name="tags" placeholder="bridal, silk, festive, handloom" type="text" />
          </label>
          <label className="admin-form-grid-span-2">
            <span>SEO Title</span>
            <input name="seoTitle" placeholder="Banarasi Saree for Bridal & Festive Wear | Mandala" type="text" />
          </label>
          <label className="admin-form-grid-span-2">
            <span>SEO Description</span>
            <textarea
              name="seoDescription"
              placeholder="Short search result description for this product page."
              rows={3}
            />
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
        <button className="admin-primary-button" disabled={state.isSubmitting || state.isRedirecting || imageUploading} type="submit">
          {state.isSubmitting ? "Creating..." : state.isRedirecting ? "Opening..." : "Create Product"}
        </button>
      </div>
    </form>
  );
}
