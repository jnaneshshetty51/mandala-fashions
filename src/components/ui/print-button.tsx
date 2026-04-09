"use client";

export function PrintButton({ label = "Print Invoice" }: { label?: string }) {
  return (
    <button
      className="primary-button text-button"
      onClick={() => window.print()}
      type="button"
    >
      {label}
    </button>
  );
}
