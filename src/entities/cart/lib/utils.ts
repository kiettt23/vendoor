import type { CartItem, VendorGroup, CartTotals } from "../model/types";
import { ORDER } from "@/shared/lib/constants";

/**
 * Nhóm các cart items theo vendor.
 * Dùng để hiển thị cart theo từng shop và tính phí ship per vendor.
 *
 * @param items - Danh sách cart items
 * @returns Mảng VendorGroup, mỗi group chứa items của 1 vendor
 *
 * @example
 * const groups = groupItemsByVendor(cartItems);
 * // [
 * //   { vendorId: "v1", vendorName: "Shop A", items: [...], subtotal: 500000 },
 * //   { vendorId: "v2", vendorName: "Shop B", items: [...], subtotal: 300000 }
 * // ]
 */
export function groupItemsByVendor(items: CartItem[]): VendorGroup[] {
  return items.reduce((acc, item) => {
    const existing = acc.find((g) => g.vendorId === item.vendorId);
    if (existing) {
      existing.items.push(item);
      existing.subtotal += item.price * item.quantity;
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
}

/**
 * Tính tổng tiền giỏ hàng.
 * Bao gồm subtotal, shipping fee, platform fee và total.
 *
 * @param items - Danh sách cart items
 * @returns Object chứa các thông tin tổng tiền
 *
 * @example
 * const totals = calculateCartTotals(cartItems);
 * // {
 * //   subtotal: 800000,      // Tổng tiền hàng
 * //   shippingFee: 60000,    // Phí ship (30k/vendor × 2 vendors)
 * //   platformFee: 80000,    // Platform fee 10% (cho vendor)
 * //   total: 860000,         // Customer trả: subtotal + shipping
 * //   vendorCount: 2,
 * //   itemCount: 5
 * // }
 */
export function calculateCartTotals(items: CartItem[]): CartTotals {
  const vendorGroups = groupItemsByVendor(items);
  const subtotal = vendorGroups.reduce((sum, g) => sum + g.subtotal, 0);
  const shippingFee = vendorGroups.length * ORDER.SHIPPING_FEE_PER_VENDOR;
  // platformFee là phí platform thu từ vendor, không tính vào total của customer
  const platformFee = Math.round(subtotal * ORDER.PLATFORM_FEE_RATE);
  const total = subtotal + shippingFee; // Customer trả: tiền hàng + phí ship

  return {
    subtotal,
    shippingFee,
    platformFee, // Chỉ dùng để hiển thị cho admin/vendor
    total,
    vendorCount: vendorGroups.length,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}
