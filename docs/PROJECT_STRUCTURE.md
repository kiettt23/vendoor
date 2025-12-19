# Vendoor - Cấu Trúc Dự Án

Tài liệu chi tiết về cấu trúc thư mục và mục đích của từng file/folder.

---

## 📁 Root Directory

```
vendoor/
├── .env                  # Environment variables (gitignored)
├── .env.example          # Template cho .env
├── .gitignore            # Git ignore patterns
├── package.json          # Dependencies & scripts
├── pnpm-lock.yaml        # Lock file
├── pnpm-workspace.yaml   # PNPM workspace config
│
├── next.config.ts        # Next.js configuration
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind CSS config (nếu có)
├── postcss.config.mjs    # PostCSS config
├── eslint.config.mjs     # ESLint config
├── vitest.config.ts      # Vitest test config
├── playwright.config.ts  # Playwright E2E config
│
├── prisma/               # Database schema & migrations
├── public/               # Static assets
├── src/                  # Source code
├── tests/                # E2E tests (Playwright)
└── docs/                 # Documentation
```

---

## 📁 `prisma/` - Database

```
prisma/
├── schema.prisma         # Database schema definition
├── seed.ts               # Seed script (sample data)
└── migrations/           # Migration history
    └── YYYYMMDD.../      # Auto-generated migrations
```

**Files quan trọng:**

| File            | Mô tả                                      |
| --------------- | ------------------------------------------ |
| `schema.prisma` | Định nghĩa models, relations, enums        |
| `seed.ts`       | Tạo data mẫu (users, products, categories) |

---

## 📁 `src/` - Source Code

### `src/app/` - Next.js App Router

```
src/app/
├── globals.css           # Global CSS + Tailwind imports
├── layout.tsx            # Root layout (providers, fonts)
├── not-found.tsx         # 404 page
├── error.tsx             # Error boundary
│
├── (admin)/              # Admin route group
│   ├── layout.tsx        # Admin layout (sidebar + header)
│   └── admin/
│       ├── page.tsx              # /admin - Dashboard
│       ├── orders/page.tsx       # /admin/orders
│       ├── vendors/page.tsx      # /admin/vendors
│       └── categories/page.tsx   # /admin/categories
│
├── (main)/               # Main site route group
│   ├── layout.tsx        # Customer layout (header + footer)
│   ├── page.tsx          # / (Homepage)
│   │
│   ├── (auth)/           # Auth routes (no header/footer option)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── vendor-register/page.tsx
│   │
│   ├── (customer)/       # Logged-in customer routes
│   │   ├── orders/page.tsx       # /orders
│   │   ├── orders/[id]/page.tsx  # /orders/[id]
│   │   ├── wishlist/page.tsx     # /wishlist
│   │   └── profile/page.tsx      # /profile
│   │
│   ├── products/         # Product pages
│   │   ├── page.tsx              # /products (listing)
│   │   └── [slug]/page.tsx       # /products/[slug] (detail)
│   │
│   ├── checkout/page.tsx # /checkout
│   └── cart/page.tsx     # /cart
│
├── (vendor)/             # Vendor route group
│   ├── layout.tsx        # Vendor dashboard layout
│   └── vendor/
│       ├── page.tsx              # /vendor (dashboard)
│       ├── orders/page.tsx       # /vendor/orders
│       ├── products/
│       │   ├── page.tsx          # /vendor/products
│       │   ├── new/page.tsx      # /vendor/products/new
│       │   └── [id]/edit/page.tsx
│       └── settings/page.tsx     # /vendor/settings
│
└── api/                  # API Routes
    ├── auth/[...all]/route.ts    # Better Auth handler
    └── webhooks/
        └── stripe/route.ts       # Stripe webhooks
```

---

### `src/entities/` - Business Objects

Mỗi entity có cấu trúc tương tự:

