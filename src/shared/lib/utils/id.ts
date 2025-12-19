/**
 * Generate unique order number
 *
 * Format: ORD-YYYYMMDD-XXXXXX
 *
 * @example
 * generateOrderNumber() // "ORD-20251128-A1B2C3"
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${dateStr}-${random}`;
}

/**
 * Generate unique ID with prefix
 *
 * @example
 * generateId("PRD") // "PRD-A1B2C3D4"
 */
export function generateId(prefix: string): string {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${random}`;
}

/**
 * Generate random string
 *
 * @example
 * generateRandomString(8) // "A1B2C3D4"
 */
export function generateRandomString(length: number): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
    .toUpperCase();
}
