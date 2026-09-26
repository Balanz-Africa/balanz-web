import { Brand } from "./Brand";

const FOOTER_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Brand tone="ink" />
            <p className="footer-tag" style={{ marginTop: 10 }}>
              Balance today. Build tomorrow.
            </p>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            {FOOTER_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Balanz. All rights reserved.
      </div>
    </footer>
  );
}
