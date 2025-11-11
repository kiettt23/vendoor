# 🔄 Vendoor Refactoring Plan - SIMPLIFIED VERSION

> **Mục tiêu**: Refactor đơn giản, practical, dễ maintain cho junior dev

---

## 🎯 Philosophy: Keep It Simple!

### ❌ KHÔNG CẦN (Overengineering):

- ❌ Repository pattern với classes
- ❌ Service layer với classes
- ❌ Complex abstraction layers
- ❌ Dependency injection
- ❌ Over-abstracted code

### ✅ CHỈ CẦN (Simple & Practical):

- ✅ Tách rõ Client/Server components
- ✅ Server Actions thay API routes
- ✅ Feature-based organization
- ✅ Direct Prisma queries (OK!)
- ✅ Simple utility functions
- ✅ Clear folder structure

---

## 📊 Trạng thái hiện tại

### ✅ Đã hoàn thành (Phase 0-8)

- ✅ Auth, Products, Cart, Orders, Stores, Coupons, Address, Ratings đã migrate
- ✅ Đã có structure tốt với `index.client.ts` và `index.server.ts`

### ⚠️ Còn lại cần refactor (ĐƠN GIẢN HÓA)

#### 1. Legacy Actions (lib/actions/) → Chỉ cần MOVE + UPDATE IMPORTS

```
lib/actions/admin/    → features/[feature]/actions/admin-*.action.ts
lib/actions/seller/   → features/[feature]/actions/seller-*.action.ts
lib/actions/user/     → features/[feature]/actions/user-*.action.ts
```

#### 2. Legacy Components (components/features/) → Chỉ cần RENAME + MOVE

```
components/features/address/   → features/address/components/client/*.client.tsx
components/features/order/     → features/orders/components/
components/features/product/   → features/products/components/
components/features/rating/    → features/ratings/components/client/*.client.tsx
```

#### 3. Legacy Layout/Marketing → Move to shared/

```
components/layout/      → shared/components/layout/
components/features/marketing/ → shared/components/marketing/
components/ui/         → shared/components/ui/ (optional)
```

#### 4. Utils & Hooks → Organize better

```
lib/utils/     → shared/lib/
lib/hooks/     → features/[feature]/hooks/ hoặc shared/hooks/
```

#### 5. Cleanup

```
❌ Remove lib/actions/
❌ Remove lib/features/ (Redux slices - không dùng nữa)
❌ Remove components/features/
❌ Remove components/layout/
```

---

## 🚀 Kế hoạch chi tiết (SIMPLIFIED)

### Phase 9: Move Prisma (1 việc duy nhất!)

**Mục tiêu**: Tổ chức lại database client

#### Bước 1: Move file

```bash
mkdir -p server/db
mv lib/prisma.ts server/db/prisma.ts
```

#### Bước 2: Update imports (tự động với Find & Replace)

```
Tìm:    from "@/lib/prisma"
Thay:   from "@/server/db/prisma"
```

#### Bước 3: Test

```bash
npm run type-check
npm run dev
```

**Xong! Không cần tạo Repository, Service gì cả.**

---

### Phase 10: Migrate Actions (Simple Move)

**Mục tiêu**: Di chuyển actions vào đúng feature

#### 10.1. Admin Actions

<details>
<summary>Example: Store Admin Actions</summary>

