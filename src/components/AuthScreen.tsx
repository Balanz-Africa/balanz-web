import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { ApiError, request } from "../lib/api";
import { AuthLayout } from "./AuthLayout";
import type { AuthPayload, Screen } from "../types/balanz";

interface AuthScreenProps {
  mode: Extract<Screen, "signin" | "signup">;
  onBack: () => void;
  onSwitch: () => void;
  onVerifyEmail: (email: string) => void;
  onForgotPassword: (email?: string) => void;
  onAuthenticated: (payload: AuthPayload) => void;
  
}

export function AuthScreen({
  mode,
  onBack,
  onSwitch,
  onVerifyEmail,
  onForgotPassword,
  onAuthenticated,
}: AuthScreenProps) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = await request<AuthPayload>(
        `/auth/${mode === "signin" ? "signin" : "signup"}`,
        {
          method: "POST",
          body: JSON.stringify(
            mode === "signin"
              ? { email: form.email, password: form.password }
              : {
                  email: form.email,
                  password: form.password,
                  displayName: form.name,
                },
          ),
        },
      );
      onAuthenticated(payload);
    } catch (submitError) {
      if (
        mode === "signup" &&
        submitError instanceof ApiError &&
        submitError.status === 409
      ) {
        setError("This email is already registered.");
        return;
      }
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Authentication failed",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout onBack={onBack} backLabel="Back to Balanz">
      <form className="auth-card" onSubmit={submit}>
        <img src="/icon.png" alt="Balanz" />
        <span className="eyebrow">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </span>
        <h2>
          {mode === "signin"
            ? "Pick up where you left off."
            : "Start building better habits."}
        </h2>
        {mode === "signup" && (
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        )}
        <input
          required
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          required
          minLength={8}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) =>
            setForm({ ...form, password: event.target.value })
          }
        />
        <button className="button primary" disabled={busy}>
          {busy
            ? "Please wait…"
            : mode === "signin"
              ? "Sign in"
              : "Create account"}{" "}
          <ArrowRight size={18} />
        </button>
        {error && <output>{error}</output>}
        {mode === "signup" &&
          error === "This email is already registered." && (
            <button
              type="button"
              className="button secondary"
              onClick={() => onVerifyEmail(form.email)}
            >
              Verify this email instead
            </button>
          )}
        {mode === "signin" && (
          <button
            type="button"
            className="text-button"
            onClick={() => onForgotPassword(form.email)}
          >
            Forgot password?
          </button>
        )}
        <p>
          {mode === "signin" ? "New to Balanz?" : "Already have an account?"}{" "}
          <button type="button" onClick={onSwitch}>
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
