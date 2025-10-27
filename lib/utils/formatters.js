/**
 * Formatting utilities
 * For price, date, phone number formatting
 */

export const formatters = {
  /**
   * Format price to USD currency
   * @param {number} price
   * @returns {string} Formatted price (e.g., "$123.45")
   */
  formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  },

  /**
   * Format date to readable string
   * @param {Date|string} date
   * @returns {string} Formatted date (e.g., "Jan 1, 2024")
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  /**
   * Format date with time
   * @param {Date|string} date
   * @returns {string} Formatted datetime (e.g., "Jan 1, 2024 at 3:45 PM")
   */
  formatDateTime(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  },

  /**
   * Format phone number
   * @param {string} phone
   * @returns {string} Formatted phone (e.g., "(123) 456-7890")
   */
  formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },

  /**
   * Format number with commas
   * @param {number} num
   * @returns {string} Formatted number (e.g., "1,234,567")
   */
  formatNumber(num) {
    return new Intl.NumberFormat("en-US").format(num);
  },
};
