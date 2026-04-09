"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AdminImageManager } from "@/components/admin/admin-image-manager";

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
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ isSubmitting: true, error: null, success: null });

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
    };

    const response = await fetch("/api/products", {
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
        error: result?.error ?? "Unable to create product right now.",
        success: null
      });
      return;
    }

    event.currentTarget.reset();
    setImageUrls([]);

    if (result?.data?.id) {
      router.push(`/admin/products/${result.data.id}`);
      return;
    }

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
      <label>
        <span>Description</span>
        <input name="description" placeholder="Describe the weave, finish, and styling." required type="text" />
      </label>
      <label>
        <span>Length</span>
        <input name="length" placeholder="5.5 metres" type="text" />
      </label>
      <label>
        <span>Colors</span>
        <input name="colors" placeholder="Deep Green, Gold" type="text" />
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
        <span>Qty</span>
        <input min="0" name="qty" placeholder="6" type="number" />
      </label>
      <AdminImageManager
        imageUploading={imageUploading}
        imageUrls={imageUrls}
        onImageChange={handleImageChange}
        onImageUrlTextChange={handleImageUrlTextChange}
        onRemoveImage={handleRemoveImage}
      />

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
