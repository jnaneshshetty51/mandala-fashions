"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type FormState = {
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
};

export function CustomerNoteForm({ customerId }: { customerId: string }) {
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
    const note = String(formData.get("note") ?? "").trim();

    if (!note) {
      setState({ isSubmitting: false, error: "Note cannot be empty.", success: null });
      return;
    }

    if (note.length > 500) {
      setState({ isSubmitting: false, error: "Note cannot exceed 500 characters.", success: null });
      return;
    }

    const response = await fetch(`/api/admin/customers/${customerId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note })
    });

    const result = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setState({
        isSubmitting: false,
        error: result?.error ?? "Unable to add note right now.",
        success: null
      });
      return;
    }

    event.currentTarget.reset();
    setState({
      isSubmitting: false,
      error: null,
      success: "Note added successfully."
    });
    router.refresh();
  }

  return (
    <form className="admin-settings-form" onSubmit={handleSubmit}>
      <label>
        <span>Note</span>
        <textarea
          maxLength={500}
          name="note"
          placeholder="Add a CRM note about this customer..."
          required
          rows={3}
        />
      </label>

      {state.success ? <p className="admin-form-message success">{state.success}</p> : null}
      {state.error ? <p className="admin-form-message error">{state.error}</p> : null}

      <div className="admin-settings-actions">
        <button className="admin-primary-button" disabled={state.isSubmitting} type="submit">
          {state.isSubmitting ? "Saving..." : "Add Note"}
        </button>
      </div>
    </form>
  );
}
