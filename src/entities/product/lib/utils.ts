import { slugify } from "@/shared/lib";

export function calculateDiscount(price: number, compareAtPrice: number | null): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function hasDiscount(price: number, compareAtPrice: number | null): boolean {
  return !!compareAtPrice && compareAtPrice > price;
}

export function validateSKU(sku: string): boolean {
  const skuRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  return sku.length >= 3 && sku.length <= 20 && skuRegex.test(sku);
}

export async function generateUniqueSlug(
  baseText: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = slugify(baseText);
  const exists = await checkExists(baseSlug);
  if (!exists) return baseSlug;
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomSuffix}`;
}

