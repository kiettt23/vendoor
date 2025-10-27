/**
 * Helper utilities
 * For business logic calculations
 */

/**
 * Calculate discount amount
 * @param {number} amount - Original amount
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} Discount value (not total after discount)
 */
export function calculateDiscount(amount, discountPercent) {
  if (!discountPercent || discountPercent <= 0) return 0;
  return (amount * discountPercent) / 100;
}

/**
 * Calculate shipping fee
 * @param {boolean} isPlusMember - Whether user is a Plus member
 * @param {number} standardFee - Standard shipping fee (default: 5)
 * @returns {number} Shipping fee (0 for Plus members)
 */
export function calculateShipping(isPlusMember, standardFee = 5) {
  return isPlusMember ? 0 : standardFee;
}

/**
 * Calculate order total
 * @param {Array} items - Cart items with {price, quantity}
 * @param {number} discount - Discount amount (not percent)
 * @param {number} shippingFee - Shipping fee
 * @returns {number} Total amount
 */
export function calculateOrderTotal(items, discount = 0, shippingFee = 0) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return subtotal - discount + shippingFee;
}

/**
 * Calculate average rating
 * @param {Array} ratings - Array of rating objects with {rating}
 * @returns {number} Average rating (0-5)
 */
export function calculateAverageRating(ratings) {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal
}

/**
 * Generate random code
 * @param {number} length - Code length
 * @returns {string} Random uppercase alphanumeric code
 */
export function generateCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Slugify string for URLs
 * @param {string} text
 * @returns {string} URL-friendly slug
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

/**
 * Truncate text
 * @param {string} text
 * @param {number} maxLength
 * @returns {string} Truncated text with ellipsis
 */
export function truncate(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Re-export as object for backward compatibility
export const helpers = {
  calculateDiscount,
  calculateShipping,
  calculateOrderTotal,
  calculateAverageRating,
  generateCode,
  slugify,
  truncate,
};
