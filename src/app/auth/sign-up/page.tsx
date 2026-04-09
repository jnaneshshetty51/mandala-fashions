import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth-shell";
import { SignUpForm } from "@/components/auth/auth-forms";
import { getCurrentSessionUser } from "@/server/auth/guards";

export default async function SignUpPage() {
  const user = await getCurrentSessionUser();

  if (user) {
    redirect(user.role === "ADMIN" ? "/admin" : "/account");
  }

  return (
    <AuthShell>
      <section className="auth-split-layout auth-split-soft">
        <aside className="auth-visual-panel auth-visual-signup">
          <div className="auth-visual-image auth-visual-loom" />
          <div className="auth-membership-copy">
            <h2>Preserve the Craft.</h2>
            <p>
              Beyond a transaction, this is a commitment to the continuity of artisanal heritage.
              Members of Mandala Fashions receive curated narratives of every weave.
            </p>
            <ul className="auth-benefit-list">
              <li>
                <strong>Exclusive Access</strong>
                <span>Early previews of limited edition heritage drapes.</span>
              </li>
              <li>
                <strong>Track Your Heritage</strong>
                <span>Seamless order tracking and digital certificates of authenticity.</span>
              </li>
              <li>
                <strong>Loyalty Rewards</strong>
                <span>Earn points towards restoration services and bespoke consultations.</span>
              </li>
            </ul>
          </div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-form-intro">
            <p className="auth-accent-label">New collector</p>
            <h1>Join Mandala Fashions</h1>
            <p>
              Already a member? <Link href="/auth/sign-in">Sign in here</Link>
            </p>
          </div>

          <SignUpForm />

          <div className="auth-bottom-mark">
            <span>Curated by artisans</span>
            <div className="auth-mark-dots">
              <span />
              <span />
            </div>
          </div>
        </section>
      </section>
    </AuthShell>
  );
}
