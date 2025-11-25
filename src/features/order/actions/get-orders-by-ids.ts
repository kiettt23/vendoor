"use server";

import { prisma } from "@/shared/lib/prisma";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("OrderActions");

/**
 * Get multiple orders by IDs (for order success page)
 *
 * **Use case:** After checkout, display all created orders
 *
 * @param orderIds - Array of order IDs
 * @returns Orders with items and vendor info
 */
export async function getOrdersByIds(orderIds: string[]) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        id: {
          in: orderIds,
        },
      },
      include: {
        vendor: {
          select: {
            shopName: true,
            slug: true,
          },
        },
        items: {
          include: {
            variant: {
              select: {
                name: true,
                product: {
                  select: {
                    name: true,
                    images: {
                      where: { order: 0 },
                      select: { url: true, altText: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        platformFee: order.platformFee,
        createdAt: order.createdAt,
        vendor: {
          shopName: order.vendor.shopName,
          slug: order.vendor.slug,
        },
        items: order.items.map((item) => ({
          id: item.id,
          productName: item.productName,
          variantName: item.variantName,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
          image: item.variant.product.images[0]?.url ?? null,
        })),
        shippingInfo: {
          name: order.shippingName,
          phone: order.shippingPhone,
          address: order.shippingAddress,
          ward: order.shippingWard,
          district: order.shippingDistrict,
          city: order.shippingCity,
        },
      })),
    };
  } catch (error) {
    logger.error("Action failed", error);
    return {
      success: false,
      orders: [],
      error: "Không thể tải thông tin đơn hàng",
    };
  }
}
