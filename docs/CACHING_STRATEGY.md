# Caching Strategy - Vendoor

> Production-ready caching architecture for optimal performance

## Implementation Status ✅

| Phase | Status | Files |
|-------|--------|-------|
| **Phase 1: Foundation** | ✅ Done | `cache.ts`, `query-keys.ts`, `cache/index.ts`, `cache/revalidate.ts` |
| **Phase 2: Server Caching** | ✅ Done | All `queries.ts` and `actions.ts` files |
| **Phase 3: Client Caching** | ✅ Done | `ReactQueryProvider.tsx`, hooks |
| **Phase 4: Monitoring** | ⏳ Pending | - |

### Quick Reference - Implemented Files

```
src/shared/lib/
├── cache/
│   ├── index.ts         # unstable_cache wrappers (cacheProducts, cacheProductDetail, etc.)
│   └── revalidate.ts    # revalidateTag helpers (revalidateProduct, revalidateBulk, etc.)
├── constants/
│   ├── cache.ts         # CACHE_DURATION, STALE_TIME, GC_TIME, CACHE_TAGS
│   └── query-keys.ts    # React Query key factory
└── providers/
    └── ReactQueryProvider.tsx  # QueryClient config
```

### Next.js 16 Note ⚠️

```typescript
// Next.js 16 requires 2 arguments for revalidateTag:
revalidateTag("products", "max");  // ✅ Correct
revalidateTag("products");          // ❌ Old syntax

// "max" = stale-while-revalidate pattern
```

---

## Table of Contents

