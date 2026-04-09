import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth-shell";
import { SignInForm } from "@/components/auth/auth-forms";
import { getCurrentSessionUser } from "@/server/auth/guards";

export default async function SignInPage() {
  const user = await getCurrentSessionUser();

  if (user) {
    redirect(user.role === "ADMIN" ? "/admin" : "/account");
  }

  return (
    <AuthShell
      navigation={[
        { href: "/our-story", label: "Heritage" },
        { href: "/collections", label: "Gallery" },
        { href: "/artisanship", label: "Editorial" }
      ]}
    >
      <section className="auth-split-layout">
        <aside className="auth-visual-panel auth-visual-signin">
          <div className="auth-visual-image auth-visual-silk" />
          <blockquote className="auth-quote">
            “The drape of a thousand stories, woven into the very fabric of our heritage.”
          </blockquote>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-form-intro">
            <h1>Welcome back to Mandala Fashions</h1>
            <p>Enter your details to access your curated collection.</p>
          </div>

          <SignInForm />

          <p className="auth-message">
            Secure email sign-in is currently available. Social sign-in will be added once it is fully configured.
          </p>

          <p className="auth-switch-copy">
            New to Mandala Fashions? <Link href="/auth/sign-up">Create Membership</Link>
          </p>
        </section>
      </section>
    </AuthShell>
  );
}
