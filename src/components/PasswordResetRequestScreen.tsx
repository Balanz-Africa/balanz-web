import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, KeyRound } from "lucide-react";
import { request } from "../lib/api";
import { AuthLayout } from "./AuthLayout";

interface PasswordResetRequestScreenProps {
  initialEmail?: string;
  token?: string;
  onBack: () => void;
}

export function PasswordResetRequestScreen({
  initialEmail = "",
  token,
  onBack,
}: PasswordResetRequestScreenProps) {
  const [email, setEmail] = useState(initialEmail);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");

    try {
      await request(
        "/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        },
        token,
      );
      setMessage(
        "If an account exists for this email, a password reset link has been sent.",
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not request a password reset",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout onBack={onBack} backLabel="Back">
      <form className="auth-card" onSubmit={submit}>
        <KeyRound size={42} color="var(--brand-500)" />
        <span className="eyebrow">Account security</span>
        <h2>Reset your password.</h2>
        <p>
          We will send a secure reset link to your email. The link expires after
          one hour.
        </p>
        <input
          required
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button className="button primary" disabled={busy}>
          {busy ? "Sending…" : "Send reset link"} <ArrowRight size={18} />
        </button>
        {message && <output>{message}</output>}
        {error && <output>{error}</output>}
      </form>
    </AuthLayout>
  );
}
