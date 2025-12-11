# 🗺️ Code Map - Hướng Dẫn Sửa Code

Bạn muốn sửa gì? Tìm đúng nơi trong bản đồ này.

---

## 📍 Tìm Nhanh Theo Mục Đích

### Tôi muốn sửa UI/Giao diện

| Muốn sửa               | Đi đến                                       | Ghi chú                            |
| ---------------------- | -------------------------------------------- | ---------------------------------- |
| Button, Input, Card... | `src/shared/ui/`                             | Shadcn components, ít khi cần sửa  |
| Header, Footer         | `src/widgets/header/`, `src/widgets/footer/` | Layout chung                       |
| Search input           | `src/features/search/ui/`                    | SearchInput, SearchInputMobile     |
| Search suggestions     | `src/features/search/ui/SearchInput.tsx`     | Dropdown gợi ý khi gõ              |
| Product filter         | `src/features/product-filter/ui/`            | ProductFilterBar, ActiveFilterTags |
| Trang chủ              | `src/widgets/homepage/`                      | Hero, featured sections            |
| Card sản phẩm          | `src/entities/product/ui/ProductCard.tsx`    | Dùng khắp nơi                      |
| Product Grid           | `src/widgets/product/ui/ProductGrid.tsx`     | Grid layout sản phẩm               |
| Form checkout          | `src/widgets/checkout/ui/`                   | Checkout page UI                   |
| Trang account          | `src/app/(customer)/account/`                | Dashboard, profile                 |
| Trang cửa hàng         | `src/app/(customer)/stores/`                 | List stores, store detail          |
| Trang vendor dashboard | `src/widgets/vendor/ui/`                     | Các page của vendor                |
| Trang admin            | `src/widgets/admin/ui/`                      | Các page của admin                 |

### Tôi muốn sửa Logic/Business

| Muốn sửa                   | Đi đến                                   | Ghi chú              |
| -------------------------- | ---------------------------------------- | -------------------- |
| Tính giá, phí ship         | `src/entities/cart/lib/utils.ts`         | Cart calculations    |
| Tính commission            | `src/entities/order/lib/utils.ts`        | Order calculations   |
| Validate form checkout     | `src/features/checkout/model/schema.ts`  | Zod schema           |
| Validate đăng ký/đăng nhập | `src/features/auth/model/schema.ts`      | Zod schema           |
| Trạng thái đơn hàng        | `src/entities/order/lib/utils.ts`        | Status transitions   |
| Format tiền, ngày          | `src/shared/lib/utils/format.ts`         | Formatting helpers   |
| Debounce search            | `src/features/search/ui/SearchInput.tsx` | use-debounce package |

### Tôi muốn sửa Database/API

| Muốn sửa              | Đi đến                                 | Ghi chú                                       |
| --------------------- | -------------------------------------- | --------------------------------------------- |
| Schema database       | `prisma/schema.prisma`                 | Chạy `prisma migrate dev` sau khi sửa         |
| Query lấy products    | `src/entities/product/api/queries.ts`  | Read operations với cache()                   |
| Search suggestions    | `src/entities/product/api/queries.ts`  | `searchProducts()` - gợi ý sản phẩm real-time |
| Filter products       | `src/entities/product/api/queries.ts`  | `getProducts()` - hỗ trợ price, rating, sort  |
| Tạo/sửa/xóa product   | `src/entities/product/api/actions.ts`  | Write operations                              |
| Query lấy orders      | `src/entities/order/api/queries.ts`    | Read operations                               |
| Cập nhật order status | `src/entities/order/api/actions.ts`    | Write operations                              |
| Query vendor          | `src/entities/vendor/api/queries.ts`   | Read operations                               |
| Public vendors list   | `src/entities/vendor/api/queries.ts`   | `getPublicVendors()`, `getPublicVendorById()` |
| Duyệt vendor          | `src/entities/vendor/api/actions.ts`   | Write operations                              |
| Query user profile    | `src/entities/user/api/queries.ts`     | `getCurrentUserProfile()`, order stats        |
| Update user profile   | `src/entities/user/api/actions.ts`     | `updateUserProfile()`                         |
| Query reviews         | `src/entities/review/api/queries.ts`   | Read reviews                                  |
| Tạo/sửa review        | `src/entities/review/api/actions.ts`   | Create, update reviews                        |
| Query wishlist        | `src/entities/wishlist/api/queries.ts` | Read wishlist                                 |
| Toggle wishlist       | `src/entities/wishlist/api/actions.ts` | Add/remove from wishlist                      |

### Tôi muốn sửa Authentication

