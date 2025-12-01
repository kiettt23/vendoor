/**
 * Unit Tests cho Product Utilities
 */

import { describe, it, expect } from "vitest";
import { calculateDiscount, hasDiscount, validateSKU } from "./utils";

// ============================================================
// calculateDiscount - Tính % giảm giá
// ============================================================
describe("calculateDiscount", () => {
  it("should calculate discount percentage correctly", () => {
    expect(calculateDiscount(80000, 100000)).toBe(20);
    expect(calculateDiscount(50000, 100000)).toBe(50);
    expect(calculateDiscount(70000, 100000)).toBe(30);
  });

  it("should round to nearest integer", () => {
    expect(calculateDiscount(66666, 100000)).toBe(33);
    expect(calculateDiscount(33333, 100000)).toBe(67);
  });

  it("should return null when no compareAtPrice", () => {
    expect(calculateDiscount(100000, null)).toBe(null);
  });

  it("should return null when compareAtPrice <= price", () => {
    expect(calculateDiscount(100000, 100000)).toBe(null);
    expect(calculateDiscount(100000, 80000)).toBe(null);
  });
});

// ============================================================
// hasDiscount - Kiểm tra có giảm giá không
// ============================================================
describe("hasDiscount", () => {
  it("should return true when compareAtPrice > price", () => {
    expect(hasDiscount(80000, 100000)).toBe(true);
  });

  it("should return false when no compareAtPrice", () => {
    expect(hasDiscount(100000, null)).toBe(false);
  });

  it("should return false when compareAtPrice <= price", () => {
    expect(hasDiscount(100000, 100000)).toBe(false);
    expect(hasDiscount(100000, 80000)).toBe(false);
  });
});

// ============================================================
// validateSKU - Validate mã SKU
// ============================================================
describe("validateSKU", () => {
  // Valid SKUs
  it("should accept alphanumeric SKU", () => {
    expect(validateSKU("ABC123")).toBe(true);
    expect(validateSKU("abc123")).toBe(true);
    expect(validateSKU("SKU001")).toBe(true);
  });

  it("should accept SKU with hyphens in middle", () => {
    expect(validateSKU("ABC-123")).toBe(true);
    expect(validateSKU("PRO-001-A")).toBe(true);
  });

  // Invalid SKUs
  it("should reject too short SKU (< 3 chars)", () => {
    expect(validateSKU("AB")).toBe(false);
    expect(validateSKU("A")).toBe(false);
  });

  it("should reject too long SKU (> 20 chars)", () => {
    expect(validateSKU("ABCDEFGHIJKLMNOPQRSTUVWXYZ")).toBe(false);
  });

  it("should reject SKU starting with hyphen", () => {
    expect(validateSKU("-ABC123")).toBe(false);
  });

  it("should reject SKU ending with hyphen", () => {
    expect(validateSKU("ABC123-")).toBe(false);
  });

  it("should reject SKU with special characters", () => {
    expect(validateSKU("ABC@123")).toBe(false);
    expect(validateSKU("ABC 123")).toBe(false);
    expect(validateSKU("ABC#123")).toBe(false);
  });
});
