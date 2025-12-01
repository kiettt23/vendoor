/**
 * Tests for ID Generation utilities
 */

import { describe, it, expect } from "vitest";
import { generateOrderNumber, generateId, generateRandomString } from "./id";

describe("ID Generation", () => {
  describe("generateOrderNumber", () => {
    it("should start with ORD-", () => {
      const result = generateOrderNumber();
      expect(result).toMatch(/^ORD-/);
    });

    it("should have correct format ORD-YYYYMMDD-XXXXXX", () => {
      const result = generateOrderNumber();
      // Format: ORD-20251128-A1B2C3
      expect(result).toMatch(/^ORD-\d{8}-[A-Z0-9]{6}$/);
    });

    it("should include current date", () => {
      const result = generateOrderNumber();
      const today = new Date();
      const expectedDate = `${today.getFullYear()}${String(
        today.getMonth() + 1
      ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

      expect(result).toContain(expectedDate);
    });

    it("should generate unique values", () => {
      const results = new Set<string>();
      for (let i = 0; i < 100; i++) {
        results.add(generateOrderNumber());
      }
      // All 100 should be unique
      expect(results.size).toBe(100);
    });
  });

  describe("generateId", () => {
    it("should start with provided prefix", () => {
      expect(generateId("PRD")).toMatch(/^PRD-/);
      expect(generateId("USR")).toMatch(/^USR-/);
      expect(generateId("CAT")).toMatch(/^CAT-/);
    });

    it("should have random suffix", () => {
      const result = generateId("TEST");
      expect(result).toMatch(/^TEST-[A-Z0-9]{8}$/);
    });

    it("should generate unique values", () => {
      const results = new Set<string>();
      for (let i = 0; i < 100; i++) {
        results.add(generateId("ID"));
      }
      expect(results.size).toBe(100);
    });
  });

  describe("generateRandomString", () => {
    it("should generate string of specified length", () => {
      expect(generateRandomString(4).length).toBeLessThanOrEqual(4);
      expect(generateRandomString(8).length).toBeLessThanOrEqual(8);
    });

    it("should only contain uppercase alphanumeric characters", () => {
      const result = generateRandomString(10);
      expect(result).toMatch(/^[A-Z0-9]+$/);
    });
  });
});
