export type { CartItem, VendorGroup, CartStore, StockValidationItem, StockValidationResult } from "./model";
export { useCartStore, useCart } from "./model";
export { groupItemsByVendor, calculateCartTotals, SHIPPING_FEE_PER_VENDOR, PLATFORM_FEE_RATE } from "./lib";

