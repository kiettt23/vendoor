"use server";

import { headers } from "next/headers";

import { groupItemsByVendor } from "@/entities/cart";
import type { CartItem } from "@/entities/cart";
import { prepareOrderData } from "@/entities/order";
import type { CreateOrdersResult } from "@/entities/order";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/db";
import { generateOrderNumber } from "@/shared/lib/utils";

import type {
  CheckoutFormData,
  PaymentMethod,
  CheckoutValidationResult,
  InvalidCartItem,
} from "../model";

// ============================================
// Validate Checkout
// ============================================

export async function validateCheckout(
  items: CartItem[]
): Promise<CheckoutValidationResult> {
  const invalidItems: InvalidCartItem[] = [];

  for (const item of items) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: item.variantId },
      select: { stock: true, name: true, product: { select: { name: true } } },
    });

    if (!variant || variant.stock < item.quantity) {
      invalidItems.push({
        variantId: item.variantId,
        productName: variant?.product.name || item.productName,
        variantName: variant?.name || item.variantName,
        requestedQuantity: item.quantity,
        availableStock: variant?.stock || 0,
      });
    }
  }

  return { isValid: invalidItems.length === 0, invalidItems };
}

// ============================================
// Create Orders
// ============================================

export async function createOrders(
  cartItems: CartItem[],
  shippingInfo: Omit<CheckoutFormData, "paymentMethod">,
  paymentMethod: PaymentMethod
): Promise<CreateOrdersResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return {
        success: false,
        orders: [],
        totalAmount: 0,
        error: "Vui lòng đăng nhập",
      };
    }

    if (!cartItems?.length) {
      return {
        success: false,
        orders: [],
        totalAmount: 0,
        error: "Giỏ hàng trống",
      };
    }

    const vendorGroups = groupItemsByVendor(cartItems);

    // Validate vendorIds tồn tại trong VendorProfile
    const vendorIds = vendorGroups.map((g) => g.vendorId);
    const validVendors = await prisma.vendorProfile.findMany({
      where: { id: { in: vendorIds } },
      select: { id: true },
    });
    const validVendorIds = new Set(validVendors.map((v) => v.id));

    const invalidVendorIds = vendorIds.filter((id) => !validVendorIds.has(id));
    if (invalidVendorIds.length > 0) {
      return {
        success: false,
        orders: [],
        totalAmount: 0,
        error:
          "Giỏ hàng chứa sản phẩm không hợp lệ. Vui lòng xóa giỏ hàng và thêm lại sản phẩm.",
      };
    }

    const ordersData = vendorGroups.map((g) =>
      prepareOrderData(g.vendorId, g.items, session.user.id, shippingInfo)
    );
    const totalAmount = ordersData.reduce((sum, o) => sum + o.total, 0);

    // Xác định status dựa vào payment method
    // COD: PENDING (chờ giao hàng để thu tiền)
    // STRIPE: PENDING_PAYMENT (chờ thanh toán online xong mới chuyển PENDING)
    const initialStatus =
      paymentMethod === "COD" ? "PENDING" : "PENDING_PAYMENT";

    const result = await prisma.$transaction(async (tx) => {
      const stockDecrements = new Map<string, number>();
      for (const order of ordersData) {
        for (const item of order.items) {
          stockDecrements.set(
            item.variantId,
            (stockDecrements.get(item.variantId) || 0) + item.quantity
          );
        }
      }

      for (const [variantId, qty] of stockDecrements) {
        const variant = await tx.productVariant.findUnique({
          where: { id: variantId },
          select: {
            stock: true,
            name: true,
            product: { select: { name: true } },
          },
        });
        if (!variant) throw new Error(`Sản phẩm không tồn tại`);
        if (variant.stock < qty) {
          throw new Error(
            `${variant.product.name} không đủ hàng (còn ${variant.stock}, cần ${qty})`
          );
        }
        await tx.productVariant.update({
          where: { id: variantId },
          data: { stock: { decrement: qty } },
        });
      }

      const createdOrders = [];
      for (const o of ordersData) {
        const order = await tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            customerId: o.customerId,
            vendorId: o.vendorId,
            subtotal: o.subtotal,
            shippingFee: o.shippingFee,
            platformFee: o.platformFee,
            platformFeeRate: o.platformFeeRate,
            vendorEarnings: o.vendorEarnings,
            total: o.total,
            tax: 0,
            shippingName: o.shippingName,
            shippingPhone: o.shippingPhone,
            shippingAddress: o.shippingAddress,
            shippingWard: o.shippingWard,
            shippingDistrict: o.shippingDistrict,
            shippingCity: o.shippingCity,
            customerNote: o.note,
            status: initialStatus,
            items: {
              create: o.items.map((i) => ({
                productName: i.productName,
                variantId: i.variantId,
                variantName: i.variantName,
                price: i.price,
                quantity: i.quantity,
                subtotal: i.subtotal,
              })),
            },
          },
          include: { vendor: { select: { shopName: true } } },
        });
        createdOrders.push({
          id: order.id,
          orderNumber: order.orderNumber,
          vendorId: order.vendorId,
          vendorName: order.vendor.shopName,
          total: order.total,
          status: order.status,
        });
      }

      const payment = await tx.payment.create({
        data: {
          paymentNumber: `PAY-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()}`,
          amount: totalAmount,
          method: paymentMethod,
          status: paymentMethod === "COD" ? "PENDING" : "PENDING",
        },
      });

      await tx.order.updateMany({
        where: { id: { in: createdOrders.map((o) => o.id) } },
        data: { paymentId: payment.id },
      });

      return { orders: createdOrders, paymentId: payment.id };
    });

    return { success: true, ...result, totalAmount };
  } catch (error) {
    return {
      success: false,
      orders: [],
      totalAmount: 0,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra",
    };
  }
}
