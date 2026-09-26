import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { request } from "../lib/api";

export function WaitlistForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("Joining…");
    try {
      await request("/waitlist", {
        method: "POST",
        body: JSON.stringify({ ...form, source: "website" }),
      });
      setStatus("You’re on the launch list.");
      setForm({ name: "", email: "", phone: "" });
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Could not join the list",
      );
    }
  };

  return (
    <section id="join" className="waitlist">
      <div>
        <span className="eyebrow">LAUNCHING SOON</span>
        <h2>Stay in the loop.</h2>
        <p>Join the list for Balanz launch updates and beta news.</p>
      </div>
      <form onSubmit={submit}>
        <input
          required
          placeholder="Your name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <input
          required
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          required
          type="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
        />
        <label>
          <input required type="checkbox" /> I agree to receive Balanz launch
          updates.
        </label>
        <button className="button dark">
          Join launch list <ArrowRight size={18} />
        </button>
        {status && <output>{status}</output>}
      </form>
    </section>
  );
}