| Muốn sửa             | Đi đến                                    | Ghi chú                      |
| -------------------- | ----------------------------------------- | ---------------------------- |
| Auth config          | `src/shared/lib/auth/config.ts`           | Better Auth setup            |
| Route protection     | `src/middleware.ts`                       | Middleware rules             |
| Role guards          | `src/entities/user/api/guards.ts`         | requireAuth, requireAdmin    |
| Login form           | `src/app/(auth)/login/page.tsx`           | Login page + Google OAuth    |
| Register form        | `src/app/(auth)/register/page.tsx`        | Register page + Google OAuth |
| Forgot password      | `src/app/(auth)/forgot-password/page.tsx` | Gửi email reset              |
| Reset password       | `src/app/(auth)/reset-password/page.tsx`  | Form đặt lại mật khẩu        |
| Google OAuth button  | `src/features/auth/ui/GoogleSignInButton` | Reusable component           |
| Auth form validation | `src/features/auth/model/`                | Zod schemas                  |
| Error translations   | `src/shared/lib/auth/error-messages.ts`   | Vietnamese error messages    |

### Tôi muốn thêm Page mới

| Loại page     | Tạo ở                      | Ví dụ                         |
| ------------- | -------------------------- | ----------------------------- |
| Customer page | `src/app/(customer)/`      | `/wishlist`, `/become-vendor` |
| Vendor page   | `src/app/(vendor)/vendor/` | `/vendor/analytics`           |
| Admin page    | `src/app/(admin)/admin/`   | `/admin/reports`              |
| Auth page     | `src/app/(auth)/`          | `/forgot-password`            |
| API route     | `src/app/api/`             | `/api/webhooks/...`           |

---

## 🏗️ Cấu Trúc Một Feature

Khi thêm tính năng mới, tạo theo cấu trúc này:

```
src/features/ten-tinh-nang/
├── api/              # Server actions (nếu cần)
│   └── actions.ts
├── model/            # Schemas, types (nếu cần)
│   ├── schema.ts     # Zod validation
│   └── types.ts
├── ui/
│   ├── Component.tsx
│   └── index.ts      # UI exports
└── index.ts          # Public exports
```

**Ví dụ thực tế - Search feature:**

```
src/features/search/
├── ui/
│   ├── SearchInput.tsx        # Desktop với suggestions
│   ├── SearchInputMobile.tsx  # Mobile panel
│   └── index.ts
└── index.ts
```

---

## ✅ Được Phép Sửa

### Thoải mái sửa

| Folder/File             | Lý do                                     |
| ----------------------- | ----------------------------------------- |
| `src/widgets/*/ui/`     | UI components, không ảnh hưởng core logic |
| `src/features/*/ui/`    | Feature UI                                |
| `src/entities/*/ui/`    | Entity UI components                      |
| `src/app/**/page.tsx`   | Page components                           |
| `src/app/**/layout.tsx` | Layout components                         |
| `prisma/seed.ts`        | Test data                                 |
| `docs/`                 | Documentation                             |

### Sửa cẩn thận (cần test)

| Folder/File                      | Lý do                       |
| -------------------------------- | --------------------------- |
| `src/entities/*/api/queries.ts`  | Ảnh hưởng data fetching     |
| `src/entities/*/api/actions.ts`  | Ảnh hưởng data mutations    |
| `src/entities/*/lib/utils.ts`    | Business logic calculations |
| `src/features/*/model/schema.ts` | Validation rules            |
| `src/shared/lib/utils/`          | Shared utilities            |

### Cần review kỹ

| Folder/File                 | Lý do                              |
| --------------------------- | ---------------------------------- |
| `prisma/schema.prisma`      | Database structure - cần migration |
| `src/shared/lib/auth/`      | Authentication - security critical |
| `src/middleware.ts`         | Route protection                   |
| `src/shared/lib/constants/` | App-wide constants                 |
| `src/generated/`            | Auto-generated - không sửa tay     |

---

## ❌ Không Nên Sửa (Trừ Khi Biết Rõ)

| Folder/File          | Lý do                                  |
| -------------------- | -------------------------------------- |
| `src/shared/ui/`     | Shadcn components - dùng CLI để update |
| `src/shared/lib/db/` | Prisma client singleton                |
| `src/generated/`     | Auto-generated từ Prisma               |
| `next.config.ts`     | Next.js config                         |
| `eslint.config.mjs`  | Linting rules đã chuẩn hóa             |
| `tsconfig.json`      | TypeScript config                      |
| `tailwind.config.ts` | Tailwind config                        |
| `*.lock` files       | Package lock files                     |

---

## 🔄 Quy Tắc Import (QUAN TRỌNG)

```
app/ → widgets/ → features/ → entities/ → shared/
                                       ↘ generated/
```

### ✅ Đúng

```typescript
// Trong widgets/ - import từ features/, entities/, shared/
import { SearchInput } from "@/features/search";
import { ProductCard, searchProducts } from "@/entities/product";
import { Button } from "@/shared/ui";

// Trong entities/ - import từ shared/ và generated/
import { prisma } from "@/shared/lib/db";
import { Role, OrderStatus } from "@/generated/prisma";
```

