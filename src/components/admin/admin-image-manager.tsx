"use client";

import { useState, type DragEvent } from "react";

type AdminImageManagerProps = {
  imageUrls: string[];
  imageUploading: boolean;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUrlTextChange: (value: string) => void;
  onMakePrimary: (index: number) => void;
  onReorderImages: (fromIndex: number, toIndex: number) => void;
  onRemoveImage: (index: number) => void;
};

export function AdminImageManager({
  imageUrls,
  imageUploading,
  onImageChange,
  onImageUrlTextChange,
  onMakePrimary,
  onReorderImages,
  onRemoveImage
}: AdminImageManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDrop(event: DragEvent<HTMLElement>, dropIndex: number) {
    event.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    onReorderImages(draggedIndex, dropIndex);
    setDraggedIndex(null);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
  }

  return (
    <div className="admin-image-manager">
      <label>
        <span>Gallery Images</span>
        <textarea
          onChange={(event) => onImageUrlTextChange(event.target.value)}
          placeholder="Paste one image URL per line"
          rows={4}
          value={imageUrls.join("\n")}
        />
      </label>

      <p className="admin-image-helper">
        The first image becomes the primary storefront thumbnail. Upload or paste multiple URLs, then drag cards to reorder the gallery.
      </p>

      <label>
        <span>Upload Images</span>
        <input
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          disabled={imageUploading}
          multiple
          onChange={onImageChange}
          type="file"
        />
      </label>

      {imageUploading ? <p className="admin-form-message">Uploading image...</p> : null}

      {imageUrls.length > 0 ? (
        <div className="admin-image-grid">
          {imageUrls.map((url, index) => (
            <article
              className={`admin-image-card ${draggedIndex === index ? "is-dragging" : ""}`}
              draggable
              key={`${url}-${index}`}
              onDragEnd={handleDragEnd}
              onDragOver={(event) => event.preventDefault()}
              onDragStart={() => handleDragStart(index)}
              onDrop={(event) => handleDrop(event, index)}
            >
              <div
                className="admin-image-preview"
                style={{
                  backgroundImage: `url('${url}')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover"
                }}
              />
              <div className="admin-image-meta">
                <span>{index === 0 ? "Primary image" : `Image ${index + 1}`}</span>
                <div className="admin-image-actions">
                  {index > 0 ? (
                    <button className="admin-image-promote" onClick={() => onMakePrimary(index)} type="button">
                      Make primary
                    </button>
                  ) : null}
                  <button className="admin-image-remove" onClick={() => onRemoveImage(index)} type="button">
                    Delete
                  </button>
                </div>
              </div>
              <p className="admin-image-drag-note">Drag to change gallery order</p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
