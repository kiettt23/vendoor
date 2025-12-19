# Vendoor - Technical Decisions

Tài liệu giải thích chi tiết các quyết định kỹ thuật trong dự án, bao gồm lý do, trade-offs, và alternatives được cân nhắc.

---

## 📋 Mục lục

1. [Framework & Runtime](#1-framework--runtime)
2. [Database & ORM](#2-database--orm)
3. [Authentication](#3-authentication)
4. [State Management](#4-state-management)
5. [Caching Strategy](#5-caching-strategy)
6. [Server Actions](#6-server-actions)
7. [Image Upload](#7-image-upload)
8. [Payment Integration](#8-payment-integration)
9. [Testing Strategy](#9-testing-strategy)
10. [Architecture Pattern](#10-architecture-pattern-fsd)
11. [Multi-Vendor Design](#11-multi-vendor-design)
12. [Code Conventions](#12-code-conventions)

---

## 1. Framework & Runtime

### Quyết định: Next.js 16 + React 19

**Tại sao chọn:**

- **App Router**: Modern routing với layouts, loading states, error boundaries
- **Server Components**: Default server rendering = smaller bundle, better performance
- **Server Actions**: Mutations không cần API routes riêng
- **Streaming**: Progressive rendering với Suspense

**Alternatives được cân nhắc:**
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Next.js | Full-stack, Server Components | Learning curve | ✅ Chọn |
| Remix | Great DX, loaders/actions | Smaller ecosystem | ❌ |
| Vite + React | Fast dev, simple | Need separate backend | ❌ |

---

## 2. Database & ORM

### Quyết định: Neon (Serverless PostgreSQL) + Prisma 7

**Neon - Tại sao chọn:**

- **Serverless**: Scale to zero, pay-per-use
- **Branching**: Database branching cho dev/staging
- **Fast cold starts**: ~150ms connection time
- **Free tier**: Đủ cho development và small production
- **PostgreSQL compatible**: Full PostgreSQL features (ACID, JSON, etc.)

**Prisma - Tại sao chọn:**

- **Type-safe queries**: TypeScript types auto-generated từ schema
- **Migrations**: Version control cho database schema
- **Prisma Studio**: GUI để debug data
- **Relations**: Declarative syntax, không cần viết JOINs
- **Driver Adapter (v7)**: Native connection cho Neon

**Prisma v7 với Driver Adapter:**

```typescript
// shared/lib/db/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!, // Neon connection string
});

export const prisma = new PrismaClient({ adapter });
```

**Code example:**

```typescript
// Type-safe query với includes
const product = await prisma.product.findUnique({
  where: { slug },
  include: {
    variants: true,
    images: { orderBy: { order: "asc" } },
    category: true,
    reviews: { include: { user: true } },
  },
});
// product: Product & { variants: ProductVariant[]; ... }
```

**Database Alternatives:**
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Neon** | Serverless, branching, free tier | Newer service | ✅ Chọn |
| Supabase | Auth built-in, realtime | More opinionated | ❌ |
| PlanetScale | Great DX, branching | MySQL only | ❌ |
| Railway | Simple deploy | Less features | ❌ |

**ORM Alternatives:**
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Prisma** | Type-safe, great DX, v7 adapters | Abstraction overhead | ✅ Chọn |
| Drizzle | Lightweight, SQL-like | Newer, less docs | ❌ |
| TypeORM | Mature | Decorators, complex | ❌ |
| Raw SQL | Full control | No type safety | ❌ |

---

## 3. Authentication

### Quyết định: Better Auth (thay vì NextAuth)

**Tại sao không NextAuth:**

- NextAuth v5 breaking changes nhiều
- Session handling phức tạp
- Callbacks syntax verbose

**Better Auth - Tại sao chọn:**

- **TypeScript-first**: Full type inference
- **Simple API**: `auth.api.signIn()`, `auth.api.signOut()`
- **Plugin system**: Email verification, 2FA dễ thêm
- **Database adapter**: Works native với Prisma

**Setup pattern:**

```typescript
// shared/lib/auth/config.ts (server-only)
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma),
  emailAndPassword: { enabled: true },
  socialProviders: { google: { ... } },
});

// shared/lib/auth/client.ts (client-safe)
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
export const { signIn, signUp, signOut, useSession } = authClient;
```

**Server-only pattern:**

```typescript
// shared/lib/auth/session.ts
import "server-only";
import { auth } from "./config";

export async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
```

---

## 4. State Management

### Quyết định: Zustand (Cart) + TanStack Query (Server State)

**Tại sao tách biệt:**

- **Cart = Client state**: Persist localStorage, không cần backend
- **Products, Orders = Server state**: Data từ database, cần caching

### Cart với Zustand

**Tại sao Zustand:**

- Simple API (không cần providers)
- Built-in persist middleware
- TypeScript friendly
- Tiny bundle size (~1kb)

**Implementation:**

```typescript
// entities/cart/model/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items;
        // ... validation logic
        set({ items: [...items, newItem] });
      },

      updateQuantity: (variantId, quantity) => { ... },
      removeItem: (variantId) => { ... },
      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" }  // localStorage key
  )
);
```

### Server State với TanStack Query

**Tại sao TanStack Query:**

- Automatic caching, deduplication
- Background refetching
- Optimistic updates
- Devtools

**Dùng khi nào:**

- Client-side data fetching
- Infinite scroll pagination
- Real-time updates

> **Note:** Trong dự án này, phần lớn data fetching là Server Components, nên TanStack Query chủ yếu dùng cho mutations và client-side interactivity.

---

## 5. Caching Strategy

### Quyết định: React `cache` + Next.js `unstable_cache`

**3 levels of caching:**

```
┌─────────────────────────────────────────────────────────┐
│ Level 1: React cache (request deduplication)            │
│ - Same query called 5x in 1 request = 1 DB call         │
├─────────────────────────────────────────────────────────┤
│ Level 2: unstable_cache (cross-request caching)         │
│ - Cache data với tags, TTL                              │
│ - Revalidate khi data thay đổi                          │
├─────────────────────────────────────────────────────────┤
│ Level 3: Full Route Cache (production)                  │
│ - Static pages cached at build time                     │
└─────────────────────────────────────────────────────────┘
```

**Cache utilities:**

```typescript
// shared/lib/cache/index.ts
import { unstable_cache } from "next/cache";
import { cache } from "react";

// Cache wrapper với tags
export function cacheProducts<T>(
  fn: () => Promise<T>,
  categorySlug?: string
): () => Promise<T> {
  const tags = [CACHE_TAGS.PRODUCTS];
  if (categorySlug) {
    tags.push(CACHE_TAGS.PRODUCTS_BY_CATEGORY(categorySlug));
  }

  return unstable_cache(fn, ["products", categorySlug || "all"], {
    tags,
    revalidate: CACHE_DURATION.PRODUCTS,  // 60 seconds
  });
}

// Dual cache: request dedup + cross-request
export function createDualCache<T>(fn: () => Promise<T>, config) {
  const serverCached = unstable_cache(fn, ...);
  return cache(serverCached);  // Wrap với React cache
}
```

**Cache invalidation:**

```typescript
// Sau khi tạo product mới
import { revalidateTag } from "next/cache";

await prisma.product.create({ ... });
revalidateTag(CACHE_TAGS.PRODUCTS);
revalidateTag(CACHE_TAGS.PRODUCTS_BY_VENDOR(vendorId));
```

**Cache tags được sử dụng:**

```typescript
export const CACHE_TAGS = {
  PRODUCTS: "products",
  PRODUCT: (slug: string) => `product:${slug}`,
  PRODUCTS_BY_CATEGORY: (slug: string) => `products:category:${slug}`,
  PRODUCTS_BY_VENDOR: (vendorId: string) => `products:vendor:${vendorId}`,
  CATEGORIES: "categories",
  ORDERS: "orders",
  ORDERS_BY_USER: (userId: string) => `orders:user:${userId}`,
  ORDERS_BY_VENDOR: (vendorId: string) => `orders:vendor:${vendorId}`,
  VENDOR_STATS: (vendorId: string) => `vendor:stats:${vendorId}`,
  ADMIN_STATS: "admin:stats",
};
```

### Route Rendering Strategy

**Quyết định: Selective `force-dynamic` thay vì global**

**Tại sao không dùng `force-dynamic` ở root layout:**

- Disable caching cho TOÀN BỘ app
- Mất lợi ích của static/ISR pages
- Performance giảm đáng kể

**Strategy đã áp dụng:**

| Page Type                                              | Config            | Lý do                                  |
| ------------------------------------------------------ | ----------------- | -------------------------------------- |
| **User-specific** (`/account`, `/orders`, `/checkout`) | `force-dynamic`   | Cần fresh session/user data            |
| **Vendor/Admin dashboards**                            | `force-dynamic`   | Real-time data management              |
| **Product detail**                                     | `revalidate = 60` | ISR - cache 60s, background revalidate |
| **Public pages**                                       | Auto              | Next.js tự quyết định                  |

**Code example:**

```typescript
// Pages cần fresh data
export const dynamic = "force-dynamic";

// ISR pages
export const revalidate = 60;
```

**Quan trọng:** `force-dynamic` chỉ disable Full Route Cache, KHÔNG ảnh hưởng:

- `unstable_cache()` - Data vẫn cached
- React `cache()` - Request dedup vẫn hoạt động

> Xem chi tiết: [CACHING_STRATEGY.md](./CACHING_STRATEGY.md#3-route-rendering-strategy)

---

## 6. Server Actions

### Quyết định: Server Actions cho tất cả mutations

**Tại sao không API Routes:**

- Server Actions = Progressive enhancement (works without JS)
- Type-safe: Input/output types inferred
- Colocated với UI code
- Automatic form handling

**Pattern:**

```typescript
// features/checkout/api/actions.ts
"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/db";

export async function createOrders(
  cartItems: CartItem[],
  shippingInfo: ShippingInfo,
  paymentMethod: PaymentMethod
): Promise<CreateOrdersResult> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Vui lòng đăng nhập" };
    }

    // Transaction đảm bảo atomic operation
    const result = await prisma.$transaction(async (tx) => {
      // 1. Validate stock
      // 2. Create orders
      // 3. Decrement stock
      // 4. Create payment record
      return { orders, paymentId };
    });

    // Invalidate relevant caches
    revalidateTag(CACHE_TAGS.ORDERS);
    revalidateTag(CACHE_TAGS.PRODUCTS);

    return { success: true, ...result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

**Calling from Client:**

```typescript
"use client";

import { createOrders } from "@/features/checkout";

function CheckoutForm() {
  const handleSubmit = async (data) => {
    const result = await createOrders(cartItems, data, paymentMethod);
    if (result.success) {
      clearCart();
      router.push(`/orders/${result.orders[0].id}`);
    }
  };
}
```

---

## 7. Image Upload

### Quyết định: Cloudinary

**Tại sao Cloudinary:**

- **Transformations**: Resize, crop, format on-the-fly
- **CDN**: Global delivery
- **Free tier**: 25GB bandwidth/month
- **Easy integration**: Node SDK + URL-based transformations

**Upload pattern:**

```typescript
// shared/lib/upload/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

export async function uploadImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "vendoor/products" }, (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      })
      .end(buffer);
  });
}
```

**Image optimization với Next.js:**

```tsx
import Image from "next/image";

// Auto-optimize Cloudinary images
<Image
  src={cloudinaryUrl}
  alt={product.name}
  width={400}
  height={400}
  loader={cloudinaryLoader}
/>;
```

---

## 8. Payment Integration

### Quyết định: Stripe + COD

**Flow:**

```
Customer → Checkout → Select Payment
                          │
           ┌──────────────┴──────────────┐
           ▼                              ▼
         COD                           Stripe
           │                              │
    Order created              Stripe Checkout Session
    status: PENDING            Order status: PENDING_PAYMENT
           │                              │
           │                    ← Webhook callback →
           │                              │
           ▼                              ▼
    Wait for delivery           Payment confirmed
                               Order status: PENDING
```

**Stripe Checkout Session:**

```typescript
// features/checkout/api/actions.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createStripeSession(orderIds: string[]) {
  const orders = await prisma.order.findMany({
    where: { id: { in: orderIds } },
    include: { items: true },
  });

  const session = await stripe.checkout.sessions.create({
    line_items: orders.flatMap((order) =>
      order.items.map((item) => ({
        price_data: {
          currency: "vnd",
          product_data: { name: item.productName },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      }))
    ),
    mode: "payment",
    success_url: `${SITE_URL}/orders?success=true`,
    cancel_url: `${SITE_URL}/checkout?canceled=true`,
    metadata: { orderIds: orderIds.join(",") },
  });

  return session.url;
}
```

**Webhook handler:**

```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderIds = session.metadata.orderIds.split(",");

    await prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { status: "PENDING" },
    });

    await prisma.payment.update({
      where: { stripeSessionId: session.id },
      data: { status: "COMPLETED", paidAt: new Date() },
    });
  }

  return Response.json({ received: true });
}
```

---

## 9. Testing Strategy

### Quyết định: Vitest (Unit/Integration) + Playwright (E2E)

**Test pyramid:**

```
        ╱╲
       ╱  ╲   E2E Tests (Playwright)
      ╱────╲  - Critical user flows
     ╱      ╲
    ╱────────╲ Integration Tests
   ╱          ╲ - Feature interactions
  ╱────────────╲
 ╱              ╲ Unit Tests
╱                ╲ - Entities, utils, validation
──────────────────
```

**Vitest - Tại sao chọn:**

- Native ESM support
- Fast (Vite-powered)
- Jest-compatible API
- Vitest UI for debugging

**Test examples:**

```typescript
// Unit test - validation
describe("validateSKU", () => {
  it("accepts valid SKU format", () => {
    expect(validateSKU("PROD-001-RED")).toBe(true);
  });
});

// Integration test - checkout flow
describe("createOrders", () => {
  it("creates orders and decrements stock", async () => {
    const result = await createOrders(cartItems, shippingInfo, "COD");
    expect(result.success).toBe(true);

    const variant = await prisma.productVariant.findUnique({...});
    expect(variant.stock).toBe(initialStock - quantity);
  });
});
```

**Playwright E2E:**

```typescript
// tests/checkout.spec.ts
test("customer can complete checkout", async ({ page }) => {
  await page.goto("/products");
  await page.click('[data-testid="add-to-cart"]');
  await page.goto("/checkout");
  await page.fill('[name="phone"]', "0901234567");
  await page.click('[data-testid="place-order"]');

  await expect(page).toHaveURL(/\/orders\//);
  await expect(page.locator("text=Đặt hàng thành công")).toBeVisible();
});
```

---

## 10. Architecture Pattern (FSD)

### Quyết định: Feature-Sliced Design

**Xem chi tiết:** [ARCHITECTURE.md](./ARCHITECTURE.md)

**Tóm tắt lý do:**

- **Scalability**: Dễ thêm features mới
- **Maintainability**: Code liên quan nằm cùng chỗ
- **Team collaboration**: Mỗi người làm 1 feature độc lập
- **Clear dependencies**: Import rules prevent spaghetti code

---

## 11. Multi-Vendor Design

### Quyết định: 1 Order = 1 Vendor

**Tại sao không 1 Order có nhiều Vendors:**

- Đơn giản hóa order management
- Shipping riêng cho từng vendor
- Tracking number riêng
- Commission calculation đơn giản

**Flow:**

```
Cart (có items từ 3 vendors)
         │
    ┌────┴────┐
    ▼    ▼    ▼
Order 1  Order 2  Order 3
(Vendor A) (Vendor B) (Vendor C)
```

**Implementation:**

```typescript
// Group cart items by vendor
const vendorGroups = groupItemsByVendor(cartItems);

// Create 1 order per vendor
for (const group of vendorGroups) {
  await prisma.order.create({
    data: {
      vendorId: group.vendorId,
      customerId: session.user.id,
      items: { create: group.items },
      // Commission tính cho từng order
      platformFee: group.subtotal * 0.1,
      vendorEarnings: group.subtotal * 0.9,
    },
  });
}
```

---

## 12. Code Conventions

### Barrel Exports

**Pattern:** Mỗi feature/entity có `index.ts` export public API

```typescript
// entities/product/index.ts
export type { Product } from "./model";
export { ProductCard } from "./ui";
export { createProduct } from "./api";

// ⚠️ Không export server-only queries
// Server Components import trực tiếp:
// import { getProducts } from "@/entities/product/api/queries"
```

### Server-Only Imports

**Pattern:** Dùng `"server-only"` directive

```typescript
// shared/lib/auth/session.ts
import "server-only";  // Sẽ error nếu import từ client

import { auth } from "./config";
export async function getSession() { ... }
```

### Form Validation

**Pattern:** Zod schemas + React Hook Form

```typescript
// Shared schema
const productSchema = z.object({
  name: z.string().min(3).max(200),
  price: z.number().positive(),
});

// React Hook Form
const form = useForm<ProductFormData>({
  resolver: zodResolver(productSchema),
});
```

### Error Messages - Vietnamese

**Pattern:** Centralized toast messages

```typescript
// shared/lib/constants/toast.ts
export const TOAST_MESSAGES = {
  cart: {
    added: "Đã thêm vào giỏ hàng",
    removed: "Đã xóa khỏi giỏ hàng",
    updated: "Đã cập nhật giỏ hàng",
  },
  order: {
    created: "Đặt hàng thành công",
    cancelled: "Đã hủy đơn hàng",
  },
};
```

---

## 🔗 Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - FSD layer details
- [DATABASE.md](./DATABASE.md) - Schema design rationale
- [DATA_FLOW.md](./DATA_FLOW.md) - How data flows through the system
