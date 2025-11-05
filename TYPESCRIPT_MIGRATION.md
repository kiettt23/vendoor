# TypeScript Migration Roadmap

## Phase 1: Setup TypeScript (30 phút)

### 1. Install dependencies

```bash
npm install --save-dev typescript @types/react @types/node
npm install --save-dev @types/react-dom
```

### 2. Create tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3. Create next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

## Phase 2: Type Definitions (1-2 giờ)

### 1. Create types/index.ts

```typescript
// Prisma models
export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  cart: Record<string, number>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  userId: string;
  createdAt: Date;
}

export interface Rating {
  id: string;
  rating: number;
  review: string;
  userId: string;
  productId: string;
  orderId: string;
  createdAt: Date;
  user?: Pick<User, "id" | "name" | "image">;
}

export interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  userId: string;
  storeId: string;
  addressId: string;
  isPaid: boolean;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
  isCouponUsed: boolean;
  coupon: Record<string, any>;
  orderItems: OrderItem[];
  address?: Address;
  store?: Store;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export enum OrderStatus {
  ORDER_PLACED = "ORDER_PLACED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  COD = "COD",
  STRIPE = "STRIPE",
}

// Server Action responses
export interface ActionResponse<T = any> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}

export interface AddressActionResponse extends ActionResponse {
  newAddress?: Address;
  address?: Address;
  addresses?: Address[];
  deletedId?: string;
}

export interface RatingActionResponse extends ActionResponse {
  rating?: Rating;
  ratings?: Rating[];
  deletedId?: string;
}

export interface OrderActionResponse extends ActionResponse {
  order?: Order;
  orders?: Order[];
  session?: any; // Stripe session
}

export interface CouponActionResponse extends ActionResponse {
  coupon?: Coupon;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  expiresAt: Date;
  isPublic: boolean;
  forNewUser: boolean;
  forMember: boolean;
}
```

## Phase 3: Migrate Files (Incremental)

### Priority Order:

1. **Types & Utils** (1 giờ)

   - ✅ Create `types/index.ts`
   - ✅ Rename `lib/i18n.js` → `lib/i18n.ts`
   - ✅ Rename `lib/prisma.js` → `lib/prisma.ts`

2. **Server Actions** (2-3 giờ)

   - ✅ `components/features/actions/address.js` → `.ts`
   - ✅ `components/features/actions/rating.js` → `.ts`
   - ✅ `components/features/actions/order.js` → `.ts`
   - ✅ Add proper types for parameters and returns

3. **Redux** (1-2 giờ)

   - ✅ `lib/features/**/*.js` → `.ts`
   - ✅ `lib/store.js` → `.ts`
   - ✅ Add RootState and AppDispatch types

4. **Components** (3-4 giờ)

   - ✅ Rename `.jsx` → `.tsx`
   - ✅ Add prop types interfaces
   - ✅ Fix type errors incrementally

5. **Pages** (2-3 giờ)
   - ✅ App Router pages `.jsx` → `.tsx`
   - ✅ Add PageProps types

## Phase 4: Strict Mode (Optional)

Enable stricter TypeScript settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## Estimation:

- **Setup**: 30 phút
- **Types**: 1-2 giờ
- **Migration**: 8-12 giờ (tùy số lượng files)
- **Total**: 10-15 giờ

## Benefits:

- ✅ Type safety - Catch bugs at compile time
- ✅ Better IntelliSense
- ✅ Self-documenting code
- ✅ Easier refactoring
- ✅ Better team collaboration

## Next Steps:

Bạn muốn:

1. **Làm ngay** → Tôi sẽ migrate toàn bộ
2. **Làm từ từ** → Tôi chỉ setup + migrate một vài files mẫu
3. **Để sau** → Fix bugs trước, TypeScript sau
