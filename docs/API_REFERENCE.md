# 🔌 API Reference

Tài liệu chi tiết về Server Actions và Queries trong Vendoor.

---

## 📖 Conventions

### File Structure

```
src/entities/{entity}/api/
├── queries.ts    # Read operations (SELECT)
└── actions.ts    # Write operations (INSERT/UPDATE/DELETE)
```

### Response Pattern

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string }
```

### Caching

- **Queries**: Wrapped với `cache()` + `unstable_cache()`
- **Actions**: Gọi `revalidateTag(tag, "max")` sau mutation

---

## 🛍️ Product

### Queries (`src/entities/product/api/queries.ts`)

#### `getProducts(options)`

Lấy danh sách sản phẩm với filter, sort, pagination.

```typescript
const products = await getProducts({
  categorySlug?: string,      // Filter by category
  vendorId?: string,          // Filter by vendor
  minPrice?: number,          // Price range
  maxPrice?: number,
  minRating?: number,         // Min rating (1-5)
  search?: string,            // Search in name, description
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular',
  page?: number,              // Pagination (default: 1)
  limit?: number,             // Items per page (default: 12)
});

// Returns: { products: Product[], total: number, totalPages: number }
```

#### `getProductBySlug(slug)`

Lấy chi tiết sản phẩm.

```typescript
const product = await getProductBySlug("iphone-15-pro-max");

// Returns: Product | null
// Includes: variants, images, category, vendor, reviews
```

#### `getCachedProductBySlug(slug)`

Version cached của `getProductBySlug`.

```typescript
const product = await getCachedProductBySlug("iphone-15-pro-max");
// Cache: 2 phút, tags: ['products', 'product:{slug}']
```

#### `getFeaturedProducts(limit)`

Lấy sản phẩm nổi bật cho trang chủ.

```typescript
const featured = await getFeaturedProducts(8);
// Returns: Product[] (sorted by rating, stock > 0)
```

#### `getRelatedProducts(productId, categoryId, limit)`

Lấy sản phẩm liên quan.

```typescript
const related = await getRelatedProducts(productId, categoryId, 4);
// Returns: Product[] (cùng category, exclude current)
```

#### `searchProducts(query, limit)`

Tìm kiếm sản phẩm (cho autocomplete).

```typescript
const results = await searchProducts("iphone", 5);
// Returns: { id, name, slug, price, image }[]
```

### Actions (`src/entities/product/api/actions.ts`)

#### `createProduct(data)`

Tạo sản phẩm mới (Vendor only).

```typescript
const result = await createProduct({
  name: string,
  slug: string,
  description?: string,
  categoryId: string,
  variants: [{
    name?: string,
    price: number,
    compareAtPrice?: number,
    stock: number,
    sku?: string,
    color?: string,
    size?: string,
    isDefault: boolean,
  }],
  images: [{ url: string, alt?: string, order: number }],
});

// Revalidates: products, products:vendor:{vendorId}
```

#### `updateProduct(id, data)`

Cập nhật sản phẩm.

```typescript
const result = await updateProduct(productId, {
  name?: string,
  description?: string,
  categoryId?: string,
  isActive?: boolean,
});

// Revalidates: products, product:{slug}
```

#### `deleteProduct(id)`

Soft delete sản phẩm (set `isActive: false`).

```typescript
const result = await deleteProduct(productId);
// Revalidates: products, product:{slug}
```

---

## 📦 Order

### Queries (`src/entities/order/api/queries.ts`)

#### `getOrdersByUser(userId, options)`

Lấy đơn hàng của customer.

```typescript
const orders = await getOrdersByUser(userId, {
  status?: OrderStatus,
  page?: number,
  limit?: number,
});

// Returns: { orders: Order[], total: number }
```

#### `getOrdersByVendor(vendorId, options)`

Lấy đơn hàng của vendor.

```typescript
const orders = await getOrdersByVendor(vendorId, {
  status?: OrderStatus,
  page?: number,
  limit?: number,
});
```

#### `getOrderById(id)`

Chi tiết đơn hàng.

```typescript
const order = await getOrderById(orderId);
// Includes: items, shippingAddress, vendor, customer
```

### Actions (`src/entities/order/api/actions.ts`)

#### `updateOrderStatus(orderId, status)`

Cập nhật trạng thái đơn hàng.

```typescript
const result = await updateOrderStatus(orderId, "SHIPPED");

// Status flow: PENDING → PROCESSING → SHIPPED → DELIVERED
//                                             → CANCELLED
// Revalidates: orders, order:{id}
```

---

## 🛒 Cart

Cart sử dụng **Zustand** (client-side), không có server API.

### Store (`src/entities/cart/model/store.ts`)

```typescript
import { useCartStore } from "@/entities/cart";

// Get state
const items = useCartStore((state) => state.items);

