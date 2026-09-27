/** Admin back-office types — mirrors the backend AdminKycDocumentSummary + login result. */

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export interface AdminSession {
  admin: AdminUser;
  token: string;
}

/** One KYC document as returned by the admin review endpoints (never exposes the object key). */
export interface AdminKycDocument {
  id: string;
  user_id: string;
  document_type: string;
  status: string;
  file_size: number;
  content_type: string;
  original_filename: string | null;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminDocumentView {
  document: AdminKycDocument;
  url: string;
  expires_in: number;
}

/** Review queues, matching the backend status values. */
export type ReviewStatus = "uploaded" | "approved" | "rejected";
