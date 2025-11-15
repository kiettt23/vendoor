"use server";

import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/shared/lib/prisma";

/**
 * Get order detail by ID
 *
 * **Features:**
 * - Fetch single order with all relations
 * - Check ownership (only owner can view)
 * - Return null if not found or unauthorized
 *
 * **Returns:**
 * - Order with vendor, items, shipping info
 * - Null if not found or not authorized
 */

export interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  platformFee: number;
  customerNote: string | null;
  trackingNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
  vendor: {
    id: string;
    shopName: string;
    slug: string;
    phone: string | null;
  };
  items: Array<{
    id: string;
    productName: string;
    variantName: string | null;
    quantity: number;
    price: number;
    subtotal: number;
    image: string;
  }>;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    ward: string | null;
    district: string | null;
    city: string | null;
  };
  payment: {
    id: string;
    paymentNumber: string;
    method: string;
    status: string;
    amount: number;
  } | null;
}

export async function getOrderDetail(
  orderId: string
): Promise<OrderDetail | null> {
  try {
    // 1. Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }

    // 2. Fetch order with relations
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        vendor: {
          include: {
            vendorProfile: {
              select: {
                shopName: true,
                slug: true,
                businessPhone: true,
              },
            },
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { order: 0 },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
        payment: true,
      },
    });

    // 3. Check if order exists
    if (!order) {
      return null;
    }

    // 4. Check ownership
    if (order.customerId !== session.user.id) {
      return null;
    }

    // 5. Format response
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      platformFee: order.platformFee,
      customerNote: order.customerNote,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      vendor: {
        id: order.vendor.id,
        shopName: order.vendor.vendorProfile?.shopName || "Unknown Shop",
        slug: order.vendor.vendorProfile?.slug || "",
        phone: order.vendor.vendorProfile?.businessPhone || null,
      },
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.variant.product.name,
        variantName: item.variant.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
        image:
          item.variant.product.images[0]?.url || "/placeholder-product.png",
      })),
      shippingAddress: {
        name: order.shippingName,
        phone: order.shippingPhone,
        address: order.shippingAddress,
        ward: order.shippingWard,
        district: order.shippingDistrict,
        city: order.shippingCity,
      },
      payment: order.payment
        ? {
            id: order.payment.id,
            paymentNumber: order.payment.paymentNumber,
            method: order.payment.method,
            status: order.payment.status,
            amount: order.payment.amount,
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching order detail:", error);
    return null;
  }
}
