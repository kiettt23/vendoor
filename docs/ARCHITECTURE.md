# 📐 Kiến Trúc Dự Án

Vendoor sử dụng **Feature-Sliced Design (FSD)** - một kiến trúc frontend giúp tổ chức code theo chức năng thay vì theo loại file.

---

## 🏗️ Tổng Quan Layers

```
src/
├── app/          # Layer 1: Routing & Pages
├── widgets/      # Layer 2: Các section UI lớn
├── features/     # Layer 3: Tính năng tương tác
├── entities/     # Layer 4: Business entities
├── shared/       # Layer 5: Code dùng chung
└── generated/    # Auto-generated types (Prisma)
```

### Quy Tắc Import

**Layer cao chỉ import từ layer thấp hơn:**

```
app → widgets → features → entities → shared
                                   ↘ generated
```

❌ **KHÔNG** import ngược: `entities` không import từ `features`

---

## 📂 Chi Tiết Từng Layer

### 1. `app/` - Routing Layer

Chứa pages và layouts theo Next.js App Router conventions.

```
app/
├── (customer)/       # Routes cho customer
│   ├── products/     # /products
│   ├── cart/         # /cart
│   └── wishlist/     # /wishlist
├── (vendor)/         # Routes cho vendor
│   └── vendor/       # /vendor/*
├── (admin)/          # Routes cho admin
│   └── admin/        # /admin/*
├── (auth)/           # Routes cho auth
│   ├── login/        # /login
│   └── register/     # /register
└── api/              # API routes
```

**Vai trò:**

- Định nghĩa routes
- Compose widgets để tạo pages
- Server Components cho data fetching

---

### 2. `widgets/` - UI Sections

Các section UI lớn, kết hợp nhiều entities và features.

```
widgets/
├── header/           # Header với navigation, search, cart icon
├── footer/           # Footer với links, newsletter
├── homepage/         # Hero, Featured products, Categories
├── checkout/         # Checkout page content
├── orders/           # Order list, order detail
├── product/          # ProductGrid
├── vendor/           # Vendor dashboard sections
└── admin/            # Admin panel sections
```

**Đặc điểm:**

- Không có business logic phức tạp
- Compose từ entities và features
- Có thể chứa local state cho UI

---

### 3. `features/` - Interactive Features

Tính năng có user interaction và side effects.

```
features/
├── auth/                 # Login, Register forms
├── cart/                 # Add to cart, Cart item management
├── checkout/             # Checkout form, validation
├── search/               # Search với suggestions, debounced input
├── review/               # Review forms, write review, review list
├── wishlist/             # Toggle wishlist button
└── vendor-registration/  # Vendor signup form
```

**Cấu trúc một feature:**

```
features/search/
├── ui/
│   ├── SearchInput.tsx        # Desktop search với suggestions
│   ├── SearchInputMobile.tsx  # Mobile search panel
│   └── index.ts               # UI exports
└── index.ts                   # Public exports
```

---

### 4. `entities/` - Business Entities

Đối tượng nghiệp vụ cốt lõi với data access và UI components.

```
entities/
├── product/          # Product queries, ProductCard, searchProducts
├── order/            # Order queries, actions
├── cart/             # Cart store (Zustand)
├── vendor/           # Vendor queries, actions
├── category/         # Category queries
├── user/             # User types, guards, queries
├── review/           # Review queries, actions
└── wishlist/         # Wishlist queries, actions
```

**Cấu trúc một entity:**

```
entities/product/
├── api/
│   ├── queries.ts    # Read operations (getProducts, searchProducts)
│   ├── actions.ts    # Write operations (createProduct, updateProduct)
│   └── index.ts      # API exports
├── model/
│   ├── types.ts      # TypeScript types
│   ├── schema.ts     # Zod validation schemas
│   └── index.ts      # Model exports
├── lib/
│   └── utils.ts      # Helper functions
├── ui/
│   ├── ProductCard.tsx
│   └── index.ts      # UI exports
└── index.ts          # Public exports
```

---

### 5. `shared/` - Shared Code

Code dùng chung, không chứa business logic.

```
shared/
├── ui/               # Shadcn components
├── lib/
│   ├── auth/         # Auth config, guards, client
│   ├── constants/    # App constants (centralized)
│   ├── db/           # Prisma client
│   ├── payment/      # Stripe config
│   ├── upload/       # Cloudinary upload
│   ├── utils/        # Helper functions (format, cn)
│   └── validation/   # Validation utilities
└── hooks/
    └── use-mobile.ts # Mobile detection hook
```

### 6. `generated/` - Auto-generated Types

```
src/generated/
└── prisma/
    └── index.ts      # Barrel export for Prisma types & enums
```

**Sử dụng Generated Types:**

```typescript
import { UserModel, Role, OrderStatus } from "@/generated/prisma";

// Thay vì tự định nghĩa type, dùng generated types
type User = UserModel;
const role: Role = "CUSTOMER";
```

