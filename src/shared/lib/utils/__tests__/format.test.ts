import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatPriceNumber,
  parsePrice,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatPhone,
  formatFileSize,
  formatNumber,
  formatPercent,
  truncate,
  capitalize,
  slugify,
  formatOrderNumber,
  formatStockStatus,
} from "../format";

// ============================================================================
// formatPrice - Format giá tiền VND
// ============================================================================

describe("formatPrice - Format giá tiền VND", () => {
  it("formats standard price - hiển thị giá chuẩn", () => {
    expect(formatPrice(100000)).toBe("100.000\u00A0₫");
  });

  it("formats million price - hiển thị giá triệu", () => {
    expect(formatPrice(1500000)).toBe("1.500.000\u00A0₫");
  });

  it("handles zero - xử lý giá 0đ", () => {
    expect(formatPrice(0)).toBe("0\u00A0₫");
  });

  it("handles small amounts - xử lý số tiền nhỏ", () => {
    expect(formatPrice(1000)).toBe("1.000\u00A0₫");
  });
});

// ============================================================================
// formatPriceNumber - Format số tiền không có ký hiệu
// ============================================================================

describe("formatPriceNumber - Format số tiền không có ký hiệu", () => {
  it("formats without currency symbol", () => {
    expect(formatPriceNumber(100000)).toBe("100.000");
  });

  it("formats large numbers", () => {
    expect(formatPriceNumber(1500000)).toBe("1.500.000");
  });

  it("handles zero", () => {
    expect(formatPriceNumber(0)).toBe("0");
  });
});

// ============================================================================
// parsePrice - Parse giá từ string
// ============================================================================

describe("parsePrice - Parse giá từ string", () => {
  it("parses formatted price - parse giá đã format", () => {
    expect(parsePrice("100.000")).toBe(100000);
  });

  it("parses price with currency symbol - parse giá có ký hiệu ₫", () => {
    expect(parsePrice("1.500.000₫")).toBe(1500000);
  });

  it("handles empty string - xử lý chuỗi rỗng", () => {
    expect(parsePrice("")).toBe(0);
  });

  it("handles invalid input - xử lý input không hợp lệ", () => {
    expect(parsePrice("abc")).toBe(0);
  });

  it("round trip test - test chuyển đổi 2 chiều", () => {
    const original = 1500000;
    const formatted = formatPriceNumber(original);
    expect(parsePrice(formatted)).toBe(original);
  });
});

// ============================================================================
// formatDate - Format ngày tháng
// ============================================================================

describe("formatDate - Format ngày tháng Việt Nam", () => {
  it("formats Date object - format object Date", () => {
    const date = new Date(2024, 11, 25); // 25/12/2024
    expect(formatDate(date)).toBe("25/12/2024");
  });

  it("formats ISO string - format chuỗi ISO", () => {
    const result = formatDate("2024-12-25T00:00:00.000Z");
    expect(result).toMatch(/25\/12\/2024/);
  });

  it("pads single digit days and months - thêm số 0", () => {
    const date = new Date(2024, 0, 5); // 5/1/2024
    expect(formatDate(date)).toBe("05/01/2024");
  });
});

// ============================================================================
// formatDateTime - Format ngày giờ
// ============================================================================

describe("formatDateTime - Format ngày giờ", () => {
  it("includes time - bao gồm giờ phút", () => {
    const date = new Date(2024, 11, 25, 14, 30);
    const result = formatDateTime(date);
    expect(result).toContain("25/12/2024");
    expect(result).toContain("14:30");
  });
});

// ============================================================================
// formatRelativeTime - Thời gian tương đối
// ============================================================================

describe("formatRelativeTime - Thời gian tương đối", () => {
  it('shows "Vừa xong" for < 60 seconds', () => {
    const date = new Date(Date.now() - 30000); // 30 seconds ago
    expect(formatRelativeTime(date)).toBe("Vừa xong");
  });

  it('shows "X phút trước" for < 60 minutes', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
    expect(formatRelativeTime(date)).toBe("5 phút trước");
  });

  it('shows "X giờ trước" for < 24 hours', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
    expect(formatRelativeTime(date)).toBe("3 giờ trước");
  });

  it('shows "X ngày trước" for < 7 days', () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
    expect(formatRelativeTime(date)).toBe("3 ngày trước");
  });

  it("shows formatted date for >= 7 days", () => {
    const date = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
    const result = formatRelativeTime(date);
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});

// ============================================================================
// formatPhone - Format số điện thoại
// ============================================================================

describe("formatPhone - Format số điện thoại Việt Nam", () => {
  it("formats 10-digit phone - format SĐT 10 số", () => {
    expect(formatPhone("0901234567")).toBe("090 123 4567");
  });

  it("formats 11-digit phone - format SĐT 11 số", () => {
    expect(formatPhone("09012345678")).toBe("0901 234 5678");
  });

  it("handles already formatted - xử lý SĐT đã format", () => {
    expect(formatPhone("090 123 4567")).toBe("090 123 4567");
  });

  it("returns original for invalid length - trả về nguyên bản nếu độ dài không hợp lệ", () => {
    expect(formatPhone("123")).toBe("123");
  });
});

