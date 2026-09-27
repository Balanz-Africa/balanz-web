import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { ApiError } from "../lib/api";
import { approveDocument, getDocument, rejectDocument } from "./adminApi";
import type { AdminDocumentView, AdminKycDocument } from "./types";

interface DocumentViewerProps {
  token: string;
  documentId: string;
  onClose: () => void;
  onReviewed: (updated: AdminKycDocument) => void;
  onAuthError: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentViewer({
  token,
  documentId,
  onClose,
  onReviewed,
  onAuthError,
}: DocumentViewerProps) {
  const [view, setView] = useState<AdminDocumentView | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    let active = true;
    setView(null);
    setLoadError(null);
    getDocument(token, documentId)
      .then((data) => {
        if (active) setView(data);
      })
      .catch((err) => {
        if (!active) return;
        if (err instanceof ApiError && err.status === 401) return onAuthError();
        setLoadError(
          err instanceof ApiError ? err.message : "Could not load document.",
        );
      });
    return () => {
      active = false;
    };
  }, [token, documentId, onAuthError]);

  function handleError(err: unknown, fallback: string) {
    if (err instanceof ApiError && err.status === 401) return onAuthError();
    setActionError(err instanceof ApiError ? err.message : fallback);
  }

  async function handleApprove() {
    if (busy) return;
    setActionError(null);
    setBusy("approve");
    try {
      onReviewed(await approveDocument(token, documentId));
      onClose();
    } catch (err) {
      handleError(err, "Could not approve the document.");
    } finally {
      setBusy(null);
    }
  }

  async function handleReject() {
    if (busy) return;
    if (reason.trim().length < 3) {
      setActionError("Please provide a rejection reason (at least 3 characters).");
      return;
    }
    setActionError(null);
    setBusy("reject");
    try {
      onReviewed(await rejectDocument(token, documentId, reason.trim()));
      onClose();
    } catch (err) {
      handleError(err, "Could not reject the document.");
    } finally {
      setBusy(null);
    }
  }

  const doc = view?.document;
  const isPending = doc?.status === "uploaded";

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
      <div className="admin-modal">
        <header className="admin-modal-head">
          <div>
            <h2>{doc ? doc.document_type.replace(/_/g, " ") : "Document"}</h2>
            {doc ? (
              <p className="admin-modal-sub">
                {doc.original_filename ?? "Unnamed"} · {formatBytes(doc.file_size)} ·{" "}
                <span className={`admin-status admin-status--${doc.status}`}>
                  {doc.status}
                </span>
              </p>
            ) : null}
          </div>
          <button
            className="admin-icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="admin-modal-body">
          {loadError ? <output className="admin-error">{loadError}</output> : null}
          {!view && !loadError ? (
            <div className="admin-loading">
              <Loader2 size={22} className="admin-spin" aria-hidden="true" />
              Generating secure preview…
            </div>
          ) : null}
          {view ? <DocumentPreview view={view} /> : null}
        </div>

        {doc ? (
          <footer className="admin-modal-foot">
            {doc.rejection_reason ? (
              <p className="admin-reason">
                Previous reason: {doc.rejection_reason}
              </p>
            ) : null}
            {actionError ? (
              <output className="admin-error">{actionError}</output>
            ) : null}

            {isPending && showReject ? (
              <div className="admin-reject-box">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason shown to the customer (e.g. blurry scan, name mismatch)…"
                  rows={3}
                />
              </div>
            ) : null}

            {isPending ? (
              <div className="admin-actions">
                {showReject ? (
                  <>
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => setShowReject(false)}
                      disabled={busy !== null}
                    >
                      Cancel
                    </button>
                    <button
                      className="button danger"
                      type="button"
                      onClick={handleReject}
                      disabled={busy !== null}
                    >
                      {busy === "reject" ? (
                        <Loader2 size={16} className="admin-spin" aria-hidden="true" />
                      ) : (
                        "Confirm rejection"
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => setShowReject(true)}
                      disabled={busy !== null}
                    >
                      Reject
                    </button>
                    <button
                      className="button primary"
                      type="button"
                      onClick={handleApprove}
                      disabled={busy !== null}
                    >
                      {busy === "approve" ? (
                        <Loader2 size={16} className="admin-spin" aria-hidden="true" />
                      ) : (
                        <>
                          <Check size={16} aria-hidden="true" />
                          Approve
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <p className="admin-decided">
                This document was already {doc.status}.
              </p>
            )}
          </footer>
        ) : null}
      </div>
    </div>
  );
}

function DocumentPreview({ view }: { view: AdminDocumentView }) {
  const { document, url } = view;
  if (document.content_type.startsWith("image/")) {
    return <img className="admin-preview-img" src={url} alt="KYC document" />;
  }
  if (document.content_type === "application/pdf") {
    return (
      <iframe className="admin-preview-frame" src={url} title="KYC document" />
    );
  }
  return (
    <a className="button secondary" href={url} target="_blank" rel="noreferrer">
      Open file in new tab
    </a>
  );
}
