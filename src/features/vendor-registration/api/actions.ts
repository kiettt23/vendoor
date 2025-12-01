"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/db";
import { slugify, ok, err, type Result } from "@/shared/lib/utils";

import { vendorRegistrationSchema } from "../model";
import type { VendorRegistrationInput } from "../model";

/**
 * Đăng ký làm Vendor
 */
export async function registerAsVendor(
  userId: string,
  data: VendorRegistrationInput
): Promise<Result<string>> {
  try {
    // 1. Validate input
    const validated = vendorRegistrationSchema.parse(data);

    // 2. Kiểm tra user đã có vendor profile chưa
    const existingProfile = await prisma.vendorProfile.findUnique({
      where: { userId },
      select: { id: true, status: true },
    });

    if (existingProfile) {
      if (existingProfile.status === "PENDING") {
        return err("Bạn đã đăng ký làm người bán. Vui lòng đợi duyệt.");
      }
      if (existingProfile.status === "APPROVED") {
        return err("Bạn đã là người bán.");
      }
      if (existingProfile.status === "REJECTED") {
        return err(
          "Đơn đăng ký của bạn đã bị từ chối. Vui lòng liên hệ hỗ trợ."
        );
      }
      if (existingProfile.status === "SUSPENDED") {
        return err("Tài khoản người bán của bạn đã bị đình chỉ.");
      }
    }

    // 3. Kiểm tra shopName đã tồn tại chưa
    const baseSlug = slugify(validated.shopName);
    const existingSlug = await prisma.vendorProfile.findUnique({
      where: { slug: baseSlug },
      select: { id: true },
    });

    // Tạo slug unique
    const slug = existingSlug
      ? `${baseSlug}-${Date.now().toString(36)}`
      : baseSlug;

    // 4. Tạo vendor profile
    const vendorProfile = await prisma.vendorProfile.create({
      data: {
        userId,
        shopName: validated.shopName,
        slug,
        description: validated.description || null,
        businessAddress: validated.businessAddress || null,
        businessPhone: validated.businessPhone || null,
        businessEmail: validated.businessEmail || null,
        status: "PENDING", // Chờ admin duyệt
      },
    });

    // 5. Revalidate
    revalidatePath("/account");
    revalidatePath("/admin/vendors");

    return ok(vendorProfile.id);
  } catch (error) {
    console.error("registerAsVendor error:", error);
    return err("Không thể đăng ký. Vui lòng thử lại sau.");
  }
}

/**
 * Kiểm tra trạng thái đăng ký vendor của user
 */
export async function getVendorRegistrationStatus(userId: string) {
  const profile = await prisma.vendorProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      shopName: true,
      slug: true,
      status: true,
      createdAt: true,
    },
  });

  return profile;
}
