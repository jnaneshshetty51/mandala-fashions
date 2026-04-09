"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type FormState = {
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
};

export function CustomerRoleForm({
  customerId,
  currentRole
}: {
  customerId: string;
  currentRole: string;
}) {
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
    const role = String(formData.get("role") ?? "");

    const response = await fetch(`/api/admin/customers/${customerId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role })
    });

    const result = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setState({
        isSubmitting: false,
        error: result?.error ?? "Unable to update role.",
        success: null
      });
      return;
    }

    setState({ isSubmitting: false, error: null, success: "Role updated successfully." });
    router.refresh();
  }

  return (
    <form className="admin-settings-form" onSubmit={handleSubmit}>
      <label>
        <span>Role</span>
        <select defaultValue={currentRole} name="role">
          <option value="USER">USER</option>
          <option value="STYLIST">STYLIST</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </label>

      {state.success ? <p className="admin-form-message success">{state.success}</p> : null}
      {state.error ? <p className="admin-form-message error">{state.error}</p> : null}

      <div className="admin-settings-actions">
        <button className="admin-primary-button" disabled={state.isSubmitting} type="submit">
          {state.isSubmitting ? "Saving..." : "Update Role"}
        </button>
      </div>
    </form>
  );
}
