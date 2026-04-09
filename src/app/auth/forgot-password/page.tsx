import Link from "next/link";

import { AuthShell } from "@/components/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/auth-forms";

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <section className="auth-recovery-layout">
        <div className="auth-recovery-copy">
          <p className="auth-accent-label">Recovery Access</p>
          <h1>Forgot your Mandala Fashions password?</h1>
          <p>
            Enter your email address and we will assist you in reclaiming your curated collection.
          </p>

          <ForgotPasswordForm />

          <Link className="auth-back-link" href="/auth/sign-in">
            Return to sign in
          </Link>

          <div className="auth-note-box">
            <p>
              “Tradition is not the worship of ashes, but the preservation of fire.” Rest assured,
              your heritage profile is securely held within our digital vault.
            </p>
          </div>
        </div>

        <div className="auth-recovery-art" aria-hidden="true" />
      </section>
    </AuthShell>
  );
}
