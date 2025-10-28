/**
 * Formatting utilities
 * For price, date, phone number formatting (Vietnam locale)
 */

/**
 * Format price to VND currency
 * @param {number} price
 * @returns {string} Formatted price (e.g., "₫123.456")
 */
export function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

/**
 * Format date to readable string (Vietnamese)
 * @param {Date|string} date
 * @returns {string} Formatted date (e.g., "1 Thg 1, 2024")
 */
export function formatDate(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check invalid date
  if (isNaN(dateObj.getTime())) {
    return "Ngày không hợp lệ";
  }

  return dateObj.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

/**
 * Format date with time (Vietnamese)
 * @param {Date|string} date
 * @returns {string} Formatted datetime (e.g., "1 Thg 1, 2024 lúc 15:45")
 */
export function formatDateTime(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Ngày không hợp lệ";
  }

  return dateObj.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

/**
 * Format phone number (Vietnamese format)
 * @param {string} phone
 * @returns {string} Formatted phone (e.g., "0123 456 789")
 */
export function formatPhone(phone) {
  if (!phone) return phone;

  const cleaned = phone.replace(/\D/g, "");
  // Vietnamese phone: 10 digits starting with 0
  const match = cleaned.match(/^(0\d{2})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
}

/**
 * Format number with commas (Vietnamese)
 * @param {number} num
 * @returns {string} Formatted number (e.g., "1.234.567")
 */
export function formatNumber(num) {
  return new Intl.NumberFormat("vi-VN").format(num);
}

// Re-export as object for backward compatibility
export const formatters = {
  formatPrice,
  formatDate,
  formatDateTime,
  formatPhone,
  formatNumber,
};
