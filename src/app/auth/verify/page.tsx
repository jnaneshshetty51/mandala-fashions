import Link from "next/link";

import { AuthShell } from "@/components/auth-shell";

export default function VerifyPage() {
  return (
    <AuthShell centerBrand>
      <section className="auth-verify-layout">
        <div className="auth-verify-panel">
          <h1>Verify Your Identity</h1>
          <p>A one-time code has been sent to your registered email/phone</p>

          <div className="auth-otp-row" aria-label="Verification code">
            {Array.from({ length: 6 }).map((_, index) => (
              <input key={index} maxLength={1} placeholder="•" type="text" />
            ))}
          </div>

          <p className="auth-timer">
            Resend Code in <span>01:59</span>
          </p>

          <button className="auth-primary-button" type="button">
            Verify & Continue
          </button>

          <Link className="auth-back-link auth-back-center" href="/auth/sign-in">
            Back to secure login
          </Link>
        </div>

        <div className="auth-security-row">
          <span>End-to-end encrypted</span>
          <span>Boutique security standard</span>
        </div>
      </section>
    </AuthShell>
  );
}
