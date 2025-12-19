# Vendoor - Caching Strategy

Tài liệu giải thích chi tiết chiến lược caching trong dự án Vendoor.

---

## 📋 Mục lục

1. [Tổng quan về Caching](#1-tổng-quan-về-caching)
2. [3 Layers of Caching](#2-3-layers-of-caching)
3. [Route Rendering Strategy](#3-route-rendering-strategy)
4. [Cache Tags System](#4-cache-tags-system)
5. [Cache Utilities](#5-cache-utilities)
6. [Cache Invalidation](#6-cache-invalidation)
7. [Best Practices](#7-best-practices)
8. [Debugging Cache](#8-debugging-cache)

---

## 1. Tổng quan về Caching

### Tại sao cần Caching?

Trong e-commerce, có rất nhiều queries lặp đi lặp lại:

- Trang chủ hiển thị featured products → Query products table
- Category page → Query products by category
- Mỗi ProductCard → Query images, variants, reviews

**Không có cache:**

```
User A truy cập /products → Query database
User B truy cập /products → Query database (lặp lại!)
User C truy cập /products → Query database (lặp lại!)
```

**Có cache:**

```
User A truy cập /products → Query database → Save to cache
User B truy cập /products → Return from cache (instant!)
User C truy cập /products → Return from cache (instant!)
```

### Caching trong Next.js

Next.js App Router cung cấp nhiều cơ chế caching:

| Mechanism          | Scope          | Purpose                           |
| ------------------ | -------------- | --------------------------------- |
| `cache()` (React)  | Single request | Dedupe same query trong 1 request |
| `unstable_cache()` | Cross requests | Cache data với TTL và tags        |
| Route Cache        | Full page      | Cache static pages                |
| Data Cache         | fetch() calls  | Cache fetch responses             |

---

## 2. 3 Layers of Caching

Vendoor sử dụng 3 layers caching:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Layer 1: React cache() - Request Deduplication                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Khi 1 page render:                                             │
│  - Header gọi getCategories()                                   │
│  - Sidebar gọi getCategories()                                  │
│  - Footer gọi getCategories()                                   │
│                                                                 │
│  → Chỉ có 1 database query thực sự!                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 2: unstable_cache() - Cross-Request Caching              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  User A request → Cache miss → Query DB → Store in cache        │
│  User B request → Cache hit → Return cached data (1ms vs 100ms) │
│                                                                 │
│  Features:                                                      │
│  - TTL (Time To Live): Auto expire sau X seconds                │
│  - Tags: Invalidate theo category                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 3: Full Route Cache (Production)                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Static pages được cache at build time:                         │
│  - /about                                                       │
│  - /contact                                                     │
│  - Static product pages                                         │
│                                                                 │
│  → Zero server processing, served from CDN                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Route Rendering Strategy

### Static vs Dynamic Rendering

Next.js App Router có 2 modes rendering:

| Mode        | Behavior                 | Use Case                      |
| ----------- | ------------------------ | ----------------------------- |
| **Static**  | Pre-render at build time | Public pages, marketing       |
| **Dynamic** | Render on each request   | User-specific, real-time data |

### Vendoor Route Strategy

```typescript
// ❌ KHÔNG dùng force-dynamic ở root layout
// (đã xóa vì disable caching cho toàn app)

// ✅ Dùng force-dynamic CHỈ cho pages cần fresh session
export const dynamic = "force-dynamic";
```

### Page Classifications

#### 🔴 Dynamic Pages (`force-dynamic`)

Pages cần render mỗi request vì phụ thuộc vào session/user data:

| Route              | Lý do                              |
| ------------------ | ---------------------------------- |
| `/account`         | User profile data                  |
| `/account/profile` | User settings                      |
| `/checkout`        | Cart validation, session           |
| `/orders`          | User's order history               |
| `/orders/[id]`     | Order detail + auth                |
| `/wishlist`        | User's wishlist                    |
| `/vendor/*`        | Vendor dashboard, products, orders |
| `/admin/*`         | Admin dashboard, stats             |

```typescript
// Ví dụ: src/app/(main)/(customer)/account/page.tsx
import { requireAuth } from "@/entities/user";

// Force dynamic to ensure fresh user data
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  await requireAuth();
  // ...
}
```

#### 🟢 ISR Pages (`revalidate`)

Pages có thể cache nhưng cần update định kỳ:

| Route              | Revalidate | Lý do                                                        |
| ------------------ | ---------- | ------------------------------------------------------------ |
| `/products/[slug]` | 60s        | Product detail có thể cache, update khi stock/price thay đổi |

```typescript
// src/app/(main)/(customer)/products/[slug]/page.tsx

// Enable ISR with 60s revalidation
// Pages are generated on-demand at first request, then cached
export const revalidate = 60;

export default async function ProductDetailPage({ params }: PageProps) {
  // Page renders, được cache 60s
  // Sau 60s, request tiếp theo trigger background revalidation
}
```

#### ⚪ Default (Auto)

Pages không có explicit config - Next.js tự quyết định:

| Route                 | Actual Behavior             |
| --------------------- | --------------------------- |
| `/` (Homepage)        | Dynamic (có database calls) |
| `/products`           | Dynamic (search, filters)   |
| `/stores`             | Dynamic (list vendors)      |
| `/login`, `/register` | Dynamic (auth forms)        |

### force-dynamic + Data Cache

**Quan trọng:** `force-dynamic` KHÔNG conflict với `unstable_cache()`:

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 1: Full Route Cache                                       │
│ ─────────────────────────────────────────────────────────────── │
│ ❌ force-dynamic DISABLE layer này                              │
│ → Page phải render lại mỗi request                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Layer 2: Data Cache (unstable_cache)                            │
│ ─────────────────────────────────────────────────────────────── │
│ ✅ force-dynamic KHÔNG ảnh hưởng layer này                      │
│ → unstable_cache VẪN hoạt động bình thường                      │
│ → Data vẫn được cache với tags và TTL                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Layer 3: React cache() - Request Dedup                          │
│ ─────────────────────────────────────────────────────────────── │
│ ✅ force-dynamic KHÔNG ảnh hưởng layer này                      │
│ → Cùng query gọi 5x trong 1 request = 1 DB call                 │
└─────────────────────────────────────────────────────────────────┘
```

**Ví dụ thực tế:**

```typescript
// Account page: force-dynamic
export const dynamic = "force-dynamic";
// → Page HTML render mỗi request

export default async function AccountPage() {
  const stats = await getCachedUserStats(userId);
  // → unstable_cache vẫn hoạt động
  // → Nếu data < 60s cũ, return cached
  // → Nếu > 60s, query DB và cache mới
}
```

---

## 4. Cache Tags System

### Định nghĩa Cache Tags

```typescript
// shared/lib/constants/cache.ts

export const CACHE_TAGS = {
  // ===== Products =====
  PRODUCTS: "products",
  // Tag cho tất cả products
  // Invalidate khi: create, update, delete any product

  PRODUCT: (slug: string) => `product:${slug}`,
  // Tag cho 1 product cụ thể
  // Ví dụ: "product:iphone-15-pro-max"
  // Invalidate khi: update product đó

  PRODUCTS_BY_CATEGORY: (categorySlug: string) =>
    `products:category:${categorySlug}`,
  // Tag cho products trong 1 category
  // Ví dụ: "products:category:electronics"
  // Invalidate khi: product thêm/bớt khỏi category

  PRODUCTS_BY_VENDOR: (vendorId: string) => `products:vendor:${vendorId}`,
  // Tag cho products của 1 vendor
  // Ví dụ: "products:vendor:vendor_abc123"
  // Invalidate khi: vendor tạo/sửa/xóa product

  // ===== Categories =====
  CATEGORIES: "categories",
  // Tag cho tất cả categories
  // Invalidate khi: admin tạo/sửa/xóa category

  // ===== Orders =====
  ORDERS: "orders",
  // Tag chung cho orders

  ORDERS_BY_USER: (userId: string) => `orders:user:${userId}`,
  // Orders của 1 user cụ thể
  // Invalidate khi: user đặt hàng mới

  ORDERS_BY_VENDOR: (vendorId: string) => `orders:vendor:${vendorId}`,
  // Orders của 1 vendor
  // Invalidate khi: có order mới cho vendor

  // ===== Stats =====
  VENDOR_STATS: (vendorId: string) => `vendor:stats:${vendorId}`,
  // Thống kê của vendor (revenue, orders, etc.)
  // Invalidate khi: order status thay đổi

  ADMIN_STATS: "admin:stats",
  // Thống kê tổng hệ thống
  // Invalidate khi: có thay đổi quan trọng
};
```

### Cache Durations

```typescript
// shared/lib/constants/cache.ts

export const CACHE_DURATION = {
  // Thời gian cache (seconds)

  PRODUCTS: 60, // 1 phút
  // Products thay đổi thường xuyên (stock, price)

  PRODUCT_DETAIL: 60, // 1 phút
  // Chi tiết product cũng cần fresh data

  CATEGORIES: 3600, // 1 giờ
  // Categories ít thay đổi

  VENDOR_PRODUCTS: 60, // 1 phút
  // Vendor có thể update products thường xuyên

  VENDOR_STATS: 300, // 5 phút
  // Stats không cần real-time

  ADMIN_STATS: 300, // 5 phút
  // Admin stats cũng không cần real-time

  HOMEPAGE: 60, // 1 phút
  // Homepage data (featured, flash sale)
};
```

---

## 5. Cache Utilities

### 5.1. Basic Cache Wrapper

```typescript
// shared/lib/cache/index.ts

import { unstable_cache } from "next/cache";
import { cache } from "react";

/**
 * Tạo cached function với tags và TTL
 *
 * @param fn - Async function cần cache
 * @param config - Cache configuration
 * @param keyParts - Unique key parts để phân biệt cache entries
 */
export function createCachedQuery<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  config: { tags?: string[]; revalidate?: number },
  keyParts?: string[]
): (...args: TArgs) => Promise<TResult> {
  return unstable_cache(fn, keyParts, {
    tags: config.tags,
    revalidate: config.revalidate,
  });
}
```

**Giải thích từng dòng:**

```typescript
// unstable_cache là function của Next.js
// Nhận vào:
// 1. fn: function cần cache
// 2. keyParts: array strings để tạo unique cache key
// 3. options: { tags, revalidate }

return unstable_cache(
  fn, // Function gốc
  keyParts, // Ví dụ: ["products", "electronics"]
  {
    tags: config.tags, // Ví dụ: ["products", "products:category:electronics"]
    revalidate: config.revalidate, // Ví dụ: 60 (seconds)
  }
);
```

### 5.2. Specialized Cache Functions

```typescript
// shared/lib/cache/index.ts

/**
 * Cache cho product list
 * Tự động thêm tags phù hợp
 */
export function cacheProducts<TResult>(
  fn: () => Promise<TResult>,
  categorySlug?: string
): () => Promise<TResult> {
  // Luôn có tag "products"
  const tags: string[] = [CACHE_TAGS.PRODUCTS];

  // Nếu filter theo category, thêm tag category
  if (categorySlug) {
    tags.push(CACHE_TAGS.PRODUCTS_BY_CATEGORY(categorySlug));
  }

  return unstable_cache(
    fn,
    ["products", categorySlug || "all"], // Cache key
    {
      tags,
      revalidate: CACHE_DURATION.PRODUCTS, // 60 seconds
    }
  );
}
```

**Cách sử dụng:**

```typescript
// entities/product/api/queries.ts

export async function getProducts(categorySlug?: string) {
  // Wrap database query với cache
  const cachedQuery = cacheProducts(async () => {
    return prisma.product.findMany({
      where: categorySlug ? { category: { slug: categorySlug } } : undefined,
      include: { images: true, variants: true },
    });
  }, categorySlug);

  return cachedQuery();
}
```

### 5.3. Product Detail Cache

```typescript
/**
 * Cache cho chi tiết 1 product
 * Tag: products (general) + product:slug (specific)
 */
export function cacheProductDetail<TResult>(
  fn: () => Promise<TResult>,
  slug: string
): () => Promise<TResult> {
  return unstable_cache(
    fn,
    ["product", slug], // Unique key per product
    {
      tags: [
        CACHE_TAGS.PRODUCTS, // Invalidate khi any product changes
        CACHE_TAGS.PRODUCT(slug), // Invalidate khi product này changes
      ],
      revalidate: CACHE_DURATION.PRODUCT_DETAIL,
    }
  );
}
```

### 5.4. Vendor Stats Cache

```typescript
/**
 * Cache thống kê vendor
 * Invalidate khi orders của vendor thay đổi
 */
export function cacheVendorStats<TResult>(
  fn: () => Promise<TResult>,
  vendorId: string
): () => Promise<TResult> {
  return unstable_cache(fn, ["vendor-stats", vendorId], {
    tags: [CACHE_TAGS.VENDOR_STATS(vendorId)],
    revalidate: CACHE_DURATION.VENDOR_STATS, // 5 minutes
  });
}
```

### 5.5. Dual Cache (Request Dedup + Cross-Request)

```typescript
/**
 * Kết hợp React cache() và unstable_cache()
 * - React cache(): Dedupe trong 1 request
 * - unstable_cache(): Cache across requests
 */
export function createDualCache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  config: { tags?: string[]; revalidate?: number },
  keyParts?: string[]
): (...args: TArgs) => Promise<TResult> {
  // Bước 1: Wrap với unstable_cache cho cross-request caching
  const serverCached = unstable_cache(fn, keyParts, {
    tags: config.tags,
    revalidate: config.revalidate,
  });

  // Bước 2: Wrap tiếp với React cache() cho request dedup
  return cache(serverCached);
}
```

**Tại sao cần cả hai?**

```
Scenario: ProductPage render

Header → getCategories()     ─┐
Sidebar → getCategories()     │ React cache() dedupe
Footer → getCategories()     ─┘   = 1 actual call
                                         │
                                         ▼
                              unstable_cache()
                                         │
                            ┌────────────┴────────────┐
                            ▼                          ▼
                      Cache Hit                   Cache Miss
                      (return cached)             (query DB, store)
```

---

## 6. Cache Invalidation

### 6.1. Revalidate Functions

```typescript
// shared/lib/cache/invalidation.ts

import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "../constants/cache";

/**
 * Invalidate tất cả product caches
 * Gọi khi: product created/updated/deleted
 */
export function revalidateProducts() {
  revalidateTag(CACHE_TAGS.PRODUCTS);
}

/**
 * Invalidate cache cho 1 product cụ thể
 * Gọi khi: product updated
 */
export function revalidateProduct(slug: string) {
  revalidateTag(CACHE_TAGS.PRODUCTS); // General list
  revalidateTag(CACHE_TAGS.PRODUCT(slug)); // Specific product
}

/**
 * Invalidate tất cả cache liên quan đến vendor
 * Gọi khi: vendor's product changes, order changes
 */
export function revalidateVendor(vendorId: string) {
  revalidateTag(CACHE_TAGS.PRODUCTS_BY_VENDOR(vendorId));
  revalidateTag(CACHE_TAGS.VENDOR_STATS(vendorId));
  revalidateTag(CACHE_TAGS.ORDERS_BY_VENDOR(vendorId));
}

/**
 * Invalidate reviews
 * Gọi khi: review created/updated/deleted
 */
export function revalidateReviews(productSlug: string) {
  revalidateTag(CACHE_TAGS.PRODUCT(productSlug));
}

/**
 * Invalidate orders
 * Gọi khi: order created, status updated
 */
export function revalidateOrders(userId?: string, vendorId?: string) {
  revalidateTag(CACHE_TAGS.ORDERS);
  if (userId) {
    revalidateTag(CACHE_TAGS.ORDERS_BY_USER(userId));
  }
  if (vendorId) {
    revalidateTag(CACHE_TAGS.ORDERS_BY_VENDOR(vendorId));
    revalidateTag(CACHE_TAGS.VENDOR_STATS(vendorId));
  }
}
```

### 6.2. Invalidation trong Server Actions

```typescript
// entities/product/api/actions.ts

export async function createProduct(data: ProductFormInput) {
  const session = await requireSession();

  // Create product trong database
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: generateSlug(data.name),
      vendorId: session.user.id,
      // ... other fields
    },
  });

  // ⬇️ INVALIDATE CACHES SAU KHI TẠO

  // 1. Invalidate general products list
  revalidateTag(CACHE_TAGS.PRODUCTS);

  // 2. Invalidate vendor's products
  revalidateTag(CACHE_TAGS.PRODUCTS_BY_VENDOR(session.user.id));

  // 3. Nếu có category, invalidate category products
  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
      select: { slug: true },
    });
    if (category) {
      revalidateTag(CACHE_TAGS.PRODUCTS_BY_CATEGORY(category.slug));
    }
  }

  return { success: true, product };
}
```

### 6.3. Checkout Flow Invalidation

```typescript
// features/checkout/api/actions.ts

