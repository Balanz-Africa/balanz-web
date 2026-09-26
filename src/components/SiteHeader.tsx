import { Menu, X } from "lucide-react";
import { Brand } from "./Brand";

interface SiteHeaderProps {
  menuOpen: boolean;
  onMenuToggle: () => void;
  onNavigateHome: () => void;
  onStart: () => void;
}

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader({
  menuOpen,
  onMenuToggle,
  onNavigateHome,
  onStart,
}: SiteHeaderProps) {
  const closeMenu = () => {
    if (menuOpen) onMenuToggle();
  };

  return (
    <header className="site-header">
      <button className="brand-button" onClick={onNavigateHome} aria-label="Go to Balanz home">
        <Brand tone="onblue" />
      </button>

      <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
        <button className="btn btn-onblue" onClick={onStart}>
          Get started
        </button>
      </nav>

      <button
        className="menu-button"
        onClick={onMenuToggle}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>
    </header>
  );
}
