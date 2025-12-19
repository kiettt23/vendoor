import { describe, it, expect } from "vitest";
import {
  calculateCommission,
  prepareOrderData,
  validateStatusTransition,
  formatShippingAddress,
  formatOrderStatus,
} from "../lib/utils";

// ============================================================================
// calculateCommission - Tính phí platform 2%
// ============================================================================

describe("calculateCommission - Tính phí platform 2%", () => {
  it("calculates 2% correctly - tính đúng 2%", () => {
    expect(calculateCommission(100000)).toBe(2000);
  });

  it("calculates for large amounts - tính cho số tiền lớn", () => {
    expect(calculateCommission(1000000)).toBe(20000);
  });

  it("rounds to nearest VND - làm tròn đến VND gần nhất", () => {
    // 12345 * 0.02 = 246.9 → 247
    expect(calculateCommission(12345)).toBe(247);
  });

  it("handles zero subtotal - xử lý subtotal = 0", () => {
    expect(calculateCommission(0)).toBe(0);
  });

  it("handles small amounts - xử lý số tiền nhỏ", () => {
    // 1000 * 0.02 = 20
    expect(calculateCommission(1000)).toBe(20);
  });
});

// ============================================================================
// prepareOrderData - Chuẩn bị dữ liệu đơn hàng
// ============================================================================

describe("prepareOrderData - Chuẩn bị dữ liệu đơn hàng", () => {
  const mockItems = [
    {
      productId: "p1",
      productName: "Áo thun",
      variantId: "v1",
      variantName: "Đỏ - M",
      price: 100000,
      quantity: 2,
    },
    {
      productId: "p2",
      productName: "Quần jean",
      variantId: "v2",
      variantName: "Xanh - L",
      price: 200000,
      quantity: 1,
    },
  ];

  const shippingInfo = {
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "test@example.com",
    address: "123 Đường ABC",
    ward: "Phường 1",
    district: "Quận 1",
    city: "TP.HCM",
    note: "Giao giờ hành chính",
  };

  it("calculates subtotal correctly - tính đúng subtotal", () => {
    const data = prepareOrderData("vendor-1", mockItems, "customer-1", shippingInfo);
    // (100000 * 2) + (200000 * 1) = 400000
    expect(data.subtotal).toBe(400000);
  });

  it("includes shipping fee - bao gồm phí ship", () => {
    const data = prepareOrderData("vendor-1", mockItems, "customer-1", shippingInfo);
    expect(data.shippingFee).toBe(30000); // 30k per vendor
  });

  it("calculates platform fee - tính phí platform", () => {
    const data = prepareOrderData("vendor-1", mockItems, "customer-1", shippingInfo);
    // 400000 * 0.02 = 8000
    expect(data.platformFee).toBe(8000);
  });

  it("calculates vendor earnings - tính thu nhập vendor", () => {
    const data = prepareOrderData("vendor-1", mockItems, "customer-1", shippingInfo);
    // 400000 - 8000 = 392000
    expect(data.vendorEarnings).toBe(392000);
  });

  it("calculates total - tính tổng (subtotal + shipping)", () => {
    const data = prepareOrderData("vendor-1", mockItems, "customer-1", shippingInfo);
    // 400000 + 30000 = 430000
    expect(data.total).toBe(430000);
  });

  it("transforms items correctly - chuyển đổi items đúng", () => {
    const data = prepareOrderData("vendor-1", mockItems, "customer-1", shippingInfo);
    expect(data.items).toHaveLength(2);
    expect(data.items[0].subtotal).toBe(200000); // 100000 * 2
    expect(data.items[1].subtotal).toBe(200000); // 200000 * 1
  });

  it("includes shipping info - bao gồm thông tin giao hàng", () => {
    const data = prepareOrderData("vendor-1", mockItems, "customer-1", shippingInfo);
    expect(data.shippingName).toBe("Nguyễn Văn A");
    expect(data.shippingPhone).toBe("0901234567");
    expect(data.shippingAddress).toBe("123 Đường ABC");
    expect(data.shippingCity).toBe("TP.HCM");
    expect(data.note).toBe("Giao giờ hành chính");
  });

  it("handles empty items array - xử lý mảng items rỗng", () => {
    const data = prepareOrderData("vendor-1", [], "customer-1", shippingInfo);
    expect(data.subtotal).toBe(0);
    expect(data.platformFee).toBe(0);
    expect(data.vendorEarnings).toBe(0);
    expect(data.total).toBe(30000); // Only shipping fee
  });
});

// ============================================================================
// validateStatusTransition - Kiểm tra chuyển trạng thái đơn hàng
// ============================================================================

