"use client";

import { useState } from "react";

type EmailCaptureFormProps = {
  buttonLabel: string;
  source: string;
  subject: string;
  placeholder?: string;
};

export function EmailCaptureForm({
  buttonLabel,
  source,
  subject,
  placeholder = "Enter email address"
}: EmailCaptureFormProps) {
  const [email, setEmail] = useState("");

  return (
    <form
      className="fashion-newsletter-form"
      onSubmit={(event) => {
        event.preventDefault();

        const params = new URLSearchParams({
          subject,
          body: `Newsletter signup request\n\nEmail: ${email || "-"}\nSource: ${source}`
        });

        window.location.href = `mailto:info@mandalafashions.com?${params.toString()}`;
      }}
    >
      <input
        onChange={(event) => setEmail(event.target.value)}
        placeholder={placeholder}
        required
        type="email"
        value={email}
      />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
}
