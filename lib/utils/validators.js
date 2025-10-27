/**
 * Validation utilities
 * For input validation
 */

export const validators = {
  /**
   * Validate email format
   * @param {string} email
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number (Vietnamese format: 10 digits starting with 0)
   * @param {string} phone
   * @returns {boolean}
   */
  isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10 && cleaned.startsWith("0");
  },

  /**
   * Validate price (must be positive number)
   * @param {number} price
   * @returns {boolean}
   */
  isValidPrice(price) {
    return typeof price === "number" && price > 0;
  },

  /**
   * Validate rating (must be 1-5)
   * @param {number} rating
   * @returns {boolean}
   */
  isValidRating(rating) {
    return typeof rating === "number" && rating >= 1 && rating <= 5;
  },

  /**
   * Validate required fields
   * @param {object} data - Object with field values
   * @param {Array<string>} requiredFields - Array of required field names
   * @returns {object} { isValid: boolean, missingFields: Array<string> }
   */
  validateRequiredFields(data, requiredFields) {
    const missingFields = requiredFields.filter(
      (field) => !data[field] || data[field] === ""
    );

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  },

  /**
   * Validate URL format
   * @param {string} url
   * @returns {boolean}
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate ZIP code (US format)
   * @param {string} zipCode
   * @returns {boolean}
   */
  isValidZipCode(zipCode) {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  },

  /**
   * Sanitize string (remove HTML tags)
   * @param {string} str
   * @returns {string}
   */
  sanitizeString(str) {
    return str.replace(/<[^>]*>/g, "").trim();
  },
};
