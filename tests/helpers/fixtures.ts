import type { CartItem } from "@/entities/cart/model/types";

// ============================================================================
// Cart Fixtures
// ============================================================================

export function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: "cart-item-1",
    productId: "product-1",
    productName: "Áo thun nam",
    productSlug: "ao-thun-nam",
    variantId: "variant-1",
    variantName: "Đỏ - Size M",
    price: 150000,
    quantity: 2,
    image: "/images/product.jpg",
    stock: 10,
    vendorId: "vendor-1",
    vendorName: "Shop ABC",
    ...overrides,
  };
}

export function createCartItems(count: number): CartItem[] {
  return Array.from({ length: count }, (_, i) =>
    createCartItem({
      id: `cart-item-${i + 1}`,
      productId: `product-${i + 1}`,
      variantId: `variant-${i + 1}`,
      productName: `Sản phẩm ${i + 1}`,
    })
  );
}

export function createMultiVendorCart(): CartItem[] {
  return [
    createCartItem({
      id: "cart-1",
      vendorId: "vendor-1",
      vendorName: "Shop A",
      price: 100000,
      quantity: 2,
    }),
    createCartItem({
      id: "cart-2",
      vendorId: "vendor-1",
      vendorName: "Shop A",
      price: 50000,
      quantity: 1,
    }),
    createCartItem({
      id: "cart-3",
      vendorId: "vendor-2",
      vendorName: "Shop B",
      price: 200000,
      quantity: 1,
    }),
  ];
}

// ============================================================================
// Order Fixtures
// ============================================================================

export function createOrder(overrides = {}) {
  return {
    id: "order-1",
    orderNumber: "ORD-20241219-ABC123",
    status: "PENDING",
    customerId: "customer-123",
    vendorId: "vendor-1",
    subtotal: 300000,
    shippingFee: 30000,
    platformFee: 6000,
    total: 330000,
    shippingName: "Nguyễn Văn A",
    shippingPhone: "0901234567",
    shippingAddress: "123 Đường ABC",
    shippingWard: "Phường 1",
    shippingDistrict: "Quận 1",
    shippingCity: "TP.HCM",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createOrderItem(overrides = {}) {
  return {
    id: "order-item-1",
    orderId: "order-1",
    productId: "product-1",
    productName: "Áo thun nam",
    variantId: "variant-1",
    variantName: "Đỏ - Size M",
    price: 150000,
    quantity: 2,
    subtotal: 300000,
    ...overrides,
  };
}

// ============================================================================
// Shipping Info Fixtures
// ============================================================================

export const validShippingInfo = {
  name: "Nguyễn Văn A",
  phone: "0901234567",
  email: "test@example.com",
  address: "123 Đường ABC",
  ward: "Phường 1",
  district: "Quận 1",
  city: "TP.HCM",
};

// ============================================================================
// Product Fixtures
// ============================================================================

export function createProduct(overrides = {}) {
  return {
    id: "product-1",
    name: "Áo thun nam",
    slug: "ao-thun-nam",
    shortDescription: "Áo thun nam cao cấp",
    description: "Mô tả chi tiết sản phẩm",
    vendorId: "vendor-1",
    categoryId: "category-1",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createProductVariant(overrides = {}) {
  return {
    id: "variant-1",
    productId: "product-1",
    name: "Đỏ - Size M",
    color: "Đỏ",
    size: "M",
    price: 150000,
    compareAtPrice: 200000,
    sku: "AO-DO-M-001",
    stock: 10,
    isDefault: true,
    ...overrides,
  };
}

// ============================================================================
// Vendor Fixtures
// ============================================================================

export function createVendorProfile(overrides = {}) {
  return {
    id: "vendor-profile-1",
    userId: "vendor-123",
    shopName: "Shop ABC",
    slug: "shop-abc",
    description: "Shop bán quần áo",
    status: "APPROVED",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