```typescript
// ❌ OLD: lib/actions/admin/store.action.ts
"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveStore(storeId: string) {
  await prisma.store.update({
    where: { id: storeId },
    data: { isActive: true },
  });
  revalidatePath("/admin/approve");
  return { success: true };
}

export async function rejectStore(storeId: string) {
  await prisma.store.update({
    where: { id: storeId },
    data: { isActive: false },
  });
  revalidatePath("/admin/approve");
  return { success: true };
}

export async function toggleStoreActive(storeId: string) {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  await prisma.store.update({
    where: { id: storeId },
    data: { isActive: !store?.isActive },
  });
  revalidatePath("/admin/stores");
}

// ✅ NEW: features/stores/actions/admin-store.action.ts
// 👉 CHỈ COPY-PASTE + UPDATE IMPORT prisma!
("use server");
import prisma from "@/server/db/prisma"; // ← Chỉ thay dòng này
import { revalidatePath } from "next/cache";

export async function approveStore(storeId: string) {
  await prisma.store.update({
    where: { id: storeId },
    data: { isActive: true },
  });
  revalidatePath("/admin/approve");
  return { success: true };
}

export async function rejectStore(storeId: string) {
  await prisma.store.update({
    where: { id: storeId },
    data: { isActive: false },
  });
  revalidatePath("/admin/approve");
  return { success: true };
}

export async function toggleStoreActive(storeId: string) {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  await prisma.store.update({
    where: { id: storeId },
    data: { isActive: !store?.isActive },
  });
  revalidatePath("/admin/stores");
}

// ✅ Export trong features/stores/index.server.ts
export {
  approveStore,
  rejectStore,
  toggleStoreActive,
} from "./actions/admin-store.action";
```

</details>

**Checklist:**

```bash
# 1. Copy file
cp lib/actions/admin/store.action.ts features/stores/actions/admin-store.action.ts

# 2. Update prisma import trong file mới
# Tìm: from "@/lib/prisma"
# Thay: from "@/server/db/prisma"

# 3. Export trong index.server.ts
# features/stores/index.server.ts
export * from "./actions/admin-store.action";

# 4. Update imports trong app/admin/
# Tìm: from "@/lib/actions/admin/store.action"
# Thay: from "@/features/stores/index.server"

# 5. Test
npm run type-check
```

**Tương tự cho:**

- `lib/actions/admin/coupon.action.ts` → `features/coupons/actions/admin-coupon.action.ts`

#### 10.2. Seller Actions

**Checklist:**

```bash
# Product actions
cp lib/actions/seller/product.action.ts features/products/actions/seller-product.action.ts
# Update imports...

# Order actions
cp lib/actions/seller/order.action.ts features/orders/actions/seller-order.action.ts
# Update imports...

# Store actions
cp lib/actions/seller/store.action.ts features/stores/actions/seller-store.action.ts
# Update imports...
```

#### 10.3. User Actions

```bash
# Address
cp lib/actions/user/address.action.ts features/address/actions/address.action.ts

# Coupon
cp lib/actions/user/coupon.action.ts features/coupons/actions/user-coupon.action.ts

# Create Store
cp lib/actions/user/create-store.action.ts features/stores/actions/create-store.action.ts

# Order
cp lib/actions/user/order.action.ts features/orders/actions/user-order.action.ts

# Rating
cp lib/actions/user/rating.action.ts features/ratings/actions/rating.action.ts
```

**Files to migrate**: ~10 files
**Estimated time**: 2-3 hours

---

### Phase 11: Migrate Components (Simple Rename + Move)

**Mục tiêu**: Di chuyển components vào đúng feature với naming convention

#### 11.1. Address Components

```bash
# AddressManager.tsx → AddressManager.client.tsx
cp components/features/address/AddressManager.tsx \
   features/address/components/client/AddressManager.client.tsx

# AddressModal.tsx → AddressModal.client.tsx
cp components/features/address/AddressModal.tsx \
   features/address/components/client/AddressModal.client.tsx

# Thêm "use client" directive nếu chưa có
# Export trong index.client.ts
# features/address/index.client.ts
export { AddressManager } from "./components/client/AddressManager.client";
export { AddressModal } from "./components/client/AddressModal.client";

# Update imports trong app/
# Tìm: from "@/components/features/address/AddressManager"
# Thay: from "@/features/address/index.client"
```

#### 11.2. Order Components

