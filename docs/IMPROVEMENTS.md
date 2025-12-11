# Vendoor - Improvement Roadmap

> Tài liệu này mô tả chi tiết các cải tiến cần thực hiện, được chia thành các phases theo priority.
> 
> **Last Updated:** December 5, 2025

---

## Current Testing Status

### ✅ Existing Tests (35 test files, 533 tests)

| Category | Files | Status |
|----------|-------|--------|
| **Shared Utils** | `format.test.ts`, `id.test.ts`, `result.test.ts` | ✅ Pass |
| **Shared Validation** | `form.test.ts` | ✅ Pass |
| **Shared Upload** | `validation.test.ts`, `cloudinar### Phase Comp### Phase C## Progress Tracking

### Phase Completion Status

| Phase | Status | Start Date | End Date | Notes |
|-------|--------|------------|----------|-------|
| 1 | ✅ Complete | Dec 5, 2025 | Dec 5, 2025 | Unit tests ✅, E2E ✅, Error boundaries ✅ |
| 2 | ✅ Complete | Dec 5, 2025 | Dec 5, 2025 | Đã có sẵn - indexes, caching, image optimization |
| 3 | 🔲 Not Started | - | - | Accessibility & UX |
| 4 | 🔲 Not Started | - | - | Security Hardening |
| 5 | 🔲 Not Started | - | - | Real-time Features |
| 6 | 🟡 In Progress | Dec 5, 2025 | - | Wishlist ✅, Review ✅ |
| 7 | 🔲 Not Started | - | - | DevOps & Monitoring |
| 8 | 🔲 Not Started | - | - | Documentation & i18n |us

| Phase | Status | Start Date | End Date | Notes |
|-------|--------|------------|----------|-------|
| 1 | ✅ Complete (95%) | Dec 5, 2025 | Dec 5, 2025 | Unit tests ✅, E2E ✅, Error boundaries ✅ |
| 2 | ✅ Complete | Dec 5, 2025 | Dec 5, 2025 | Đã có sẵn - indexes, caching, image optimization |
| 3 | 🔲 Not Started | - | - | - |
| 4 | 🔲 Not Started | - | - | - |
| 5 | 🔲 Not Started | - | - | - |
| 6 | 🔲 Not Started | - | - | - |
| 7 | 🔲 Not Started | - | - | - |
| 8 | 🔲 Not Started | - | - | - |s

| Phase | Status | Start Date | End Date | Notes |
|-------|--------|------------|----------|-------|
| 1 | � Nearly Complete (95%) | Dec 5, 2025 | - | Unit tests ✅, E2E ✅, Error boundaries ✅, CI ✅, Sentry pending |
| 2 | 🔲 Not Started | - | - | - |
| 3 | 🔲 Not Started | - | - | - |
| 4 | 🔲 Not Started | - | - | - |
| 5 | 🔲 Not Started | - | - | - |
| 6 | 🔲 Not Started | - | - | - |est.ts`, `upload.test.ts` | ✅ Pass |
| **Entities - Cart** | `lib/utils.test.ts`, `model/store.test.ts` | ✅ Pass |
| **Entities - Order** | `lib/utils.test.ts`, `api/actions.test.ts` | ✅ Pass |
| **Entities - Product** | `lib/utils.test.ts`, `model/schema.test.ts`, `api/actions.test.ts` | ✅ Pass |
| **Entities - Category** | `api/actions.test.ts` | ✅ Pass |
| **Entities - Vendor** | `lib/utils.test.ts`, `api/actions.test.ts` | ✅ Pass |
| **Entities - Review** | `model/schema.test.ts`, `api/actions.test.ts` | ✅ Pass |
| **Entities - Wishlist** | `api/actions.test.ts` | ✅ Pass |
| **Entities - User** | `api/guards.test.ts` | ✅ Pass |
| **Features - Auth** | `model/schema.test.ts` | ✅ Pass |
| **Features - Checkout** | `model/schema.test.ts`, `api/actions.test.ts` | ✅ Pass |
| **Features - Inventory** | `model/types.test.ts` | ✅ Pass |
| **Features - Vendor Registration** | `model/schema.test.ts`, `api/actions.test.ts` | ✅ Pass |
| **Features - Vendor Analytics** | `model/types.test.ts` | ✅ Pass |
| **Features - Product Filter** | `lib/filter-utils.test.ts` | ✅ Pass |
| **Integration Tests** | `api/inventory.test.ts`, `api/analytics.test.ts` | ✅ Pass |

---

## Overview