export async function createOrders(...) {
  // ... create orders logic ...

  // INVALIDATE MULTIPLE CACHES

  // 1. Products (stock changed)
  revalidateTag(CACHE_TAGS.PRODUCTS);

  // 2. General orders
  revalidateTag(CACHE_TAGS.ORDERS);

  // 3. User's orders
  revalidateTag(CACHE_TAGS.ORDERS_BY_USER(session.user.id));

  // 4. Vendor-specific caches (loop qua tất cả vendors)
  for (const vendorId of affectedVendorIds) {
    revalidateTag(CACHE_TAGS.ORDERS_BY_VENDOR(vendorId));
    revalidateTag(CACHE_TAGS.VENDOR_STATS(vendorId));
  }

  return result;
}
```

---

## 7. Best Practices

### ✅ DO

```typescript
// ✅ Dùng tags có hierarchy
revalidateTag("products");                    // Broad
revalidateTag("products:category:electronics"); // Specific

// ✅ Invalidate sau mutations
await prisma.product.update({...});
revalidateTag(CACHE_TAGS.PRODUCT(slug));

// ✅ Set appropriate TTL
// Frequently changing: 60s
// Rarely changing: 3600s (1 hour)

// ✅ Combine React cache + unstable_cache
const getCachedData = cache(
  unstable_cache(fetchData, ["key"], { tags: ["tag"] })
);
```

### ❌ DON'T

```typescript
// ❌ Cache user-specific data với general tag
// User A's data sẽ show cho User B!
unstable_cache(getUserOrders, ["orders"], {
  tags: ["orders"],  // ❌ Too broad!
});

