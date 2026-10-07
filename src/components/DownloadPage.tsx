import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Smartphone } from "lucide-react";
import {
  ANDROID_DOWNLOAD_URL,
  IOS_DOWNLOAD_URL,
  StoreBadges,
} from "./StoreBadges";
import { SiteFooter } from "./SiteFooter";

type Platform = "android" | "ios" | "other";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "other";
}

interface DownloadPageProps {
  onStart: () => void;
}

/**
 * Branded download page. Every link here points at the BACKEND's stable
 * /download/* redirects (see StoreBadges) — so new builds never require editing
 * or redeploying this site. We detect the visitor's platform only to highlight
 * the most likely button; both are always available.
 */
export function DownloadPage({ onStart }: DownloadPageProps) {
  const [platform, setPlatform] = useState<Platform>("other");
  useEffect(() => setPlatform(detectPlatform()), []);

  const primaryHref =
    platform === "ios" ? IOS_DOWNLOAD_URL : ANDROID_DOWNLOAD_URL;
  const primaryLabel =
    platform === "ios" ? "Download for iPhone" : "Download for Android";

  return (
    <main>
      <section className="hero">
        <div className="container" style={{ maxWidth: 720, textAlign: "center" }}>
          <span className="pill pill-light">
            <Smartphone size={15} /> Get the Balanz app
          </span>
          <h1>
            Your money,
            <br />
            on your phone.
          </h1>
          <p className="hero-lead">
            Fund your wallet, send money instantly, and buy data &amp; airtime —
            all in one simple app. Install Balanz in under a minute.
          </p>

          <div
            className="hero-actions"
            style={{ justifyContent: "center", marginTop: 24 }}
          >
            <a className="btn btn-onblue" href={primaryHref}>
              {primaryLabel} <ArrowRight size={17} />
            </a>
          </div>

          <StoreBadges className="download-badges" />

          <p
            className="hero-sub"
            style={{ marginTop: 28, display: "flex", gap: 8, justifyContent: "center" }}
          >
            <ShieldCheck size={16} /> Android installs may ask you to allow
            install from your browser — that&apos;s normal for apps outside the
            Play Store.
          </p>

          <div style={{ marginTop: 32 }}>
            <button className="btn" onClick={onStart}>
              Or use Balanz on the web
            </button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
