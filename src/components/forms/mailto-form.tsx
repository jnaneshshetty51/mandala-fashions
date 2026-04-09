"use client";

import { useState } from "react";

type MailtoField = {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "textarea";
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
};

type MailtoFormProps = {
  recipient?: string;
  subject: string;
  submitLabel: string;
  title: string;
  fields: MailtoField[];
  description?: string;
  extraBodyLines?: string[];
};

function buildMailtoHref({
  recipient,
  subject,
  lines
}: {
  recipient: string;
  subject: string;
  lines: string[];
}) {
  const params = new URLSearchParams({
    subject,
    body: lines.join("\n")
  });

  return `mailto:${recipient}?${params.toString()}`;
}

export function MailtoForm({
  recipient = "info@mandalafashions.com",
  subject,
  submitLabel,
  title,
  fields,
  description,
  extraBodyLines = []
}: MailtoFormProps) {
  const [status, setStatus] = useState("");

  return (
    <form
      className="form-card"
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const bodyLines = [
          `${title}`,
          "",
          ...fields.map((field) => `${field.label}: ${String(formData.get(field.name) ?? "").trim() || "-"}`),
          ...extraBodyLines.map((line) => `${line}`)
        ];

        setStatus("Opening your email app with the request details.");
        window.location.href = buildMailtoHref({
          recipient,
          subject,
          lines: bodyLines
        });
      }}
    >
      <h2>{title}</h2>
      {description ? <p className="form-helper-text">{description}</p> : null}
      <div className="field-grid">
        {fields.map((field) => (
          <label className={field.className} key={field.name}>
            {field.label}
            {field.type === "textarea" ? (
              <textarea
                defaultValue={field.defaultValue}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                rows={5}
              />
            ) : (
              <input
                defaultValue={field.defaultValue}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                type={field.type ?? "text"}
              />
            )}
          </label>
        ))}
      </div>
      <button className="primary-button text-button support-submit" type="submit">
        {submitLabel}
      </button>
      {status ? <p className="form-helper-text">{status}</p> : null}
    </form>
  );
}
