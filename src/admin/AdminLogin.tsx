import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { ApiError } from "../lib/api";
import { AuthLayout } from "../components/AuthLayout";
import { adminLogin } from "./adminApi";
import type { AdminSession } from "./types";

interface AdminLoginProps {
  onSignedIn: (session: AdminSession) => void;
}

export default function AdminLogin({ onSignedIn }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      const session = await adminLogin(email.trim(), password);
      onSignedIn(session);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <form className="auth-card" onSubmit={handleSubmit}>
        <img src="/icon.png" alt="Balanz" />
        <span className="eyebrow">Balanz Admin</span>
        <h2>Reviewer sign in</h2>
        <p>Restricted to compliance staff. Customer credentials won't work here.</p>
        <input
          required
          type="email"
          autoComplete="username"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          required
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className="button primary" disabled={busy}>
          {busy ? "Please wait…" : "Sign in"} <ArrowRight size={18} />
        </button>
        {error && <output>{error}</output>}
      </form>
    </AuthLayout>
  );
}
