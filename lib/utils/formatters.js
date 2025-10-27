/**
 * Formatting utilities
 * For price, date, phone number formatting (Vietnam locale)
 */

export const formatters = {
  /**
   * Format price to VND currency
   * @param {number} price
   * @returns {string} Formatted price (e.g., "₫123.456")
   */
  formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  },

  /**
   * Format date to readable string (Vietnamese)
   * @param {Date|string} date
   * @returns {string} Formatted date (e.g., "1 Thg 1, 2024")
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Ho_Chi_Minh",
    });
  },

  /**
   * Format date with time (Vietnamese)
   * @param {Date|string} date
   * @returns {string} Formatted datetime (e.g., "1 Thg 1, 2024 lúc 15:45")
   */
  formatDateTime(date) {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh",
    });
  },

  /**
   * Format phone number (Vietnamese format)
   * @param {string} phone
   * @returns {string} Formatted phone (e.g., "0123 456 789")
   */
  formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, "");
    // Vietnamese phone: 10 digits starting with 0
    const match = cleaned.match(/^(0\d{2})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  },

  /**
   * Format number with commas (Vietnamese)
   * @param {number} num
   * @returns {string} Formatted number (e.g., "1.234.567")
   */
  formatNumber(num) {
    return new Intl.NumberFormat("vi-VN").format(num);
  },
};
