/**
 * Regex patterns for validation
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_VN: /^(0|\+84)[0-9]{9,10}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  URL: /^https?:\/\/.+/,
} as const;

/**
 * Date formats
 */
export const DATE_FORMATS = {
  DISPLAY: "dd/MM/yyyy",
  DISPLAY_TIME: "dd/MM/yyyy HH:mm",
  API: "yyyy-MM-dd",
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;
