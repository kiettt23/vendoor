"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/features/auth/index.server";
import { revalidatePath } from "next/cache";
import type { CouponFormData, ActionResponse } from "@/types";

// Get all coupons for admin
export async function getCoupons() {
  await requireAdmin();

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return coupons;
}

// Create a new coupon
export async function createCoupon(
  couponData: CouponFormData
): Promise<ActionResponse> {
  try {
    await requireAdmin();

    const {
      code,
      description,
      discount,
      forNewUser,
      forMember,
      isPublic,
      expiresAt,
    } = couponData;

    // Validate required fields
    if (!code || !description || discount === undefined) {
      throw new Error("Vui lòng điền đầy đủ thông tin");
    }

    // Validate discount range
    if (discount < 0 || discount > 100) {
      throw new Error("Giảm giá phải từ 0 đến 100%");
    }

    // Check if coupon code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existingCoupon) {
      throw new Error("Mã giảm giá này đã tồn tại");
    }

    // Validate expiration date
    const expirationDate = new Date(expiresAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day

    if (expirationDate < today) {
      throw new Error("Ngày hết hạn phải từ hôm nay trở đi");
    }

    // Create coupon
    await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description,
        discount: Number(discount),
        forNewUser: Boolean(forNewUser),
        forMember: Boolean(forMember),
        isPublic: Boolean(isPublic),
        expiresAt: expirationDate,
      },
    });

    revalidatePath("/admin/coupons");

    return {
      success: true,
      message: `Đã tạo mã giảm giá ${code.toUpperCase()}!`,
    };
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể tạo mã giảm giá"
    );
  }
}

// Delete a coupon by code
export async function deleteCoupon(code: string): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (!code) {
      throw new Error("Coupon code is required");
    }

    // Check if coupon exists
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      throw new Error("Mã giảm giá không tồn tại");
    }

    // Delete coupon
    await prisma.coupon.delete({
      where: { code },
    });

    revalidatePath("/admin/coupons");

    return {
      success: true,
      message: `Đã xóa mã giảm giá ${code}!`,
    };
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể xóa mã giảm giá"
    );
  }
}
