import { useCallback, useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import { clearSession, loadSession, saveSession } from "./adminApi";
import type { AdminSession } from "./types";

/**
 * Self-contained admin sub-app, mounted at /admin (see main.tsx). It shares the
 * public site's API client and design tokens but nothing else — the admin JWT
 * is stored and read only here, isolated from the customer session.
 */
export default function AdminApp() {
  const [session, setSession] = useState<AdminSession | null>(() => loadSession());

  const signIn = useCallback((next: AdminSession) => {
    saveSession(next);
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  if (!session) {
    return <AdminLogin onSignedIn={signIn} />;
  }

  return (
    <AdminDashboard
      session={session}
      onSignOut={signOut}
      onAuthError={signOut}
    />
  );
}
