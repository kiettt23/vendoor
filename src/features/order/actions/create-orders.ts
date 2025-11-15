"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";
import { groupItemsByVendor } from "@/features/cart/lib/utils";
import { prepareOrderData, generateOrderNumber } from "../lib/utils";
import type { CartItem } from "@/features/cart/types";
import type { CreateOrdersResult } from "../types";
import type { CheckoutFormData } from "../types";

// ============================================
// SERVER ACTION: Create Orders
// ============================================

/**
 * Create orders from cart
 *
 * **Flow:**
 * 1. Validate user session
 * 2. Group cart items by vendor
 * 3. For each vendor:
 *    - Create order with items
 *    - Calculate commission
 *    - Decrease stock
 * 4. Create payment record
 * 5. All in transaction (atomic)
 *
 * **Why transaction:**
 * - All or nothing (avoid partial orders)
 * - Stock consistency
 * - Payment integrity
 *
 * **Order status:**
 * - Created as PENDING_PAYMENT
 * - Updated to PENDING after payment success
 * - Vendor can process from PENDING
 *
 * @param cartItems - Items to order
 * @param shippingInfo - Delivery address
 * @returns Result with order IDs and payment ID
 */
export async function createOrders(
  cartItems: CartItem[],
  shippingInfo: CheckoutFormData
): Promise<CreateOrdersResult> {
  try {
    // ============================================
    // 1. VALIDATE SESSION
    // ============================================
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        orders: [],
        totalAmount: 0,
        error: "Vui lòng đăng nhập để đặt hàng",
      };
    }

    const customerId = session.user.id;

    // ============================================
    // 2. VALIDATE CART
    // ============================================
    if (!cartItems || cartItems.length === 0) {
      return {
        success: false,
        orders: [],
        totalAmount: 0,
        error: "Giỏ hàng trống",
      };
    }

    // ============================================
    // 3. GROUP BY VENDOR
    // ============================================
    const vendorGroups = groupItemsByVendor(cartItems);

    // ============================================
    // 4. PREPARE ORDER DATA
    // ============================================
    const ordersData = vendorGroups.map((group) =>
      prepareOrderData(group.vendorId, group.items, customerId, shippingInfo)
    );

    // Calculate total amount for payment
    const totalAmount = ordersData.reduce((sum, order) => sum + order.total, 0);

    // ============================================
    // 5. CREATE ORDERS IN TRANSACTION
    // ============================================
    const result = await prisma.$transaction(async (tx) => {
      const createdOrders = [];

      // Create each order
      // ============================================
      // 4. AGGREGATE STOCK DECREMENTS (FIX: Prevent duplicate decrements)
      // ============================================
      // Collect all items across orders and group by variantId
      const stockDecrements = new Map<string, number>();

      for (const orderData of ordersData) {
        for (const item of orderData.items) {
          const currentDecrement = stockDecrements.get(item.variantId) || 0;
          stockDecrements.set(item.variantId, currentDecrement + item.quantity);
        }
      }

      // ============================================
      // 5. VALIDATE AND DECREASE STOCK (Once per variant)
      // ============================================
      for (const [variantId, totalQuantity] of stockDecrements) {
        const variant = await tx.productVariant.findUnique({
          where: { id: variantId },
          select: {
            stock: true,
            name: true,
            product: { select: { name: true } },
          },
        });

        if (!variant) {
          throw new Error(`Sản phẩm không tồn tại (ID: ${variantId})`);
        }

        const productName = `${variant.product.name}${
          variant.name ? ` - ${variant.name}` : ""
        }`;

        if (variant.stock < totalQuantity) {
          throw new Error(
            `Sản phẩm "${productName}" không đủ hàng (còn ${variant.stock}, cần ${totalQuantity})`
          );
        }

        // Decrease stock (only once per variant)
        await tx.productVariant.update({
          where: { id: variantId },
          data: { stock: { decrement: totalQuantity } },
        });
      }

      // ============================================
      // 6. CREATE ORDERS
      // ============================================
      for (const orderData of ordersData) {
        // Generate unique order number
        const orderNumber = generateOrderNumber();

        // Create order
        const order = await tx.order.create({
          data: {
            orderNumber,
            customerId: orderData.customerId,
            vendorId: orderData.vendorId,

            // Amounts
            subtotal: orderData.subtotal,
            shippingFee: orderData.shippingFee,
            platformFee: orderData.platformFee,
            platformFeeRate: orderData.platformFeeRate,
            vendorEarnings: orderData.vendorEarnings,
            total: orderData.total,
            tax: 0, // MVP: no tax

            // Shipping info
            shippingName: orderData.shippingName,
            shippingPhone: orderData.shippingPhone,
            shippingAddress: orderData.shippingAddress,
            shippingWard: orderData.shippingWard,
            shippingDistrict: orderData.shippingDistrict,
            shippingCity: orderData.shippingCity,

            // Note
            customerNote: orderData.note,

            // Status
            status: "PENDING_PAYMENT", // Will update after payment

            // Order items
            items: {
              create: orderData.items.map((item) => ({
                productName: item.productName,
                variantId: item.variantId,
                variantName: item.variantName,
                price: item.price,
                quantity: item.quantity,
                subtotal: item.subtotal,
              })),
            },
          },
          include: {
            vendor: {
              select: {
                vendorProfile: {
                  select: {
                    shopName: true,
                  },
                },
              },
            },
          },
        });

        createdOrders.push({
          id: order.id,
          orderNumber: order.orderNumber,
          vendorId: order.vendorId,
          vendorName: order.vendor.vendorProfile?.shopName ?? "Unknown",
          total: order.total,
          status: order.status,
        });
      }

      // ============================================
      // 7. CREATE PAYMENT RECORD
      // ============================================
      const paymentNumber = `PAY-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

      const payment = await tx.payment.create({
        data: {
          paymentNumber,
          amount: totalAmount,
          method: "VNPAY", // Default for now
          status: "PENDING",
        },
      });

      // Link orders to payment
      await tx.order.updateMany({
        where: {
          id: {
            in: createdOrders.map((o) => o.id),
          },
        },
        data: {
          paymentId: payment.id,
        },
      });

      return {
        orders: createdOrders,
        paymentId: payment.id,
      };
    });

    // ============================================
    // 7. SUCCESS RESPONSE
    // ============================================
    return {
      success: true,
      orders: result.orders,
      paymentId: result.paymentId,
      totalAmount,
    };
  } catch (error) {
    console.error("Create orders error:", error);

    // Handle specific errors
    if (error instanceof Error) {
      return {
        success: false,
        orders: [],
        totalAmount: 0,
        error: error.message,
      };
    }

    return {
      success: false,
      orders: [],
      totalAmount: 0,
      error: "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.",
    };
  }
}
