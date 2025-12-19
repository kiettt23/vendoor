import { describe, it, expect } from "vitest";
import {
  calculateDiscount,
  hasDiscount,
  validateSKU,
  calculateAverageRating,
} from "../lib/utils";

// ============================================================================
// calculateDiscount - Tính % giảm giá
// ============================================================================

describe("calculateDiscount - Tính % giảm giá", () => {
  it("calculates percentage correctly - tính đúng phần trăm", () => {
    // Giá gốc 200k, bán 100k → giảm 50%
    expect(calculateDiscount(100000, 200000)).toBe(50);
  });

  it("calculates 33% discount", () => {
    // Giá gốc 150k, bán 100k → giảm 33%
    expect(calculateDiscount(100000, 150000)).toBe(33);
  });

  it("rounds to nearest integer - làm tròn đến số nguyên", () => {
    // 120k / 150k = 20% off → 100 - 80 = 20
    expect(calculateDiscount(120000, 150000)).toBe(20);
  });

  it("returns null when compareAtPrice is null - không có giá so sánh", () => {
    expect(calculateDiscount(100000, null)).toBeNull();
  });

  it("returns null when compareAtPrice equals price - giá bằng nhau", () => {
    expect(calculateDiscount(100000, 100000)).toBeNull();
  });

  it("returns null when compareAtPrice is lower - giá so sánh thấp hơn", () => {
    expect(calculateDiscount(100000, 80000)).toBeNull();
  });

  it("handles small discounts - giảm giá nhỏ", () => {
    // 95k / 100k = 5% off
    expect(calculateDiscount(95000, 100000)).toBe(5);
  });

  it("handles large discounts - giảm giá lớn", () => {
    // 10k / 100k = 90% off
    expect(calculateDiscount(10000, 100000)).toBe(90);
  });
});

// ============================================================================
// hasDiscount - Kiểm tra có giảm giá không
// ============================================================================

describe("hasDiscount - Kiểm tra có giảm giá không", () => {
  it("returns true when compareAtPrice > price - có giảm giá", () => {
    expect(hasDiscount(100000, 150000)).toBe(true);
  });

  it("returns false when compareAtPrice is null - không có giá so sánh", () => {
    expect(hasDiscount(100000, null)).toBe(false);
  });

  it("returns false when prices are equal - giá bằng nhau", () => {
    expect(hasDiscount(100000, 100000)).toBe(false);
  });

  it("returns false when compareAtPrice < price - giá so sánh thấp hơn", () => {
    expect(hasDiscount(100000, 80000)).toBe(false);
  });
});

// ============================================================================
// validateSKU - Validate mã SKU
// ============================================================================

describe("validateSKU - Validate mã SKU", () => {
  describe("Valid SKUs - SKU hợp lệ", () => {
    it("accepts alphanumeric SKU - chữ và số", () => {
      expect(validateSKU("ABC123")).toBe(true);
    });

    it("accepts SKU with hyphens - có gạch ngang", () => {
      expect(validateSKU("ABC-123")).toBe(true);
    });

    it("accepts minimum length 3 - độ dài tối thiểu 3", () => {
      expect(validateSKU("ABC")).toBe(true);
    });

    it("accepts maximum length 20 - độ dài tối đa 20", () => {
      expect(validateSKU("ABCDEFGHIJ1234567890")).toBe(true);
    });

    it("accepts all uppercase - toàn chữ hoa", () => {
      expect(validateSKU("ABCDEF")).toBe(true);
    });

    it("accepts all lowercase - toàn chữ thường", () => {
      expect(validateSKU("abcdef")).toBe(true);
    });

    it("accepts mixed case - hỗn hợp chữ hoa thường", () => {
      expect(validateSKU("AbCdEf")).toBe(true);
    });

    it("accepts complex SKU - SKU phức tạp", () => {
      expect(validateSKU("AO-DO-M-001")).toBe(true);
    });
  });

  describe("Invalid SKUs - SKU không hợp lệ", () => {
    it("rejects too short (< 3 chars) - quá ngắn", () => {
      expect(validateSKU("AB")).toBe(false);
    });

    it("rejects too long (> 20 chars) - quá dài", () => {
      expect(validateSKU("ABCDEFGHIJ12345678901")).toBe(false);
    });

    it("rejects special characters - ký tự đặc biệt", () => {
      expect(validateSKU("ABC@123")).toBe(false);
      expect(validateSKU("ABC#123")).toBe(false);
      expect(validateSKU("ABC$123")).toBe(false);
    });

    it("rejects starting with hyphen - bắt đầu bằng gạch ngang", () => {
      expect(validateSKU("-ABC123")).toBe(false);
    });

    it("rejects ending with hyphen - kết thúc bằng gạch ngang", () => {
      expect(validateSKU("ABC123-")).toBe(false);
    });

    it("rejects spaces - có khoảng trắng", () => {
      expect(validateSKU("ABC 123")).toBe(false);
    });

    it("rejects empty string - chuỗi rỗng", () => {
      expect(validateSKU("")).toBe(false);
    });

    it("rejects Vietnamese characters - ký tự tiếng Việt", () => {
      expect(validateSKU("ÁO-ĐỎ")).toBe(false);
    });
  });
});

// ============================================================================
// calculateAverageRating - Tính điểm đánh giá trung bình
// ============================================================================

describe("calculateAverageRating - Tính điểm đánh giá trung bình", () => {
  it("calculates average correctly - tính đúng trung bình", () => {
    const reviews = [{ rating: 4 }, { rating: 5 }, { rating: 3 }];
    // (4 + 5 + 3) / 3 = 4.0
    expect(calculateAverageRating(reviews)).toBe(4);
  });

  it("returns null for empty array - mảng rỗng", () => {
    expect(calculateAverageRating([])).toBeNull();
  });

  it("handles single review - một đánh giá", () => {
    expect(calculateAverageRating([{ rating: 5 }])).toBe(5);
  });

  it("rounds to one decimal place - làm tròn 1 chữ số thập phân", () => {
    const reviews = [{ rating: 4 }, { rating: 4 }, { rating: 5 }];
    // (4 + 4 + 5) / 3 = 4.333... → 4.3
    expect(calculateAverageRating(reviews)).toBe(4.3);
  });

  it("handles all same ratings - tất cả đánh giá giống nhau", () => {
    const reviews = [{ rating: 5 }, { rating: 5 }, { rating: 5 }];
    expect(calculateAverageRating(reviews)).toBe(5);
  });

  it("handles decimal averages correctly - xử lý đúng số thập phân", () => {
    const reviews = [
      { rating: 1 },
      { rating: 2 },
      { rating: 3 },
      { rating: 4 },
      { rating: 5 },
    ];
    // (1 + 2 + 3 + 4 + 5) / 5 = 3.0
    expect(calculateAverageRating(reviews)).toBe(3);
  });

  it("handles many reviews - nhiều đánh giá", () => {
    const reviews = Array.from({ length: 100 }, () => ({ rating: 4 }));
    expect(calculateAverageRating(reviews)).toBe(4);
  });
});