// ✅ Correct
unstable_cache(getUserOrders, ["orders", userId], {
  tags: [CACHE_TAGS.ORDERS_BY_USER(userId)],
});

// ❌ Forget to invalidate
await prisma.product.update({...});
// Missing revalidateTag!

// ❌ Over-invalidate
// Invalidate everything on every change
revalidateTag("products");
revalidateTag("orders");
revalidateTag("users");
// ❌ This defeats the purpose of caching!
```

---

## 8. Debugging Cache

### Development Tools

```typescript
// Thêm logging để debug cache
const cachedFunction = unstable_cache(
  async () => {
    console.log("🔍 Cache MISS - fetching from DB");
    return await prisma.product.findMany();
  },
  ["products"],
  { tags: ["products"], revalidate: 60 }
);

// Khi cache hit, console.log không chạy
// Khi cache miss, sẽ thấy log
```

### Force Revalidate

```typescript
// Trong development, force revalidate toàn bộ
import { revalidateTag } from "next/cache";

// Route handler để manual revalidate
// app/api/revalidate/route.ts
export async function POST(req: Request) {
  const { tag } = await req.json();
  revalidateTag(tag);
  return Response.json({ revalidated: true });
}
```

### Check Cache Headers

```bash
# Xem cache headers trong response
curl -I https://your-site.com/products

