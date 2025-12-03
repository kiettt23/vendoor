/**
 * Unit Tests cho Result Pattern
 */

import { describe, it, expect } from "vitest";
import { ok, okVoid, err, tryCatch, isOk, isErr, type Result } from "./result";

describe("Result Pattern", () => {
  describe("ok", () => {
    it("should create success result with data", () => {
      const result = ok("test data");

      expect(result.success).toBe(true);
      if (isOk(result)) {
        expect(result.data).toBe("test data");
      }
    });

    it("should work with complex objects", () => {
      const data = { id: "1", name: "Product", price: 100000 };
      const result = ok(data);

      expect(result.success).toBe(true);
      if (isOk(result)) {
        expect(result.data).toEqual(data);
      }
    });

    it("should work with arrays", () => {
      const items = [1, 2, 3];
      const result = ok(items);

      expect(result.success).toBe(true);
      if (isOk(result)) {
        expect(result.data).toEqual([1, 2, 3]);
      }
    });
  });

  describe("okVoid", () => {
    it("should create success result without data", () => {
      const result = okVoid();

      expect(result.success).toBe(true);
      if (isOk(result)) {
        expect(result.data).toBeUndefined();
      }
    });
  });

  describe("err", () => {
    it("should create error result with message", () => {
      const result = err("Validation failed");

      expect(result.success).toBe(false);
      if (isErr(result)) {
        expect(result.error).toBe("Validation failed");
      }
    });

    it("should work with custom error types", () => {
      const result = err({ code: "INVALID_INPUT", field: "email" });

      expect(result.success).toBe(false);
      if (isErr(result)) {
        expect(result.error).toEqual({ code: "INVALID_INPUT", field: "email" });
      }
    });
  });

  describe("tryCatch", () => {
    it("should return ok when function succeeds", async () => {
      const result = await tryCatch(async () => "success");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("success");
      }
    });

    it("should return err when function throws", async () => {
      const result = await tryCatch(async () => {
        throw new Error("Something went wrong");
      }, "Custom error message");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Custom error message");
      }
    });

    it("should use default error message when not provided", async () => {
      const result = await tryCatch(async () => {
        throw new Error("Test");
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Đã có lỗi xảy ra");
      }
    });
  });

  describe("isOk", () => {
    it("should return true for success result", () => {
      const result: Result<string> = ok("test");
      expect(isOk(result)).toBe(true);
    });

    it("should return false for error result", () => {
      const result: Result<string> = err("error");
      expect(isOk(result)).toBe(false);
    });

    it("should narrow type correctly", () => {
      const result: Result<number> = ok(42);

      if (isOk(result)) {
        // TypeScript should know result.data is number
        expect(result.data).toBe(42);
      }
    });
  });

  describe("isErr", () => {
    it("should return true for error result", () => {
      const result: Result<string> = err("error");
      expect(isErr(result)).toBe(true);
    });

    it("should return false for success result", () => {
      const result: Result<string> = ok("test");
      expect(isErr(result)).toBe(false);
    });

    it("should narrow type correctly", () => {
      const result: Result<number> = err("Invalid number");

      if (isErr(result)) {
        // TypeScript should know result.error is string
        expect(result.error).toBe("Invalid number");
      }
    });
  });
});