| Phase | Focus Area | Priority | Estimated Effort |
|-------|------------|----------|------------------|
| 1 | Testing & Error Handling | 🔴 Critical | 2-3 weeks |
| 2 | Performance Optimization | 🟡 High | 1-2 weeks |
| 3 | Accessibility & UX | 🟡 High | 1-2 weeks |
| 4 | Security Hardening | 🟡 High | 1 week |
| 5 | Real-time Features | 🟢 Medium | 2-3 weeks |
| 6 | Business Logic Completion | 🟢 Medium | 3-4 weeks |
| 7 | DevOps & Monitoring | 🟢 Medium | 1-2 weeks |
| 8 | Documentation & i18n | 🔵 Low | 1 week |

---

## Phase 1: Testing & Error Handling 🔴

### 1.1 Unit Tests

**Mục tiêu:** Đạt coverage tối thiểu 70% cho critical paths.

#### ✅ Đã có tests:
- [x] `entities/cart/lib/utils.ts` - Cart calculations
- [x] `entities/cart/model/store.ts` - Zustand store
- [x] `entities/order/lib/utils.ts` - Order utilities
- [x] `entities/product/lib/utils.ts` - Product utilities
- [x] `entities/product/model/schema.ts` - Form validation
- [x] `entities/category/api/actions.ts` - Category CRUD
- [x] `entities/vendor/lib/utils.ts` - Vendor utilities
- [x] `entities/review/model/schema.ts` - Review validation
- [x] `features/auth/model/schema.ts` - Auth validation
- [x] `features/checkout/model/schema.ts` - Checkout validation
- [x] `features/vendor-registration/model/schema.ts` - Registration validation
- [x] `features/vendor-analytics/model/types.ts` - Analytics types
- [x] `features/inventory-management/model/types.ts` - Inventory types
- [x] `shared/lib/utils/*` - Format, ID, Result utilities
- [x] `shared/lib/validation/form.ts` - Form validation
- [x] `shared/lib/upload/*` - Upload utilities

#### ✅ Đã thêm tests trong Phase 1:

**Entities:**
- [x] `entities/order/api/actions.ts` - updateOrderStatus action
- [x] `entities/product/api/actions.ts` - createProduct, updateProduct, deleteProduct
- [x] `entities/product/api/queries.ts` - getProducts, getProductBySlug, searchProducts, etc.
- [x] `entities/review/api/actions.ts` - createReview, updateReview, replyToReview
- [x] `entities/wishlist/api/actions.ts` - addToWishlist, toggleWishlist
- [x] `entities/user/api/guards.ts` - requireAuth, requireRole, hasRole
- [x] `entities/vendor/api/actions.ts` - approveVendor, rejectVendor
- [x] `entities/vendor/api/guards.ts` - requireVendor

**Features:**
- [x] `features/checkout/api/actions.ts` - validateCheckout (createOrders needs more tests)
- [x] `features/product-filter/lib/filter-utils.ts` - parseFilterParams, buildFilterSearchParams
- [x] `features/vendor-registration/api/actions.ts` - registerAsVendor
- [x] `features/auth/api/actions.ts` - logout

**E2E Tests (Playwright):**
- [x] `tests/e2e/checkout-flow.spec.ts` - Cart to checkout, form validation, COD flow
- [x] `tests/e2e/search-filter.spec.ts` - Search, filter, sort, pagination

**Error Boundaries:**
- [x] `shared/ui/error-boundary/checkout-error-boundary.tsx`
- [x] `shared/ui/error-boundary/cart-error-boundary.tsx`
- [x] `shared/ui/error-boundary/product-list-error-boundary.tsx`

### 🆕 Phase 1 Test Summary

| Category | File | Tests | Coverage |
|----------|------|-------|----------|
| **Filter Utils** | `features/product-filter/lib/filter-utils.test.ts` | 37 | URL parsing, building, page numbers, brands, price ranges |
| **User Guards** | `entities/user/api/guards.test.ts` | 10 | requireAuth, requireRole, hasRole functions |
| **Checkout Actions** | `features/checkout/api/actions.test.ts` | 5 | validateCheckout validation |
| **Order Actions** | `entities/order/api/actions.test.ts` | 4 | updateOrderStatus authorization & states |
| **Product Actions** | `entities/product/api/actions.test.ts` | 6 | CRUD operations with vendor auth |
| **Product Queries** | `entities/product/api/queries.test.ts` | 27 | getProducts, getProductBySlug, search, etc. |
| **Vendor Guards** | `entities/vendor/api/guards.test.ts` | 7 | requireVendor authorization |
| **Auth Actions** | `features/auth/api/actions.test.ts` | 2 | logout functionality |
| **Review Actions** | `entities/review/api/actions.test.ts` | 8 | Create, update, delete, reply operations |
| **Wishlist Actions** | `entities/wishlist/api/actions.test.ts` | 10 | Add, remove, toggle, clear items |
| **Vendor Admin Actions** | `entities/vendor/api/actions.test.ts` | 6 | Approve/reject vendor applications |
| **Vendor Registration** | `features/vendor-registration/api/actions.test.ts` | 9 | registerAsVendor complete flow |

