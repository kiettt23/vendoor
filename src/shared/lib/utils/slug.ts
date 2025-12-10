import { slugify } from "./format";

/** Tạo unique slug bằng cách append timestamp */
export function generateTimestampSlug(text: string): string {
  return `${slugify(text)}-${Date.now().toString(36)}`;
}

/** Tạo unique slug bằng cách append random string */
export function generateRandomSlug(text: string, length = 6): string {
  const suffix = Math.random()
    .toString(36)
    .substring(2, 2 + length);
  return `${slugify(text)}-${suffix}`;
}

/**
 * Tạo unique slug với check tồn tại trong DB
 * @param text - Text gốc để tạo slug
 * @param checkExists - Function check slug đã tồn tại chưa
 * @returns Slug unique (base hoặc base-suffix)
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
