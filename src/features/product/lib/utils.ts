// ============================================
// PRODUCT UTILITIES
// ============================================

/**
 * Format price to Vietnamese Dong (VND)
 *
 * @example
 * formatPrice(100000) // "100.000 ₫"
 * formatPrice(1500000) // "1.500.000 ₫"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

/**
 * Calculate discount percentage
 *
 * @returns Discount percentage (0-100) or null if no discount
 *
 * @example
 * calculateDiscount(200000, 300000) // 33 (33% off)
 * calculateDiscount(100000, 100000) // null (no discount)
 * calculateDiscount(100000, null) // null
 */
export function calculateDiscount(
  price: number,
  compareAtPrice: number | null
): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/**
 * Generate URL-friendly slug from Vietnamese text
 * - Converts to lowercase
 * - Removes accents (à → a, ê → e)
 * - Converts đ → d
 * - Replaces spaces and special chars with hyphens
 *
 * @example
 * slugify("Áo Thun Nam Đẹp") // "ao-thun-nam-dep"
 * slugify("Giày Nike Air Max") // "giay-nike-air-max"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Normalize Unicode (é → e + ´)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[đĐ]/g, "d") // Vietnamese đ → d
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with -
    .replace(/^-+|-+$/g, ""); // Trim hyphens
}

/**
 * Validate SKU format
 * - Must be alphanumeric + hyphens
 * - Length: 3-20 characters
 * - No consecutive hyphens
 *
 * @example
 * validateSKU("PROD-001") // true
 * validateSKU("abc") // true
 * validateSKU("a") // false (too short)
 * validateSKU("a--b") // false (consecutive hyphens)
 */
export function validateSKU(sku: string): boolean {
  const skuRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  return sku.length >= 3 && sku.length <= 20 && skuRegex.test(sku);
}

/**
 * Check if product has discount
 */
export function hasDiscount(
  price: number,
  compareAtPrice: number | null
): boolean {
  return !!compareAtPrice && compareAtPrice > price;
}

/**
 * Format stock status text
 *
 * @example
 * formatStockStatus(0) // "Hết hàng"
 * formatStockStatus(5) // "Còn 5 sản phẩm"
 * formatStockStatus(100) // "Còn hàng"
 */
export function formatStockStatus(stock: number): string {
  if (stock === 0) return "Hết hàng";
  if (stock <= 10) return `Còn ${stock} sản phẩm`;
  return "Còn hàng";
}

/**
 * Generate unique slug with collision handling
 * - First try: base slug (e.g., "ao-thun-nam")
 * - If exists: append random string (e.g., "ao-thun-nam-a3f2x1")
 *
 * @param baseText - Base text to slugify
 * @param checkExists - Async function to check if slug exists
 * @returns Promise<string> - Unique slug
 *
 * @example
 * const slug = await generateUniqueSlug(
 *   "Áo Thun Nam",
 *   async (slug) => {
 *     const exists = await prisma.product.findUnique({ where: { slug } });
 *     return !!exists;
 *   }
 * );
 */
export async function generateUniqueSlug(
  baseText: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = slugify(baseText);

  // Try base slug first
  const exists = await checkExists(baseSlug);
  if (!exists) {
    return baseSlug;
  }

  // Generate random suffix (6 characters)
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomSuffix}`;
}