```bash
# OrderItem (Client)
cp components/features/order/OrderItem.tsx \
   features/orders/components/client/OrderItem.client.tsx

# OrderSummary (có thể là Server hoặc Client - check code)
# Nếu không có "use client" → Server Component
cp components/features/order/OrderSummary.tsx \
   features/orders/components/server/OrderSummary.server.tsx

# OrdersAreaChart (Client - có chart)
cp components/features/order/OrdersAreaChart.tsx \
   features/orders/components/client/OrdersAreaChart.client.tsx

# Export
# features/orders/index.client.ts
export { OrderItem } from "./components/client/OrderItem.client";
export { OrdersAreaChart } from "./components/client/OrdersAreaChart.client";

# features/orders/index.server.ts
export { OrderSummary } from "./components/server/OrderSummary.server";
```

#### 11.3. Product Components

```bash
# Client Components (có interactivity)
ProductCard.tsx          → features/products/components/client/ProductCard.client.tsx
ProductDescription.tsx   → features/products/components/client/ProductDescription.client.tsx

# Server Components (chỉ render, không có state/events)
BestSelling.tsx         → features/products/components/server/BestSelling.server.tsx
LatestProducts.tsx      → features/products/components/server/LatestProducts.server.tsx
ProductDetails.tsx      → features/products/components/server/ProductDetails.server.tsx

# Update exports
```

#### 11.4. Rating Components

```bash
# RatingModal (Client)
cp components/features/rating/RatingModal.tsx \
   features/ratings/components/client/RatingModal.client.tsx

# Export
# features/ratings/index.client.ts
export { RatingModal } from "./components/client/RatingModal.client";
```

**Files to migrate**: ~15 files
**Estimated time**: 3-4 hours

---

### Phase 12: Migrate to Shared (Marketing + Layout)

**Mục tiêu**: Tạo shared layer cho reusable components

#### 12.1. Marketing Components

```bash
# Tạo folder
mkdir -p shared/components/marketing

# Move files (giữ nguyên tên)
cp components/features/marketing/Newsletter.tsx shared/components/marketing/
cp components/features/marketing/OurSpec.tsx shared/components/marketing/
cp components/features/marketing/CategoriesMarquee.tsx shared/components/marketing/

# Create barrel export
# shared/components/marketing/index.ts
export { Newsletter } from "./Newsletter";
export { OurSpec } from "./OurSpec";
export { CategoriesMarquee } from "./CategoriesMarquee";

# Update imports trong app/
# Tìm: from "@/components/features/marketing/Newsletter"
# Thay: from "@/shared/components/marketing"
```

#### 12.2. Layout Components

```bash
# Tạo folder
mkdir -p shared/components/layout

# Move files
cp components/layout/Navbar.tsx shared/components/layout/
cp components/layout/Footer.tsx shared/components/layout/
cp components/layout/Hero.tsx shared/components/layout/
cp components/layout/Banner.tsx shared/components/layout/

# Create barrel export
# shared/components/layout/index.ts
export { Navbar } from "./Navbar";
export { Footer } from "./Footer";
export { Hero } from "./Hero";
export { Banner } from "./Banner";

# Update imports
# Tìm: from "@/components/layout/Navbar"
# Thay: from "@/shared/components/layout"
```

#### 12.3. UI Components (OPTIONAL)

```bash
# Option 1: Giữ nguyên trong components/ui (nếu dùng shadcn)
# → Không cần làm gì!

# Option 2: Move sang shared/ (nếu muốn consistent)
mkdir -p shared/components/ui
cp -r components/ui/* shared/components/ui/

# Nhưng recommend: GIỮ NGUYÊN components/ui cho shadcn
```

**Files to migrate**: ~10 files
**Estimated time**: 1-2 hours

---

### Phase 13: Organize Utils & Hooks

**Mục tiêu**: Tổ chức utilities và hooks

#### 13.1. Shared Utils

```bash
# Tạo folder
mkdir -p shared/lib/{format,constants,helpers}

# Move format utilities
cp -r lib/utils/format/* shared/lib/format/

# Move constants
cp -r lib/utils/constants/* shared/lib/constants/

# Move helpers
cp -r lib/utils/helpers/* shared/lib/helpers/

# Copy utils.ts (cn, clsx helpers)
cp lib/utils.ts shared/lib/utils.ts

# Create barrel exports
# shared/lib/index.ts
export * from "./utils";
export * from "./format";
export * from "./constants";
export * from "./helpers";

# Update imports
# Tìm: from "@/lib/utils/format/currency"
# Thay: from "@/shared/lib/format/currency"
# Hoặc: from "@/shared/lib"
```

