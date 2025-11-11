/**
 * Cart Feature - Main Barrel Export
 *
 * Usage:
 * - Client: import from '@/features/cart/index.client'
 * - Server: import from '@/features/cart/index.server'
 * - Shared: import from '@/features/cart'
 */

// ============================================
// SHARED EXPORTS (types, schemas)
// ============================================

// Schemas
// export { cartSchema } from "./schemas/cart.schema";

// Types
// export type { Cart, CartItem } from "./types/cart.types";

// ============================================
// RE-EXPORTS (for convenience)
// ============================================

// Client exports
export * from "./index.client";

// Server exports
export * from "./index.server";
