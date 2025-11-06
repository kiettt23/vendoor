/**
 * ===================================
 * Type Definitions cho Vendoor App
 * ===================================
 *
 * Centralized type exports
 * Import các types từ file này: import { Product, Order } from '@/types'
 */

// ============================================
// CORE MODELS
// ============================================
export * from "./user";
export * from "./product";
export * from "./store";
export * from "./order";
export * from "./cart";
export * from "./address";
export * from "./rating";
export * from "./coupon";

// ============================================
// ACTION RESPONSES
// ============================================
export * from "./action-response";

// ============================================
// COMPONENT PROPS
// ============================================
export * from "./component-props";

// ============================================
// LEGACY EXPORTS (backward compatibility)
// Giữ lại để không break code cũ
// TODO: Dần dần migrate sang import từ file riêng
// ============================================

/**
 * @deprecated Import from '@/types/cart' instead
 */
export type { CartItem } from "./cart";

/**
 * @deprecated Import from '@/types/address' instead
 */
export type { SerializedAddress } from "./address";

/**
 * @deprecated Import from '@/types/rating' instead
 */
export type { SerializedRating } from "./rating";

/**
 * @deprecated Import from '@/types/product' instead
 */
export type { SerializedProduct } from "./product";
