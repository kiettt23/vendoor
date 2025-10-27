import { describe, it, expect } from "vitest";
import { formatPrice, formatDate, formatPhone } from "../formatters";

/**
 * UNIT TESTS cho Formatters
 *
 * Giải thích cấu trúc test:
 *
 * describe() - Nhóm các tests liên quan
 * it() hoặc test() - Một test case cụ thể
 * expect() - Assert/kiểm tra kết quả
 *
 * Pattern: AAA
 * - Arrange: Setup data
 * - Act: Execute function
 * - Assert: Verify result
 */

describe("formatPrice", () => {
  it("should format price to VND currency", () => {
    // Arrange - Prepare input
    const price = 1000000;

    // ACT - Execute function
    const result = formatPrice(price);

    // ASSERT - Verify output
    // Use toMatch to handle non-breaking space issues
    expect(result).toMatch(/1\.000\.000/);
    expect(result).toContain('₫');
  });

  it("should handle small amounts", () => {
    const result = formatPrice(500);
    expect(result).toMatch(/500/);
    expect(result).toContain('₫');
  });

  it("should handle large amounts", () => {
    const result = formatPrice(99999999);
    expect(result).toMatch(/99\.999\.999/);
    expect(result).toContain('₫');
  });

  it("should handle zero", () => {
    const result = formatPrice(0);
    expect(result).toMatch(/^0/);
    expect(result).toContain('₫');
  });

  it("should handle decimal values", () => {
    // Giá có thập phân (VND thường làm tròn)
    const result = formatPrice(1500.5);
    expect(result).toMatch(/1\.501/);
    expect(result).toContain('₫');
  });
});

describe("formatDate", () => {
  it("should format date to Vietnamese locale", () => {
    const date = new Date("2025-10-27T10:30:00");
    const result = formatDate(date);

    // Expect Vietnamese date format
    expect(result).toContain("27");
    expect(result).toContain("10");
    expect(result).toContain("2025");
  });

  it("should handle string dates", () => {
    const dateString = "2025-12-25";
    const result = formatDate(dateString);

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });

  it("should handle invalid dates gracefully", () => {
    const invalidDate = "invalid-date";

    // Depending on your implementation
    // Could throw error or return default value
    expect(() => formatDate(invalidDate)).not.toThrow();
  });
});

describe("formatPhone", () => {
  it("should format Vietnamese phone number", () => {
    const phone = "0123456789";
    const result = formatPhone(phone);

    expect(result).toBe("012 345 6789");
  });

  it("should handle already formatted phone", () => {
    const phone = "012 345 6789";
    const result = formatPhone(phone);

    expect(result).toBe("012 345 6789");
  });

  it("should handle phone with country code", () => {
    const phone = "+84123456789";
    const result = formatPhone(phone);

    // Depending on your implementation
    expect(result).toBeDefined();
  });

  it("should handle invalid phone numbers", () => {
    const invalidPhone = "123"; // Quá ngắn

    // Could return as-is or throw error
    expect(() => formatPhone(invalidPhone)).not.toThrow();
  });
});
