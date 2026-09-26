import { Star } from "lucide-react";

const STATS = [
  { value: "₦10B+", label: "moved safely for members" },
  { value: "250K+", label: "people building better habits" },
  { value: "4.9/5", label: "average rating on app stores" },
];

const QUOTES = [
  {
    quote:
      "Balanz completely changed how I manage money. I can finally see where my cash goes and actually plan for the future.",
    name: "Tunde A.",
    role: "Product Designer, Lagos",
    initials: "TA",
    tint: "var(--c2)",
  },
  {
    quote:
      "The growth tracking keeps me motivated. It nudges me to make smarter decisions without ever feeling like a chore.",
    name: "Bola S.",
    role: "Software Engineer, Abuja",
    initials: "BS",
    tint: "var(--c3)",
  },
];

function Stars() {
  return (
    <div className="stars" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
      ))}
    </div>
  );
}

export function SocialProof() {
  return (
    <section id="about" className="section social">
      <div className="container social-grid">
        <div>
          <span className="pill pill-light">Real people. Real results.</span>
          <h2 style={{ marginTop: 16 }}>Trusted by thousands building better financial habits.</h2>
          <div className="stat-row">
            {STATS.map((stat) => (
              <div className="stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="quote-grid">
          {QUOTES.map((q) => (
            <figure className="quote-card" key={q.name} style={{ margin: 0 }}>
              <Stars />
              <p style={{ marginTop: 12 }}>&ldquo;{q.quote}&rdquo;</p>
              <figcaption className="quote-who">
                <span
                  aria-hidden
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    background: q.tint,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {q.initials}
                </span>
                <span>
                  <strong>{q.name}</strong>
                  <span>{q.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
