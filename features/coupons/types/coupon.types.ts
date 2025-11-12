/**
 * Coupon Types
 */

export interface Coupon {
  code: string;
  description: string;
  discount: number;
  expiresAt: Date | string;
  isPublic: boolean;
  forNewUser: boolean;
  forMember: boolean;
  createdAt: Date | string;
}

export interface AppliedCoupon {
  code: string;
  discount: number;
  discountAmount: number;
}
