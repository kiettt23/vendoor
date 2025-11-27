/**
 * Stripe Configuration
 *
 * Server-side Stripe instance for creating checkout sessions, webhooks, etc.
 *
 * Environment Variables:
 * - STRIPE_SECRET_KEY: Stripe secret key (sk_test_xxx for test mode)
 * - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Publishable key (pk_test_xxx)
 */

import Stripe from "stripe";

// Check for Stripe secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn("⚠️  STRIPE_SECRET_KEY not set. Stripe payments will not work.");
}

// Server-side Stripe instance
export const stripe = new Stripe(stripeSecretKey || "sk_test_placeholder", {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

// Payment method types
export const PAYMENT_METHODS = {
  COD: "cod",
  STRIPE: "stripe",
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

// Payment status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