**Total New Tests: 148 tests across 13 new files**
**Before:** 22 test files, 375 tests → **After:** 35 test files, 533 tests ✅

---

### 1.2 Integration Tests

**Đã có:**
- [x] `tests/integration/api/inventory.test.ts`
- [x] `tests/integration/api/analytics.test.ts`

**Cần thêm:**
- [x] Cart → Checkout → Order flow
- [ ] User registration → Email verification → Login
- [ ] Vendor application → Approval → Store creation
- [ ] Product creation → Inventory update → Order impact

### 1.3 E2E Tests (Playwright)

**Đã có (5 spec files):**
- [x] `tests/e2e/auth.spec.ts` - Login, register form validation
- [x] `tests/e2e/customer-journey.spec.ts` - Homepage, products page, cart, checkout access
- [x] `tests/e2e/vendor-flow.spec.ts` - Vendor dashboard, products, inventory, analytics, orders
- [x] `tests/e2e/admin-flow.spec.ts` - Admin operations
- [x] `tests/e2e/product-features.spec.ts` - Product features

**Cần mở rộng:**
- [ ] Complete checkout flow với COD (guest & authenticated)
- [ ] Complete checkout flow với Stripe (mock payment)
- [ ] Vendor product CRUD operations (với authenticated state)
- [ ] Admin vendor approval workflow
- [ ] Search và filter functionality với data thực
- [ ] Mobile responsive tests
- [ ] Cart persistence across sessions

### 1.4 Error Handling Improvements

#### Error Tracking Service:
- [ ] Integrate Sentry hoặc LogRocket
- [x] Setup error boundaries cho từng feature
- [ ] Implement structured error logging

#### Error Boundaries (✅ Completed):
- [x] `shared/ui/error-boundary/checkout-error-boundary.tsx`
- [x] `shared/ui/error-boundary/cart-error-boundary.tsx`
- [x] `shared/ui/error-boundary/product-list-error-boundary.tsx`
- [x] Export từ `shared/ui/index.ts`

#### Result Pattern Consistency:
- [ ] Audit tất cả server actions, đảm bảo dùng Result type
- [ ] Implement retry logic cho transient failures
- [ ] User-friendly error messages (không expose technical details)

### 1.5 Deliverables Phase 1

- [x] Test files cho tất cả items trên
- [x] Error boundary components

---

## Phase 2: Performance Optimization 🟡

### 2.1 React Query Optimization

#### Cache Strategy:
- [x] staleTime đã config (60s default trong ReactQueryProvider)
- [x] React `cache()` cho tất cả queries (request deduplication)
- [x] revalidatePath/revalidateTag cho cache invalidation

> **Note:** Prefetching không cần thiết vì dự án dùng Server Components. Data được fetch server-side, không cần client-side prefetch.

### 2.2 Database Optimization

#### Indexing:
- [x] Indexes đã có cho tất cả foreign keys và common filters
- [x] Composite indexes cho Product (vendorId, categoryId, slug, isActive)
- [x] Composite indexes cho Order (customerId, vendorId, orderNumber, status)

#### Query Optimization:
- [x] `select` được dùng để chỉ fetch needed fields
- [x] `include` với nested select cho related data
- [x] Offset-based pagination (đủ cho scale hiện tại)

> **Note:** Cursor-based pagination chỉ cần khi có >100k records. Hiện tại offset pagination đủ dùng.

### 2.3 Bundle Optimization

- [x] Next.js App Router tự động code split theo route
- [x] Server Components giảm client bundle size
- [x] Tree-shaking được handle bởi Next.js build

> **Note:** Dynamic imports cho modals có thể thêm sau nếu bundle size trở thành vấn đề.

### 2.4 Image Optimization

- [x] `OptimizedImage` component với Cloudinary loader
- [x] Blur placeholder tự động cho Cloudinary images
- [x] `priority` loading cho hero images (HeroSection)
- [x] Responsive sizes support

### 2.5 Core Web Vitals

- [x] Lighthouse trong DevTools đủ để đo
- [x] Loading states (30 loading.tsx files) cho streaming
- [x] Suspense boundaries cho async components

