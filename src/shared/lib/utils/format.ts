import { CURRENCY } from "../constants/currency";

/**
 * Format price in Vietnamese Dong
 *
 * @example
 * formatPrice(100000) // "100.000₫"
 * formatPrice(1500000) // "1.500.000₫"
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: "currency",
    currency: CURRENCY.CODE,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format price without currency symbol (for inputs)
 *
 * @example
 * formatPriceNumber(100000) // "100.000"
 */
export function formatPriceNumber(amount: number): string {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Parse price from formatted string
 *
 * @example
 * parsePrice("100.000") // 100000
 * parsePrice("1.500.000₫") // 1500000
 */
export function parsePrice(formattedPrice: string): number {
  // Remove currency symbol and spaces
  const cleaned = formattedPrice.replace(/[₫\s]/g, "");
  // Remove thousand separators (dots)
  const number = cleaned.replace(/\./g, "");
  return parseInt(number, 10) || 0;
}

/**
 * Format date in Vietnamese format
 *
 * @example
 * formatDate(new Date()) // "25/11/2025"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/**
 * Format date with time
 *
 * @example
 * formatDateTime(new Date()) // "25/11/2025 14:30"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Format relative time (e.g., "2 giờ trước")
 *
 * @example
 * formatRelativeTime(Date.now() - 3600000) // "1 giờ trước"
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatDate(d);
}

/**
 * Format phone number (Vietnam)
 *
 * @example
 * formatPhone("0123456789") // "012 345 6789"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Format file size
 *
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Format number with thousand separators
 *
 * @example
 * formatNumber(1000) // "1.000"
 * formatNumber(1500000) // "1.500.000"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat(CURRENCY.LOCALE).format(num);
}

/**
 * Format percentage
 *
 * @example
 * formatPercent(0.1) // "10%"
 * formatPercent(0.155) // "15,5%"
 */
export function formatPercent(decimal: number, fractionDigits = 0): string {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(decimal);
}

/**
 * Truncate text with ellipsis
 *
 * @example
 * truncate("Hello world", 5) // "Hello..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Capitalize first letter
 *
 * @example
 * capitalize("hello") // "Hello"
 */
export function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Generate slug from text
 *
 * @example
 * slugify("Áo Thun Nam") // "ao-thun-nam"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Decompose Vietnamese characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d") // Replace đ
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
}

/**
 * Format order number
 *
 * @example
 * formatOrderNumber("ORD-123") // "#ORD-123"
 */
export function formatOrderNumber(orderNumber: string): string {
  return `#${orderNumber}`;
}

/**
 * Format stock status
 *
 * @example
 * formatStockStatus(0) // "Hết hàng"
 * formatStockStatus(5) // "Còn 5 sản phẩm"
 */
export function formatStockStatus(stock: number): string {
  if (stock === 0) return "Hết hàng";
  if (stock < 10) return `Chỉ còn ${stock} sản phẩm`;
  return "Còn hàng";
}
