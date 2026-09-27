import { useCallback, useEffect, useState } from "react";
import { LogOut, RefreshCw, ShieldCheck } from "lucide-react";
import { ApiError } from "../lib/api";
import { listDocuments } from "./adminApi";
import DocumentViewer from "./DocumentViewer";
import type { AdminKycDocument, AdminSession, ReviewStatus } from "./types";

const PAGE_SIZE = 20;

const TABS: { value: ReviewStatus; label: string }[] = [
  { value: "uploaded", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

interface AdminDashboardProps {
  session: AdminSession;
  onSignOut: () => void;
  onAuthError: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export default function AdminDashboard({
  session,
  onSignOut,
  onAuthError,
}: AdminDashboardProps) {
  const { token, admin } = session;
  const [status, setStatus] = useState<ReviewStatus>("uploaded");
  const [offset, setOffset] = useState(0);
  const [docs, setDocs] = useState<AdminKycDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listDocuments(token, status, PAGE_SIZE, offset);
      setDocs(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onAuthError();
      setError(
        err instanceof ApiError ? err.message : "Could not load documents.",
      );
    } finally {
      setLoading(false);
    }
  }, [token, status, offset, onAuthError]);

  useEffect(() => {
    load();
  }, [load]);

  function changeStatus(next: ReviewStatus) {
    setStatus(next);
    setOffset(0);
  }

  function handleReviewed(updated: AdminKycDocument) {
    // Drop the row from the current queue if it no longer matches the filter.
    setDocs((prev) =>
      prev.filter((d) => (d.id === updated.id ? d.status === updated.status : true)),
    );
  }

  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const canPrev = offset > 0;
  const canNext = docs.length === PAGE_SIZE;

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <span className="admin-badge">
          <ShieldCheck size={16} aria-hidden="true" />
          Balanz Admin
        </span>
        <div className="admin-topbar-right">
          <span className="admin-whoami">{admin.email}</span>
          <button className="text-button" type="button" onClick={onSignOut}>
            <LogOut size={16} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-main-head">
          <div>
            <span className="eyebrow">KYC review</span>
            <h1>Document queue</h1>
          </div>
          <button
            className="button secondary"
            type="button"
            onClick={load}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? "admin-spin" : undefined}
              aria-hidden="true"
            />
            Refresh
          </button>
        </div>

        <div className="admin-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={status === tab.value}
              className={`admin-tab${status === tab.value ? " is-active" : ""}`}
              type="button"
              onClick={() => changeStatus(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error ? <output className="admin-error">{error}</output> : null}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Owner</th>
                <th>Filename</th>
                <th>Uploaded</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.id}>
                  <td className="admin-cap">
                    {doc.document_type.replace(/_/g, " ")}
                  </td>
                  <td className="admin-mono">{doc.user_id.slice(0, 8)}…</td>
                  <td>{doc.original_filename ?? "—"}</td>
                  <td>{formatDate(doc.created_at)}</td>
                  <td className="admin-row-action">
                    <button
                      className="text-button"
                      type="button"
                      onClick={() => setOpenId(doc.id)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && docs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-empty">
                    No {status === "uploaded" ? "pending" : status} documents.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="admin-pager">
          <button
            className="button secondary"
            type="button"
            disabled={!canPrev || loading}
            onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
          >
            Previous
          </button>
          <span className="admin-page-num">Page {page}</span>
          <button
            className="button secondary"
            type="button"
            disabled={!canNext || loading}
            onClick={() => setOffset((o) => o + PAGE_SIZE)}
          >
            Next
          </button>
        </div>
      </main>

      {openId ? (
        <DocumentViewer
          token={token}
          documentId={openId}
          onClose={() => setOpenId(null)}
          onReviewed={handleReviewed}
          onAuthError={onAuthError}
        />
      ) : null}
    </div>
  );
}
