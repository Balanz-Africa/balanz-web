import { ShieldCheck, Lock, Fingerprint, BadgeCheck } from "lucide-react";

const ITEMS = [
  { icon: Lock, label: "Bank-grade 256-bit encryption" },
  { icon: Fingerprint, label: "Biometric login" },
  { icon: BadgeCheck, label: "Regulatory compliance" },
];

export function TrustBar() {
  return (
    <section id="security" className="trust-wrap">
      <div className="container">
        <div className="trust-card">
          <div className="trust-lead">
            <span className="trust-lead-ico">
              <ShieldCheck size={22} />
            </span>
            <span>
              <strong>Trusted. Secure. Always.</strong>
              <span>Your money and data are protected at every step.</span>
            </span>
          </div>
          {ITEMS.map(({ icon: Icon, label }) => (
            <div className="trust-item" key={label}>
              <Icon size={20} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