# Look for:
# x-vercel-cache: HIT    → Served from cache
# x-vercel-cache: MISS   → Fetched fresh
```

---

## 8. Visual Summary

```
                    ┌──────────────────────────────────┐
                    │         User Request              │
                    └──────────────┬───────────────────┘
                                   │
                    ┌──────────────▼───────────────────┐
                    │     React cache() (Layer 1)      │
                    │    Request-level deduplication   │
                    │                                  │
                    │  Same fn called 5x = 1 execution │
                    └──────────────┬───────────────────┘
                                   │
                    ┌──────────────▼───────────────────┐
                    │  unstable_cache() (Layer 2)      │
                    │    Cross-request caching         │
                    │                                  │
                    │  Tags: ["products", "category:x"]│
                    │  TTL: 60 seconds                 │
                    └──────────────┬───────────────────┘
                                   │
               ┌───────────────────┼───────────────────┐
               ▼                                       ▼
        ┌─────────────┐                        ┌─────────────┐
        │ Cache HIT   │                        │ Cache MISS  │
        │             │                        │             │
        │ Return data │                        │ Query DB    │
        │ (~1ms)      │                        │ Store cache │
        └─────────────┘                        │ (~100ms)    │
                                               └─────────────┘
                                                      │
                    ┌─────────────────────────────────┘
                    │
                    ▼
        ┌─────────────────────────────────────────────┐
        │            Cache Invalidation               │
        │                                             │
        │  createProduct() → revalidateTag("products")│
        │  updateProduct() → revalidateTag("product:x")│
        │  createOrder()   → revalidateTag("orders")  │
        └─────────────────────────────────────────────┘
```

---

## 🔗 Related Documentation

- [DATA_FLOW.md](./DATA_FLOW.md) - Luồng data và caching
- [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) - Tại sao chọn caching strategy này
- [API_REFERENCE.md](./API_REFERENCE.md) - Server Actions với cache invalidation
