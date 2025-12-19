"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/db";
import {
  generateUniqueSlug,
  ok,
  err,
  type Result,
  createLogger,
} from "@/shared/lib/utils";
import { ROUTES } from "@/shared/lib/constants";

import { vendorRegistrationSchema } from "../model";
import type { VendorRegistrationInput } from "../model";

const logger = createLogger("vendor-registration");

export async function registerAsVendor(
  userId: string,
  data: VendorRegistrationInput
): Promise<Result<string>> {
  try {
    const validated = vendorRegistrationSchema.parse(data);

    const existingProfile = await prisma.vendorProfile.findUnique({
      where: { userId },
      select: { id: true, status: true },
    });

    // Guard clauses for existing profile status
    if (existingProfile?.status === "PENDING") {
      return err("Bạn đã đăng ký làm người bán. Vui lòng đợi duyệt.");
    }
    if (existingProfile?.status === "APPROVED") {
      return err("Bạn đã là người bán.");
    }
    if (existingProfile?.status === "REJECTED") {
      return err("Đơn đăng ký của bạn đã bị từ chối. Vui lòng liên hệ hỗ trợ.");
    }
    if (existingProfile?.status === "SUSPENDED") {
      return err("Tài khoản người bán của bạn đã bị đình chỉ.");
    }

    const slug = await generateUniqueSlug(validated.shopName, async (s) => {
      const existing = await prisma.vendorProfile.findUnique({
        where: { slug: s },
        select: { id: true },
      });
      return !!existing;
    });

    const vendorProfile = await prisma.vendorProfile.create({
      data: {
        userId,
        shopName: validated.shopName,
        slug,
        description: validated.description || null,
        businessAddress: validated.businessAddress || null,
        businessPhone: validated.businessPhone || null,
        businessEmail: validated.businessEmail || null,
        status: "PENDING",
      },
    });

    revalidatePath(ROUTES.ACCOUNT);
    revalidatePath(ROUTES.ADMIN_VENDORS);

    return ok(vendorProfile.id);
  } catch (error) {
    logger.error("registerAsVendor error:", error);
    return err("Không thể đăng ký. Vui lòng thử lại sau.");
  }
}

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