#### 13.2. Feature-specific Hooks

```bash
# Move hooks to their features
mv lib/hooks/useAIImageAnalysis.ts features/products/hooks/
mv lib/hooks/useOrderManagement.ts features/orders/hooks/
mv lib/hooks/useSellerStatus.ts features/stores/hooks/

# Export trong index.client.ts
# features/products/index.client.ts
export { useAIImageAnalysis } from "./hooks/useAIImageAnalysis";

# features/orders/index.client.ts
export { useOrderManagement } from "./hooks/useOrderManagement";

# features/stores/index.client.ts
export { useSellerStatus } from "./hooks/useSellerStatus";

# Update imports
```

**Files to migrate**: ~10 files
**Estimated time**: 1 hour

---

### Phase 14: Cleanup (XÓA files cũ)

**Mục tiêu**: Dọn dẹp legacy files

#### ⚠️ CHỈ XÓA SAU KHI:

1. ✅ Type check pass
2. ✅ Dev server chạy OK
3. ✅ Tất cả pages load được
4. ✅ Tất cả features hoạt động
5. ✅ Đã commit code

#### Backup trước khi xóa:

```bash
# Tạo backup
mkdir -p .backup
cp -r lib/actions .backup/
cp -r lib/features .backup/
cp -r components/features .backup/
cp -r components/layout .backup/
```

#### Xóa legacy folders:

```bash
# Xóa Redux slices (không dùng nữa)
rm -rf lib/features
rm lib/store.ts

# Xóa legacy actions (đã migrate)
rm -rf lib/actions

# Xóa legacy components (đã migrate)
rm -rf components/features
rm -rf components/layout

# Optional: Xóa legacy utils nếu đã migrate hết
# rm -rf lib/utils
# rm -rf lib/hooks
```

#### Verify sau khi xóa:

```bash
npm run type-check
npm run dev
# Test all features
```

**Estimated time**: 30 minutes

---

## 🏗️ Kiến trúc cuối cùng (SIMPLE VERSION)

```
vendoor/
├── app/                           # Next.js App Router
│   ├── (user)/                   # Customer routes
│   ├── admin/                    # Admin routes
│   ├── store/                    # Vendor routes
│   └── api/                      # API Routes (webhooks only)
│
├── features/                      # ✅ FEATURE-BASED MODULES
│   ├── auth/
│   │   ├── components/
│   │   │   ├── client/*.client.tsx
│   │   │   └── server/*.server.tsx
│   │   ├── actions/*.action.ts       # 👈 Direct Prisma queries OK!
│   │   ├── queries/*.query.ts        # 👈 Direct Prisma queries OK!
│   │   ├── hooks/use*.ts
│   │   ├── schemas/*.schema.ts
│   │   ├── types/*.types.ts
│   │   ├── index.client.ts
│   │   └── index.server.ts
│   │
│   ├── products/                 # Same structure
│   ├── cart/
│   ├── orders/
│   ├── stores/
│   ├── coupons/
│   ├── address/
│   └── ratings/
│
├── server/                        # ✅ SIMPLE SERVER LAYER
│   └── db/
│       └── prisma.ts             # Prisma client only!
│
├── shared/                        # ✅ SHARED UTILITIES
│   ├── components/
│   │   ├── ui/                   # Design system (shadcn)
│   │   ├── layout/               # Layout components
│   │   └── marketing/            # Marketing components
│   ├── lib/
│   │   ├── utils.ts              # cn, clsx, etc.
│   │   ├── format/               # formatPrice, formatDate
│   │   ├── constants/            # APP_CONFIG, ROUTES
│   │   └── helpers/              # Helper functions
│   ├── hooks/                    # Universal hooks
│   │   ├── use-debounce.ts
│   │   ├── use-media-query.ts
│   │   └── use-local-storage.ts
│   └── types/                    # Shared types
│       └── common.types.ts
│
├── components/                    # ✅ Keep cho shadcn UI
│   └── ui/                       # Shadcn components
│
├── prisma/
├── public/
└── configs/
```

