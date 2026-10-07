import { useEffect, useState } from "react";
import { AuthScreen } from "./components/AuthScreen";
import { Dashboard } from "./components/Dashboard";
import { EmailVerificationScreen } from "./components/EmailVerificationScreen";
import { DownloadPage } from "./components/DownloadPage";
import { LandingPage } from "./components/LandingPage";
import { PasswordResetRequestScreen } from "./components/PasswordResetRequestScreen";
import { ResetPasswordScreen } from "./components/ResetPasswordScreen";
import { SiteHeader } from "./components/SiteHeader";
import { request } from "./lib/api";
import { pathForScreen, screenFromPath } from "./lib/routing";
import type { AuthPayload, Balance, Screen, User } from "./types/balanz";

export default function App() {
  const [screen, setScreen] = useState<Screen>(() =>
    screenFromPath(window.location.pathname),
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [pendingAuth, setPendingAuth] = useState<AuthPayload | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const navigate = (
    next: Screen,
    query?: Record<string, string | undefined>,
  ) => {
    setNotice("");
    setScreen(next);
    setMenuOpen(false);
    const search = new URLSearchParams();
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value) search.set(key, value);
    });
    const path =
      pathForScreen(next) + (search.toString() ? "?" + search.toString() : "");
    window.history.pushState({}, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handlePopState = () => {
      setScreen(screenFromPath(window.location.pathname));
      setMenuOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (screen === "dashboard" && !user) {
      setScreen("signin");
      window.history.replaceState({}, "", pathForScreen("signin"));
    }
  }, [screen, user]);

  useEffect(() => {
    if (screen !== "dashboard" || !token) return;
    request<Balance>("/wallet/balance", {}, token)
      .then(setBalance)
      .catch((error) =>
        setNotice(
          error instanceof Error ? error.message : "Could not load wallet",
        ),
      );
  }, [screen, token]);

  const handleAuthenticated = (payload: AuthPayload) => {
    if (!payload.user.isVerified) {
      setPendingAuth(payload);
      navigate("verify-email", {
        email: payload.user.email,
        returnTo: "dashboard",
      });
      return;
    }

    setToken(payload.tokens.accessToken);
    setUser(payload.user);
    navigate("dashboard");
  };

  if (screen === "signin" || screen === "signup") {
    return (
      <AuthScreen
        mode={screen}
        onBack={() => navigate("landing")}
        onSwitch={() => navigate(screen === "signin" ? "signup" : "signin")}
        onVerifyEmail={(email) => {
          setPendingAuth(null);
          navigate("verify-email", { email, returnTo: "signin" });
        }}
        onForgotPassword={(email) => navigate("forgot-password", { email })}
        onAuthenticated={handleAuthenticated}
      />
    );
  }

  if (screen === "verify-email") {
    const query = new URLSearchParams(window.location.search);
    const email = pendingAuth?.user.email ?? query.get("email") ?? "";
    const returnToDashboard =
      query.get("returnTo") === "dashboard" && Boolean(user && token);

    return (
      <EmailVerificationScreen
        email={email}
        onBack={() => navigate(returnToDashboard ? "dashboard" : "signin")}
        onVerified={async () => {
          if (!pendingAuth) {
            if (!returnToDashboard || !user || !token) {
              navigate("signin");
              return;
            }

            const verifiedUser = await request<User>("/auth/me", {}, token).catch(
              () => ({
                ...user,
                isVerified: true,
                verificationLevel: "email_verified",
              }),
            );
            setUser(verifiedUser);
            navigate("dashboard");
            return;
          }

          setToken(pendingAuth.tokens.accessToken);
          const verifiedUser = await request<User>(
            "/auth/me",
            {},
            pendingAuth.tokens.accessToken,
          ).catch(() => ({
            ...pendingAuth.user,
            isVerified: true,
            verificationLevel: "email_verified",
          }));
          setUser(verifiedUser);
          setPendingAuth(null);
          navigate("dashboard");
        }}
      />
    );
  }

  if (screen === "forgot-password") {
    const email = new URLSearchParams(window.location.search).get("email") ?? "";

    return (
      <PasswordResetRequestScreen
        initialEmail={email}
        token={token || undefined}
        onBack={() => navigate(user ? "dashboard" : "signin")}
      />
    );
  }

  if (screen === "download") {
    return (
      <div className="site-shell">
        <SiteHeader
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((open) => !open)}
          onNavigateHome={() => navigate("landing")}
          onStart={() => navigate("signin")}
        />
        <DownloadPage onStart={() => navigate("signin")} />
      </div>
    );
  }

  if (screen === "reset-password") {
    const resetToken =
      new URLSearchParams(window.location.search).get("token") ?? "";

    return (
      <ResetPasswordScreen
        token={resetToken}
        onComplete={() => navigate("signin")}
      />
    );
  }

  if (screen === "dashboard" && user) {
    return (
      <Dashboard
        user={user}
        token={token}
        balance={balance}
        notice={notice}
        busy={busy}
        onSignOut={() => {
          setToken("");
          setUser(null);
          setBalance(null);
          navigate("landing");
        }}
        onBalanceChange={setBalance}
        onNotice={setNotice}
        onBusyChange={setBusy}
        onVerifyEmail={() =>
          navigate("verify-email", {
            email: user.email,
            returnTo: "dashboard",
          })
        }
        onForgotPassword={() =>
          navigate("forgot-password", { email: user.email })
        }
      />
    );
  }

  return (
    <div className="site-shell">
      <SiteHeader
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
        onNavigateHome={() => navigate("landing")}
        onStart={() => navigate("signin")}
      />
      <LandingPage onStart={() => navigate("signin")} />
    </div>
  );
}