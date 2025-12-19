# Vendoor - Kiến Trúc Dự Án

## 🏗️ Feature-Sliced Design (FSD)

Vendoor sử dụng **Feature-Sliced Design** - một kiến trúc front-end architecture pattern hiện đại, giúp tổ chức code theo domain/feature thay vì theo type (components, services, utils...).

### Tại sao chọn FSD?

| Vấn đề với cấu trúc truyền thống            | FSD giải quyết như thế nào                |
| ------------------------------------------- | ----------------------------------------- |
| ❌ Folder `components/` quá lớn, khó tìm    | ✅ Components nằm trong feature tương ứng |
| ❌ Không rõ component thuộc feature nào     | ✅ Mỗi feature là 1 folder độc lập        |
| ❌ Import chằng chịt, circular dependencies | ✅ Quy tắc import 1 chiều từ trên xuống   |
| ❌ Khó biết file nào phụ thuộc file nào     | ✅ Layer hierarchy rõ ràng                |

---

## 📁 Layer Hierarchy

```
src/
├── app/          # Layer 1: Routing (Next.js App Router)
├── widgets/      # Layer 2: Composite UI sections
├── features/     # Layer 3: User interactions
├── entities/     # Layer 4: Business objects
└── shared/       # Layer 5: Shared utilities
```

### Quy tắc import (QUAN TRỌNG)

```
app → widgets → features → entities → shared
 ↓       ↓         ↓          ↓
Chỉ import từ layer DƯỚI, KHÔNG import ngược lên
```

**Ví dụ hợp lệ:**

```typescript
// ✅ app/ import từ widgets/
import { Header } from "@/widgets/header";

// ✅ widgets/ import từ features/
import { AddToCartButton } from "@/features/checkout";

// ✅ features/ import từ entities/
import { ProductCard } from "@/entities/product";

// ✅ entities/ import từ shared/
import { Button } from "@/shared/ui";
```

**Ví dụ KHÔNG hợp lệ:**

```typescript
// ❌ entities/ KHÔNG import từ features/
import { AddToCartButton } from "@/features/checkout"; // SAI!

// ❌ shared/ KHÔNG import từ entities/
import { ProductCard } from "@/entities/product"; // SAI!
```

---

## 📂 Chi tiết từng Layer

### Layer 1: `app/` - Routing

**Vai trò:** Định nghĩa routes và layouts. Chỉ chứa page components và layouts.

```
src/app/
├── (admin)/          # Admin routes group
│   ├── admin/
│   │   ├── page.tsx         # /admin
│   │   ├── orders/page.tsx  # /admin/orders
│   │   ├── vendors/page.tsx # /admin/vendors
│   │   └── categories/...
│   └── layout.tsx
│
├── (main)/           # Customer routes group
│   ├── (auth)/       # Auth routes
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (customer)/   # Logged-in customer routes
│   │   ├── orders/page.tsx
│   │   ├── wishlist/page.tsx
│   │   └── profile/page.tsx
│   ├── page.tsx      # Homepage (/)
│   └── layout.tsx
│
├── (vendor)/         # Vendor routes group
│   ├── vendor/
│   │   ├── page.tsx         # /vendor (dashboard)
│   │   ├── orders/page.tsx
│   │   ├── products/...
│   │   └── settings/...
│   └── layout.tsx
│
├── api/              # API Routes
│   ├── auth/[...all]/route.ts
│   └── webhooks/...
│
├── layout.tsx        # Root layout
└── globals.css       # Global styles
```

**Pattern:** Route Groups `(name)/` để tổ chức routes mà không ảnh hưởng URL.

---

### Layer 2: `widgets/` - Composite Sections

**Vai trò:** Các section lớn của trang, kết hợp nhiều features và entities.

```
src/widgets/
├── header/           # Navigation header
│   ├── ui/
│   │   └── Header.tsx
│   └── index.ts
│
├── footer/           # Site footer
├── homepage/         # Homepage sections
│   ├── ui/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedProducts.tsx
│   │   └── CategoryGrid.tsx
│   └── index.ts
│
├── checkout/         # Checkout page widget
├── product/          # Product detail page
├── orders/           # Orders list widget
├── vendor/           # Vendor dashboard widgets
├── admin/            # Admin dashboard widgets
└── dashboard-shell/  # Shared dashboard layout
```

**Ví dụ Widget:**

```typescript
// widgets/header/ui/Header.tsx
import { SearchBar } from "@/features/search";
import { CartButton } from "@/features/cart";
import { UserMenu } from "@/features/auth";
import { Logo } from "@/shared/ui";

export function Header() {
  return (
    <header>
      <Logo />
      <SearchBar />
      <CartButton />
      <UserMenu />
    </header>
  );
}
```

---

### Layer 3: `features/` - User Interactions

**Vai trò:** Các tính năng tương tác với user, chứa business logic.

```
src/features/
├── auth/                     # Authentication
│   ├── api/
│   │   └── actions.ts        # Server actions (login, register, logout)
│   ├── ui/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── model/
│   │   └── schemas.ts        # Zod validation schemas
│   └── index.ts
│
├── checkout/                 # Checkout flow
│   ├── api/
│   │   └── actions.ts        # createOrders, validateCheckout
│   ├── ui/
│   │   ├── CheckoutForm.tsx
│   │   └── PaymentSelector.tsx
│   ├── model/
│   │   └── types.ts
│   └── index.ts
│
├── cart/                     # Cart interactions
├── wishlist/                 # Wishlist feature
├── search/                   # Search functionality
├── review/                   # Review submission
├── product-form/             # Product CRUD (vendor)
├── product-filter/           # Filter & sort
├── product-variants/         # Variant management
├── inventory-management/     # Stock management
├── vendor-registration/      # Vendor signup
├── vendor-analytics/         # Dashboard analytics
├── vendor-earnings/          # Earnings tracking
├── profile/                  # User profile update
└── ai-product-generator/     # AI-powered product creation
```

