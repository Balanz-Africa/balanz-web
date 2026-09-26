import { ArrowRight, ShieldCheck } from "lucide-react";
import { PhonePreview } from "./PhonePreview";
import { StoreBadges } from "./StoreBadges";
import { TrustBar } from "./TrustBar";
import { Features } from "./Features";
import { SocialProof } from "./SocialProof";
import { Faq } from "./Faq";
import { CtaBand } from "./CtaBand";
import { SiteFooter } from "./SiteFooter";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="pill pill-light">
              <ShieldCheck size={15} /> Your complete money companion
            </span>
            <h1>
              Balance today.
              <br />
              Build tomorrow.
            </h1>
            <p className="hero-lead">
              Manage your money, track your growth, and stay in control — all in one
              beautifully simple app built for how you actually live.
            </p>
            <p className="hero-sub">
              Fund your wallet, buy data, watch your net worth climb. No jargon, no
              clutter.
            </p>
            <div className="hero-actions">
              <button className="btn btn-onblue" onClick={onStart}>
                Get started free <ArrowRight size={17} />
              </button>
            </div>
            <StoreBadges />
          </div>
          <div className="hero-art">
            <PhonePreview />
          </div>
        </div>
      </section>

      <TrustBar />
      <Features />
      <SocialProof />
      <Faq />
      <CtaBand onStart={onStart} />
      <SiteFooter />
    </main>
  );
}
