// ============================================
// CART TYPES
// ============================================

/**
 * Cart item representation
 * - Mỗi item là 1 variant cụ thể của product
 * - Grouped by vendor cho checkout flow
 */
export interface CartItem {
  id: string; // Unique cart item ID (variantId + timestamp)
  productId: string;
  productName: string;
  productSlug: string;
  variantId: string;
  variantName: string | null;
  price: number;
  quantity: number;
  image: string;
  stock: number; // For validation
  vendorId: string;
  vendorName: string;
}

/**
 * Cart store state interface
 */
export interface CartStore {
  // State
  items: CartItem[];

  // Computed values (getters)
  itemCount: () => number;
  subtotal: () => number;
  getItemsByVendor: () => Record<string, CartItem[]>;

  // Actions
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

/**
 * Vendor group for checkout
 * - 1 Order = 1 Vendor rule
 */
export interface VendorGroup {
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  subtotal: number;
}
