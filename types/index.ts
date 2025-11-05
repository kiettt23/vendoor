/**
 * Type Definitions cho Vendoor App
 *
 * Giải thích:
 * - interface: Định nghĩa cấu trúc của object
 * - enum: Tập hợp các giá trị cố định (như OrderStatus)
 * - Generic <T>: Kiểu linh hoạt, có thể thay thế bằng bất kỳ type nào
 */

// ============================================
// DATABASE MODELS (từ Prisma schema)
// ============================================

/**
 * User model - Người dùng từ Clerk
 */
export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  cart: Record<string, number>; // { "productId": quantity }
}

/**
 * Product model - Sản phẩm
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number; // Market Retail Price (giá gốc)
  price: number; // Giá bán
  images: string[];
  category: string;
  inStock: boolean;
  storeId: string;
  createdAt: Date | string; // Date khi từ DB, string khi serialize
  updatedAt: Date | string;
  // Relations (optional - chỉ khi include)
  store?: Store;
  orderItems?: OrderItem[];
  rating?: Rating[];
}

/**
 * Store model - Cửa hàng
 */
export interface Store {
  id: string;
  name: string;
  username: string;
  logo: string;
  description: string;
  userId: string;
  plan: StorePlan;
  isActive: boolean;
  isApproved: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Relations
  products?: Product[];
  orders?: Order[];
}

/**
 * Address model - Địa chỉ giao hàng
 */
export interface Address {
  id: string;
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  userId: string;
  createdAt: Date | string;
}

/**
 * Rating model - Đánh giá sản phẩm
 */
export interface Rating {
  id: string;
  rating: number; // 1-5 stars
  review: string;
  userId: string;
  productId: string;
  orderId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Relations
  user?: Pick<User, "id" | "name" | "image">; // Chỉ lấy một số field
  product?: Pick<Product, "id" | "name">;
}

/**
 * Order model - Đơn hàng
 */
export interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  userId: string;
  storeId: string;
  addressId: string;
  isPaid: boolean;
  paymentMethod: PaymentMethod;
  createdAt: Date | string;
  updatedAt: Date | string;
  isCouponUsed: boolean;
  coupon: Record<string, any>;
  // Relations
  orderItems?: OrderItem[];
  address?: Address;
  store?: Pick<Store, "name" | "username">;
  user?: User;
}

/**
 * OrderItem model - Chi tiết đơn hàng
 */
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  // Relations
  product?: Pick<Product, "id" | "name" | "images" | "price">;
}

/**
 * Coupon model - Mã giảm giá
 */
export interface Coupon {
  id: string;
  code: string;
  discount: number; // Percentage (0-100)
  expiresAt: Date | string;
  isPublic: boolean;
  forNewUser: boolean;
  forMember: boolean;
}

// ============================================
// ENUMS
// ============================================

/**
 * Order status - Trạng thái đơn hàng
 */
export enum OrderStatus {
  ORDER_PLACED = "ORDER_PLACED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

/**
 * Payment method - Phương thức thanh toán
 */
export enum PaymentMethod {
  COD = "COD", // Cash on Delivery
  STRIPE = "STRIPE",
}

/**
 * Store plan - Gói cửa hàng
 */
export enum StorePlan {
  FREE = "FREE",
  PLUS = "PLUS",
}

// ============================================
// SERVER ACTION RESPONSES
// ============================================

/**
 * Generic response từ Server Actions
 *
 * Generic <T> nghĩa là gì?
 * - Thay vì tạo nhiều interface giống nhau, dùng <T> làm placeholder
 * - Khi dùng, thay T bằng type cụ thể: ActionResponse<Address>
 *
 * Example:
 * const res1: ActionResponse<Address> = { success: true, data: address };
 * const res2: ActionResponse<Product[]> = { success: true, data: products };
 */
export interface ActionResponse<T = any> {
  success: boolean;
  error?: string; // Optional - chỉ có khi success = false
  message?: string; // Optional - message cho user
  data?: T; // Optional - data trả về (type linh hoạt)
}

/**
 * Response cho Address actions
 */
export interface AddressActionResponse extends ActionResponse {
  newAddress?: Address;
  address?: Address;
  addresses?: Address[];
  deletedId?: string;
}

/**
 * Response cho Rating actions
 */
export interface RatingActionResponse extends ActionResponse {
  rating?: Rating;
  ratings?: Rating[];
  deletedId?: string;
}

/**
 * Response cho Order actions
 */
export interface OrderActionResponse extends ActionResponse {
  order?: Order;
  orders?: Order[];
  session?: any; // Stripe session
}

/**
 * Response cho Coupon actions
 */
export interface CouponActionResponse extends ActionResponse {
  coupon?: Coupon;
}

// ============================================
// COMPONENT PROPS
// ============================================

/**
 * Props cho components
 *
 * Tại sao cần?
 * - TypeScript check props khi dùng component
 * - Auto-complete trong editor
 * - Catch lỗi sai type props
 */

export interface ProductCardProps {
  product: Product;
}

export interface RatingModalProps {
  ratingModal: {
    productId: string;
    orderId: string;
  } | null;
  setRatingModal: (modal: RatingModalProps["ratingModal"]) => void;
}

export interface AddressModalProps {
  setShowAddressModal: (show: boolean) => void;
  editingAddress?: Address | null;
}

export interface OrderSummaryProps {
  totalPrice: number;
  items: (Product & { quantity: number })[]; // Product + quantity field
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * CartItem - Product trong giỏ hàng
 */
export interface CartItem extends Product {
  quantity: number;
}

/**
 * SerializedModel - Model đã serialize Date → string
 *
 * Omit<T, K>: Bỏ field K khỏi type T
 * Record<K, V>: Object với key type K và value type V
 *
 * Example:
 * type WithoutDates = Omit<Product, 'createdAt' | 'updatedAt'>
 */
export type SerializedAddress = Omit<Address, "createdAt"> & {
  createdAt: string;
};

export type SerializedRating = Omit<Rating, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type SerializedProduct = Omit<Product, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
