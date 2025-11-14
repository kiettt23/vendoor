import type { CartItem, VendorGroup } from "../types";

// ============================================
// CART CALCULATIONS
// ============================================

/**
 * Calculate total items count in cart
 */
export function calculateItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Calculate cart subtotal (before shipping, fees)
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

/**
 * Group cart items by vendor
 * - Important for "1 Order = 1 Vendor" rule
 * - Returns map of vendorId → items[]
 */
export function groupItemsByVendor(
  items: CartItem[]
): Record<string, CartItem[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.vendorId]) {
      acc[item.vendorId] = [];
    }
    acc[item.vendorId].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);
}

/**
 * Get vendor groups with calculated subtotals
 * - Used for checkout summary
 */
export function getVendorGroups(items: CartItem[]): VendorGroup[] {
  const grouped = groupItemsByVendor(items);

  return Object.entries(grouped).map(([vendorId, vendorItems]) => ({
    vendorId,
    vendorName: vendorItems[0].vendorName, // All items have same vendorName
    items: vendorItems,
    subtotal: calculateSubtotal(vendorItems),
  }));
}

// ============================================
// CART VALIDATION
// ============================================

/**
 * Validate quantity against stock
 * - Returns clamped quantity (1 <= quantity <= stock)
 */
export function validateQuantity(quantity: number, stock: number): number {
  return Math.max(1, Math.min(quantity, stock));
}

/**
 * Check if item exists in cart by variantId
 */
export function findItemByVariant(
  items: CartItem[],
  variantId: string
): CartItem | undefined {
  return items.find((item) => item.variantId === variantId);
}

/**
 * Generate unique cart item ID
 */
export function generateCartItemId(variantId: string): string {
  return `${variantId}-${Date.now()}`;
}
