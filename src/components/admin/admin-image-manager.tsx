"use client";

type AdminImageManagerProps = {
  imageUrls: string[];
  imageUploading: boolean;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUrlTextChange: (value: string) => void;
  onMakePrimary: (index: number) => void;
  onRemoveImage: (index: number) => void;
};

export function AdminImageManager({
  imageUrls,
  imageUploading,
  onImageChange,
  onImageUrlTextChange,
  onMakePrimary,
  onRemoveImage
}: AdminImageManagerProps) {
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
        The first image becomes the primary storefront thumbnail. Upload or paste multiple URLs to build the gallery.
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
            <article className="admin-image-card" key={`${url}-${index}`}>
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
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
