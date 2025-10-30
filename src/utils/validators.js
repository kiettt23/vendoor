export const validators = {
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10 && cleaned.startsWith("0");
  },

  isValidPrice(price) {
    return typeof price === "number" && price > 0;
  },

  isValidRating(rating) {
    return typeof rating === "number" && rating >= 1 && rating <= 5;
  },

  validateRequiredFields(data, requiredFields) {
    const missingFields = requiredFields.filter(
      (field) => !data[field] || data[field] === ""
    );

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  },

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isValidZipCode(zipCode) {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  },

  sanitizeString(str) {
    return str.replace(/<[^>]*>/g, "").trim();
  },
};