**Feature structure pattern:**

```
feature-name/
├── api/           # Server actions, API calls
│   └── actions.ts
├── ui/            # React components
│   └── FeatureComponent.tsx
├── model/         # Types, schemas, business logic
│   ├── types.ts
│   └── schemas.ts
├── lib/           # Feature-specific utilities (optional)
└── index.ts       # Barrel export
```

---

### Layer 4: `entities/` - Business Objects

**Vai trò:** Domain models, data access, và UI components cho business objects.

```
src/entities/
├── product/
│   ├── api/
│   │   ├── actions.ts    # CRUD server actions
│   │   └── queries.ts    # Data fetching (server-only)
│   ├── ui/
│   │   ├── ProductCard.tsx
│   │   ├── ProductStatusBadge.tsx
│   │   └── ProductStockBadge.tsx
│   ├── model/
│   │   ├── types.ts      # Product, ProductVariant types
│   │   └── schemas.ts    # Zod validation
│   ├── lib/
│   │   └── utils.ts      # calculateDiscount, hasDiscount...
│   └── index.ts
│
├── order/
│   ├── api/
│   ├── ui/
│   │   └── OrderStatusBadge.tsx
│   ├── model/
│   │   └── types.ts
│   └── index.ts
│
├── cart/
│   ├── model/
│   │   ├── store.ts      # Zustand store
│   │   └── types.ts
│   ├── ui/
│   │   └── CartItem.tsx
│   └── index.ts
│
├── user/
├── vendor/
├── category/
├── review/
└── wishlist/
```

**Quan trọng:** Entity chỉ chứa logic liên quan đến chính nó, không chứa business flows phức tạp (đó là của features).

---

### Layer 5: `shared/` - Shared Utilities

**Vai trò:** Code dùng chung, không chứa business logic.

```
src/shared/
├── ui/                  # UI Components (Shadcn/UI based)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ... (40+ components)
│
├── lib/
│   ├── auth/            # Authentication
│   │   ├── config.ts    # Better Auth config (server-only)
│   │   ├── client.ts    # Client-side auth
│   │   ├── session.ts   # Session helpers
│   │   └── index.ts     # Safe exports
│   │
│   ├── db/              # Database
│   │   ├── prisma.ts    # Prisma client singleton
│   │   └── prisma-includes.ts
│   │
│   ├── cache/           # Caching utilities
│   │   ├── index.ts     # Cache wrappers
│   │   ├── invalidation.ts
│   │   └── revalidate.ts
│   │
│   ├── upload/          # Cloudinary upload
│   ├── payment/         # Stripe helpers
│   ├── utils/           # General utilities
│   │   ├── format.ts    # formatPrice, formatDate...
│   │   ├── generate.ts  # generateOrderNumber, generateId...
│   │   └── cn.ts        # className merger
│   │
│   ├── constants/       # App constants
│   │   ├── cache.ts     # Cache tags & durations
│   │   ├── routes.ts    # Route constants
│   │   └── toast.ts     # Toast messages
│   │
│   └── validation/      # Shared Zod schemas
│
├── hooks/               # Shared React hooks
│   └── use-media-query.ts
│
└── providers/           # React context providers
    └── query-provider.tsx
```

---

## 🔄 Data Flow Pattern

### Server Components (Default)

```
Page (Server) → Widget (Server) → Entity UI (Server)
                     ↓
              Feature (Client) ← User Interaction
                     ↓
              Server Action → Database → Revalidate Cache
```

### Client Components

Chỉ dùng `"use client"` khi cần:

- Event handlers (onClick, onSubmit)
- State (useState, useReducer)
- Effects (useEffect)
- Browser APIs

**Pattern:** Đẩy interactivity xuống component nhỏ nhất có thể.

```typescript
// ✅ Good: Chỉ button là client
// ProductCard.tsx (Server Component)
export function ProductCard({ product }) {
  return (
    <Card>
      <Image ... />  {/* Server */}
      <Title ... />  {/* Server */}
      <AddToCartButton product={product} />  {/* Client */}
    </Card>
  );
}

// AddToCartButton.tsx
"use client";
export function AddToCartButton({ product }) {
  const addToCart = useCartStore((s) => s.addItem);
  return <Button onClick={() => addToCart(product)}>Add to Cart</Button>;
}
```

---

## 📦 Barrel Exports

Mỗi layer/feature có file `index.ts` export public API:

```typescript
// entities/product/index.ts
export type { Product, ProductVariant } from "./model";
export { ProductCard, ProductStatusBadge } from "./ui";
export { createProduct, updateProduct } from "./api";
export { calculateDiscount } from "./lib";

// ⚠️ KHÔNG export server-only code trong barrel!
// Server Components import trực tiếp:
// import { getProducts } from "@/entities/product/api/queries";
```

**Lợi ích:**

- Import gọn: `import { ProductCard } from "@/entities/product"`
- Kiểm soát public API
- Avoid exposing internal implementation

---

## 🔗 Related Documentation

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Chi tiết từng file
- [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) - Lý do kỹ thuật
- [DATA_FLOW.md](./DATA_FLOW.md) - Luồng data chi tiết
