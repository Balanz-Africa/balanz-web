import { ArrowRight, Database, TrendingUp, Wallet } from "lucide-react";

const FEATURES = [
  {
    icon: Database,
    title: "Smart cash flow",
    kicker: "Automated categorization",
    body: "See where your money goes in real time. Balanz sorts every transaction so you can spot patterns, cut waste, and keep more of what you earn.",
    primary: false,
  },
  {
    icon: TrendingUp,
    title: "The growth curve",
    kicker: "Net worth & investments",
    body: "Track your net worth, monitor investments, and watch your future unfold with clear charts and honest projections — no jargon.",
    primary: true,
  },
  {
    icon: Wallet,
    title: "Intelligent budgets",
    kicker: "Alerts before you overspend",
    body: "Set goals, build budgets, and get a nudge as you near a limit. Stay in control without checking the app every hour.",
    primary: false,
  },
];

export function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="features-head">
          <span className="pill pill-brand">How Balanz helps</span>
          <h2 className="section-title" style={{ marginTop: 16 }}>
            Three tools that keep you balanced.
          </h2>
          <p className="section-lead">
            Everything you need to manage money, grow wealth, and stay in control —
            without the complexity.
          </p>
        </div>
        <div className="feature-grid">
          {FEATURES.map(({ icon: Icon, title, kicker, body, primary }) => (
            <article
              key={title}
              className={primary ? "feature-card is-primary" : "feature-card"}
            >
              <span className="feature-ico">
                <Icon size={24} />
              </span>
              <h3>{title}</h3>
              <p className="feature-kicker">{kicker}</p>
              <p>{body}</p>
              <a className="feature-link" href="#faq">
                Learn more <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
