"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createCoupon(couponData) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    // 2. Validate required fields
    const {
      code,
      description,
      discount,
      forNewUser,
      forMember,
      isPublic,
      expiresAt,
    } = couponData;

    if (!code || !description || discount === undefined) {
      throw new Error("Vui lòng điền đầy đủ thông tin");
    }

    // 3. Validate discount range
    if (discount < 0 || discount > 100) {
      throw new Error("Giảm giá phải từ 0 đến 100%");
    }

    // 4. Check if coupon code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existingCoupon) {
      throw new Error("Mã giảm giá này đã tồn tại");
    }

    // 5. Validate expiration date
    const expirationDate = new Date(expiresAt);
    if (expirationDate <= new Date()) {
      throw new Error("Ngày hết hạn phải sau ngày hiện tại");
    }

    // 6. Create coupon in database
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

    // 7. Refresh the page data
    revalidatePath("/admin/coupons");

    // 8. Return success
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

export async function deleteCoupon(code) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    // 2. Validate input
    if (!code) {
      throw new Error("Coupon code is required");
    }

    // 3. Check if coupon exists
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      throw new Error("Mã giảm giá không tồn tại");
    }

    // 4. Delete coupon from database
    await prisma.coupon.delete({
      where: { code },
    });

    // 5. Refresh the page data
    revalidatePath("/admin/coupons");

    // 6. Return success
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
