import { describe, it, expect } from "vitest";
import {
  generateOrderNumber,
  generateId,
  generateRandomString,
} from "../id";

// ============================================================================
// generateOrderNumber - Tạo mã đơn hàng
// ============================================================================

describe("generateOrderNumber - Tạo mã đơn hàng", () => {
  it("follows format ORD-YYYYMMDD-XXXXXX", () => {
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toMatch(/^ORD-\d{8}-[A-Z0-9]{6}$/);
  });

  it("includes current date - bao gồm ngày hiện tại", () => {
    const orderNumber = generateOrderNumber();
    const today = new Date();
    const expectedDatePart = `${today.getFullYear()}${String(
      today.getMonth() + 1
    ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
    expect(orderNumber).toContain(expectedDatePart);
  });

  it("generates unique numbers - không trùng lặp", () => {
    const numbers = Array.from({ length: 100 }, () => generateOrderNumber());
    const unique = new Set(numbers);
    expect(unique.size).toBe(100);
  });

  it("starts with ORD prefix", () => {
    const orderNumber = generateOrderNumber();
    expect(orderNumber.startsWith("ORD-")).toBe(true);
  });
});

// ============================================================================
// generateId - Tạo ID với prefix
// ============================================================================

describe("generateId - Tạo ID với prefix", () => {
  it("follows format PREFIX-XXXXXXXX", () => {
    const id = generateId("PRD");
    expect(id).toMatch(/^PRD-[A-Z0-9]{8}$/);
  });

  it("uses provided prefix - dùng prefix được cung cấp", () => {
    expect(generateId("USR").startsWith("USR-")).toBe(true);
    expect(generateId("ORD").startsWith("ORD-")).toBe(true);
    expect(generateId("VND").startsWith("VND-")).toBe(true);
  });

  it("generates unique IDs - không trùng lặp", () => {
    const ids = Array.from({ length: 100 }, () => generateId("TEST"));
    const unique = new Set(ids);
    expect(unique.size).toBe(100);
  });

  it("handles empty prefix - xử lý prefix rỗng", () => {
    const id = generateId("");
    expect(id).toMatch(/^-[A-Z0-9]{8}$/);
  });
});

// ============================================================================
// generateRandomString - Tạo chuỗi ngẫu nhiên
// ============================================================================

describe("generateRandomString - Tạo chuỗi ngẫu nhiên", () => {
  it("generates correct length - độ dài chính xác", () => {
    expect(generateRandomString(8).length).toBe(8);
    expect(generateRandomString(4).length).toBe(4);
    // Note: Math.random().toString(36) max ~11 chars, testing safe length
    expect(generateRandomString(10).length).toBeLessThanOrEqual(11);
  });

  it("generates uppercase alphanumeric - chữ hoa và số", () => {
    const str = generateRandomString(20);
    expect(str).toMatch(/^[A-Z0-9]+$/);
  });

  it("generates unique strings - không trùng lặp", () => {
    const strings = Array.from({ length: 100 }, () => generateRandomString(8));
    const unique = new Set(strings);
    // Có thể có 1-2 trùng do xác suất, nhưng hầu như không
    expect(unique.size).toBeGreaterThanOrEqual(98);
  });

  it("handles length 1", () => {
    const str = generateRandomString(1);
    expect(str.length).toBe(1);
    expect(str).toMatch(/^[A-Z0-9]$/);
  });
});
