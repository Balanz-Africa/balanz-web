import { ArrowUpRight, LineChart, Plus, Send, PiggyBank, Wallet } from "lucide-react";

const SEGMENTS = [
  { label: "Food & Dining", pct: 32, color: "var(--c1)" },
  { label: "Transport", pct: 20, color: "var(--c2)" },
  { label: "Bills & Utilities", pct: 15, color: "var(--c3)" },
  { label: "Other", pct: 33, color: "var(--c4)" },
];

const CIRC = 2 * Math.PI * 30;

function Donut() {
  let start = 0;
  return (
    <svg width="92" height="92" viewBox="0 0 80 80" role="img" aria-label="Spending by category">
      <g transform="rotate(-90 40 40)">
        {SEGMENTS.map((seg) => {
          const len = (seg.pct / 100) * CIRC;
          const dash = `${len} ${CIRC - len}`;
          const offset = -start;
          start += len;
          return (
            <circle
              key={seg.label}
              cx="40"
              cy="40"
              r="30"
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={dash}
              strokeDashoffset={offset}
            />
          );
        })}
      </g>
    </svg>
  );
}

export function PhonePreview() {
  return (
    <div className="phone-stack">
      <div className="phone">
        <div className="phone-notch" />
        <div className="phone-scr">
          <div className="phone-row">
            <span className="brand brand-ink" style={{ fontSize: 15 }}>
              <img src="/icon.png" alt="" style={{ width: 22, height: 22 }} />
              balanz
            </span>
            <Plus size={18} color="var(--brand-500)" />
          </div>

          <div className="phone-greet">
            <strong>Good morning, Alex</strong>
            <span>Here's your money today</span>
          </div>

          <div className="bal-card">
            <span>Total balance</span>
            <strong>₦412,480.00</strong>
            <span className="bal-delta">
              <ArrowUpRight size={13} /> 12% vs last month
            </span>
          </div>

          <div className="qa">
            {[
              { icon: Wallet, label: "Fund" },
              { icon: Send, label: "Send" },
              { icon: PiggyBank, label: "Save" },
              { icon: LineChart, label: "Grow" },
            ].map(({ icon: Icon, label }) => (
              <span className="qa-item" key={label}>
                <span className="qa-ico">
                  <Icon size={18} />
                </span>
                {label}
              </span>
            ))}
          </div>

          <div className="ov-card">
            <div className="ov-head">
              Spending overview <span>This month</span>
            </div>
            <div className="donut-row">
              <Donut />
              <div className="legend">
                {SEGMENTS.map((seg) => (
                  <span key={seg.label}>
                    <i style={{ background: seg.color }} />
                    {seg.label} · {seg.pct}%
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="phone-mini" aria-label="Net worth trend">
        <span>Net worth</span>
        <strong>₦1.24M</strong>
        <span className="bal-delta">
          <ArrowUpRight size={13} /> 18% this year
        </span>
        <svg width="100%" height="56" viewBox="0 0 180 56" preserveAspectRatio="none" aria-hidden>
          <path
            d="M0 46 L26 40 L52 43 L78 30 L104 33 L130 18 L156 22 L180 6"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0 46 L26 40 L52 43 L78 30 L104 33 L130 18 L156 22 L180 6 L180 56 L0 56 Z"
            fill="rgba(255,255,255,0.18)"
          />
        </svg>
        <div className="range-chips">
          <span>1M</span>
          <span>3M</span>
          <span className="on">6M</span>
          <span>1Y</span>
        </div>
      </div>
    </div>
  );
}
