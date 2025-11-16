"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";

// ============================================
// GET VENDOR ORDER DETAIL
// ============================================

/**
 * Get detailed order information for vendor
 *
 * **Features:**
 * - Full order info (customer, shipping, items, payment)
 * - Security: Only vendor can see their own orders
 * - Product variant details included
 *
 * **Returns:**
 * - Order with nested items (product, variant, quantity, price)
 * - Customer info (name, phone, email)
 * - Shipping address
 * - Payment status
 */

export interface VendorOrderDetailItem {
  id: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  price: number;
  subtotal: number;
  // Extra info
  variant: {
    id: string;
    color: string | null;
    size: string | null;
    sku: string | null;
    product: {
      id: string;
      name: string;
      slug: string;
      images: Array<{
        url: string;
        altText: string | null;
      }>;
    };
  };
}

export interface VendorOrderDetail {
  id: string;
  orderNumber: string;
  status: string;

  // Customer info
  customer: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };

  // Pricing
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  platformFee: number;
  vendorEarnings: number;
  platformFeeRate: number;

  // Shipping
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string | null;
  shippingDistrict: string | null;
  shippingWard: string | null;
  trackingNumber: string | null;

  // Notes
  customerNote: string | null;
  vendorNote: string | null;

  // Payment
  payment: {
    id: string;
    paymentNumber: string;
    method: string;
    status: string;
    amount: number;
    paidAt: Date | null;
  } | null;

  // Items
  items: VendorOrderDetailItem[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export async function getVendorOrderDetail(
  orderId: string
): Promise<
  { success: true; data: VendorOrderDetail } | { success: false; error: string }
> {
  try {
    // Auth check
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Check VENDOR role
    if (!session.user.roles?.includes("VENDOR")) {
      return {
        success: false,
        error: "Chỉ vendor mới có thể xem đơn hàng",
      };
    }

    // Get vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!vendorProfile) {
      return {
        success: false,
        error: "Vendor profile không tồn tại",
      };
    }

    // Fetch order with all details
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        vendorId: vendorProfile.id, // IMPORTANT: Only vendor's own orders
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      take: 1,
                      orderBy: { order: "asc" },
                      select: {
                        url: true,
                        altText: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        payment: {
          select: {
            id: true,
            paymentNumber: true,
            method: true,
            status: true,
            amount: true,
            paidAt: true,
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        error: "Đơn hàng không tồn tại hoặc bạn không có quyền xem",
      };
    }

    // Map to response format
    const result: VendorOrderDetail = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      customer: order.customer,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      tax: order.tax,
      total: order.total,
      platformFee: order.platformFee,
      vendorEarnings: order.vendorEarnings,
      platformFeeRate: order.platformFeeRate,
      shippingName: order.shippingName,
      shippingPhone: order.shippingPhone,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingDistrict: order.shippingDistrict,
      shippingWard: order.shippingWard,
      trackingNumber: order.trackingNumber,
      customerNote: order.customerNote,
      vendorNote: order.vendorNote,
      payment: order.payment,
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        variantName: item.variantName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
        variant: item.variant,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Failed to get vendor order detail:", error);
    return {
      success: false,
      error: "Không thể tải thông tin đơn hàng",
    };
  }
}
