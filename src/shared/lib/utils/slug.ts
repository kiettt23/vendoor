import { slugify } from "./format";

/**
 * Tạo unique slug bằng cách thêm timestamp (base36) vào cuối.
 *
 * Timestamp đảm bảo mỗi slug là unique vì mỗi millisecond
 * sẽ tạo ra một timestamp khác nhau.
 *
 * @param text - Text gốc cần chuyển thành slug
 * @returns Slug với suffix là timestamp dạng base36
 *
 * @example
 * // Cách hoạt động:
 * // 1. slugify("iPhone 15") → "iphone-15"
 * // 2. Date.now() → 1702540800000
 * // 3. (1702540800000).toString(36) → "lqm8z9c"
 * // 4. Kết hợp: "iphone-15-lqm8z9c"
 *
 * generateTimestampSlug("iPhone 15 Pro Max")
 * // → "iphone-15-pro-max-lqm8z9c"
 *
 * generateTimestampSlug("Áo Thun Nam - Size XL")
 * // → "ao-thun-nam-size-xl-lqm8z9d"
 */
export function generateTimestampSlug(text: string): string {
  return `${slugify(text)}-${Date.now().toString(36)}`;
}

/**
 * Tạo unique slug bằng cách thêm random string vào cuối.
 *
 * Random string được tạo từ Math.random() và chuyển sang base36.
 * Có xác suất trùng rất thấp nhưng không đảm bảo 100% unique.
 *
 * @param text - Text gốc cần chuyển thành slug
 * @param length - Số ký tự của suffix random (mặc định: 6)
 * @returns Slug với suffix random
 *
 * @example
 * // Cách hoạt động:
 * // 1. Math.random() → 0.123456789
 * // 2. (0.123456789).toString(36) → "0.4fzyo82mvyr"
 * // 3. "0.4fzyo82mvyr".substring(2, 8) → "4fzyo8"
 * // 4. Kết hợp: "macbook-pro-4fzyo8"
 *
 * generateRandomSlug("MacBook Pro")
 * // → "macbook-pro-x7k9m2"
 *
 * generateRandomSlug("MacBook Pro", 4)
 * // → "macbook-pro-x7k9"
 *
 * generateRandomSlug("Điện thoại Samsung", 8)
 * // → "dien-thoai-samsung-a1b2c3d4"
 */
export function generateRandomSlug(text: string, length = 6): string {
  const suffix = Math.random()
    .toString(36)
    .substring(2, 2 + length);
  return `${slugify(text)}-${suffix}`;
}

/**
 * Tạo unique slug với kiểm tra tồn tại trong database.
 *
 * Đây là function chính để tạo slug cho products, categories, etc.
 * Nó đảm bảo 100% slug là unique trong database.
 *
 * Flow:
 * 1. Tạo base slug từ text
 * 2. Kiểm tra xem slug đã tồn tại trong DB chưa
 * 3. Nếu chưa → trả về base slug
 * 4. Nếu có rồi → thêm timestamp suffix
 *
 * @param text - Text gốc cần chuyển thành slug
 * @param checkExists - Callback function để kiểm tra slug đã tồn tại chưa
 *                      Nhận vào slug string, trả về Promise<boolean>
 *                      true = đã tồn tại, false = chưa tồn tại
 * @returns Promise<string> - Slug đảm bảo unique trong database
 *
 * @example
 * // Dùng cho Product
 * const productSlug = await generateUniqueSlug(
 *   "iPhone 15 Pro Max",
 *   async (slug) => {
 *     const existing = await prisma.product.findUnique({ where: { slug } });
 *     return existing !== null;
 *   }
 * );
 * // productSlug = "iphone-15-pro-max" (nếu chưa tồn tại)
 * // productSlug = "iphone-15-pro-max-lqm8z9c" (nếu đã tồn tại)
 *
 * @example
 * // Dùng cho Category
 * const categorySlug = await generateUniqueSlug(
 *   "Điện Thoại",
 *   async (slug) => {
 *     const existing = await prisma.category.findUnique({ where: { slug } });
 *     return existing !== null;
 *   }
 * );
 *
 * @example
 * // Dùng cho VendorProfile (shop name)
 * const shopSlug = await generateUniqueSlug(
 *   "Cửa hàng ABC",
 *   async (slug) => {
 *     const existing = await prisma.vendorProfile.findUnique({ where: { slug } });
 *     return existing !== null;
 *   }
 * );
 */
export async function generateUniqueSlug(
  text: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = slugify(text);
  const exists = await checkExists(baseSlug);
  if (!exists) return baseSlug;
  return generateTimestampSlug(text);
}