```
entities/[entity-name]/
├── api/
│   ├── actions.ts        # Server Actions (mutations)
│   └── queries.ts        # Data fetching (server-only)
├── ui/
│   └── [Component].tsx   # UI components
├── model/
│   ├── types.ts          # TypeScript types
│   └── schemas.ts        # Zod validation schemas (nếu cần)
├── lib/
│   └── utils.ts          # Entity-specific utilities
└── index.ts              # Barrel export (public API)
```

**Entities trong dự án:**

| Entity     | Mô tả       | Key Files                                     |
| ---------- | ----------- | --------------------------------------------- |
| `product`  | Sản phẩm    | ProductCard, createProduct, calculateDiscount |
| `order`    | Đơn hàng    | OrderStatusBadge, prepareOrderData            |
| `cart`     | Giỏ hàng    | Zustand store, CartItem                       |
| `user`     | Người dùng  | User types, UserAvatar                        |
| `vendor`   | Vendor/Shop | VendorProfile types, VendorCard               |
| `category` | Danh mục    | CategoryCard, CategoryBadge                   |
| `review`   | Đánh giá    | ReviewCard, StarRating                        |
| `wishlist` | Yêu thích   | WishlistItem                                  |

---

### `src/features/` - User Interactions

Mỗi feature có cấu trúc:

```
features/[feature-name]/
├── api/
│   └── actions.ts        # Server Actions
├── ui/
│   └── [Component].tsx   # Interactive components
├── model/
│   ├── types.ts
│   └── schemas.ts
├── lib/                  # Feature-specific logic (optional)
└── index.ts
```

**Features trong dự án:**

| Feature                | Mô tả            | Key Components                              |
| ---------------------- | ---------------- | ------------------------------------------- |
| `auth`                 | Đăng nhập/ký     | LoginForm, RegisterForm, logout action      |
| `checkout`             | Thanh toán       | CheckoutForm, PaymentSelector, createOrders |
| `cart`                 | Giỏ hàng UI      | AddToCartButton, CartSheet                  |
| `wishlist`             | Yêu thích        | WishlistButton, AddToWishlist               |
| `search`               | Tìm kiếm         | SearchBar, SearchResults                    |
| `review`               | Đánh giá         | ReviewForm, ReviewList                      |
| `product-form`         | CRUD sản phẩm    | ProductForm, ImageUploader                  |
| `product-filter`       | Filter & Sort    | FilterPanel, SortDropdown                   |
| `product-variants`     | Quản lý variants | VariantForm, VariantTable                   |
| `inventory-management` | Tồn kho          | StockEditor, LowStockAlert                  |
| `vendor-registration`  | Đăng ký bán      | VendorRegisterForm                          |
| `vendor-analytics`     | Analytics        | RevenueChart, OrderStats                    |
| `vendor-earnings`      | Thu nhập         | EarningsTable, PayoutHistory                |
| `profile`              | Profile update   | ProfileForm                                 |
| `ai-product-generator` | AI tạo product   | AIProductForm                               |

---

### `src/widgets/` - Composite Sections

```
widgets/[widget-name]/
├── ui/
│   └── [Widget].tsx
└── index.ts
```

**Widgets trong dự án:**

| Widget            | Mô tả                      | Used In                 |
| ----------------- | -------------------------- | ----------------------- |
| `header`          | Navigation header          | Main layout             |
| `footer`          | Site footer                | Main layout             |
| `homepage`        | Hero, Featured, Categories | Homepage                |
| `checkout`        | Checkout page content      | /checkout               |
| `product`         | Product detail page        | /products/[slug]        |
| `orders`          | Orders list                | /orders, /vendor/orders |
| `wishlist`        | Wishlist page              | /wishlist               |
| `vendor`          | Vendor dashboard widgets   | /vendor/\*              |
| `admin`           | Admin dashboard widgets    | /admin/\*               |
| `dashboard-shell` | Shared dashboard layout    | Vendor & Admin          |

---

### `src/shared/` - Shared Code

