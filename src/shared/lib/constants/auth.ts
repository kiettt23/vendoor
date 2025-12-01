/**
 * Auth Constants
 */
export const AUTH = {
  SESSION_COOKIE: "better-auth.session_token",
  SESSION_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
} as const;

/**
 * Multi-account limits
 */
export const ACCOUNT = {
  MAX_ACCOUNTS: 5,
  STORAGE_KEY: "vendoor_accounts",
} as const;