### Constants Structure

```
shared/lib/constants/
├── index.ts          # Barrel exports
├── navigation.ts     # HEADER_NAV_ITEMS, VENDOR_NAV_ITEMS, FOOTER_LINKS
├── order.ts          # ORDER_STATUS_CONFIG, VENDOR_STATUS_CONFIG
├── toast.ts          # TOAST_MESSAGES, showToast(), showErrorToast()
├── limits.ts         # LIMITS (pagination, etc.)
├── routes.ts         # ROUTES constants
├── auth.ts           # AUTH constants
├── cache.ts          # CACHE_DURATION, REVALIDATE_TAGS
└── ...
```

**Sử dụng Toast Messages:**

```typescript
import {
  showToast,
  showErrorToast,
  showCustomToast,
} from "@/shared/lib/constants";

// Success toast (từ config)
showToast("cart", "added"); // "Đã thêm vào giỏ hàng"
showToast("auth", "loginSuccess"); // "Đăng nhập thành công"

// Error toast (từ config)
showErrorToast("generic"); // "Có lỗi xảy ra, vui lòng thử lại"

// Custom toast (dynamic message)
showCustomToast.success("Tùy chỉnh message");
showCustomToast.error(result.error);
```

---

## 🔐 Authentication Flow

```
Request → Middleware → Guards → Page/API
```

1. **Middleware** (`middleware.ts`): Route protection
2. **Guards** (`entities/user/api/guards.ts`): Role-based access
3. **Session**: Better Auth với Prisma adapter

### Auth Guards

| Guard          | Dùng cho                    |
| -------------- | --------------------------- |
| `requireAuth`  | Yêu cầu đăng nhập           |
| `requireRole`  | Yêu cầu role cụ thể         |
| `requireAdmin` | Yêu cầu admin role          |
| `hasRole`      | Check role (không redirect) |

---

## 🗃️ Database Layer

```
Prisma Schema → Entities → Features/Widgets → App
```

- **Schema**: `prisma/schema.prisma`
- **Queries**: `entities/*/api/queries.ts` (read operations)
- **Actions**: `entities/*/api/actions.ts` (write operations)

### Pattern

```typescript
// queries.ts - Read operations với cache()
export const getProducts = cache(async () => { ... });

// actions.ts - Write operations (Server Actions)
"use server";
export async function createProduct(data) { ... }
```

---

## 🛒 State Management

| State Type   | Solution        | Location          |
| ------------ | --------------- | ----------------- |
| Server State | Server Actions  | `entities/*/api/` |
| Cart State   | Zustand         | `entities/cart/`  |
| Form State   | React Hook Form | Local component   |
| UI State     | useState        | Local component   |

---

## 📦 Imports Convention

```typescript
// 1. External packages
import { useState } from "react";
import { z } from "zod";

// 2. Generated types
import { Role, OrderStatus } from "@/generated/prisma";

// 3. Shared layer
import { Button } from "@/shared/ui";
import { formatPrice } from "@/shared/lib";

// 4. Entities
import { ProductCard, searchProducts } from "@/entities/product";

// 5. Features
import { SearchInput } from "@/features/search";

// 6. Relative imports (same module)
import { ProductSchema } from "./schema";
```

---

## 🎯 Best Practices

1. **Single Responsibility**: Mỗi file/component làm một việc
2. **Explicit Exports**: Chỉ export những gì cần thiết qua `index.ts`
3. **Colocation**: Đặt code liên quan gần nhau
4. **Type Safety**: Sử dụng TypeScript strict mode
5. **Error Handling**: Dùng Result pattern cho server actions
6. **Cache Strategy**: Sử dụng `cache()` wrapper cho queries
7. **Generated Types**: Tận dụng Prisma generated types, không duplicate
8. **Image Optimization**: Dùng `OptimizedImage` component (Cloudinary)
9. **Comments**: Chỉ comment khi cần thiết (xem `comments.instructions.md`)

---

## 🖼️ Image Handling

Dự án sử dụng **Cloudinary** cho image optimization thay vì Next.js Image Optimization:

```tsx
// ✅ ĐÚNG: Dùng OptimizedImage
import { OptimizedImage } from "@/shared/ui/optimized-image";

<OptimizedImage src={cloudinaryUrl} width={400} height={400} alt="Product" />;

// ❌ SAI: Không dùng next/image trực tiếp
import Image from "next/image";
```

**Lợi ích:**

- Cloudinary tự động resize theo width/height
- Auto format (WebP/AVIF) tùy browser
- AI-optimized quality (`q_auto`)
- Giảm CPU server Next.js
- CDN caching tốt hơn

**Files liên quan:**

- `src/shared/ui/optimized-image.tsx` - Component wrapper
- `src/shared/lib/upload/cloudinary-loader.ts` - URL transformation
- `src/shared/lib/constants/upload.ts` - CLOUDINARY_PRESETS
