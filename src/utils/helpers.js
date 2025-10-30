export function calculateDiscount(amount, discountPercent) {
  if (!discountPercent || discountPercent <= 0) return 0;
  return (amount * discountPercent) / 100;
}

export function calculateShipping(isPlusMember, standardFee = 5) {
  return isPlusMember ? 0 : standardFee;
}

export function calculateOrderTotal(items, discount = 0, shippingFee = 0) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return subtotal - discount + shippingFee;
}

export function calculateAverageRating(ratings) {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal
}

export function generateCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export function truncate(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export const helpers = {
  calculateDiscount,
  calculateShipping,
  calculateOrderTotal,
  calculateAverageRating,
  generateCode,
  slugify,
  truncate,
};
