import type { CartItem, VendorGroup } from "../model/types";
import { ORDER } from "@/shared/lib";

export const SHIPPING_FEE_PER_VENDOR = ORDER.SHIPPING_FEE_PER_VENDOR;
export const PLATFORM_FEE_RATE = ORDER.PLATFORM_FEE_RATE;

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

export function calculateCartTotals(items: CartItem[]) {
  const vendorGroups = groupItemsByVendor(items);
  const subtotal = vendorGroups.reduce((sum, g) => sum + g.subtotal, 0);
  const shippingFee = vendorGroups.length * SHIPPING_FEE_PER_VENDOR;
  // platformFee là phí platform thu từ vendor, không tính vào total của customer
  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE);
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
