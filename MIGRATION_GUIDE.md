# 🔄 Migration Guide - Vendoor Refactoring

**Last Updated**: November 11, 2025

This guide helps developers update their imports and usage patterns after each refactoring phase.

---

## 📦 Phase 1: Auth Feature ⏳ PENDING

### Import Changes

#### Before:

```typescript
// Scattered imports
import { SignInForm } from "@/features/auth/components/SignInForm";
import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { UserButton } from "@/features/auth/components/UserButton/UserButton";
```

#### After:

```typescript
// ✅ Option 1: Import from .client barrel (recommended for client components)
import {
  SignInForm,
  SignUpForm,
  UserButton,
} from "@/features/auth/index.client";

// ✅ Option 2: Import from main feature barrel (auto re-exports)
import { SignInForm, SignUpForm, UserButton } from "@/features/auth";

// ✅ Option 3: Server-only imports
import { requireAuth, getCurrentUser } from "@/features/auth/index.server";
```

### File Renames

| Old Path                                             | New Path                                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| `features/auth/components/SignInForm.tsx`            | `features/auth/components/client/SignInForm.client.tsx`            |
| `features/auth/components/SignUpForm.tsx`            | `features/auth/components/client/SignUpForm.client.tsx`            |
| `features/auth/components/UserButton/UserButton.tsx` | `features/auth/components/client/UserButton/UserButton.client.tsx` |
| `features/auth/components/AuthRedirectToast.tsx`     | `features/auth/components/server/AuthRedirectToast.server.tsx`     |

### Breaking Changes:

- ✅ **None** - Barrel exports maintain compatibility
- ⚠️ Direct file imports will need updates

---

## 📦 Phase 2: Products Feature ⏳ PENDING

### Import Changes

#### Before:

```typescript
import { ProductCard } from "@/components/features/product/ProductCard";
import { LatestProducts } from "@/components/features/product/LatestProducts";
import { createProduct } from "@/lib/actions/seller/product.action";
import { productSchema } from "@/lib/validations/product";
import type { Product } from "@/types/product";
```

#### After:

```typescript
// ✅ Client components and hooks
import {
  ProductCard,
  useProductFilters,
} from "@/features/products/index.client";

// ✅ Server components and actions
import {
  LatestProducts,
  createProduct,
  getProducts,
} from "@/features/products/index.server";

// ✅ Shared types and schemas
import { productSchema, type Product } from "@/features/products";
```

### New Patterns

#### Server Components (RSC):

```typescript
// app/page.tsx - Server Component
import { LatestProducts } from "@/features/products/components/server";
import { getLatestProducts } from "@/features/products/queries";

export default async function HomePage() {
  const products = await getLatestProducts();

  return <LatestProducts products={products} />;
}
```

#### Client Components:

```typescript
// ProductCard.client.tsx
"use client";

import { addToCart } from "@/features/cart/actions";
import { useTransition } from "react";

export function ProductCard({ product }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(() => {
      addToCart(product.id);
    });
  };

  return (
    <button onClick={handleAddToCart} disabled={isPending}>
      Add to Cart
    </button>
  );
}
```

---

## 📦 Phase 3: Cart Feature ⏳ PENDING

### ⚠️ MAJOR CHANGES - Redux → Server State

#### Before (Redux):

```typescript
// Old Redux approach
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { addToCart, removeFromCart } from "@/lib/features/cart/cart-slice";

function CartComponent() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  const handleAdd = (product: Product) => {
    dispatch(addToCart(product));
  };
}
```

#### After (Server State):

```typescript
// New Server State approach
import { useCart } from "@/features/cart/hooks";
import { addToCartAction } from "@/features/cart/actions";

// Server Component passes initial cart
export default async function CartPage() {
  const initialCart = await getCart();

  return <CartClient initialCart={initialCart} />;
}

// Client Component
("use client");
function CartClient({ initialCart }) {
  const { cart, addToCart, isPending } = useCart(initialCart);

  const handleAdd = async (productId: string) => {
    await addToCart(productId); // Optimistic update + server sync
  };
}
```

