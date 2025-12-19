export const PRICE_LIMITS = {
  MIN: 1000,
  MAX: 1000000000, // 1 billion VND
} as const;

export const STOCK_LIMITS = {
  MIN: 0,
  MAX: 999999,
  LOW_STOCK_THRESHOLD: 10,
} as const;
