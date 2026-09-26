const APP_STORE_URL = "#";
const PLAY_STORE_URL = "#";

function AppleGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 2.98-.83.94-2.18 1.66-3.3 1.57-.14-1.12.42-2.29 1.08-3.02.75-.85 2.06-1.48 3.34-1.53zM20.9 17.02c-.55 1.27-.81 1.83-1.52 2.95-.99 1.56-2.39 3.5-4.12 3.51-1.54.02-1.93-1-4.02-.99-2.09.01-2.52 1.01-4.06.99-1.73-.02-3.05-1.77-4.04-3.32C.36 16.9-.06 12.02 1.65 9.44c1.05-1.6 2.7-2.53 4.26-2.53 1.59 0 2.59 1.02 3.9 1.02 1.27 0 2.05-1.02 3.89-1.02 1.4 0 2.87.76 3.92 2.08-3.44 1.88-2.88 6.79.28 8.01z" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg width="20" height="22" viewBox="0 0 24 24" aria-hidden>
      <path d="M3.6 1.8 13.3 12 3.6 22.2c-.35-.2-.6-.6-.6-1.15V2.95c0-.55.25-.95.6-1.15z" fill="#00d3ff" />
      <path d="M17.1 8.2 13.3 12l3.8 3.8 3.1-1.78c.9-.52.9-1.52 0-2.04L17.1 8.2z" fill="#ffce00" />
      <path d="M3.6 1.8c.3-.17.7-.16 1.1.07l12.4 6.33L13.3 12 3.6 1.8z" fill="#00f076" />
      <path d="M13.3 12l3.8 3.8-12.4 6.33c-.4.23-.8.24-1.1.07L13.3 12z" fill="#ff3a44" />
    </svg>
  );
}

export function StoreBadges({ className }: { className?: string }) {
  return (
    <div className={className ? `store-badges ${className}` : "store-badges"}>
      <a className="store-badge" href={APP_STORE_URL} aria-label="Download on the App Store">
        <AppleGlyph />
        <span>
          <small>Download on the</small>
          <strong>App Store</strong>
        </span>
      </a>
      <a className="store-badge" href={PLAY_STORE_URL} aria-label="Get it on Google Play">
        <PlayGlyph />
        <span>
          <small>Get it on</small>
          <strong>Google Play</strong>
        </span>
      </a>
    </div>
  );
}
