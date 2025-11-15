// ============================================
// CART TYPES
// ============================================

/**
 * Cart item representation
 * - Stored in localStorage via Zustand persist
 * - stock field is CACHED (may be outdated)
 */
export interface CartItem {
  id: string; // variantId (unique identifier)
  productId: string;
  productName: string;
  productSlug: string;
  variantId: string;
  variantName: string | null;
  price: number;
  quantity: number;
  image: string;
  stock: number; // ⚠️ CACHED - may not match DB
  vendorId: string;
  vendorName: string;
}

/**
 * Vendor group for display
 * - Used for grouping items by vendor (1 Order = 1 Vendor rule)
 */
export interface VendorGroup {
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  subtotal: number;
}

/**
 * Zustand cart store interface
 */
export interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id"> & { id?: string }) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
}

/**
 * Stock validation result (from server)
 */
export interface StockValidationItem {
  variantId: string;
  requestedQuantity: number;
  availableStock: number;
  isAvailable: boolean;
  message?: string;
}

export interface StockValidationResult {
  isValid: boolean;
  items: StockValidationItem[];
  hasWarnings: boolean;
}
