"use server";

import { prisma } from "@/shared/lib";
import { auth } from "@/shared/lib";
import { headers } from "next/headers";
import { groupItemsByVendor } from "@/entities/cart";
import { prepareOrderData, generateOrderNumber } from "@/entities/order";
import type { CartItem } from "@/entities/cart";
import type { CreateOrdersResult } from "@/entities/order";
import type { CheckoutFormData } from "../model/schema";

export async function createOrders(
  cartItems: CartItem[],
  shippingInfo: CheckoutFormData
): Promise<CreateOrdersResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { success: false, orders: [], totalAmount: 0, error: "Vui lòng đăng nhập" };
    }

    if (!cartItems?.length) {
      return { success: false, orders: [], totalAmount: 0, error: "Giỏ hàng trống" };
    }

    const vendorGroups = groupItemsByVendor(cartItems);
    const ordersData = vendorGroups.map((g) =>
      prepareOrderData(g.vendorId, g.items, session.user.id, shippingInfo)
    );
    const totalAmount = ordersData.reduce((sum, o) => sum + o.total, 0);

    const result = await prisma.$transaction(async (tx) => {
      const stockDecrements = new Map<string, number>();
      for (const order of ordersData) {
        for (const item of order.items) {
          stockDecrements.set(item.variantId, (stockDecrements.get(item.variantId) || 0) + item.quantity);
        }
      }

      for (const [variantId, qty] of stockDecrements) {
        const variant = await tx.productVariant.findUnique({
          where: { id: variantId },
          select: { stock: true, name: true, product: { select: { name: true } } },
        });
        if (!variant) throw new Error(`Sản phẩm không tồn tại`);
        if (variant.stock < qty) {
          throw new Error(`${variant.product.name} không đủ hàng (còn ${variant.stock}, cần ${qty})`);
        }
        await tx.productVariant.update({ where: { id: variantId }, data: { stock: { decrement: qty } } });
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
            status: "PENDING_PAYMENT",
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
          paymentNumber: `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          amount: totalAmount,
          method: "VNPAY",
          status: "PENDING",
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

