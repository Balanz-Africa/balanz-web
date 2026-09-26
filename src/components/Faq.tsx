import { useState } from "react";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Is my money and data safe with Balanz?",
    a: "Yes. Balanz uses bank-grade 256-bit encryption, biometric login, and follows regulatory compliance standards. Your funds are held with licensed partners and your data is never sold.",
  },
  {
    q: "Can I connect my existing bank accounts?",
    a: "Balanz gives you a dedicated wallet you can fund from any Nigerian bank in seconds. Full account sync for tracking net worth across banks is rolling out to members first.",
  },
  {
    q: "How much does Balanz cost?",
    a: "Getting started is free — create an account, fund your wallet, and track your spending at no cost. Premium growth and budgeting tools are available on an affordable monthly plan.",
  },
  {
    q: "What can I do with Balanz today?",
    a: "Fund your wallet, buy data and airtime, track where your money goes with automatic categorization, and watch your net worth grow — all from one balanced dashboard.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="container">
        <div className="features-head faq-head">
          <span className="pill pill-brand">Good to know</span>
          <h2 className="section-title" style={{ marginTop: 16 }}>
            Questions, answered.
          </h2>
          <p className="section-lead">
            Everything you might be wondering before you get started.
          </p>
        </div>
        <div className="faq-list">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div className={isOpen ? "faq-item open" : "faq-item"} key={item.q}>
                <button
                  className="faq-q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="faq-num">{i + 1}</span>
                  {item.q}
                  <Plus className="faq-toggle" size={20} />
                </button>
                <div className="faq-a">{item.a}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
