/**
 * Component Props Types
 * Props cho các components
 */

import type { ProductCardData } from "@/features/products/types/product.types";
import type { Address } from "@/features/address/types/address.types";
import type { RatingModalState } from "@/features/ratings/types/rating.types";
import type { CartItem } from "@/features/cart/types/cart.types";

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
  items: Array<
    {
      id: string;
      quantity: number;
      price: number;
    } & Record<string, unknown>
  >;
}
