# Vendoor - Data Flow

Tài liệu mô tả luồng dữ liệu qua các thành phần chính của hệ thống.

---

## 📋 Mục lục

1. [Checkout Flow](#1-checkout-flow)
2. [Authentication Flow](#2-authentication-flow)
3. [Product CRUD Flow](#3-product-crud-flow)
4. [Search Flow](#4-search-flow)
5. [Caching & Invalidation](#5-caching--invalidation)

---

## 1. Checkout Flow

### Overview Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────────┐     │
│  │ ProductCard │───►│ CartStore    │───►│ CheckoutForm      │     │
│  │             │    │ (Zustand)    │    │                   │     │
│  │ addItem()   │    │ localStorage │    │ createOrders()    │     │
│  └─────────────┘    └──────────────┘    └─────────┬─────────┘     │
│                                                    │               │
└────────────────────────────────────────────────────┼───────────────┘
                                                     │
                                                     ▼
┌────────────────────────────────────────────────────────────────────┐
│                           SERVER                                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                Server Action: createOrders()                 │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │  1. Validate session                                        │  │
│  │  2. Group items by vendor                                   │  │
│  │  3. Validate vendor profiles exist                          │  │
│  │  4. prisma.$transaction:                                    │  │
│  │     a. Validate & decrement stock                           │  │
│  │     b. Create orders (1 per vendor)                         │  │
│  │     c. Create payment record                                │  │
│  │     d. Link payment to orders                               │  │
│  │  5. Revalidate cache tags                                   │  │
│  │  6. Return result                                           │  │
│  └──────────────────────────────┬──────────────────────────────┘  │
│                                 │                                  │
│                      ┌──────────┴──────────┐                       │
│                      ▼                      ▼                      │
│               ┌─────────────┐        ┌─────────────┐              │
│               │    COD      │        │   Stripe    │              │
│               │             │        │             │              │
│               │ status:     │        │ Redirect to │              │
│               │ PENDING     │        │ Stripe      │              │
│               └──────┬──────┘        └──────┬──────┘              │
│                      │                      │                      │
└──────────────────────┼──────────────────────┼──────────────────────┘
                       │                      │
                       │               Stripe Webhook
                       │                      │
                       ▼                      ▼
               ┌─────────────┐        ┌─────────────┐
               │ /orders/[id]│        │/orders?     │
               │             │        │success=true │
               └─────────────┘        └─────────────┘
```

### Step-by-Step

#### Step 1: Add to Cart

```typescript
// entities/cart/model/store.ts
addItem: (newItem) => {
  const items = get().items;
  const existingItem = items.find((i) => i.id === newItem.variantId);

  if (existingItem) {
    // Validate không vượt quá stock
    const validation = validateQuantity(newQuantity, existingItem.stock);
    if (!validation.isValid) {
      showToast.error(validation.message);
      return;
    }
    // Update quantity
    set({
      items: items.map((i) =>
        i.id === itemId ? { ...i, quantity: newQuantity } : i
      ),
    });
  } else {
    // Add new item
    set({ items: [...items, { ...newItem, quantity }] });
  }
};
```

#### Step 2: Checkout - Group by Vendor

```typescript
// entities/cart/lib/group-items.ts
export function groupItemsByVendor(items: CartItem[]): VendorGroup[] {
  const groups = new Map<string, VendorGroup>();

  for (const item of items) {
    const vendorId = item.vendorId;
    if (!groups.has(vendorId)) {
      groups.set(vendorId, {
        vendorId,
        vendorName: item.vendorName,
        items: [],
      });
    }
    groups.get(vendorId)!.items.push(item);
  }

  return Array.from(groups.values());
}
```

#### Step 3: Create Orders (Transaction)

```typescript
// features/checkout/api/actions.ts
const result = await prisma.$transaction(async (tx) => {
  // 1. Validate & decrement stock
  for (const [variantId, qty] of stockDecrements) {
    const variant = await tx.productVariant.findUnique({
      where: { id: variantId },
    });
    if (variant.stock < qty) {
      throw new Error(`${variant.product.name} không đủ hàng`);
    }
    await tx.productVariant.update({
      where: { id: variantId },
      data: { stock: { decrement: qty } },
    });
  }

  // 2. Create orders
  for (const orderData of ordersData) {
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: session.user.id,
        vendorId: orderData.vendorId,
        status: paymentMethod === "COD" ? "PENDING" : "PENDING_PAYMENT",
        // ... pricing, shipping, items
      },
    });
    createdOrders.push(order);
  }

  // 3. Create payment
  const payment = await tx.payment.create({
    data: { method: paymentMethod, amount: totalAmount, status: "PENDING" },
  });

  // 4. Link payment to orders
  await tx.order.updateMany({
    where: { id: { in: createdOrders.map((o) => o.id) } },
    data: { paymentId: payment.id },
  });

  return { orders: createdOrders, paymentId: payment.id };
});
```

#### Step 4: Cache Invalidation

```typescript
// Sau transaction thành công
revalidateTag(CACHE_TAGS.PRODUCTS); // Stock đã thay đổi
revalidateTag(CACHE_TAGS.ORDERS); // Orders mới được tạo
revalidateTag(CACHE_TAGS.ORDERS_BY_USER(userId));

// Invalidate vendor caches
for (const vendorId of vendorIds) {
  revalidateTag(CACHE_TAGS.ORDERS_BY_VENDOR(vendorId));
  revalidateTag(CACHE_TAGS.VENDOR_STATS(vendorId));
}
```

---

## 2. Authentication Flow

### Login Flow

```
┌─────────────────────────────────────┐
│           LoginForm                 │
│                                     │
│   email: [____________]             │
│   password: [____________]          │
│                                     │
│   [Login Button]                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    authClient.signIn.email()       │
│    (Client-side, Better Auth)       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    POST /api/auth/signin            │
│                                     │
│    1. Validate credentials          │
│    2. Check password hash           │
│    3. Create session                │
│    4. Set session cookie            │
│    5. Return user data              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    Client receives session          │
│    → Redirect based on role         │
│                                     │
│    ADMIN   → /admin                 │
│    VENDOR  → /vendor                │
│    CUSTOMER → / (homepage)          │
└─────────────────────────────────────┘
```

### Session Check Pattern

```typescript
// Server Component
import { getSession } from "@/shared/lib/auth/session";

export default async function ProtectedPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // User is authenticated
  return <Dashboard user={session.user} />;
}
```

```typescript
// Client Component
"use client";
import { useSession } from "@/shared/lib/auth";

export function UserMenu() {
  const { data: session, isPending } = useSession();

  if (isPending) return <Skeleton />;
  if (!session) return <LoginButton />;

  return <UserDropdown user={session.user} />;
}
```

---

## 3. Product CRUD Flow

### Create Product

```
┌─────────────────────────────────────────────────────────────────┐
│                      ProductForm (Client)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User fills form:                                            │
│     - name, description, category                               │
│     - Images (upload to Cloudinary first)                       │
│     - Variants (price, stock, color, size)                      │
│                                                                 │
│  2. Form validation (Zod + React Hook Form)                     │
│                                                                 │
│  3. Call createProduct() server action                          │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Server Action: createProduct()                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  async function createProduct(data: ProductFormInput) {         │
│    // 1. Validate session & vendor role                         │
│    const session = await requireSession();                      │
│    if (!session.user.roles.includes("VENDOR")) {                │
│      return { success: false, error: "Unauthorized" };          │
│    }                                                            │
│                                                                 │
│    // 2. Generate slug                                          │
│    const slug = generateSlug(data.name);                        │
│                                                                 │
│    // 3. Create in transaction                                  │
│    const product = await prisma.product.create({                │
│      data: {                                                    │
│        name: data.name,                                         │
│        slug,                                                    │
│        vendorId: session.user.id,                               │
│        categoryId: data.categoryId,                             │
│        variants: { create: data.variants },                     │
│        images: { create: data.images },                         │
│      }                                                          │
│    });                                                          │
│                                                                 │
│    // 4. Invalidate caches                                      │
│    revalidateTag(CACHE_TAGS.PRODUCTS);                          │
│    revalidateTag(CACHE_TAGS.PRODUCTS_BY_VENDOR(vendorId));      │
│                                                                 │
│    return { success: true, product };                           │
│  }                                                              │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Client Response                              │
│                                                                 │
│  - Show success toast                                           │
│  - Redirect to /vendor/products                                 │
│  - Product list auto-updates (cache invalidated)                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Image Upload Flow

```
User selects image
        │
        ▼
┌───────────────────┐
│ ImageUploader     │
│ (Client)          │
│                   │
│ - Preview         │
│ - Validate size   │
│ - Validate type   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐      ┌─────────────────┐
│ uploadImage()     │─────►│ Cloudinary      │
│ Server Action     │      │                 │
│                   │◄─────│ Returns URL     │
└─────────┬─────────┘      └─────────────────┘
          │
          ▼
┌───────────────────┐
│ URL stored in     │
│ form state        │
│                   │
│ Submitted with    │
│ product data      │
└───────────────────┘
```

---

## 4. Search Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         SearchBar                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [🔍] Search products...                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  User types: "iphone"                                           │
│  → Debounce 300ms                                               │
│                                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              Server Action: searchProducts()                    │
│                                                                 │
│  - Full-text search on product name                             │
│  - Filter active products only                                  │
│  - Limit results (e.g., 10)                                     │
│  - Return suggestions with images                               │
│                                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Search Results Dropdown                     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  [📱] iPhone 15 Pro Max                 ▶ /products/...  │   │
│  │  [📱] iPhone 15 Pro                     ▶ /products/...  │   │
│  │  [📱] iPhone 15                         ▶ /products/...  │   │
│  │                                                          │   │
│  │  [See all results] ▶ /products?search=iphone             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Caching & Invalidation

### Cache Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      Request Lifecycle                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Request 1                    Request 2                         │
│      │                            │                             │
│      ▼                            ▼                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              React cache() - Request Dedup              │    │
│  │                                                         │    │
│  │  getProducts() called 5x in same request                │    │
│  │  → Only 1 actual execution                              │    │
│  │                                                         │    │
│  └─────────────────────────────┬───────────────────────────┘    │
│                                │                                │
│                                ▼                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            unstable_cache() - Cross-Request             │    │
│  │                                                         │    │
│  │  Data cached với:                                       │    │
│  │  - Tags: ["products", "products:category:electronics"]  │    │
│  │  - TTL: 60 seconds                                      │    │
│  │                                                         │    │
│  │  Request 1 & Request 2 share cached data                │    │
│  │                                                         │    │
│  └─────────────────────────────┬───────────────────────────┘    │
│                                │                                │
│                                ▼                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    PostgreSQL                           │    │
│  │                                                         │    │
│  │  Cache miss → Query database                            │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Cache Tag Strategy

```typescript
// shared/lib/constants/cache.ts
export const CACHE_TAGS = {
  // Products
  PRODUCTS: "products",
  PRODUCT: (slug: string) => `product:${slug}`,
  PRODUCTS_BY_CATEGORY: (slug: string) => `products:category:${slug}`,
  PRODUCTS_BY_VENDOR: (vendorId: string) => `products:vendor:${vendorId}`,

  // Categories
  CATEGORIES: "categories",

  // Orders
  ORDERS: "orders",
  ORDERS_BY_USER: (userId: string) => `orders:user:${userId}`,
  ORDERS_BY_VENDOR: (vendorId: string) => `orders:vendor:${vendorId}`,

  // Stats
  VENDOR_STATS: (vendorId: string) => `vendor:stats:${vendorId}`,
  ADMIN_STATS: "admin:stats",
};

export const CACHE_DURATION = {
  PRODUCTS: 60, // 1 minute
  PRODUCT_DETAIL: 60, // 1 minute
  CATEGORIES: 3600, // 1 hour (rarely changes)
  VENDOR_PRODUCTS: 60, // 1 minute
  VENDOR_STATS: 300, // 5 minutes
  ADMIN_STATS: 300, // 5 minutes
};
```

### Invalidation Scenarios

| Action              | Tags Invalidated                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| Create product      | `products`, `products:vendor:{id}`                                                                  |
| Update product      | `products`, `product:{slug}`, `products:vendor:{id}`                                                |
| Delete product      | `products`, `product:{slug}`, `products:vendor:{id}`, `products:category:{slug}`                    |
| Create order        | `orders`, `orders:user:{id}`, `orders:vendor:{id}`, `vendor:stats:{id}`, `products` (stock changed) |
| Update order status | `orders`, `orders:vendor:{id}`, `vendor:stats:{id}`                                                 |
| Create category     | `categories`                                                                                        |
| Approve vendor      | `admin:stats`                                                                                       |

### Example: Product Update Invalidation

```typescript
// entities/product/api/actions.ts
export async function updateProduct(id: string, data: ProductEditInput) {
  const product = await prisma.product.update({
    where: { id },
    data: { ... },
  });

  // Invalidate all relevant caches
  revalidateTag(CACHE_TAGS.PRODUCTS);
  revalidateTag(CACHE_TAGS.PRODUCT(product.slug));
  revalidateTag(CACHE_TAGS.PRODUCTS_BY_VENDOR(product.vendorId));
  if (product.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: product.categoryId } });
    if (category) {
      revalidateTag(CACHE_TAGS.PRODUCTS_BY_CATEGORY(category.slug));
    }
  }

  return { success: true, product };
}
```

---

## 🔗 Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Layer structure
- [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) - Caching strategy details
- [DATABASE.md](./DATABASE.md) - Data models
