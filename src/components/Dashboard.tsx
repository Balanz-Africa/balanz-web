import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, CheckCircle2, Database, LogOut } from "lucide-react";
import { request } from "../lib/api";
import type { Balance, DataPlan, User } from "../types/balanz";
import { Brand } from "./Brand";

interface DashboardProps {
  user: User;
  token: string;
  balance: Balance | null;
  notice: string;
  busy: boolean;
  onSignOut: () => void;
  onBalanceChange: (balance: Balance) => void;
  onNotice: (notice: string) => void;
  onBusyChange: (busy: boolean) => void;
  onVerifyEmail: () => void;
  onForgotPassword: () => void;
}

export function Dashboard({
  user,
  token,
  balance,
  notice,
  busy,
  onSignOut,
  onBalanceChange,
  onNotice,
  onBusyChange,
  onVerifyEmail,
  onForgotPassword,
}: DashboardProps) {
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("mtn");
  const [phone, setPhone] = useState("");
  const [plans, setPlans] = useState<DataPlan[]>([]);
  const [plansAreStale, setPlansAreStale] = useState(false);
  const [planError, setPlanError] = useState("");
  const [plansRetryKey, setPlansRetryKey] = useState(0);

  const refreshBalance = async () =>
    onBalanceChange(await request<Balance>("/wallet/balance", {}, token));

  useEffect(() => {
    setPlanError("");
    setPlans([]);
    setPlansAreStale(false);
    request<{ plans: DataPlan[]; stale: boolean }>(
      `/data/plans/${network}`,
      {},
      token,
    )
      .then((catalog) => {
        setPlans(catalog.plans);
        setPlansAreStale(catalog.stale);
      })
      .catch((error) =>
        setPlanError(
          error instanceof Error ? error.message : "Could not load plans",
        ),
      );
  }, [network, token, plansRetryKey]);

  const fund = async (event: FormEvent) => {
    event.preventDefault();
    onBusyChange(true);
    try {
      const data = await request<{
        virtualAccount: { accountNumber: string; bankName?: string };
      }>(
        "/funding/initialize",
        {
          method: "POST",
          body: JSON.stringify({
            amountKobo: Math.round(Number(amount) * 100),
          }),
        },
        token,
      );
      onNotice(
        `Send ₦${Number(amount).toLocaleString()} to ${data.virtualAccount.accountNumber}${data.virtualAccount.bankName ? ` (${data.virtualAccount.bankName})` : ""}. This temporary account expires soon.`,
      );
    } catch (error) {
      onNotice(
        error instanceof Error
          ? error.message
          : "Funding could not be initialized",
      );
    } finally {
      onBusyChange(false);
    }
  };

  const buy = async (plan: DataPlan) => {
    onBusyChange(true);
    try {
      const data = await request<{ status: string; amountFormatted: string }>(
        "/data/orders",
        {
          method: "POST",
          body: JSON.stringify({
            network,
            variationCode: plan.variationCode,
            phone,
            idempotencyKey: crypto.randomUUID(),
          }),
        },
        token,
      );
      onNotice(
        data.status === "success"
          ? `Data purchase successful for ${data.amountFormatted}.`
          : `Purchase is ${data.status}. We will update it when the provider responds.`,
      );
      await refreshBalance();
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Data purchase failed");
    } finally {
      onBusyChange(false);
    }
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <Brand />
        <div>
          <span>{user.email}</span>
          <button onClick={onSignOut}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </header>
      <section className="balance-card">
        <span>Available balance</span>
        <strong>{balance?.balanceFormatted ?? "—"}</strong>
        <p>
          {user.isVerified
            ? "Wallet ready for data purchases."
            : "Verify your email to enable wallet activity."}
        </p>
        {!user.isVerified && (
          <button className="button secondary" onClick={onVerifyEmail}>
            Verify email
          </button>
        )}
      </section>
      {notice && (
        <div className="notice">
          <CheckCircle2 size={18} />
          {notice}
        </div>
      )}
      <div className="dashboard-grid">
        <section className="panel">
          <h2>Fund wallet</h2>
          <p>Get temporary transfer details for the amount you need.</p>
          <form onSubmit={fund}>
            <input
              required
              min="100"
              type="number"
              placeholder="Amount in naira"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <button className="button primary" disabled={busy}>
              Get account details <ArrowRight size={17} />
            </button>
          </form>
        </section>
        <section className="panel">
          <h2>Buy data</h2>
          <select
            value={network}
            onChange={(event) => setNetwork(event.target.value)}
          >
            <option value="mtn">MTN</option>
            <option value="airtel">Airtel</option>
            <option value="glo">Glo</option>
            <option value="9mobile">9mobile</option>
          </select>
          <input
            required
            placeholder="Recipient phone number"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          {planError && (
            <>
              <output>{planError}</output>
              <button
                type="button"
                className="button secondary"
                onClick={() => setPlansRetryKey((key) => key + 1)}
              >
                Retry loading plans
              </button>
            </>
          )}
          {plansAreStale && (
            <p className="empty-plans">
              Showing recently cached plans. Prices will be confirmed at
              checkout.
            </p>
          )}
          <div className="catalog">
            {plans.map((plan) => (
              <button
                key={plan.variationCode}
                disabled={!phone || busy}
                onClick={() => void buy(plan)}
              >
                <span>
                  <strong>{plan.name}</strong>
                  <small>{plan.validity ?? network.toUpperCase()}</small>
                </span>
                <b>₦{plan.amountNaira.toLocaleString()}</b>
              </button>
            ))}
          </div>
          {!planError && plans.length === 0 && (
            <p className="empty-plans">
              <Database size={16} /> Loading available plans…
            </p>
          )}
        </section>
        <section className="panel">
          <h2>Account security</h2>
          <p>
            Need to change your password? We will send a secure reset link to{" "}
            {user.email}.
          </p>
          <button
            type="button"
            className="button secondary"
            onClick={onForgotPassword}
          >
            Send password reset link
          </button>
        </section>
      </div>
    </main>
  );
}
