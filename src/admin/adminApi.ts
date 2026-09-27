/** Admin API helpers + session storage, layered over the shared request() client. */
import { request } from "../lib/api";
import type {
  AdminDocumentView,
  AdminKycDocument,
  AdminSession,
  AdminUser,
  ReviewStatus,
} from "./types";

const TOKEN_KEY = "balanz_admin_token";
const ADMIN_KEY = "balanz_admin_user";

/**
 * The admin token is kept in sessionStorage (not localStorage): it survives a
 * page refresh but is cleared when the tab closes, limiting how long a token
 * that guards KYC PII lives in a browser that could be exposed to XSS.
 */
export function loadSession(): AdminSession | null {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const raw = sessionStorage.getItem(ADMIN_KEY);
    if (!token || !raw) return null;
    return { token, admin: JSON.parse(raw) as AdminUser };
  } catch {
    return null;
  }
}

export function saveSession(session: AdminSession): void {
  sessionStorage.setItem(TOKEN_KEY, session.token);
  sessionStorage.setItem(ADMIN_KEY, JSON.stringify(session.admin));
}

export function clearSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_KEY);
}

export function adminLogin(
  email: string,
  password: string,
): Promise<AdminSession> {
  return request<AdminSession>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function listDocuments(
  token: string,
  status: ReviewStatus,
  limit: number,
  offset: number,
): Promise<AdminKycDocument[]> {
  const query = new URLSearchParams({
    status,
    limit: String(limit),
    offset: String(offset),
  });
  return request<AdminKycDocument[]>(
    `/admin/kyc/documents?${query.toString()}`,
    {},
    token,
  );
}

export function getDocument(
  token: string,
  documentId: string,
): Promise<AdminDocumentView> {
  return request<AdminDocumentView>(
    `/admin/kyc/documents/${documentId}`,
    {},
    token,
  );
}

export function approveDocument(
  token: string,
  documentId: string,
): Promise<AdminKycDocument> {
  return request<AdminKycDocument>(
    `/admin/kyc/documents/${documentId}/approve`,
    { method: "POST" },
    token,
  );
}

export function rejectDocument(
  token: string,
  documentId: string,
  reason: string,
): Promise<AdminKycDocument> {
  return request<AdminKycDocument>(
    `/admin/kyc/documents/${documentId}/reject`,
    { method: "POST", body: JSON.stringify({ reason }) },
    token,
  );
}
