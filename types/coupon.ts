/**
 * Coupon Types
 * Mã giảm giá
 */

export interface Coupon {
  code: string; // Primary key
  description: string;
  discount: number; // Percentage (0-100)
  expiresAt: Date | string;
  isPublic: boolean;
  forNewUser: boolean;
  forMember: boolean;
  createdAt: Date | string;
}

/**
 * Coupon Form Data
 */
export interface CouponFormData {
  code: string;
  description: string;
  discount: number;
  expiresAt: Date | string;
  isPublic: boolean;
  forNewUser: boolean;
  forMember: boolean;
}

/**
 * Applied Coupon - Coupon đã áp dụng
 */
export interface AppliedCoupon {
  code: string;
  discount: number;
  discountAmount: number; // Số tiền giảm được
}
