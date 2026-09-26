import type { ReactNode } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Brand } from "./Brand";

interface AuthLayoutProps {
  onBack?: () => void;
  backLabel?: string;
  children: ReactNode;
}

const HIGHLIGHTS = [
  "Bank-grade security on every transaction",
  "Track your net worth as it grows",
  "Fund your wallet and buy data in seconds",
];

export function AuthLayout({
  onBack,
  backLabel = "Back to Balanz",
  children,
}: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <aside className="auth-visual">
        <div className="auth-visual-inner">
          <Brand tone="onblue" />
          <h2>Balance today. Build tomorrow.</h2>
          <p>
            Manage your money, track your growth, and stay in control — all in one
            beautifully simple app.
          </p>
          <ul className="auth-highlights">
            {HIGHLIGHTS.map((item) => (
              <li key={item}>
                <span className="auth-check">
                  <Check size={14} strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <svg className="auth-swoosh" viewBox="0 0 240 240" fill="none" aria-hidden>
          <path
            d="M10 200 Q90 160 130 100 T230 20"
            stroke="#fff"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M185 20 L230 20 L230 65"
            stroke="#fff"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </aside>

      <div className="auth-panel">
        {onBack && (
          <button
            className="back-button"
            onClick={onBack}
            aria-label={backLabel}
            title={backLabel}
          >
            <ArrowLeft size={20} />
          </button>
        )}
        {children}
      </div>
    </main>
  );
}
