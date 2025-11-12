/**
 * Server Action Response Types
 * Generic responses từ Server Actions
 */

import type { SerializedAddress } from "@/features/address/types/address.types";
import type { SerializedRating } from "@/features/ratings/types/rating.types";
import type { Order } from "@/features/orders/types/order.types";
import type { Coupon } from "@/features/coupons/types/coupon.types";

/**
 * Generic Action Response
 *
 * Generic <T> nghĩa là gì?
 * - Thay vì tạo nhiều interface giống nhau, dùng <T> làm placeholder
 * - Khi dùng, thay T bằng type cụ thể: ActionResponse<Address>
 *
 * Example:
 * const res1: ActionResponse<Address> = { success: true, data: address };
 * const res2: ActionResponse<Product[]> = { success: true, data: products };
 */
export interface ActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}

/**
 * Address Action Response
 */
export interface AddressActionResponse extends ActionResponse {
  newAddress?: SerializedAddress;
  address?: SerializedAddress;
  addresses?: SerializedAddress[];
  deletedId?: string;
}

/**
 * Rating Action Response
 */
export interface RatingActionResponse extends ActionResponse {
  rating?: SerializedRating;
  ratings?: SerializedRating[];
  deletedId?: string;
}

/**
 * Order Action Response
 */
export interface OrderActionResponse extends ActionResponse {
  order?: Order;
  orders?: Order[];
  session?: {
    id: string;
    url: string;
  };
}

/**
 * Coupon Action Response
 */
export interface CouponActionResponse extends ActionResponse {
  coupon?: Coupon;
}

/**
 * Product Action Response
 */
export interface ProductActionResponse extends ActionResponse {
  product?: import("@/features/products/types/product.types").Product;
  products?: import("@/features/products/types/product.types").Product[];
}

/**
 * Store Action Response
 */
export interface StoreActionResponse extends ActionResponse {
  store?: import("@/features/stores/types/store.types").Store;
}
