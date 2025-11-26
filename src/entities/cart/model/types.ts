export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantId: string;
  variantName: string | null;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  vendorId: string;
  vendorName: string;
}

export interface VendorGroup {
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  subtotal: number;
}

export interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id"> & { id?: string }) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
}

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

