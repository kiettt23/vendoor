# 🛒 Cart Feature

**Purpose**: Shopping cart management

⚠️ **MAJOR REFACTOR**: Migrating from Redux to Server State

---

## 📁 Structure

```
features/cart/
├── components/
│   ├── client/              # Client Components
│   │   ├── CartClient.client.tsx
│   │   ├── CartItem.client.tsx
│   │   ├── MiniCart.client.tsx
│   │   └── CartSummary.client.tsx
│   │
│   └── server/              # Server Components
│       └── CartWrapper.server.tsx
│
├── actions/                 # Server Actions
│   ├── get-cart.action.ts
│   ├── update-cart.action.ts
│   ├── add-to-cart.action.ts
│   ├── remove-from-cart.action.ts
│   └── clear-cart.action.ts
│
├── hooks/                   # Client hooks
│   └── useCart.ts           # Replaces Redux
│
├── schemas/
│   └── cart.schema.ts
│
├── types/
│   └── cart.types.ts
│
└── index.ts
```

---

## 🔄 Migration: Redux → Server State

### Old Approach (Redux):

```typescript
// ❌ OLD - Don't use
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { addToCart } from "@/lib/features/cart/cart-slice";

function CartComponent() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  const handleAdd = (product) => {
    dispatch(addToCart(product));
  };
}
```

### New Approach (Server State):

```typescript
// ✅ NEW - Use this
import { useCart } from "@/features/cart/hooks";

// Server Component passes initial cart
export default async function CartPage() {
  const initialCart = await getCart();
  return <CartClient initialCart={initialCart} />;
}

// Client Component
("use client");
function CartClient({ initialCart }) {
  const { cart, addToCart, removeFromCart, isPending } = useCart(initialCart);

  const handleAdd = async (productId: string) => {
    await addToCart(productId); // Optimistic update + server sync
  };

  return (
    <div>
      {Object.entries(cart).map(([id, qty]) => (
        <CartItem key={id} productId={id} quantity={qty} />
      ))}
    </div>
  );
}
```

---

## 🎯 Usage

### Server Actions

```typescript
// Add to cart
import { addToCartAction } from "@/features/cart/actions";

async function handleAddToCart(productId: string) {
  const result = await addToCartAction(productId, 1);
  if (result.success) {
    toast.success("Added to cart");
  }
}
```

### Hooks

```typescript
// useCart hook with optimistic updates
const {
  cart, // Current cart state
  addToCart, // Add item
  removeFromCart, // Remove item
  updateQuantity, // Update quantity
  clearCart, // Clear all
  isPending, // Loading state
  totalItems, // Total items count
} = useCart(initialCart);
```

---

## 🔧 Key Functions

### Actions

- `getCart()` - Get user's cart from DB
- `updateCart(cart)` - Update entire cart
- `addToCart(productId, quantity)` - Add single item
- `removeFromCart(productId)` - Remove item
- `clearCart()` - Empty cart

### Hooks

- `useCart(initialCart)` - Main cart hook with optimistic updates

---

## ⚠️ Breaking Changes

### Phase 3 Migration:

1. **Redux removed** - No more `useAppDispatch`/`useAppSelector`
2. **API route removed** - No more `/api/cart`
3. **New hook** - Must use `useCart` from `@/features/cart/hooks`

### Migration Path:

1. ✅ Add Server Actions (Phase 3.1)
2. ✅ Create `useCart` hook (Phase 3.2)
3. ✅ Update all components (Phase 3.3)
4. ✅ Test thoroughly (Phase 3.4)
5. ✅ Remove Redux slice (Phase 3.5)
6. ✅ Remove API route (Phase 3.6)

---

## 📝 Notes

- ⏳ Will be refactored in Phase 3 (HIGH RISK)
- Server State provides better SSR/SSG support
- Optimistic updates for better UX
- Automatic sync with server

---

Last Updated: November 11, 2025