---

## 📝 Import Conventions (SIMPLE)

### ✅ Client Components & Hooks

```typescript
// From features
import {
  ProductCard,
  useProductFilters,
} from "@/features/products/index.client";
import { CartDrawer, useCart } from "@/features/cart/index.client";
import { UserButton, useSession } from "@/features/auth/index.client";

// From shared
import { Button, Card } from "@/components/ui"; // or @/shared/components/ui
import { formatPrice, formatDate } from "@/shared/lib";
import { Navbar, Footer } from "@/shared/components/layout";
```

### ✅ Server Components, Actions, Queries

```typescript
// From features
import { getProducts } from "@/features/products/index.server";
import { createProduct } from "@/features/products/index.server";
import { requireAuth } from "@/features/auth/index.server";

// Direct Prisma (OK trong queries!)
import prisma from "@/server/db/prisma";

async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { store: true, rating: true },
  });
}
```

---

## 🚀 Quick Migration Steps

### Tóm tắt toàn bộ process:

```bash
# Phase 9: Move Prisma (5 phút)
mkdir -p server/db
mv lib/prisma.ts server/db/prisma.ts
# Find & Replace: "@/lib/prisma" → "@/server/db/prisma"

# Phase 10: Move Actions (2-3 giờ)
# Copy từng file từ lib/actions/ sang features/[feature]/actions/
# Update imports trong app/

# Phase 11: Move Components (3-4 giờ)
# Copy từng file từ components/features/ sang features/[feature]/components/
# Rename với .client.tsx hoặc .server.tsx
# Update imports trong app/

# Phase 12: Move to Shared (1-2 giờ)
mkdir -p shared/components/{layout,marketing}
# Copy marketing & layout components
# Update imports

# Phase 13: Organize Utils (1 giờ)
mkdir -p shared/lib
# Copy utils, format, constants
# Update imports

# Phase 14: Cleanup (30 phút)
# Backup first!
rm -rf lib/actions lib/features components/features components/layout
```

**Total time**: 8-11 giờ (1-2 ngày làm việc)

---

## ✅ Success Criteria

- ✅ `npm run type-check` pass
- ✅ `npm run dev` chạy không lỗi
- ✅ Tất cả pages load được
- ✅ Client/Server components phân tách rõ
- ✅ Feature-based organization
- ✅ Clean imports với barrel exports
- ✅ Không còn legacy folders
- ✅ Code dễ đọc, dễ maintain

---

## 🎯 Key Principles

1. **KISS (Keep It Simple, Stupid)**

   - Không cần Repository pattern
   - Không cần Service classes
   - Direct Prisma queries là OK!

2. **Feature-based Organization**

   - Mỗi feature tự contained
   - Clear imports/exports

3. **Client/Server Separation**

   - `.client.tsx` cho Client Components
   - `.server.tsx` cho Server Components
   - Clear "use client" directives

4. **Progressive Refactoring**
   - Làm từng phase
   - Test sau mỗi phase
   - Git commit thường xuyên

---

## 🆘 Nếu gặp vấn đề

```bash
# Rollback git commit
git log --oneline -5
git reset --hard <previous-commit>

# Hoặc restore từ backup
cp -r .backup/lib/actions lib/
cp -r .backup/components/features components/
```

---

## 📚 Next Steps

Bạn ready để bắt đầu?

**Đề xuất workflow:**

1. Đọc hết file này
2. Commit code hiện tại
3. Bắt đầu Phase 9 (Move Prisma - 5 phút)
4. Test xong Phase 9 → Phase 10
5. Cứ từng phase một

Tôi có thể giúp bạn implement từng phase! 🚀

---

**Bottom line**: Refactoring này chỉ là **di chuyển files + đổi tên + update imports**.
Không có gì phức tạp! 💪
