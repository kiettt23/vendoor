# Vendoor - Code Tour 🎒

## Chào mừng bạn đến với Vendoor!

Xin chào! Tôi sẽ là hướng dẫn viên của bạn trong chuyến tham quan code Vendoor. Đừng lo nếu bạn chưa biết gì - tôi sẽ giải thích **từng dòng code** một cách chi tiết nhất có thể.

Hãy tưởng tượng bạn đang đi tham quan một tòa nhà. Tôi sẽ dẫn bạn từ cửa chính, qua từng phòng, giải thích mỗi thứ bạn thấy.

---

## 📋 Mục lục Tour

1. [Điểm xuất phát - Cấu trúc thư mục](#1-điểm-xuất-phát---cấu-trúc-thư-mục)
2. [Tầng trệt - Configuration files](#2-tầng-trệt---configuration-files)
3. [Database - Nền móng của tòa nhà](#3-database---nền-móng-của-tòa-nhà)
4. [Shared - Kho đồ dùng chung](#4-shared---kho-đồ-dùng-chung)
5. [Entities - Các phòng chức năng](#5-entities---các-phòng-chức-năng)
6. [Features - Các tiện ích](#6-features---các-tiện-ích)
7. [App - Routing và Pages](#7-app---routing-và-pages)

---

## 1. Điểm xuất phát - Cấu trúc thư mục

Đầu tiên, hãy nhìn tổng quan tòa nhà của chúng ta:

```
vendoor/
├── prisma/          ← 🏗️ Nền móng (Database)
├── src/
│   ├── shared/      ← 🧰 Kho đồ dùng chung
│   ├── entities/    ← 🏠 Các phòng chức năng (Product, Order, Cart...)
│   ├── features/    ← ⚡ Các tiện ích (Checkout, Search...)
│   ├── widgets/     ← 🖼️ Các khu vực lớn (Header, Footer...)
│   └── app/         ← 🚪 Các cửa ra vào (Routes)
├── package.json     ← 📦 Danh sách đồ đạc cần mua
└── .env             ← 🔐 Chìa khóa bí mật
```

**Quy tắc đơn giản:** Đọc từ dưới lên trên (shared → entities → features → app)

---

## 2. Tầng trệt - Configuration files

### 2.1. package.json - Danh sách dependencies

📁 **File:** `package.json`

```json
{
  "name": "vendoor",        // Tên dự án
  "version": "0.1.0",       // Phiên bản
  "private": true,          // Không publish lên npm
```

**Giải thích:** Đây là "sổ kế toán" của dự án, liệt kê tất cả thư viện cần dùng.

```json
  "scripts": {
    "dev": "next dev",                    // Chạy development server
    "build": "next build",                // Build production
    "start": "next start",                // Chạy production
    "test": "vitest",                     // Chạy tests
    "db:seed": "tsx prisma/seed.ts",      // Seed database
  },
```

**Giải thích:** `scripts` là các "phím tắt". Thay vì gõ lệnh dài, bạn chỉ cần gõ `pnpm dev`.

```json
  "dependencies": {
    "next": "16.0.7",                     // Framework chính
    "react": "19.2.1",                    // UI library
    "@prisma/client": "^7.0.1",           // Database client
    "zustand": "^5.0.8",                  // State management
    "zod": "^4.1.12",                     // Validation
  }
}
```

**Giải thích:** `dependencies` là danh sách các "công cụ" mà code của chúng ta sử dụng.

---

### 2.2. tsconfig.json - Cấu hình TypeScript

📁 **File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Giải thích quan trọng:**

Thay vì viết:

```typescript
import { Button } from "../../../shared/ui/button"; // Xấu, khó đọc
```

Chúng ta có thể viết:

```typescript
import { Button } from "@/shared/ui/button"; // Đẹp, dễ đọc!
```

Ký tự `@/` là alias trỏ đến thư mục `src/`.

---

## 3. Database - Nền móng của tòa nhà

### 3.1. prisma/schema.prisma - Bản vẽ database

📁 **File:** `prisma/schema.prisma`

Đây là file **quan trọng nhất** để hiểu dữ liệu. Hãy đọc từng phần:

```prisma
// Phần 1: Cấu hình generator
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma/client"
}
```

**Giải thích từng dòng:**

- `generator client` = Prisma sẽ tạo ra code TypeScript
- `output` = Code được tạo ra sẽ lưu ở đâu

```prisma
// Phần 2: Cấu hình database
datasource db {
  provider = "postgresql"
}
```

**Giải thích:** Chúng ta dùng PostgreSQL (qua Neon).

```prisma
// Phần 3: Định nghĩa Enums (các giá trị cố định)
enum Role {
  CUSTOMER   // Khách hàng
  VENDOR     // Người bán
  ADMIN      // Quản trị viên
}
```

**Giải thích:** `enum` giống như dropdown - chỉ có thể chọn 1 trong các giá trị đã định nghĩa.

```prisma
// Phần 4: Model User (Người dùng)
model User {
  id            String    @id @default(cuid())
  //            ↑         ↑   ↑
  //            |         |   └── Tự động tạo ID dạng "cuid"
  //            |         └── Đây là Primary Key (khóa chính)
  //            └── Kiểu dữ liệu là String

  email         String    @unique
  //                      ↑
  //                      └── Không được trùng (unique)

  name          String?
  //                  ↑
  //                  └── Dấu ? có nghĩa là có thể NULL (không bắt buộc)

  roles         String[]  @default(["CUSTOMER"])
  //                  ↑   ↑
  //                  |   └── Giá trị mặc định là ["CUSTOMER"]
  //                  └── Array of strings

  createdAt     DateTime  @default(now())
  //                      ↑
  //                      └── Tự động set thời gian hiện tại khi tạo

  // Relations (Quan hệ với bảng khác)
  vendorProfile VendorProfile?
  //            ↑            ↑
  //            |            └── ? = 0 hoặc 1 (optional)
  //            └── Liên kết đến bảng VendorProfile

  products      Product[]
  //                   ↑
  //                   └── [] = 0 hoặc nhiều (1-to-many)
}
```

**Tóm tắt ký hiệu:**

- `@id` = Primary key
- `@unique` = Không được trùng
- `?` = Optional (có thể null)
- `[]` = Array (nhiều)
- `@default(...)` = Giá trị mặc định

```prisma
// Phần 5: Model Product (Sản phẩm)
model Product {
  id          String    @id @default(cuid())

  vendorId    String
  //          ↑
  //          └── Foreign Key - ID của vendor sở hữu product này

  vendor      User      @relation(fields: [vendorId], references: [id])
  //          ↑         ↑
  //          |         └── Nối vendorId với User.id
  //          └── Kiểu dữ liệu là User (relation)

  name        String
  slug        String    @unique
  //          ↑
  //          └── URL-friendly version của name, ví dụ: "iphone-15-pro"

  isActive    Boolean   @default(true)
  //          ↑         ↑
  //          |         └── Mặc định là true
  //          └── true/false

  variants    ProductVariant[]
  //          ↑
  //          └── Một product có nhiều variants (màu, size...)

  @@index([vendorId])
  //       ↑
  //       └── Tạo index để query nhanh hơn
}
```

---

### 3.2. src/shared/lib/db/prisma.ts - Kết nối Database

📁 **File:** `src/shared/lib/db/prisma.ts`

```typescript
/**
 * Dòng 1: Import "server-only"
 * Có nghĩa: File này CHỈ được dùng trên server
 * Nếu ai import file này ở client (browser), sẽ bị lỗi ngay!
 */
import "server-only";

/**
 * Dòng 2-3: Import các thứ cần thiết
 */
import { PrismaPg } from "@prisma/adapter-pg";
// ↑ Adapter để kết nối Prisma với PostgreSQL (Neon)

import { PrismaClient } from "@/generated/prisma/client/client";
// ↑ Prisma Client đã được generate từ schema.prisma

/**
 * Dòng 4-8: Singleton Pattern
 * Vấn đề: Mỗi lần save file, Next.js dev server restart
 *         → Tạo connection mới → Hết connection!
 * Giải pháp: Lưu Prisma client vào biến global
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
// ↑ Ép kiểu globalThis để lưu prisma instance

/**
 * Dòng 9-18: Tạo Prisma Client
 */
function createPrismaClient() {
  // Tạo adapter cho Neon (serverless PostgreSQL)
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    //                ↑                        ↑
    //                |                        └── ! = chắc chắn có giá trị
    //                └── Lấy từ biến môi trường .env
  });

  return new PrismaClient({
    adapter, // Sử dụng adapter ở trên
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"] // Dev: log nhiều để debug
        : ["error"], // Prod: chỉ log lỗi
  });
}

/**
 * Dòng 19-23: Export prisma client
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
//                    ↑                      ↑
//                    |                      └── Nếu chưa có, tạo mới
//                    └── Nếu đã có trong global, dùng lại

// Chỉ lưu vào global khi development (để tránh memory leak)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

---

## 4. Shared - Kho đồ dùng chung

### 4.1. UI Components

📁 **File:** `src/shared/ui/button.tsx`

```tsx
import * as React from "react";
// ↑ Import React library

import { Slot } from "@radix-ui/react-slot";
// ↑ Radix UI component cho asChild pattern

import { cva, type VariantProps } from "class-variance-authority";
// ↑ Library để quản lý className variants

import { cn } from "@/shared/lib/utils/cn";
// ↑ Utility function để merge classNames

/**
 * buttonVariants: Định nghĩa các style variants của Button
 */
const buttonVariants = cva(
  // Base styles (luôn áp dụng)
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      // Variant "variant" - loại button
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      // Variant "size" - kích thước
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    // Giá trị mặc định
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Interface định nghĩa Props của Button
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    //      ↑ Kế thừa tất cả props của <button> HTML
    VariantProps<typeof buttonVariants> {
  //          ↑ Thêm props variant và size
  asChild?: boolean;
  // ↑ Nếu true, render children thay vì <button>
}

/**
 * Button Component
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  // ↑ forwardRef cho phép truyền ref vào component

  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Destructuring props:
    // - className: custom classes từ người dùng
    // - variant: "default" | "destructive" | "outline" | "ghost"
    // - size: "default" | "sm" | "lg" | "icon"
    // - asChild: render như Slot hay button
    // - ...props: tất cả props còn lại (onClick, disabled, etc.)
    // - ref: reference đến DOM element

    const Comp = asChild ? Slot : "button";
    // ↑ Nếu asChild=true, dùng Slot. Ngược lại, dùng <button>

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        //         ↑ Merge tất cả classes lại
        ref={ref}
        {...props}
        // ↑ Spread tất cả props còn lại
      />
    );
  }
);

// Đặt displayName cho React DevTools
Button.displayName = "Button";

export { Button, buttonVariants };
```

**Cách sử dụng:**

```tsx
// Button mặc định
<Button>Click me</Button>

// Button destructive, size lớn
<Button variant="destructive" size="lg">Delete</Button>

// Button với custom className
<Button className="mt-4">Submit</Button>
```

---

### 4.2. Utility Functions

📁 **File:** `src/shared/lib/utils/cn.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
// ↑ clsx: Combine classNames, bỏ qua falsy values

import { twMerge } from "tailwind-merge";
// ↑ twMerge: Merge Tailwind classes thông minh

/**
 * cn = className utility
 * Kết hợp clsx và twMerge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Ví dụ:**

```typescript
cn("px-4 py-2", "px-8");
// Kết quả: "px-8 py-2"
// twMerge thông minh biết px-8 ghi đè px-4

cn("text-red-500", condition && "text-blue-500");
// Nếu condition = true  → "text-blue-500"
// Nếu condition = false → "text-red-500"
```

---

📁 **File:** `src/shared/lib/utils/format.ts`

```typescript
/**
 * Format số thành tiền VND
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// Ví dụ:
// formatPrice(1500000) → "1.500.000 ₫"
```

---

## 5. Entities - Các phòng chức năng

### 5.1. Cart Store (Zustand)

📁 **File:** `src/entities/cart/model/store.ts`

```typescript
"use client";
// ↑ Đánh dấu đây là Client Component
// Zustand cần chạy trên browser để lưu localStorage

import { create } from "zustand";
// ↑ Function để tạo store

import { persist } from "zustand/middleware";
// ↑ Middleware để lưu state vào localStorage

import type { CartStore } from "./types";
// ↑ Import type định nghĩa shape của store

/**
 * Tạo Zustand store
 * create<CartStore>() - Tạo store với type CartStore
 * persist(...) - Wrap logic để persist
 */
export const useCartStore = create<CartStore>()(
  persist(
    // Callback function nhận (set, get)
    // set: function để update state
    // get: function để đọc current state
    (set, get) => ({
      // State
      items: [],
      // ↑ Mảng chứa các items trong giỏ hàng

      /**
       * Action: addItem
       * Thêm sản phẩm vào giỏ
       */
      addItem: (newItem) => {
        const items = get().items;
        // ↑ Lấy items hiện tại

        const existingItem = items.find(
          (item) => item.id === newItem.variantId
        );
        // ↑ Tìm xem item đã có trong giỏ chưa

        if (existingItem) {
          // Nếu đã có → Tăng số lượng
          const newQuantity = existingItem.quantity + 1;

          set({
            items: items.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
          // ↑ Update state bằng set()
          // map qua items, tìm item cần update, thay đổi quantity
        } else {
          // Nếu chưa có → Thêm mới
          set({
            items: [...items, { ...newItem, quantity: 1 }],
          });
          // ↑ Spread items cũ + thêm item mới
        }
      },

      /**
       * Action: updateQuantity
       * Cập nhật số lượng
       */
      updateQuantity: (variantId, quantity) => {
        set({
          items: get().items.map((item) =>
            item.id === variantId ? { ...item, quantity } : item
          ),
        });
      },

      /**
       * Action: removeItem
       * Xóa item khỏi giỏ
       */
      removeItem: (variantId) => {
        set({
          items: get().items.filter((item) => item.id !== variantId),
        });
        // ↑ filter() giữ lại những items KHÔNG phải variantId
      },

      /**
       * Action: clearCart
       * Xóa toàn bộ giỏ hàng
       */
      clearCart: () => set({ items: [] }),
    }),

    // Persist config
    { name: "cart-storage" }
    //       ↑ Key trong localStorage
  )
);
```

**Cách sử dụng trong component:**

```tsx
"use client";
import { useCartStore } from "@/entities/cart";

function CartButton() {
  // Lấy items từ store
  const items = useCartStore((state) => state.items);

  // Lấy action
  const addItem = useCartStore((state) => state.addItem);

  // Tính tổng số lượng
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return <button>Cart ({totalItems})</button>;
}
```

---

### 5.2. Product Card Component

📁 **File:** `src/entities/product/ui/ProductCard.tsx`

```tsx
import Link from "next/link";
// ↑ Next.js Link component cho client-side navigation

import Image from "next/image";
// ↑ Next.js Image component với optimization

import { Card } from "@/shared/ui/card";
// ↑ Card component từ shared

import { formatPrice } from "@/shared/lib/utils";
// ↑ Format tiền VND

import type { ProductListItem } from "../model";
// ↑ Type định nghĩa shape của product

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  // Lấy variant mặc định (để hiển thị giá)
  const defaultVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0];

  // Lấy ảnh đầu tiên
  const mainImage = product.images[0];

  // Tính % giảm giá
  const discount = defaultVariant.compareAtPrice
    ? Math.round(
        ((defaultVariant.compareAtPrice - defaultVariant.price) /
          defaultVariant.compareAtPrice) *
          100
      )
    : 0;

  return (
    <Link href={`/products/${product.slug}`}>
      {/* ↑ Click vào card sẽ navigate đến trang chi tiết */}

      <Card className="group overflow-hidden">
        {/* ↑ group class cho hover effects */}

        {/* Phần ảnh */}
        <div className="relative aspect-square">
          {/* ↑ aspect-square = hình vuông */}

          {mainImage && (
            <Image
              src={mainImage.url}
              alt={product.name}
              fill
              // ↑ fill = ảnh chiếm toàn bộ parent
              className="object-cover transition-transform group-hover:scale-105"
              // ↑ object-cover = crop ảnh vừa khung
              // ↑ group-hover:scale-105 = zoom khi hover card
            />
          )}

          {/* Badge giảm giá */}
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Phần thông tin */}
        <div className="p-4">
          {/* Tên vendor */}
          <p className="text-sm text-muted-foreground">
            {product.vendor.vendorProfile?.shopName}
          </p>

          {/* Tên sản phẩm */}
          <h3 className="font-medium line-clamp-2">
            {/* ↑ line-clamp-2 = tối đa 2 dòng, thêm ... nếu dài */}
            {product.name}
          </h3>

          {/* Giá */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(defaultVariant.price)}
            </span>

            {defaultVariant.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {/* ↑ line-through = gạch ngang */}
                {formatPrice(defaultVariant.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
```

---

## 6. Features - Các tiện ích

### 6.1. Checkout Server Action

📁 **File:** `src/features/checkout/api/actions.ts`

```typescript
"use server";
// ↑ QUAN TRỌNG: Đánh dấu đây là Server Action
// Code này chạy TRÊN SERVER, không phải browser

import { revalidateTag } from "next/cache";
// ↑ Function để invalidate cache

import { prisma } from "@/shared/lib/db";
// ↑ Prisma client để query database

import { getSession } from "@/shared/lib/auth/session";
// ↑ Function lấy session user hiện tại

/**
 * Server Action: createOrders
 * Tạo đơn hàng từ giỏ hàng
 */
export async function createOrders(
  cartItems: CartItem[],
  shippingInfo: ShippingInfo,
  paymentMethod: "COD" | "STRIPE"
): Promise<CreateOrdersResult> {
  try {
    // Bước 1: Kiểm tra user đã đăng nhập chưa
    const session = await getSession();
    if (!session?.user) {
      return {
        success: false,
        error: "Vui lòng đăng nhập",
      };
    }

    // Bước 2: Kiểm tra giỏ hàng có items không
    if (!cartItems?.length) {
      return {
        success: false,
        error: "Giỏ hàng trống",
      };
    }

    // Bước 3: Nhóm items theo vendor
    // Vì 1 order = 1 vendor
    const vendorGroups = groupItemsByVendor(cartItems);

    // Bước 4: Thực hiện transaction
    // Transaction = tất cả thành công hoặc tất cả rollback
    const result = await prisma.$transaction(async (tx) => {
      //                      ↑ tx = transaction client

      // 4a. Giảm stock cho mỗi variant
      for (const item of cartItems) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        });

        // Kiểm tra đủ hàng không
        if (!variant || variant.stock < item.quantity) {
          throw new Error(`${item.productName} không đủ hàng`);
          // ↑ throw error sẽ rollback toàn bộ transaction
        }

        // Giảm stock
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
          //              ↑ decrement = giảm đi
        });
      }

      // 4b. Tạo orders (1 order cho mỗi vendor)
      const createdOrders = [];

      for (const group of vendorGroups) {
        const order = await tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            customerId: session.user.id,
            vendorId: group.vendorId,
            status: paymentMethod === "COD" ? "PENDING" : "PENDING_PAYMENT",
            // ... pricing, shipping info
            items: {
              create: group.items.map((item) => ({
                productName: item.productName,
                variantId: item.variantId,
                price: item.price,
                quantity: item.quantity,
                subtotal: item.price * item.quantity,
              })),
            },
          },
        });

        createdOrders.push(order);
      }

      // 4c. Tạo payment record
      const payment = await tx.payment.create({
        data: {
          paymentNumber: generatePaymentNumber(),
          amount: totalAmount,
          method: paymentMethod,
          status: "PENDING",
        },
      });

      return { orders: createdOrders, paymentId: payment.id };
    });

    // Bước 5: Invalidate caches
    revalidateTag("products"); // Stock đã thay đổi
    revalidateTag("orders"); // Có orders mới

    return {
      success: true,
      orders: result.orders,
      totalAmount,
    };
  } catch (error) {
    // Bất kỳ lỗi nào cũng trả về error message
    return {
      success: false,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra",
    };
  }
}
```

---

## 7. App - Routing và Pages

### 7.1. Root Layout

📁 **File:** `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
// ↑ Type cho SEO metadata

import { Inter } from "next/font/google";
// ↑ Google Font

import "./globals.css";
// ↑ Global CSS (Tailwind)

import { Toaster } from "@/shared/ui/sonner";
// ↑ Toast notifications

import { QueryProvider } from "@/shared/providers/query-provider";
// ↑ TanStack Query provider

// Cấu hình font
const inter = Inter({ subsets: ["latin"] });

// SEO Metadata
export const metadata: Metadata = {
  title: "Vendoor - Multi-Vendor Marketplace",
  description: "Sàn thương mại điện tử đa người bán",
};

// Root Layout Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      {/* ↑ lang="vi" cho accessibility và SEO */}

      <body className={inter.className}>
        {/* ↑ Áp dụng font Inter */}

        <QueryProvider>
          {/* ↑ TanStack Query context */}

          {children}
          {/* ↑ Nội dung page */}

          <Toaster />
          {/* ↑ Container cho toast notifications */}
        </QueryProvider>
      </body>
    </html>
  );
}
```

---

### 7.2. Homepage

📁 **File:** `src/app/(main)/page.tsx`

```tsx
import { HeroSection } from "@/widgets/homepage";
import { FeaturedProducts } from "@/widgets/homepage";
import { CategoryGrid } from "@/widgets/homepage";

// Đây là Server Component (mặc định)
// Không có "use client" ở đầu file

export default async function HomePage() {
  // Vì đây là Server Component, có thể dùng async/await
  // để fetch data trực tiếp!

  return (
    <main>
      {/* Hero section - Banner lớn */}
      <HeroSection />

      {/* Featured products */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm nổi bật</h2>
        <FeaturedProducts />
        {/* ↑ Server Component, fetch data bên trong */}
      </section>

      {/* Category grid */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-6">Danh mục</h2>
        <CategoryGrid />
      </section>
    </main>
  );
}
```

---

### 7.3. Product Detail Page

📁 **File:** `src/app/(main)/products/[slug]/page.tsx`

```tsx
import { notFound } from "next/navigation";
// ↑ Function để redirect đến 404

import { getProductBySlug } from "@/entities/product/api/queries";
// ↑ Server-only query function

import { ProductDetailClient } from "@/entities/product";
// ↑ Client component cho interactivity

// Type cho params
interface Props {
  params: Promise<{ slug: string }>;
  // ↑ Next.js 15+ params là Promise
}

// Generate metadata động cho SEO
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Vendoor`,
    description: product.description,
  };
}

// Page Component
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  // ↑ Await params để lấy slug

  // Fetch product data (server-side)
  const product = await getProductBySlug(slug);

  // Nếu không tìm thấy → 404
  if (!product) {
    notFound();
  }

  // Render
  return (
    <main className="container py-8">
      <ProductDetailClient product={product} />
      {/* ↑ Pass data vào Client Component */}
      {/* Client Component xử lý: select variant, add to cart, etc. */}
    </main>
  );
}
```

---

## 🎓 Tổng kết

### Thứ tự đọc code đề xuất

```
1. prisma/schema.prisma      → Hiểu data model
2. src/shared/lib/db/        → Hiểu cách kết nối DB
3. src/shared/ui/            → Hiểu UI components cơ bản
4. src/entities/cart/        → Hiểu state management (Zustand)
5. src/entities/product/     → Hiểu entity pattern
6. src/features/checkout/    → Hiểu Server Actions
7. src/app/                  → Hiểu routing và pages
```

### Key takeaways

1. **Server vs Client Components**
   - Mặc định = Server Component
   - Thêm `"use client"` = Client Component
2. **Server Actions**

   - Thêm `"use server"` ở đầu file
   - Chạy trên server, gọi được từ client

3. **Zustand Store**

   - `create()` để tạo store
   - `persist()` để lưu localStorage
   - Dùng hooks để đọc/ghi state

4. **Prisma**
   - Schema định nghĩa models
   - Client generated từ schema
   - Type-safe queries

---

## 🔗 Tiếp theo

Sau khi đọc xong tour này, bạn có thể đọc thêm:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Kiến trúc tổng quan
- [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) - Tại sao chọn các công nghệ này
- [DATA_FLOW.md](./DATA_FLOW.md) - Luồng data chi tiết