// Actions
useCartStore.getState().addItem(item);
useCartStore.getState().updateQuantity(variantId, quantity);
useCartStore.getState().removeItem(variantId);
useCartStore.getState().clearCart();
useCartStore.getState().syncStock(stockData);
```

---

## ⭐ Wishlist

### Queries (`src/entities/wishlist/api/queries.ts`)

#### `getWishlist(userId)`

Lấy danh sách wishlist.

```typescript
const wishlist = await getWishlist(userId);
// Returns: WishlistItem[] (includes product details)
```

#### `isInWishlist(userId, productId)`

Check sản phẩm có trong wishlist.

```typescript
const inWishlist = await isInWishlist(userId, productId);
// Returns: boolean
```

### Actions (`src/entities/wishlist/api/actions.ts`)

#### `toggleWishlist(userId, productId)`

Toggle sản phẩm trong wishlist.

```typescript
const result = await toggleWishlist(userId, productId);
// Returns: { success: true, data: { added: boolean } }
// Revalidates: wishlist
```

---

## ⭐ Review

### Queries (`src/entities/review/api/queries.ts`)

#### `getProductReviews(productId, options)`

Lấy reviews của sản phẩm.

```typescript
const reviews = await getProductReviews(productId, {
  page?: number,
  limit?: number,
  sortBy?: 'newest' | 'rating_high' | 'rating_low',
});

// Returns: { reviews: Review[], stats: { average, total, distribution } }
```

### Actions (`src/entities/review/api/actions.ts`)

#### `createReview(data)`

Tạo review mới.

```typescript
const result = await createReview({
  productId: string,
  rating: number,       // 1-5
  title?: string,
  comment?: string,
  images?: string[],    // Cloudinary URLs
});

// Validates: User đã mua + nhận hàng
// Revalidates: reviews, reviews:product:{id}
```

#### `replyToReview(reviewId, reply)` (Vendor)

Vendor phản hồi review.

```typescript
const result = await replyToReview(reviewId, "Cảm ơn bạn đã đánh giá!");
```

---

## 🏪 Vendor

### Queries (`src/entities/vendor/api/queries.ts`)

#### `getVendorProfile(userId)`

Lấy thông tin vendor của user.

```typescript
const vendor = await getVendorProfile(userId);
// Returns: VendorProfile | null
```

#### `getPublicVendors(options)`

Lấy danh sách vendor công khai.

```typescript
const vendors = await getPublicVendors({
  page?: number,
  limit?: number,
  search?: string,
});
```

#### `getVendorStats(vendorId)`

Thống kê cho vendor dashboard.

```typescript
const stats = await getVendorStats(vendorId);
// Returns: { totalOrders, revenue, productCount, avgRating }
```

### Actions (`src/entities/vendor/api/actions.ts`)

#### `registerVendor(data)`

Đăng ký bán hàng.

```typescript
const result = await registerVendor({
  shopName: string,
  description?: string,
  businessAddress?: string,
  businessPhone?: string,
  businessEmail?: string,
});

// Creates VendorProfile with status: PENDING
```

#### `approveVendor(vendorId)` (Admin)

Duyệt vendor.

```typescript
const result = await approveVendor(vendorId);
// Updates status: PENDING → APPROVED
// Adds VENDOR role to user
```

---

## 📁 Category

### Queries (`src/entities/category/api/queries.ts`)

#### `getCategories()`

Lấy tất cả categories.

```typescript
const categories = await getCategories();
// Returns: Category[]
```

#### `getCategoriesWithCount()`

Categories với số lượng sản phẩm.

```typescript
const categories = await getCategoriesWithCount();
// Returns: (Category & { _count: { products: number } })[]
```

### Actions (`src/entities/category/api/actions.ts`)

#### `createCategory(data)` (Admin)

Tạo category mới.

```typescript
const result = await createCategory({
  name: string,
  slug: string,
  description?: string,
  image?: string,
});
```

---

## 💳 Checkout

### Actions (`src/features/checkout/api/actions.ts`)

#### `createOrder(data)`

Tạo đơn hàng từ cart.

```typescript
const result = await createOrder({
  items: CartItem[],
  shippingAddress: {
    fullName: string,
    phone: string,
    address: string,
    ward: string,
    district: string,
    province: string,
  },
  paymentMethod: 'COD' | 'STRIPE',
  note?: string,
});

// Returns: { success: true, data: { orderId, stripeSessionId? } }
// Revalidates: orders, products (stock update)
```

#### `verifyStripePayment(sessionId)`

Verify thanh toán Stripe.

```typescript
const result = await verifyStripePayment(sessionId);
// Updates order status: PENDING → PROCESSING
```

---

## 🔐 Authentication

### Guards (`src/entities/user/api/guards.ts`)

```typescript
import { requireAuth, requireVendor, requireAdmin } from "@/entities/user";

// In Server Components or Actions
const user = await requireAuth();        // Throws if not logged in
const vendor = await requireVendor();    // Throws if not vendor
const admin = await requireAdmin();      // Throws if not admin
```

### Queries (`src/entities/user/api/queries.ts`)

#### `getCurrentUser()`

```typescript
const user = await getCurrentUser();
// Returns: User | null
```

#### `getCurrentUserProfile()`

```typescript
const profile = await getCurrentUserProfile();
// Returns: User with orders count, reviews count
```
