/**
 * Unit Tests cho Format Utilities
 *
 * 📚 Giải thích cấu trúc test file:
 *
 * 1. describe() - Nhóm các test cases liên quan
 *    - describe("formatPrice") - nhóm test cho 1 function
 *    - Có thể nested: describe bên trong describe
 *
 * 2. it() hoặc test() - Một test case cụ thể
 *    - Tên test nên mô tả behavior, không phải implementation
 *    - "should return X when Y" pattern
 *
 * 3. expect() - Assertion (kiểm tra kết quả)
 *    - expect(actual).toBe(expected) - strict equality
 *    - expect(actual).toEqual(expected) - deep equality (cho objects/arrays)
 *
 * 4. AAA Pattern:
 *    - Arrange: Chuẩn bị data
 *    - Act: Gọi function cần test
 *    - Assert: Kiểm tra kết quả
 */

import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatPriceNumber,
  parsePrice,
  formatDate,
  formatPhone,
  formatFileSize,
} from "./format";

// formatPrice - Format tiền VND với symbol ₫
describe("formatPrice", () => {
  // Happy path - trường hợp bình thường
  it("should format price with thousand separator and ₫ symbol", () => {
    expect(formatPrice(100000)).toBe("100.000\u00A0₫");
    // \u00A0 là non-breaking space, Intl.NumberFormat tự thêm
  });

  it("should format million correctly", () => {
    expect(formatPrice(1500000)).toBe("1.500.000\u00A0₫");
  });

  // Edge cases - trường hợp biên
  it("should handle zero", () => {
    expect(formatPrice(0)).toBe("0\u00A0₫");
  });

  it("should handle small numbers", () => {
    expect(formatPrice(999)).toBe("999\u00A0₫");
  });

  // Negative numbers (refund?)
  it("should handle negative numbers", () => {
    expect(formatPrice(-50000)).toBe("-50.000\u00A0₫");
  });
});

// formatPriceNumber - Format số không có symbol (dùng cho input)
describe("formatPriceNumber", () => {
  it("should format without currency symbol", () => {
    expect(formatPriceNumber(100000)).toBe("100.000");
  });

  it("should handle decimals by rounding", () => {
    // Vì minimumFractionDigits: 0, số lẻ sẽ được làm tròn
    expect(formatPriceNumber(100000.5)).toBe("100.001");
  });
});

// parsePrice - Parse từ string về number
describe("parsePrice", () => {
  it("should parse formatted price back to number", () => {
    expect(parsePrice("100.000")).toBe(100000);
  });

  it("should handle price with currency symbol", () => {
    expect(parsePrice("1.500.000₫")).toBe(1500000);
  });

  it("should handle price with spaces", () => {
    expect(parsePrice("1.500.000 ₫")).toBe(1500000);
  });

  it("should return 0 for invalid input", () => {
    expect(parsePrice("abc")).toBe(0);
    expect(parsePrice("")).toBe(0);
  });
});

// formatDate - Format ngày theo chuẩn VN (dd/mm/yyyy)
describe("formatDate", () => {
  it("should format Date object", () => {
    const date = new Date("2025-11-27");
    expect(formatDate(date)).toBe("27/11/2025");
  });

  it("should format ISO string", () => {
    expect(formatDate("2025-01-15")).toBe("15/01/2025");
  });

  it("should handle full ISO datetime", () => {
    expect(formatDate("2025-12-25T14:30:00Z")).toMatch(/25\/12\/2025/);
  });
});

// formatPhone - Format số điện thoại VN
describe("formatPhone", () => {
  it("should format 10-digit phone", () => {
    expect(formatPhone("0123456789")).toBe("012 345 6789");
  });

  it("should format 11-digit phone", () => {
    expect(formatPhone("01234567890")).toBe("0123 456 7890");
  });

  it("should strip non-digits before formatting", () => {
    expect(formatPhone("012-345-6789")).toBe("012 345 6789");
  });

  it("should return original for invalid length", () => {
    expect(formatPhone("12345")).toBe("12345");
  });
});

// formatFileSize - Format kích thước file
describe("formatFileSize", () => {
  it("should format bytes", () => {
    expect(formatFileSize(500)).toBe("500 B");
  });

  it("should format kilobytes", () => {
    // Implementation luôn show 2 decimal places
    expect(formatFileSize(1024)).toBe("1.00 KB");
    expect(formatFileSize(2048)).toBe("2.00 KB");
  });

  it("should format megabytes", () => {
    expect(formatFileSize(1048576)).toBe("1.00 MB");
    expect(formatFileSize(5242880)).toBe("5.00 MB");
  });

  it("should format gigabytes", () => {
    expect(formatFileSize(1073741824)).toBe("1.00 GB");
  });

  it("should handle decimal places", () => {
    expect(formatFileSize(1536)).toBe("1.50 KB");
  });
});
