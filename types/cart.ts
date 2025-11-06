/**
 * Cart Types
 * Giỏ hàng
 */

import type { Product } from "./product";

/**
 * Cart Item - Sản phẩm trong giỏ hàng
 */
export interface CartItem extends Product {
  quantity: number;
}

/**
 * Cart State - Redux state
 */
export interface CartState {
  items: Record<string, number>; // { productId: quantity }
  total: number; // Tổng số sản phẩm
}

/**
 * Cart Summary - Tóm tắt giỏ hàng
 */
export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

/**
 * Add to Cart Data
 */
export interface AddToCartData {
  productId: string;
  quantity: number;
}
