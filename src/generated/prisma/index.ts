/**
 * Generated Prisma Types - Barrel Export
 *
 * Re-export Prisma generated types for easier importing.
 * Sử dụng types này thay vì tự define để tránh duplicate.
 *
 * @example
 * ```ts
 * import { UserModel, Role, VendorStatus } from "@/generated/prisma";
 * ```
 */

// Models
export type { UserModel } from "./client/models/User";
export type { SessionModel } from "./client/models/Session";
export type { AccountModel } from "./client/models/Account";
export type { VerificationModel } from "./client/models/Verification";
export type { VendorProfileModel } from "./client/models/VendorProfile";
export type { CategoryModel } from "./client/models/Category";
export type { ProductModel } from "./client/models/Product";
export type { ProductVariantModel } from "./client/models/ProductVariant";
export type { ProductImageModel } from "./client/models/ProductImage";
export type { OrderModel } from "./client/models/Order";
export type { OrderItemModel } from "./client/models/OrderItem";
export type { PaymentModel } from "./client/models/Payment";
export type { ReviewModel } from "./client/models/Review";
export type { WishlistModel } from "./client/models/Wishlist";

// Enums (both type and runtime value)
export {
  Role,
  VendorStatus,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  ReviewStatus,
} from "./client/enums";

// Re-export types explicitly for clarity
export type {
  Role as RoleType,
  VendorStatus as VendorStatusType,
  OrderStatus as OrderStatusType,
  PaymentStatus as PaymentStatusType,
  PaymentMethod as PaymentMethodType,
  ReviewStatus as ReviewStatusType,
} from "./client/enums";
