/**
 * Component Props Types
 * Props cho các components
 *
 * Tại sao cần?
 * - TypeScript check props khi dùng component
 * - Auto-complete trong editor
 * - Catch lỗi sai type props
 */

import type { Product, ProductCardData } from "./product";
import type { Address } from "./address";
import type { RatingModalState } from "./rating";
import type { CartItem } from "./cart";

/**
 * Product Card Props
 */
export interface ProductCardProps {
  product: ProductCardData;
}

/**
 * Rating Modal Props
 */
export interface RatingModalProps {
  ratingModal: RatingModalState | null;
  setRatingModal: (modal: RatingModalState | null) => void;
}

/**
 * Address Modal Props
 */
export interface AddressModalProps {
  setShowAddressModal: (show: boolean) => void;
  editingAddress?: Address | null;
}

/**
 * Order Summary Props
 */
export interface OrderSummaryProps {
  totalPrice: number;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    [key: string]: any; // Allow extra fields
  }>;
}
