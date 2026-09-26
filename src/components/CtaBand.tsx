import { ArrowRight } from "lucide-react";
import { StoreBadges } from "./StoreBadges";

interface CtaBandProps {
  onStart: () => void;
}

export function CtaBand({ onStart }: CtaBandProps) {
  return (
    <section className="cta-wrap">
      <div className="container">
        <div className="cta">
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2>Your financial future is in your hands.</h2>
            <p>
              Join thousands building better money habits with Balanz. Download the
              app or get started on the web in minutes.
            </p>
            <div className="hero-actions" style={{ marginTop: 26 }}>
              <button className="btn btn-onblue" onClick={onStart}>
                Get started free <ArrowRight size={17} />
              </button>
            </div>
            <StoreBadges />
          </div>
          <svg
            className="cta-swoosh"
            viewBox="0 0 200 200"
            fill="none"
            aria-hidden
          >
            <path
              d="M10 150 Q70 120 100 80 T190 20"
              stroke="#fff"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M150 20 L190 20 L190 60"
              stroke="#fff"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