// ============================================================================
// formatFileSize - Format kích thước file
// ============================================================================

describe("formatFileSize - Format kích thước file", () => {
  it("formats bytes", () => {
    expect(formatFileSize(500)).toBe("500 B");
  });

  it("formats kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1.00 KB");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(1024 * 1024)).toBe("1.00 MB");
  });

  it("formats gigabytes", () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe("1.00 GB");
  });

  it("handles boundary values - xử lý giá trị biên", () => {
    expect(formatFileSize(1023)).toBe("1023 B");
    expect(formatFileSize(1025)).toBe("1.00 KB");
  });
});

// ============================================================================
// formatNumber - Format số với dấu phân cách
// ============================================================================

describe("formatNumber - Format số với dấu phân cách nghìn", () => {
  it("formats thousand - format số nghìn", () => {
    expect(formatNumber(1000)).toBe("1.000");
  });

  it("formats million - format số triệu", () => {
    expect(formatNumber(1500000)).toBe("1.500.000");
  });

  it("handles zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});

// ============================================================================
// formatPercent - Format phần trăm
// ============================================================================

describe("formatPercent - Format phần trăm", () => {
  it("formats decimal to percent - chuyển decimal sang %", () => {
    expect(formatPercent(0.1)).toBe("10%");
  });

  it("formats with fraction digits - format với số thập phân", () => {
    expect(formatPercent(0.155, 1)).toBe("15,5%");
  });

  it("handles 100%", () => {
    expect(formatPercent(1)).toBe("100%");
  });

  it("handles 0%", () => {
    expect(formatPercent(0)).toBe("0%");
  });
});

// ============================================================================
// truncate - Cắt ngắn text
// ============================================================================

describe("truncate - Cắt ngắn text", () => {
  it("truncates long text - cắt ngắn text dài", () => {
    expect(truncate("Hello world", 5)).toBe("Hello...");
  });

  it("keeps short text unchanged - giữ nguyên text ngắn", () => {
    expect(truncate("Hi", 5)).toBe("Hi");
  });

  it("handles exact length - xử lý độ dài chính xác", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });

  it("handles empty string", () => {
    expect(truncate("", 5)).toBe("");
  });
});

// ============================================================================
// capitalize - Viết hoa chữ cái đầu
// ============================================================================

describe("capitalize - Viết hoa chữ cái đầu", () => {
  it("capitalizes first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("lowercases rest of string", () => {
    expect(capitalize("HELLO")).toBe("Hello");
  });

  it("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("handles single character", () => {
    expect(capitalize("a")).toBe("A");
  });
});

// ============================================================================
// slugify - Tạo URL slug
// ============================================================================

describe("slugify - Tạo URL slug", () => {
  it("converts Vietnamese to ASCII - bỏ dấu tiếng Việt", () => {
    expect(slugify("Áo thun nam")).toBe("ao-thun-nam");
  });

  it("handles đ character - xử lý chữ đ", () => {
    expect(slugify("Đồng hồ")).toBe("dong-ho");
  });

  it("removes special characters - bỏ ký tự đặc biệt", () => {
    expect(slugify("Áo thun (nam) @2024")).toBe("ao-thun-nam-2024");
  });

  it("handles multiple spaces - xử lý nhiều khoảng trắng", () => {
    expect(slugify("Áo   thun   nam")).toBe("ao-thun-nam");
  });

  it("trims whitespace - cắt khoảng trắng", () => {
    expect(slugify("  Áo thun  ")).toBe("ao-thun");
  });

  it("handles numbers", () => {
    expect(slugify("Sản phẩm 123")).toBe("san-pham-123");
  });
});

// ============================================================================
// formatOrderNumber - Format mã đơn hàng
// ============================================================================

describe("formatOrderNumber - Format mã đơn hàng", () => {
  it("adds # prefix - thêm tiền tố #", () => {
    expect(formatOrderNumber("ORD-123")).toBe("#ORD-123");
  });

  it("handles empty string", () => {
    expect(formatOrderNumber("")).toBe("#");
  });
});

// ============================================================================
// formatStockStatus - Format trạng thái tồn kho
// ============================================================================

describe("formatStockStatus - Format trạng thái tồn kho", () => {
  it('shows "Hết hàng" for 0 stock - hết hàng', () => {
    expect(formatStockStatus(0)).toBe("Hết hàng");
  });

  it('shows "Chỉ còn X sản phẩm" for low stock - còn ít', () => {
    expect(formatStockStatus(5)).toBe("Chỉ còn 5 sản phẩm");
  });

  it('shows "Còn hàng" for >= 10 stock - còn hàng', () => {
    expect(formatStockStatus(10)).toBe("Còn hàng");
    expect(formatStockStatus(100)).toBe("Còn hàng");
  });

  it("handles boundary at 9 - xử lý biên tại 9", () => {
    expect(formatStockStatus(9)).toBe("Chỉ còn 9 sản phẩm");
  });
});
