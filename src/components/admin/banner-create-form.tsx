"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type FormState = {
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
};

export function BannerCreateForm() {
  const router = useRouter();
  const [state, setState] = useState<FormState>({
    isSubmitting: false,
    error: null,
    success: null
  });
  const [customPlacement, setCustomPlacement] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ isSubmitting: true, error: null, success: null });

    const formData = new FormData(event.currentTarget);

    const placement = customPlacement
      ? String(formData.get("placementCustom") ?? "")
      : String(formData.get("placementSelect") ?? "");

    const startsAtRaw = String(formData.get("startsAt") ?? "");
    const endsAtRaw = String(formData.get("endsAt") ?? "");

    const payload: Record<string, unknown> = {
      title: String(formData.get("title") ?? ""),
      subtitle: String(formData.get("subtitle") ?? "") || undefined,
      imageUrl: String(formData.get("imageUrl") ?? "") || undefined,
      href: String(formData.get("href") ?? "") || undefined,
      placement,
      status: String(formData.get("status") ?? "DRAFT"),
      startsAt: startsAtRaw ? new Date(startsAtRaw).toISOString() : undefined,
      endsAt: endsAtRaw ? new Date(endsAtRaw).toISOString() : undefined
    };

    const response = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setState({
        isSubmitting: false,
        error: result?.error ?? "Unable to create banner right now.",
        success: null
      });
      return;
    }

    event.currentTarget.reset();
    setCustomPlacement(false);
    setState({
      isSubmitting: false,
      error: null,
      success: "Banner created successfully."
    });
    router.refresh();
  }

  return (
    <form className="admin-settings-form" onSubmit={handleSubmit}>
      <label>
        <span>Title</span>
        <input name="title" placeholder="Wedding Edit 2026" required type="text" />
      </label>

      <label>
        <span>Subtitle</span>
        <input name="subtitle" placeholder="Explore the season's finest silks." type="text" />
      </label>

      <label>
        <span>Image URL</span>
        <input name="imageUrl" placeholder="https://..." type="url" />
      </label>

      <label>
        <span>Destination URL</span>
        <input name="href" placeholder="/collections/wedding" type="text" />
      </label>

      <label>
        <span>Placement</span>
        {!customPlacement ? (
          <select
            name="placementSelect"
            onChange={(e) => {
              if (e.target.value === "__custom__") {
                setCustomPlacement(true);
              }
            }}
          >
            <option value="homepage.hero">homepage.hero</option>
            <option value="homepage.mid">homepage.mid</option>
            <option value="collections.top">collections.top</option>
            <option value="__custom__">Custom...</option>
          </select>
        ) : (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              autoFocus
              name="placementCustom"
              placeholder="e.g. category.silk.top"
              required
              type="text"
            />
            <button
              onClick={() => setCustomPlacement(false)}
              style={{ whiteSpace: "nowrap" }}
              type="button"
              className="admin-secondary-button"
            >
              Use preset
            </button>
          </div>
        )}
      </label>

      <label>
        <span>Status</span>
        <select name="status">
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
        </select>
      </label>

      <label>
        <span>Starts At</span>
        <input name="startsAt" type="datetime-local" />
      </label>

      <label>
        <span>Ends At</span>
        <input name="endsAt" type="datetime-local" />
      </label>

      {state.success ? <p className="admin-form-message success">{state.success}</p> : null}
      {state.error ? <p className="admin-form-message error">{state.error}</p> : null}

      <div className="admin-settings-actions">
        <button className="admin-primary-button" disabled={state.isSubmitting} type="submit">
          {state.isSubmitting ? "Creating..." : "Create Banner"}
        </button>
      </div>
    </form>
  );
}