### ❌ Sai

```typescript
// Trong entities/ - KHÔNG import từ features/ hoặc widgets/
import { CheckoutForm } from "@/features/checkout"; // ❌ SAI!
import { Header } from "@/widgets/header"; // ❌ SAI!
```

---

## 📝 Checklist Trước Khi Commit

- [ ] Code đúng layer (không import ngược)
- [ ] Chạy `pnpm lint` - không lỗi
- [ ] Chạy `pnpm tsc --noEmit` - không lỗi TypeScript
- [ ] Chạy `pnpm test` - tests pass
- [ ] Nếu sửa schema: đã chạy `prisma migrate dev`
- [ ] Nếu thêm tính năng: đã viết tests
- [ ] Cập nhật documentation nếu cần

---

## 🆘 Không Biết Sửa Ở Đâu?

1. **Search trong codebase**: Tìm text/component name
2. **Đọc ARCHITECTURE.md**: Hiểu cấu trúc tổng quan
3. **Hỏi team**: Tạo issue với label `question`

---

## 📚 Quick Reference

### Constants quan trọng

| Constant                        | File                                 | Mô tả                          |
| ------------------------------- | ------------------------------------ | ------------------------------ |
| `ORDER.PLATFORM_FEE_RATE`       | `shared/lib/constants/order.ts`      | Phí platform (2%)              |
| `ORDER.SHIPPING_FEE_PER_VENDOR` | `shared/lib/constants/order.ts`      | Phí ship/vendor (30k)          |
| `ORDER_STATUS_CONFIG`           | `shared/lib/constants/order.ts`      | Label + variant cho Order      |
| `VENDOR_STATUS_CONFIG`          | `shared/lib/constants/order.ts`      | Label + variant cho Vendor     |
| `HEADER_NAV_ITEMS`              | `shared/lib/constants/navigation.ts` | Nav items cho header           |
| `HEADER_ICON_BUTTONS`           | `shared/lib/constants/navigation.ts` | Icon buttons cho header        |
| `HEADER_CATEGORIES`             | `shared/lib/constants/navigation.ts` | Categories cho search dropdown |
| `FOOTER_LINKS`                  | `shared/lib/constants/navigation.ts` | Các section links cho footer   |
| `VENDOR_NAV_ITEMS`              | `shared/lib/constants/navigation.ts` | Sidebar nav cho vendor         |
| `ADMIN_NAV_ITEMS`               | `shared/lib/constants/navigation.ts` | Sidebar nav cho admin          |
| `TOAST_MESSAGES`                | `shared/lib/constants/toast.ts`      | Centralized toast messages     |
| `LIMITS.PRODUCTS_PER_PAGE`      | `shared/lib/constants/limits.ts`     | Pagination                     |
| `REGEX_PATTERNS`                | `shared/lib/constants/formats.ts`    | Validation patterns            |

### Types quan trọng

| Type               | File                              | Dùng cho                  |
| ------------------ | --------------------------------- | ------------------------- |
| `ProductDetail`    | `entities/product/model/types.ts` | Chi tiết sản phẩm         |
| `ProductListItem`  | `entities/product/model/types.ts` | Item trong list/grid      |
| `SearchSuggestion` | `entities/product/api/queries.ts` | Gợi ý tìm kiếm sản phẩm   |
| `CartItem`         | `entities/cart/model/types.ts`    | Item trong giỏ hàng       |
| `OrderStatus`      | `@/generated/prisma`              | Trạng thái đơn hàng       |
| `VendorStatus`     | `@/generated/prisma`              | PENDING, APPROVED, etc.   |
| `Role`             | `@/generated/prisma`              | CUSTOMER, VENDOR, ADMIN   |
| `StatusConfig`     | `shared/lib/constants/order.ts`   | { label, variant }        |
| `NavItem`          | `shared/lib/constants/navigation` | Nav với icon              |
| `LinkItem`         | `shared/lib/constants/navigation` | Link đơn giản             |
| `HeaderIconButton` | `shared/lib/constants/navigation` | Icon button config header |

### Generated Types (Prisma)

| Type                 | Import từ            | Mô tả                       |
| -------------------- | -------------------- | --------------------------- |
| `UserModel`          | `@/generated/prisma` | User type từ Prisma         |
| `ProductModel`       | `@/generated/prisma` | Product type từ Prisma      |
| `OrderModel`         | `@/generated/prisma` | Order type từ Prisma        |
| `VendorProfileModel` | `@/generated/prisma` | VendorProfile từ Prisma     |
| `Role`               | `@/generated/prisma` | Enum: CUSTOMER/VENDOR/ADMIN |
| `OrderStatus`        | `@/generated/prisma` | Enum trạng thái đơn hàng    |
| `VendorStatus`       | `@/generated/prisma` | Enum trạng thái vendor      |

---

_Last updated: December 3, 2025_
