// 1.000.000 ₫
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// $1,000.00
export function formatPriceUSD(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

// 1.000.000
export function formatNumber(number: number): string {
  return new Intl.NumberFormat("vi-VN").format(number);
}

// 20 for 20% off
export function calculateDiscount(mrp: number, price: number): number {
  if (mrp <= 0 || price >= mrp) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

// 20% OFF
export function formatDiscount(mrp: number, price: number): string {
  const discount = calculateDiscount(mrp, price);
  return discount > 0 ? `${discount}% OFF` : "";
}
