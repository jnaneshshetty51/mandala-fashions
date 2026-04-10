"use client";

import { useState } from "react";

export function BulkActivateButton({ draftCount }: { draftCount: number }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [activated, setActivated] = useState(0);

  async function handleClick() {
    if (state === "loading") return;
    setState("loading");

    const response = await fetch("/api/admin/products/bulk-activate", { method: "POST" });
    const result = (await response.json().catch(() => null)) as { data?: { activated: number } } | null;

    if (response.ok && result?.data) {
      setActivated(result.data.activated);
      setState("done");
      setTimeout(() => window.location.reload(), 1200);
    } else {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <span className="admin-form-message success" style={{ padding: "0.5rem 1rem", display: "inline-block" }}>
        {activated} product{activated !== 1 ? "s" : ""} activated. Refreshing...
      </span>
    );
  }

  if (state === "error") {
    return (
      <span className="admin-form-message error" style={{ padding: "0.5rem 1rem", display: "inline-block" }}>
        Failed to activate. Try again.
      </span>
    );
  }

  return (
    <button
      className="admin-primary-button"
      disabled={state === "loading"}
      onClick={handleClick}
      type="button"
    >
      {state === "loading" ? "Activating..." : `Publish ${draftCount} Draft${draftCount !== 1 ? "s" : ""}`}
    </button>
  );
}
