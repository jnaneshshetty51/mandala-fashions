"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type RequestState = {
  error: string | null;
  success: string | null;
  isSubmitting: boolean;
};

function useRequestState(): [RequestState, (nextState: Partial<RequestState>) => void] {
  const [state, setState] = useState<RequestState>({
    error: null,
    success: null,
    isSubmitting: false
  });

  return [
    state,
    (nextState) =>
      setState((current) => ({
        ...current,
        ...nextState
      }))
  ];
}

export function SignInForm() {
  const router = useRouter();
  const [state, setState] = useRequestState();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ error: null, success: null, isSubmitting: true });

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? "")
    };

    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = (await response.json().catch(() => null)) as
      | { error?: string; data?: { role?: string } }
      | null;

    if (!response.ok) {
      setState({
        error: result?.error ?? "Unable to sign in right now.",
        isSubmitting: false
      });
      return;
    }

    router.push(result?.data?.role === "ADMIN" ? "/admin" : "/account");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        <span>Email Address</span>
        <input name="email" type="email" placeholder="curator@heirloom.com" />
      </label>

      <label>
        <div className="auth-inline-label">
          <span>Password</span>
          <Link href="/auth/forgot-password">Forgot?</Link>
        </div>
        <input name="password" type="password" placeholder="•••••••••" />
      </label>

      {state.error ? <p className="auth-message auth-error">{state.error}</p> : null}

      <button className="auth-primary-button" disabled={state.isSubmitting} type="submit">
        {state.isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const [state, setState] = useRequestState();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ error: null, success: null, isSubmitting: true });

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? "")
    };

    const response = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = (await response.json().catch(() => null)) as
      | { error?: string; data?: { role?: string } }
      | null;

    if (!response.ok) {
      setState({
        error: result?.error ?? "Unable to create your membership right now.",
        isSubmitting: false
      });
      return;
    }

    router.push(result?.data?.role === "ADMIN" ? "/admin" : "/account");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        <span>Full Name</span>
        <input name="name" type="text" placeholder="Enter your legal name" />
      </label>

      <label>
        <span>Email Address</span>
        <input name="email" type="email" placeholder="you@heritage.com" />
      </label>

      <label>
        <span>Create Password</span>
        <input name="password" type="password" placeholder="••••••••••••" />
      </label>

      <label className="auth-check">
        <input type="checkbox" />
        <span>
          Join the Weaver&apos;s Circle. Receive personal invitations to boutique showcases and
          exclusive heritage narratives.
        </span>
      </label>

      <label className="auth-check">
        <input required type="checkbox" />
        <span>
          I agree to the <Link href="/terms">Terms of Preservation</Link> and{" "}
          <Link href="/privacy-policy">Privacy Manifesto</Link>.
        </span>
      </label>

      {state.error ? <p className="auth-message auth-error">{state.error}</p> : null}

      <button className="auth-primary-button" disabled={state.isSubmitting} type="submit">
        {state.isSubmitting ? "Joining..." : "Join The Legacy"}
      </button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, setState] = useRequestState();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ error: null, success: null, isSubmitting: true });

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? "")
    };

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = (await response.json().catch(() => null)) as
      | { error?: string; data?: { message?: string } }
      | null;

    if (!response.ok) {
      setState({
        error: result?.error ?? "Unable to process recovery right now.",
        isSubmitting: false
      });
      return;
    }

    setState({
      error: null,
      success: result?.data?.message ?? "Recovery instructions have been prepared.",
      isSubmitting: false
    });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        <span>Email Address</span>
        <input name="email" type="email" placeholder="archivist@heritage.com" />
      </label>

      {state.error ? <p className="auth-message auth-error">{state.error}</p> : null}
      {state.success ? <p className="auth-message auth-success">{state.success}</p> : null}

      <button className="auth-primary-button" disabled={state.isSubmitting} type="submit">
        {state.isSubmitting ? "Sending..." : "Send Recovery Link"}
      </button>
    </form>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignOut() {
    setIsSubmitting(true);
    await fetch("/api/auth/sign-out", {
      method: "POST"
    });
    router.push("/auth/sign-in");
    router.refresh();
  }

  return (
    <button className="secondary-button text-button" disabled={isSubmitting} onClick={handleSignOut} type="button">
      {isSubmitting ? "Signing out..." : "Sign out"}
    </button>
  );
}
