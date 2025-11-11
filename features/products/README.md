# 🛍️ Products Feature

**Purpose**: Product catalog, listing, and management

---

## 📁 Structure

```
features/products/
├── components/
│   ├── client/              # Client Components
│   │   ├── ProductCard.client.tsx
│   │   ├── ProductFilters.client.tsx
│   │   ├── ProductDescription.client.tsx
│   │   └── AddToCart.client.tsx
│   │
│   └── server/              # Server Components (RSC)
│       ├── ProductList.server.tsx
│       ├── ProductDetails.server.tsx
│       ├── LatestProducts.server.tsx
│       └── BestSelling.server.tsx
│
├── actions/                 # Server Actions (mutations)
│   ├── create-product.action.ts
│   ├── update-product.action.ts
│   ├── delete-product.action.ts
│   └── toggle-stock.action.ts
│
├── queries/                 # Data fetching (reads)
│   ├── get-products.query.ts
│   ├── get-product-by-id.query.ts
│   ├── get-latest-products.query.ts
│   ├── get-best-selling.query.ts
│   └── search-products.query.ts
│
├── hooks/                   # Client hooks
│   ├── useProductFilters.ts
│   └── useAIImageAnalysis.ts
│
├── schemas/                 # Zod validation
│   └── product.schema.ts
│
├── types/                   # TypeScript types
│   └── product.types.ts
│
└── index.ts                 # Barrel export
```

---

## 🎯 Usage

### Server Components (Data Fetching)

```typescript
// app/page.tsx - Homepage
import { LatestProducts } from "@/features/products/components/server";
import { getLatestProducts } from "@/features/products/queries";

export default async function HomePage() {
  const products = await getLatestProducts();

  return <LatestProducts products={products} />;
}
```

### Client Components (Interactive)

```typescript
// Product card with add to cart
"use client";

import { ProductCard } from "@/features/products/components/client";
import { addToCart } from "@/features/cart/actions";

export function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={addToCart}
        />
      ))}
    </div>
  );
}
```

### Server Actions (Mutations)

```typescript
// app/store/add-product/page.tsx
import { createProduct } from "@/features/products/actions";

export default function AddProductPage() {
  return (
    <form action={createProduct}>
      <input name="name" />
      <input name="price" />
      <button type="submit">Create Product</button>
    </form>
  );
}
```

---

## 🔧 Key Functions

### Queries

- `getProducts(filters)` - Get all products with filters
- `getProductById(id)` - Get single product
- `getLatestProducts(limit)` - Get newest products
- `getBestSellingProducts(limit)` - Get top sellers
- `searchProducts(query)` - Full-text search

### Actions

- `createProduct(data)` - Create new product (Seller)
- `updateProduct(id, data)` - Update existing product (Seller)
- `deleteProduct(id)` - Delete product (Seller)
- `toggleStock(id)` - Toggle in stock status (Seller)

---

## 📝 Notes

- ⏳ Will be refactored in Phase 2
- Moving from `components/features/product/` and `lib/actions/seller/product.action.ts`
- Adding dedicated queries layer for better separation

---

Last Updated: November 11, 2025
