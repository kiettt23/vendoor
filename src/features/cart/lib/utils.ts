import type { CartItem, VendorGroup } from "../types";

// ============================================
// CONSTANTS
// ============================================

export const SHIPPING_FEE_PER_VENDOR = 30_000; // 30k VND per vendor
export const PLATFORM_FEE_RATE = 0.02; // 2% platform commission

// ============================================
// CART CALCULATIONS
// ============================================

/**
 * Group cart items by vendor
 */
export function groupItemsByVendor(items: CartItem[]): VendorGroup[] {
  const grouped = items.reduce((acc, item) => {
    const existingGroup = acc.find((g) => g.vendorId === item.vendorId);

    if (existingGroup) {
      existingGroup.items.push(item);
      existingGroup.subtotal += item.price * item.quantity;
    } else {
      acc.push({
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        items: [item],
        subtotal: item.price * item.quantity,
      });
    }

    return acc;
  }, [] as VendorGroup[]);

  return grouped;
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(items: CartItem[]) {
  const vendorGroups = groupItemsByVendor(items);
  const subtotal = vendorGroups.reduce((sum, group) => sum + group.subtotal, 0);
  const shippingFee = vendorGroups.length * SHIPPING_FEE_PER_VENDOR;
  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE);
  const total = subtotal + shippingFee + platformFee;

  return {
    subtotal,
    shippingFee,
    platformFee,
    total,
    vendorCount: vendorGroups.length,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

/**
 * Client-side quantity validation
 * - Check against CACHED stock (fast but may be outdated)
 */
export function validateQuantityClient(
  quantity: number,
  cachedStock: number
): { isValid: boolean; message?: string } {
  if (quantity < 1) {
    return { isValid: false, message: "Số lượng phải lớn hơn 0" };
  }

  if (quantity > cachedStock) {
    return {
      isValid: false,
      message: `Chỉ còn ${cachedStock} sản phẩm (dữ liệu có thể chưa cập nhật)`,
    };
  }

  return { isValid: true };
}