describe("validateStatusTransition - Kiểm tra chuyển trạng thái", () => {
  describe("Valid transitions - Các chuyển trạng thái hợp lệ", () => {
    it("PENDING → PROCESSING (xác nhận đơn)", () => {
      const result = validateStatusTransition("PENDING", "PROCESSING");
      expect(result.isValid).toBe(true);
    });

    it("PENDING → CANCELLED (hủy đơn mới)", () => {
      const result = validateStatusTransition("PENDING", "CANCELLED");
      expect(result.isValid).toBe(true);
    });

    it("PROCESSING → SHIPPED (giao hàng)", () => {
      const result = validateStatusTransition("PROCESSING", "SHIPPED");
      expect(result.isValid).toBe(true);
    });

    it("PROCESSING → CANCELLED (hủy đơn đang xử lý)", () => {
      const result = validateStatusTransition("PROCESSING", "CANCELLED");
      expect(result.isValid).toBe(true);
    });

    it("SHIPPED → DELIVERED (đã giao)", () => {
      const result = validateStatusTransition("SHIPPED", "DELIVERED");
      expect(result.isValid).toBe(true);
    });

    it("DELIVERED → REFUNDED (hoàn tiền)", () => {
      const result = validateStatusTransition("DELIVERED", "REFUNDED");
      expect(result.isValid).toBe(true);
    });
  });

  describe("Invalid transitions - Các chuyển trạng thái không hợp lệ", () => {
    it("DELIVERED → PENDING (không quay lại trạng thái cũ)", () => {
      const result = validateStatusTransition("DELIVERED", "PENDING");
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("Không thể chuyển");
    });

    it("CANCELLED → PROCESSING (đã hủy không thể tiếp tục)", () => {
      const result = validateStatusTransition("CANCELLED", "PROCESSING");
      expect(result.isValid).toBe(false);
    });

    it("REFUNDED → DELIVERED (đã hoàn tiền không thể đổi)", () => {
      const result = validateStatusTransition("REFUNDED", "DELIVERED");
      expect(result.isValid).toBe(false);
    });

    it("SHIPPED → PENDING (không quay lại)", () => {
      const result = validateStatusTransition("SHIPPED", "PENDING");
      expect(result.isValid).toBe(false);
    });

    it("PENDING → DELIVERED (không nhảy trạng thái)", () => {
      const result = validateStatusTransition("PENDING", "DELIVERED");
      expect(result.isValid).toBe(false);
    });
  });

  describe("PENDING_PAYMENT special case - Trường hợp đặc biệt", () => {
    it("blocks all transitions from PENDING_PAYMENT - chặn mọi chuyển đổi", () => {
      const result = validateStatusTransition("PENDING_PAYMENT", "PROCESSING");
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("chờ thanh toán");
    });

    it("blocks PENDING_PAYMENT → CANCELLED", () => {
      const result = validateStatusTransition("PENDING_PAYMENT", "CANCELLED");
      expect(result.isValid).toBe(false);
    });
  });
});

// ============================================================================
// formatShippingAddress - Format địa chỉ giao hàng
// ============================================================================

describe("formatShippingAddress - Format địa chỉ giao hàng", () => {
  it("formats full address - format đầy đủ địa chỉ", () => {
    const order = {
      shippingAddress: "123 Đường ABC",
      shippingWard: "Phường 1",
      shippingDistrict: "Quận 1",
      shippingCity: "TP.HCM",
    };
    expect(formatShippingAddress(order)).toBe(
      "123 Đường ABC, Phường 1, Quận 1, TP.HCM"
    );
  });

  it("handles missing ward - xử lý thiếu phường", () => {
    const order = {
      shippingAddress: "123 Đường ABC",
      shippingWard: null,
      shippingDistrict: "Quận 1",
      shippingCity: "TP.HCM",
    };
    expect(formatShippingAddress(order)).toBe("123 Đường ABC, Quận 1, TP.HCM");
  });

  it("handles missing district - xử lý thiếu quận", () => {
    const order = {
      shippingAddress: "123 Đường ABC",
      shippingWard: "Phường 1",
      shippingDistrict: null,
      shippingCity: "TP.HCM",
    };
    expect(formatShippingAddress(order)).toBe(
      "123 Đường ABC, Phường 1, TP.HCM"
    );
  });

  it("handles only address - chỉ có địa chỉ", () => {
    const order = {
      shippingAddress: "123 Đường ABC",
      shippingWard: null,
      shippingDistrict: null,
      shippingCity: null,
    };
    expect(formatShippingAddress(order)).toBe("123 Đường ABC");
  });
});

// ============================================================================
// formatOrderStatus - Format trạng thái đơn hàng
// ============================================================================

describe("formatOrderStatus - Format trạng thái tiếng Việt", () => {
  it("formats PENDING - Chờ xác nhận", () => {
    expect(formatOrderStatus("PENDING")).toBe("Chờ xác nhận");
  });

  it("formats PROCESSING - Đang xử lý", () => {
    expect(formatOrderStatus("PROCESSING")).toBe("Đang xử lý");
  });

  it("formats SHIPPED - Đang giao", () => {
    expect(formatOrderStatus("SHIPPED")).toBe("Đang giao");
  });

  it("formats DELIVERED - Đã giao", () => {
    expect(formatOrderStatus("DELIVERED")).toBe("Đã giao");
  });

  it("formats CANCELLED - Đã hủy", () => {
    expect(formatOrderStatus("CANCELLED")).toBe("Đã hủy");
  });

  it("returns original for unknown status - trả về nguyên bản nếu không biết", () => {
    expect(formatOrderStatus("UNKNOWN")).toBe("UNKNOWN");
  });
});
