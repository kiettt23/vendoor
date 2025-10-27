/**
 * Helper utilities
 * For business logic calculations
 */

export const helpers = {
  /**
   * Calculate discount amount
   * @param {number} total - Original total
   * @param {number} discountPercent - Discount percentage (0-100)
   * @returns {number} Discounted total
   */
  calculateDiscount(total, discountPercent) {
    if (!discountPercent || discountPercent <= 0) return total;
    return total - (total * discountPercent) / 100;
  },

  /**
   * Calculate shipping fee
   * @param {boolean} isPlusMember - Whether user is a Plus member
   * @param {number} standardFee - Standard shipping fee (default: 5)
   * @returns {number} Shipping fee (0 for Plus members)
   */
  calculateShipping(isPlusMember, standardFee = 5) {
    return isPlusMember ? 0 : standardFee;
  },

  /**
   * Calculate order total
   * @param {Array} items - Cart items with {price, quantity}
   * @param {number} discountPercent - Discount percentage
   * @param {number} shippingFee - Shipping fee
   * @returns {number} Total amount
   */
  calculateOrderTotal(items, discountPercent = 0, shippingFee = 0) {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const afterDiscount = this.calculateDiscount(subtotal, discountPercent);
    return afterDiscount + shippingFee;
  },

  /**
   * Calculate average rating
   * @param {Array} ratings - Array of rating objects with {rating}
   * @returns {number} Average rating (0-5)
   */
  calculateAverageRating(ratings) {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal
  },

  /**
   * Generate random code
   * @param {number} length - Code length
   * @returns {string} Random uppercase alphanumeric code
   */
  generateCode(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Slugify string for URLs
   * @param {string} text
   * @returns {string} URL-friendly slug
   */
  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  },

  /**
   * Truncate text
   * @param {string} text
   * @param {number} maxLength
   * @returns {string} Truncated text with ellipsis
   */
  truncate(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  },
};