### API Route Removal

#### Before:

```typescript
// API Route (DEPRECATED)
const response = await fetch("/api/cart", {
  method: "POST",
  body: JSON.stringify({ cart }),
});
```

#### After:

```typescript
// Server Action
import { updateCart } from "@/features/cart/actions";

await updateCart(cart); // Direct server action call
```

### Migration Steps:

1. ✅ **Phase 1**: Add Server Actions (parallel with Redux)
2. ✅ **Phase 2**: Update components to use new `useCart` hook
3. ✅ **Phase 3**: Test thoroughly
4. ✅ **Phase 4**: Remove Redux slice
5. ✅ **Phase 5**: Remove `/api/cart` route
6. ✅ **Phase 6**: Remove Redux from `StoreProvider`

---

## 📦 Phase 4: Orders Feature ⏳ PENDING

### Import Changes

#### Before:

```typescript
import { getOrders } from "@/lib/actions/user/order.action";
import { updateOrderStatus } from "@/lib/actions/seller/order.action";
import { OrderItem } from "@/components/features/order/OrderItem";
```

#### After:

```typescript
import { getOrders, updateOrderStatus } from "@/features/orders/actions";
import { OrderItem } from "@/features/orders/components";

// Queries for data fetching
import { getOrderById, getSellerOrders } from "@/features/orders/queries";
```

---

## 📦 Phase 8: Shared Layer ⏳ PENDING

### Import Changes

#### Before:

```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { formatCurrency } from "@/lib/utils/format/currency";
import type { ActionResponse } from "@/types/action-response";
```

#### After:

```typescript
// UI Components
import { Button, Card } from "@/shared/components/ui";

// Layout Components
import { Navbar } from "@/shared/components/layout";

// Utilities
import { formatCurrency } from "@/shared/lib";

// Types
import type { ActionResponse } from "@/shared/types";
```

---

## 🔧 Troubleshooting

### Import Errors

**Problem**: `Module not found: Can't resolve '@/features/auth/components'`

**Solution**:

1. Check barrel exports exist: `features/auth/components/index.ts`
2. Run `npm run type-check` to find all errors
3. Clear Next.js cache: `rm -rf .next && npm run dev`

### Type Errors

**Problem**: Type imports broken after migration

**Solution**:

1. Update type imports to use feature barrel exports
2. Restart TypeScript server in VS Code: `Cmd+Shift+P` → "Restart TS Server"

### Runtime Errors

**Problem**: "Cannot find module" at runtime

**Solution**:

1. Check that all files are exported in barrel exports
2. Verify no circular dependencies
3. Restart dev server

---

## 📋 Checklist After Each Phase

- [ ] Run `npm run type-check` - no TypeScript errors
- [ ] Run `npm run dev` - server starts successfully
- [ ] Test all affected pages manually
- [ ] Check console for runtime errors
- [ ] Verify no performance regressions
- [ ] Update this migration guide
- [ ] Commit changes with descriptive message

---

## 🆘 Need Help?

If you encounter issues during migration:

1. **Check REFACTORING_PLAN.md** for phase details
2. **Review commit history** to see exact changes
3. **Use git diff** to compare before/after
4. **Rollback if needed**: `git revert <commit-hash>`

---

## 📚 Best Practices

### DO ✅

- Use barrel exports for cleaner imports
- Name files with `.client.tsx` or `.server.tsx`
- Keep Server Components async for data fetching
- Use Server Actions for mutations
- Co-locate related files in feature folders

### DON'T ❌

- Don't use "use client" unless necessary
- Don't fetch data in Client Components
- Don't import Server Components in Client Components
- Don't mix business logic with presentation
- Don't skip type-checking

---

Last Updated: November 11, 2025
