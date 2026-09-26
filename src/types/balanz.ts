export type Screen =
  | "landing"
  | "signin"
  | "signup"
  | "verify-email"
  | "forgot-password"
  | "reset-password"
  | "dashboard";

export interface User {
  email: string;
  displayName?: string;
  isVerified?: boolean;
  verificationLevel?: string;
}

export interface AuthPayload {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface Balance {
  balanceFormatted: string;
  balanceMinor: number;
  isFrozen: boolean;
}

export interface DataPlan {
  variationCode: string;
  name: string;
  amountNaira: number;
  validity?: string;
}