> **Note:** Real User Monitoring (RUM) thêm sau khi có analytics backend.

### 2.6 Deliverables Phase 2

- [x] Database indexes đã tối ưu
- [x] Image optimization với Cloudinary
- [x] Server Components pattern (giảm JS bundle)

---

## Phase 3: Accessibility & UX 🟡

### 3.1 Keyboard Navigation

- [ ] Tab order logic cho tất cả interactive elements
- [ ] Focus trap trong modals/sheets
- [ ] Skip links cho main content
- [ ] Keyboard shortcuts cho common actions

### 3.2 Screen Reader Support

- [ ] ARIA labels cho tất cả buttons, links
- [ ] Live regions cho dynamic content updates
- [ ] Proper heading hierarchy (h1 → h6)
- [ ] Alt text audit cho images

### 3.3 Visual Accessibility

- [ ] Color contrast audit (WCAG AA compliance)
- [ ] Focus indicators rõ ràng
- [ ] Text scaling support (up to 200%)
- [ ] Reduced motion support

### 3.4 Form Accessibility

- [ ] Label associations cho tất cả inputs
- [ ] Error messages accessible
- [ ] Required field indicators
- [ ] Autocomplete attributes

### 3.5 Component Audit

Audit từng component trong `shared/ui`:
- [ ] Button - focus states, disabled states
- [ ] Input - labels, errors, descriptions
- [ ] Select - keyboard navigation
- [ ] Dialog/Sheet - focus trap, escape to close
- [ ] Toast - live region, auto-dismiss timing
- [ ] Dropdown - arrow key navigation

### 3.6 Deliverables Phase 3

- [ ] Accessibility audit report
- [ ] WCAG AA compliance checklist
- [ ] Screen reader testing documentation

---

## Phase 4: Security Hardening 🟡

### 4.1 Input Validation

- [ ] Server-side validation cho tất cả endpoints
- [ ] Sanitize user input (XSS prevention)
- [ ] File upload validation (type, size, content)
- [ ] SQL injection prevention review

### 4.2 Authentication & Authorization

- [ ] Session expiry và refresh logic review
- [ ] Rate limiting cho auth endpoints
- [ ] Brute force protection
- [ ] Secure password requirements
- [ ] 2FA implementation (optional)

### 4.3 API Security

- [ ] CSRF protection verification
- [ ] CORS configuration review
- [ ] Rate limiting cho public APIs
- [ ] Request size limits

### 4.4 Data Protection

- [ ] Sensitive data encryption at rest
- [ ] PII handling compliance
- [ ] Audit logging cho admin actions
- [ ] Data retention policies

### 4.5 Infrastructure

- [ ] Security headers (CSP, HSTS, etc.)
- [ ] Dependency vulnerability scanning
- [ ] Secret management review
- [ ] Environment variable audit

### 4.6 Deliverables Phase 4

- [ ] Security audit report
- [ ] Penetration testing results
- [ ] Security documentation

---

## Phase 5: Real-time Features 🟢

### 5.1 WebSocket Infrastructure

- [ ] Setup WebSocket server (Socket.io hoặc Pusher)
- [ ] Authentication cho WebSocket connections
- [ ] Reconnection handling
- [ ] Fallback to polling

### 5.2 Real-time Updates

#### Order Status:
- [ ] Customer receives order status changes
- [ ] Vendor receives new order notifications
- [ ] Admin receives alerts for issues

#### Inventory:
- [ ] Out of stock notifications
- [ ] Low stock alerts cho vendors
- [ ] Cart item availability updates

#### Notifications:
- [ ] In-app notification system
- [ ] Notification preferences
- [ ] Read/unread status
- [ ] Notification history

### 5.3 Chat System (Optional)

- [ ] Customer-Vendor messaging
- [ ] Message persistence
- [ ] File/image sharing
- [ ] Typing indicators

### 5.4 Deliverables Phase 5

- [ ] WebSocket infrastructure
- [ ] Notification entity và UI
- [ ] Real-time order tracking

---

## Phase 6: Business Logic Completion 🟢

### 6.1 Wishlist Feature ✅

- [x] Wishlist entity với queries và actions
- [x] WishlistButton component (add/remove)
- [x] Wishlist page (`/wishlist`)
- [x] Toggle wishlist functionality
- [x] Move to cart functionality (MoveToCartButton)
- [ ] Share wishlist (low priority)

### 6.2 Review System Enhancement

