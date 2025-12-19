/**
 * Product Data Transformers
 *
 * VẤN ĐỀ: Prisma trả về data phức tạp, nested, có nhiều arrays không cần thiết
 * GIẢI PHÁP: Transform thành objects đơn giản cho Frontend
 *
 * EXAMPLE:
 * Prisma raw data:
 *   { variants: [{price: 25M}, {price: 28M}], reviews: [{rating: 5}, {rating: 4}] }
 *   ↓
 * Clean data:
 *   { price: 25M, rating: 4.5, reviewCount: 2 }
 *
 * LỢI ÍCH:
 * - Tránh duplicate logic (1 nơi sửa → apply mọi query)
 * - Consistent format (tất cả queries trả về cùng structure)
 * - Easy testing (pure functions, no side effects)
 */

import type { ProductWithInclude } from "@/shared/lib/db";
import type { productListInclude } from "@/shared/lib/db/prisma-includes";
import type { ProductListItem } from "../model/types";
import { calculateAverageRating } from "./utils";

// ============================================================================
// Transform Functions
// ============================================================================

/**
 * Transform 1 sản phẩm từ Database → Format cho Frontend
 *
 * LÀM GÌ:
 * 1. Chọn variant đầu tiên làm default (price, stock)
 * 2. Chọn image đầu tiên làm main image
 * 3. Tính rating trung bình từ array reviews
 * 4. Đếm số reviews
 * 5. Flatten nested vendor.vendorProfile → vendor.shopName
 *
 * INPUT: Raw Prisma product (nested, có arrays)
 * OUTPUT: ProductListItem (flat, single values)
 *
 * @example
 * // INPUT từ DB
 * {
 *   variants: [{ price: 25000000 }],
 *   reviews: [{ rating: 5 }, { rating: 4 }],
 *   vendor: { vendorProfile: { shopName: "Shop A" } }
 * }
 * // OUTPUT
 * {
 *   price: 25000000,        // từ variants[0]
 *   rating: 4.5,            // avg của reviews
 *   reviewCount: 2,         // count reviews
 *   vendor: { shopName: "Shop A" }  // flatten
 * }
 */
export function transformToProductListItem(
  product: ProductWithInclude<typeof productListInclude>
): ProductListItem {
  const reviewCount = product.reviews.length;
  const avgRating = calculateAverageRating(product.reviews);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.variants[0]?.price || 0,
    compareAtPrice: product.variants[0]?.compareAtPrice || null,
    stock: product.variants[0]?.stock ?? 0,
    variantId: product.variants[0]?.id || "",
    image: product.images[0]?.url || "",
    vendor: {
      id: product.vendor.id,
      shopName: product.vendor.vendorProfile?.shopName || "Vendoor",
    },
    category: {
      name: product.category.name,
      slug: product.category.slug,
    },
    rating: avgRating,
    reviewCount,
  };
}

/**
 * Transform NHIỀU products cùng lúc
 *
 * Chỉ là wrapper để viết gọn:
 * transformToProductListItems(products)  thay vì
 * products.map(transformToProductListItem)
 */
export function transformToProductListItems(
  products: ProductWithInclude<typeof productListInclude>[]
): ProductListItem[] {
  return products.map(transformToProductListItem);
}

/**
 * Transform NHIỀU products + LỌC bỏ vendor không hợp lệ
 *
 * EDGE CASE: Có products mà vendor.vendorProfile = null (vendor bị xóa)
 * GIẢI PHÁP: Filter ra trước khi transform → tránh crash
 *
 * SỬ DỤNG KHI: Related products, search results có thể có vendor không active
 *
 * @example
 * [
 *   { vendor: { vendorProfile: {...} } },  // ✅ OK → keep
 *   { vendor: { vendorProfile: null } },   // ❌ NULL → remove
 *   { vendor: { vendorProfile: {...} } }   // ✅ OK → keep
 * ]
 * → Returns 2 products (bỏ cái null)
 */
export function transformToProductListItemsSafe(
  products: ProductWithInclude<typeof productListInclude>[]
): ProductListItem[] {
  return products
    .filter((p) => p.vendor.vendorProfile)
    .map(transformToProductListItem);
}
