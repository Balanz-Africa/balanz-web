import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { request } from "../lib/api";
import { AuthLayout } from "./AuthLayout";

interface ResetPasswordScreenProps {
  token: string;
  onComplete: () => void;
}

export function ResetPasswordScreen({
  token,
  onComplete,
}: ResetPasswordScreenProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      await request("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      onComplete();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not reset your password",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-card" onSubmit={submit}>
        <LockKeyhole size={42} color="var(--brand-500)" />
        <span className="eyebrow">New password</span>
        <h2>Choose a new password.</h2>
        <p>Use at least eight characters, including uppercase, lowercase, and a number.</p>
        <input
          required
          minLength={8}
          type="password"
          placeholder="New password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <input
          required
          minLength={8}
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        <button className="button primary" disabled={busy || !token}>
          {busy ? "Updating…" : "Update password"} <ArrowRight size={18} />
        </button>
        {error && <output>{error}</output>}
      </form>
    </AuthLayout>
  );
}