- [x] Vendor reply to reviews (replyToReview action)
- [x] Delete vendor reply
- [ ] Review reporting (low priority)
- [ ] Review helpfulness voting (low priority)
- [ ] Review with images (low priority)
- [x] Purchase verification (hasUserPurchased query)

### 6.3 Coupon/Discount System

- [ ] Coupon entity và schema
- [ ] Coupon types (percentage, fixed, free shipping)
- [ ] Usage limits và expiry
- [ ] Coupon application trong checkout
- [ ] Vendor-specific coupons

### 6.4 Shipping System

- [ ] Shipping methods configuration
- [ ] Shipping cost calculation
- [ ] Free shipping thresholds
- [ ] Shipping zones
- [ ] Tracking integration

### 6.5 Order Management

- [ ] Order cancellation flow
- [ ] Refund processing
- [ ] Partial refunds
- [ ] Return requests
- [ ] Order history filters

### 6.6 Vendor Features

- [ ] Payout system
- [ ] Advanced analytics dashboard
- [ ] Inventory alerts
- [ ] Bulk product operations
- [ ] Sales reports export

### 6.7 Search Enhancement

- [ ] Dedicated search feature module
- [ ] Search suggestions/autocomplete
- [ ] Search history
- [ ] Advanced filters
- [ ] Search analytics

### 6.8 Deliverables Phase 6

- [ ] Complete wishlist feature
- [ ] Coupon system
- [ ] Shipping configuration
- [ ] Order cancellation/refund flow

---

## Phase 7: DevOps & Monitoring 🟢

### 7.1 Health Checks

- [ ] `/api/health` endpoint
- [ ] Database connectivity check
- [ ] External service checks (Stripe, Cloudinary)
- [ ] Memory/CPU metrics

### 7.2 Monitoring

- [ ] Application performance monitoring (APM)
- [ ] Error rate tracking
- [ ] Response time metrics
- [ ] User session recording (optional)

### 7.3 Logging

- [ ] Structured logging format
- [ ] Log aggregation service
- [ ] Log retention policies
- [ ] Alert rules cho critical errors

### 7.4 Feature Flags

- [ ] Feature flag service integration
- [ ] Gradual rollout support
- [ ] A/B testing capability
- [ ] Kill switches cho features

### 7.5 CI/CD Enhancement

- [ ] Automated testing trong pipeline
- [ ] Preview deployments cho PRs
- [ ] Database migration automation
- [ ] Rollback procedures

### 7.6 Deliverables Phase 7

- [ ] Monitoring dashboard
- [ ] Alerting rules
- [ ] Feature flag system
- [ ] CI/CD documentation

---

## Phase 8: Documentation & i18n 🔵

### 8.1 API Documentation

- [ ] OpenAPI/Swagger cho API routes
- [ ] Server action documentation
- [ ] Request/response examples
- [ ] Error code reference

### 8.2 Code Documentation

- [ ] JSDoc cho tất cả exported functions
- [ ] README cho mỗi FSD layer
- [ ] Architecture decision records (ADRs)
- [ ] Contributing guide

### 8.3 Deployment Documentation

- [ ] Environment setup guide
- [ ] Deployment checklist
- [ ] Rollback procedures
- [ ] Troubleshooting guide

### 8.4 Internationalization (nếu cần)

- [ ] i18n framework setup (next-intl)
- [ ] Translation workflow
- [ ] RTL support
- [ ] Locale-aware formatting

### 8.5 Deliverables Phase 8

- [ ] Complete API documentation
- [ ] Developer onboarding guide
- [ ] i18n infrastructure (nếu applicable)

---

## Progress Tracking

### Phase Completion Status

| Phase | Status | Start Date | End Date | Notes |
|-------|--------|------------|----------|-------|
| 1 | � In Progress | Dec 5, 2025 | - | Fixed failing tests, documenting gaps |
| 2 | 🔲 Not Started | - | - | - |
| 3 | 🔲 Not Started | - | - | - |
| 4 | 🔲 Not Started | - | - | - |
| 5 | 🔲 Not Started | - | - | - |
| 6 | 🔲 Not Started | - | - | - |
| 7 | 🔲 Not Started | - | - | - |
| 8 | 🔲 Not Started | - | - | - |

### Legend

- 🔲 Not Started
- 🟡 In Progress
- ✅ Completed
- ⏸️ On Hold

---

## Notes

- Phases có thể overlap nếu resources cho phép
- Priority có thể điều chỉnh dựa trên business requirements
- Mỗi phase nên có review trước khi move sang phase tiếp theo
- Khi bắt đầu mỗi phase, đọc lại codebase liên quan để có context mới nhất