```
shared/
├── ui/                   # ~40 UI components (Shadcn/UI)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── toast.tsx (Sonner)
│   └── ...
│
├── lib/
│   ├── auth/             # Authentication
│   │   ├── config.ts     # Better Auth server config
│   │   ├── client.ts     # Client auth (signIn, signOut)
│   │   ├── session.ts    # getSession, requireSession
│   │   ├── error-messages.ts
│   │   └── index.ts      # Safe barrel export
│   │
│   ├── db/               # Database
│   │   ├── prisma.ts     # Prisma client singleton
│   │   └── prisma-includes.ts  # Reusable includes
│   │
│   ├── cache/            # Caching
│   │   ├── index.ts      # Cache wrappers (cacheProducts, etc.)
│   │   ├── invalidation.ts
│   │   └── revalidate.ts
│   │
│   ├── upload/           # Image upload
│   │   ├── cloudinary.ts # Cloudinary config
│   │   └── actions.ts    # Upload server actions
│   │
│   ├── payment/          # Payment
│   │   └── stripe.ts     # Stripe client
│   │
│   ├── utils/            # General utilities
│   │   ├── cn.ts         # className merger (clsx + tailwind-merge)
│   │   ├── format.ts     # formatPrice, formatDate
│   │   └── generate.ts   # generateId, generateOrderNumber
│   │
│   ├── constants/        # App constants
│   │   ├── cache.ts      # CACHE_TAGS, CACHE_DURATION
│   │   ├── routes.ts     # ROUTES object
│   │   ├── toast.ts      # TOAST_MESSAGES
│   │   └── index.ts
│   │
│   ├── validation/       # Shared schemas
│   │   └── common.ts     # phoneSchema, emailSchema...
│   │
│   └── hooks/            # Lib-level hooks
│       └── index.ts
│
├── hooks/                # Custom React hooks
│   └── use-media-query.ts
│
└── providers/            # React providers
    └── query-provider.tsx  # TanStack Query provider
```

---

### `src/generated/` - Generated Code

```
generated/
└── prisma/
    └── client/           # Prisma Client (auto-generated)
```

> ⚠️ Không chỉnh sửa thủ công - được generate bởi `prisma generate`

---

## 📁 `tests/` - E2E Tests

```
tests/
├── auth.spec.ts          # Login, Register, Logout flows
├── customer.spec.ts      # Customer journey
├── vendor.spec.ts        # Vendor flows
├── admin.spec.ts         # Admin flows
├── checkout.spec.ts      # Checkout E2E
└── fixtures/             # Test utilities
```

---

## 📁 `public/` - Static Assets

```
public/
├── favicon.ico
├── logo.svg
└── images/               # Static images
```

---

## 📝 Naming Conventions

### Files

| Type          | Convention           | Example              |
| ------------- | -------------------- | -------------------- |
| Component     | PascalCase           | `ProductCard.tsx`    |
| Hook          | camelCase, usePrefix | `use-media-query.ts` |
| Server Action | camelCase            | `actions.ts`         |
| Types         | camelCase            | `types.ts`           |
| Utils         | camelCase            | `format.ts`          |
| Constants     | camelCase            | `cache.ts`           |

### Folders

| Type           | Convention | Example         |
| -------------- | ---------- | --------------- |
| Feature/Entity | kebab-case | `product-form/` |
| Route group    | (name)/    | `(admin)/`      |
| Dynamic route  | [param]/   | `[slug]/`       |

### Exports

| Type      | Convention            | Example                   |
| --------- | --------------------- | ------------------------- |
| Component | PascalCase, named     | `export { ProductCard }`  |
| Hook      | camelCase, named      | `export { useCart }`      |
| Type      | PascalCase, type-only | `export type { Product }` |
| Constant  | UPPER_SNAKE_CASE      | `export const CACHE_TAGS` |
| Function  | camelCase             | `export { formatPrice }`  |
