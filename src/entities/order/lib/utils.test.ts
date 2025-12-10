import { describe, it, expect } from "vitest";
import {
  formatOrderStatus,
  calculateCommission,
  validateStatusTransition,
  formatShippingAddress,
} from "./utils";

// calculateCommission - Tính hoa hồng sàn (2%)
describe("calculateCommission", () => {
  it("should calculate 2% commission correctly", () => {
    expect(calculateCommission(100000)).toBe(2000);
    expect(calculateCommission(500000)).toBe(10000);
  });

  it("should round to nearest integer", () => {
    expect(calculateCommission(99999)).toBe(2000);
    expect(calculateCommission(123456)).toBe(2469);
  });

  it("should handle zero", () => {
    expect(calculateCommission(0)).toBe(0);
  });
});

// validateStatusTransition - Kiểm tra chuyển trạng thái
describe("validateStatusTransition", () => {
  // Valid transitions
  it("should allow PENDING -> PROCESSING", () => {
    const result = validateStatusTransition("PENDING", "PROCESSING");
    expect(result.isValid).toBe(true);
  });

  it("should allow PENDING -> CANCELLED", () => {
    const result = validateStatusTransition("PENDING", "CANCELLED");
    expect(result.isValid).toBe(true);
  });

  it("should allow PROCESSING -> SHIPPED", () => {
    const result = validateStatusTransition("PROCESSING", "SHIPPED");
    expect(result.isValid).toBe(true);
  });

  it("should allow SHIPPED -> DELIVERED", () => {
    const result = validateStatusTransition("SHIPPED", "DELIVERED");
    expect(result.isValid).toBe(true);
  });

  it("should allow DELIVERED -> REFUNDED", () => {
    const result = validateStatusTransition("DELIVERED", "REFUNDED");
    expect(result.isValid).toBe(true);
  });

  // Invalid transitions
  it("should not allow PENDING_PAYMENT transitions", () => {
    const result = validateStatusTransition("PENDING_PAYMENT", "PENDING");
    expect(result.isValid).toBe(false);
    expect(result.message).toContain("chờ thanh toán");
  });

  it("should not allow skipping status", () => {
    const result = validateStatusTransition("PENDING", "DELIVERED");
    expect(result.isValid).toBe(false);
  });

  it("should not allow reverse transitions", () => {
    const result = validateStatusTransition("DELIVERED", "PROCESSING");
    expect(result.isValid).toBe(false);
  });

  it("should not allow CANCELLED to change", () => {
    const result = validateStatusTransition("CANCELLED", "PENDING");
    expect(result.isValid).toBe(false);
  });
});

// formatShippingAddress - Format địa chỉ giao hàng
describe("formatShippingAddress", () => {
  it("should format full address", () => {
    const order = {
      shippingAddress: "123 Nguyễn Huệ",
      shippingWard: "Phường Bến Nghé",
      shippingDistrict: "Quận 1",
      shippingCity: "TP. Hồ Chí Minh",
    };
    expect(formatShippingAddress(order)).toBe(
      "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
    );
  });

  it("should handle missing ward", () => {
    const order = {
      shippingAddress: "123 Nguyễn Huệ",
      shippingWard: null,
      shippingDistrict: "Quận 1",
      shippingCity: "TP. Hồ Chí Minh",
    };
    expect(formatShippingAddress(order)).toBe(
      "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
    );
  });

  it("should handle only address", () => {
    const order = {
      shippingAddress: "123 Nguyễn Huệ",
    };
    expect(formatShippingAddress(order)).toBe("123 Nguyễn Huệ");
  });
});

// formatOrderStatus - Format trạng thái đơn hàng
describe("formatOrderStatus", () => {
  it("should format PENDING status", () => {
    expect(formatOrderStatus("PENDING")).toBe("Chờ xác nhận");
  });

  it("should format PROCESSING status", () => {
    expect(formatOrderStatus("PROCESSING")).toBe("Đang xử lý");
  });

  it("should format SHIPPED status", () => {
    expect(formatOrderStatus("SHIPPED")).toBe("Đang giao");
  });

  it("should format DELIVERED status", () => {
    expect(formatOrderStatus("DELIVERED")).toBe("Đã giao");
  });

  it("should format CANCELLED status", () => {
    expect(formatOrderStatus("CANCELLED")).toBe("Đã hủy");
  });

  it("should return original status for unknown status", () => {
    expect(formatOrderStatus("UNKNOWN")).toBe("UNKNOWN");
  });
});
