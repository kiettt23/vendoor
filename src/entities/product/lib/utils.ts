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

export function calculateAverageRating(reviews: { rating: number }[]): number | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

