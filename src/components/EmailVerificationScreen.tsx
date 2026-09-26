import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, MailCheck } from "lucide-react";
import { ApiError, request } from "../lib/api";
import { AuthLayout } from "./AuthLayout";

interface EmailVerificationScreenProps {
  email: string;
  onBack: () => void;
  onVerified: () => void;
}

export function EmailVerificationScreen({
  email: initialEmail,
  onBack,
  onVerified,
}: EmailVerificationScreenProps) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setTimeout(
      () => setResendCooldown((seconds) => seconds - 1),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await request("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });
      onVerified();
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Could not verify your email",
      );
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await request("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage("A new verification code has been sent.");
      setResendCooldown(60);
    } catch (resendError) {
      setError(
        resendError instanceof ApiError && resendError.status === 429
          ? "Too many requests. Please wait a few minutes before trying again."
          : resendError instanceof Error
            ? resendError.message
            : "Could not resend the verification code",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout onBack={onBack} backLabel="Back">
      <form className="auth-card" onSubmit={verify}>
        <MailCheck size={42} color="var(--brand-500)" />
        <span className="eyebrow">Verify your email</span>
        <h2>One last step.</h2>
        <p>
          Enter the six-digit code we sent to your email before funding your
          wallet or buying data.
        </p>
        <input
          required
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          required
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          placeholder="6-digit code"
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
        />
        <button className="button primary" disabled={busy}>
          {busy ? "Please wait…" : "Verify email"} <ArrowRight size={18} />
        </button>
        {message && <output>{message}</output>}
        {error && <output>{error}</output>}
        <p>
          Didn’t receive it?{" "}
          <button
            type="button"
            onClick={() => void resend()}
            disabled={busy || resendCooldown > 0}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