- [Overview](#overview)
- [Cache Layers](#cache-layers)
- [Cache Configuration by Data Type](#cache-configuration-by-data-type)
- [Cache Configuration by Page](#cache-configuration-by-page)
- [User Flow Examples](#user-flow-examples)
- [Cache Invalidation](#cache-invalidation)
- [Implementation Guide](#implementation-guide)
- [Monitoring & Debugging](#monitoring--debugging)

---

## Overview

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CACHE ARCHITECTURE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Request                                                                │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ LAYER 1: Browser Cache (React Query)                                │    │
│  │ • Per-user, per-device                                              │    │
│  │ • Instant for repeat visits                                         │    │
│  │ • staleTime + gcTime configuration                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │ Cache MISS                                                          │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ LAYER 2: CDN/Edge Cache (Vercel Edge Network)                       │    │
│  │ • Shared across all users                                           │    │
│  │ • Geographic distribution                                           │    │
│  │ • Static pages + ISR                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │ Cache MISS                                                          │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ LAYER 3: Server Cache (unstable_cache + Data Cache)                 │    │
│  │ • Cross-request caching                                             │    │
│  │ • Tag-based invalidation                                            │    │
│  │ • Revalidation strategies                                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │ Cache MISS                                                          │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ LAYER 4: Database (PostgreSQL + Prisma)                             │    │
│  │ • Connection pooling                                                │    │
│  │ • Query optimization                                                │    │
│  │ • Indexes                                                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Cache close to user**: Browser > Edge > Server > Database
2. **Granular invalidation**: Tag-based, not global
3. **Fresh when critical**: No cache for checkout, stock checks
4. **Stale-while-revalidate**: Show cached data, update in background

---

## Cache Layers

### Layer 1: React Query (Client-side)

**Purpose**: Per-user caching, instant repeat visits, optimistic updates.

**Configuration**:

| Data Type | staleTime | gcTime | Lý do |
|-----------|-----------|--------|-------|
| Product listing | 5 min | 30 min | Ít thay đổi |
| Product detail | 2 min | 15 min | Price/stock có thể thay đổi |
| Categories | 30 min | 1 hour | Rất ít thay đổi |
| User profile | 5 min | 10 min | User-specific |
| Cart | 0 (fresh) | 5 min | Critical data |
| Stock status | 30 sec | 2 min | Thay đổi thường xuyên |
| Orders | 1 min | 10 min | User-specific |
| Search results | 2 min | 10 min | Query-specific |

**Features to implement**:
- Prefetching on hover (product cards)
- Optimistic updates (wishlist, cart)
- Background refetching
- Query deduplication

### Layer 2: Edge/CDN Cache

**Purpose**: Shared cache across all users, geographic distribution.

**Strategies**:

| Strategy | Use Case | Config |
|----------|----------|--------|
| Static Generation | Marketing pages, categories | `generateStaticParams` |
| ISR | Product pages, store pages | `revalidate: 3600` |
| Dynamic | User-specific, checkout | `dynamic: 'force-dynamic'` |

**Headers**:
```
Cache-Control: s-maxage=3600, stale-while-revalidate=86400
```

### Layer 3: Server Cache (unstable_cache)

**Purpose**: Cross-request caching with tag-based invalidation.

**Configuration**:

```typescript
// Cache wrapper utility
import { unstable_cache } from 'next/cache';

export function createCachedQuery<T>(
  fn: () => Promise<T>,
  keyParts: string[],
  options: {
    tags: string[];
    revalidate?: number;
  }
) {
  return unstable_cache(fn, keyParts, options);
}
```

**TTL by data type**:

| Data | TTL | Tags |
|------|-----|------|
| Products | 1 hour | `['products', 'product-{slug}']` |
| Categories | 2 hours | `['categories', 'category-{slug}']` |
| Vendors | 1 hour | `['vendors', 'vendor-{id}']` |
| Reviews | 15 min | `['reviews', 'product-{slug}-reviews']` |
| Search | 15 min | `['search', 'search-{hash}']` |

### Layer 4: Database

**Optimizations**:
- Connection pooling (Prisma)
- Selective field queries (`select`)
- Proper indexes
- Query optimization

---

## Cache Configuration by Data Type

### Products

```typescript
// Product listing
{
  serverCache: {
    tags: ['products'],
    revalidate: 3600, // 1 hour
  },
  clientCache: {
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 30 * 60 * 1000,   // 30 min
  },
  edge: {
    revalidate: 3600,
  }
}

// Single product
{
  serverCache: {
    tags: ['products', 'product-{slug}'],
    revalidate: 1800, // 30 min
  },
  clientCache: {
    staleTime: 2 * 60 * 1000, // 2 min
    gcTime: 15 * 60 * 1000,   // 15 min
  },
  edge: {
    generateStaticParams: true,
    revalidate: 3600,
  }
}
```

### Stock Status

```typescript
// KHÔNG CACHE - Always fresh
{
  serverCache: null,
  clientCache: {
    staleTime: 30 * 1000, // 30 sec
    gcTime: 2 * 60 * 1000, // 2 min
  },
  edge: null,
}
```

### Categories

```typescript
{
  serverCache: {
    tags: ['categories'],
    revalidate: 7200, // 2 hours
  },
  clientCache: {
    staleTime: 30 * 60 * 1000, // 30 min
    gcTime: 60 * 60 * 1000,    // 1 hour
  },
  edge: {
    generateStaticParams: true,
    revalidate: 7200,
  }
}
```

### User-specific Data

```typescript
// Orders, Profile, Addresses
{
  serverCache: null, // User-specific, không shared cache
  clientCache: {
    staleTime: 1 * 60 * 1000, // 1 min
    gcTime: 10 * 60 * 1000,   // 10 min
  },
  edge: null,
}
```

### Cart & Checkout

```typescript
// KHÔNG CACHE - Critical, real-time
{
  serverCache: null,
  clientCache: null, // Use Zustand
  edge: {
    dynamic: 'force-dynamic',
  }
}
```

---

## Cache Configuration by Page

| Page | Rendering | Server Cache | Edge Cache | Client Cache |
|------|-----------|--------------|------------|--------------|
| `/` | ISR | ✅ 1h | ✅ 1h | ✅ 5min |
| `/products` | ISR + Dynamic | ✅ 30min | ✅ 30min | ✅ 5min |
| `/products/[slug]` | SSG + PPR | ✅ 30min | ✅ ISR 1h | ✅ 2min |
| `/categories/[slug]` | SSG | ✅ 2h | ✅ ISR 2h | ✅ 30min |
| `/stores` | ISR | ✅ 1h | ✅ 1h | ✅ 10min |
| `/stores/[id]` | SSG | ✅ 1h | ✅ ISR 1h | ✅ 5min |
| `/cart` | Client | ❌ | ❌ | Zustand |
| `/checkout` | Dynamic | ❌ | ❌ | ❌ |
| `/orders` | Dynamic | ❌ | ❌ | ✅ 1min |
| `/orders/[id]` | Dynamic | ❌ | ❌ | ✅ 1min |
| `/profile` | Dynamic | ❌ | ❌ | ✅ 5min |
| `/vendor/*` | Dynamic | ❌ | ❌ | ✅ 1min |
| `/admin/*` | Dynamic | ❌ | ❌ | ✅ 30sec |

---

## User Flow Examples

### Flow 1: Browse Products

```
User → /products
    │
    ▼
[Browser] React Query: MISS (first visit)
    │
    ▼
[Edge] Vercel Edge: HIT (shared cache)
    │
    ▼
Response: ~50ms from edge

─────────────────────────────────

User revisits (< 5 min)
    │
    ▼
[Browser] React Query: HIT
    │
    ▼
Response: INSTANT (no network)

─────────────────────────────────

User revisits (> 5 min, < 30 min)
    │
    ▼
[Browser] React Query: STALE
    │
    ├─▶ Show stale data immediately
    │
    └─▶ Background revalidation from edge
```

### Flow 2: Product Detail with PPR

```
User → /products/iphone-15-pro
    │
    ▼
[Edge] Static shell: INSTANT
    │
    ├─▶ Breadcrumb, layout, product name
    │
    ▼
[Streaming] Dynamic parts:
    │
    ├─▶ T=100ms: ProductPrice (cached 30min)
    ├─▶ T=150ms: StockStatus (fresh query)
    └─▶ T=300ms: Reviews (cached 15min)
```

### Flow 3: Add to Cart (Optimistic)

```
User clicks "Thêm vào giỏ"
    │
    ▼
[Client] useOptimistic: UI updates INSTANTLY
    │
    ├─▶ Cart count: 2 → 3
    ├─▶ Button: "Đã thêm ✓"
    │
    ▼
[Background] Server Action
    │
    ├─▶ Success: Confirm state
    └─▶ Failure: Rollback + show error
```

### Flow 4: Vendor Updates Product

```
Vendor submits form
    │
    ▼
[Server] updateProduct()
    │
    ▼
[DB] UPDATE products...
    │
    ▼
[Invalidate]
    ├─▶ revalidateTag('products')
    ├─▶ revalidateTag('product-iphone-15-pro')
    ├─▶ revalidateTag('category-phones')
    └─▶ revalidatePath('/products/iphone-15-pro')
    │
    ▼
Next request: Fresh data from DB
```

---

## Cache Invalidation

### Tag Hierarchy

```
products
├── product-{slug}
├── category-{id}-products
├── vendor-{id}-products
└── search-results

categories
├── category-{slug}
└── category-{id}

vendors
├── vendor-{id}
└── vendor-{id}-products

reviews
├── product-{slug}-reviews
└── user-{id}-reviews

orders
├── order-{id}
├── user-{id}-orders
└── vendor-{id}-orders

inventory
├── product-{slug}-stock
└── vendor-{id}-inventory
```

### Invalidation Matrix

| Action | Tags to Invalidate |
|--------|-------------------|
| Create product | `products`, `category-{id}-products`, `vendor-{id}-products` |
| Update product | `products`, `product-{slug}`, `category-{id}-products`, `vendor-{id}-products` |
| Delete product | Same as update + `search-results` |
| Update stock | `product-{slug}-stock`, `inventory` |
| Create review | `product-{slug}-reviews`, `reviews` |
| Update order status | `order-{id}`, `user-{id}-orders`, `vendor-{id}-orders` |
| Update category | `categories`, `category-{slug}` |
| Update vendor profile | `vendors`, `vendor-{id}` |

### Invalidation Code Pattern

```typescript
// In Server Actions
export async function updateProduct(id: string, data: UpdateData) {
  const product = await prisma.product.update({
    where: { id },
    data,
  });

  // Invalidate related caches
  revalidateTag('products');
  revalidateTag(`product-${product.slug}`);
  revalidateTag(`category-${product.categoryId}-products`);
  revalidateTag(`vendor-${product.vendorId}-products`);
  
  // Invalidate ISR page
  revalidatePath(`/products/${product.slug}`);

  return { success: true, data: product };
}
```

---

## Implementation Guide

### Phase 1: Foundation ✅ DONE

**Completed**:
- ✅ Created cache tag constants (`src/shared/lib/constants/cache.ts`)
- ✅ Created `unstable_cache` wrapper utility (`src/shared/lib/cache/index.ts`)
- ✅ Created revalidation helpers (`src/shared/lib/cache/revalidate.ts`)
- ✅ Query keys factory (`src/shared/lib/constants/query-keys.ts`)

**Key Code**:

```typescript
// Cache Tags - src/shared/lib/constants/cache.ts
export const CACHE_TAGS = {
  PRODUCTS: "products",
  PRODUCT: (slug: string) => `product:${slug}`,
  PRODUCTS_BY_CATEGORY: (slug: string) => `products:category:${slug}`,
  PRODUCTS_BY_VENDOR: (id: string) => `products:vendor:${id}`,
  // ...
};

// Cache Utilities - src/shared/lib/cache/index.ts
export function cacheProducts<T>(fn: () => Promise<T>, categorySlug?: string) {
  return unstable_cache(fn, ["products", categorySlug || "all"], {
    tags: [CACHE_TAGS.PRODUCTS],
    revalidate: CACHE_DURATION.PRODUCTS,
  });
}

// Revalidation - src/shared/lib/cache/revalidate.ts
export function revalidateProduct(slug: string) {
  revalidateTag(CACHE_TAGS.PRODUCT(slug), "max");
  revalidateTag(CACHE_TAGS.PRODUCTS, "max");
}
```

### Phase 2: Server Caching ✅ DONE

**Completed**:
- ✅ Product queries with `getCachedProductBySlug`, `getCachedFeaturedProducts`, etc.
- ✅ Category queries with `getCachedCategories`, `getCachedCategoriesWithCount`
- ✅ All actions updated with `revalidateTag(tag, "max")` - Next.js 16 syntax
- ✅ Bulk revalidation helpers (`revalidateBulk.afterOrderCreate`, etc.)

**Files Modified**:
- `src/entities/product/api/queries.ts`
- `src/entities/product/api/actions.ts`
- `src/entities/category/api/queries.ts`
- `src/entities/category/api/actions.ts`
- `src/entities/order/api/actions.ts`
- `src/entities/vendor/api/actions.ts`
- `src/entities/review/api/actions.ts`
- `src/features/checkout/api/actions.ts`

### Phase 3: Client Caching ✅ DONE

**Completed**:
- ✅ React Query provider with optimized defaults
- ✅ Hooks using `STALE_TIME`, `GC_TIME` constants
- ✅ Optimistic updates for cart (Zustand)
- ✅ Optimistic updates for wishlist (React Query `onMutate`)

**Files Modified**:
- `src/shared/providers/ReactQueryProvider.tsx`
- `src/features/search/use-search.ts`
- `src/entities/cart/model/use-cart-stock.ts`
- `src/features/wishlist/wishlist-button/use-wishlist-mutation.ts`

### Phase 4: Monitoring ⏳ PENDING

**Tasks**:
1. Add cache hit/miss logging
2. Setup performance monitoring
3. Create cache debugging utilities

---

## Monitoring & Debugging

### Cache Headers

Check cache status in browser DevTools:

```
x-vercel-cache: HIT | MISS | STALE
x-nextjs-cache: HIT | MISS | STALE
cache-control: s-maxage=3600, stale-while-revalidate=86400
```

### Logging Pattern

```typescript
// Development only
if (process.env.NODE_ENV === 'development') {
  console.log(`[Cache] ${cacheHit ? 'HIT' : 'MISS'}: ${cacheKey}`);
}
```

### Debug Utilities

```typescript
// Force bypass cache
const data = await getProducts({ _bypass: true });

// Check cache status
const { data, cacheStatus } = await getProductsWithStatus(slug);
```

---

## Future Considerations

### Redis (When to add)

**Triggers**:
- Traffic > 10,000 DAU
- DB CPU > 50% sustained
- P95 latency > 500ms

**Use cases**:
- Session storage
- Rate limiting
- Search autocomplete
- Real-time features

### Prisma Accelerate

**When to consider**:
- Global user base
- Complex queries
- High read volume

---

## References

- [Next.js Caching Documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Vercel Edge Network](https://vercel.com/docs/edge-network/overview)
