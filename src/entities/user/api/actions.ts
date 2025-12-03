"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/shared/lib/auth/config";
import { prisma } from "@/shared/lib/db";
import { ok, err, type Result } from "@/shared/lib/utils";

// ============================================
// Schemas
// ============================================

const updateProfileSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(100),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Số điện thoại không hợp lệ")
    .nullable()
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ============================================
// Actions
// ============================================

/**
 * Cập nhật profile user
 */
export async function updateUserProfile(
  input: UpdateProfileInput
): Promise<Result<void>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return err("Bạn cần đăng nhập");
    }

    const validated = updateProfileSchema.safeParse(input);
    if (!validated.success) {
      return err(validated.error.issues[0]?.message || "Dữ liệu không hợp lệ");
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validated.data.name,
        phone: validated.data.phone,
      },
    });

    return ok(undefined);
  } catch (error) {
    console.error("Update profile error:", error);
    return err("Có lỗi xảy ra, vui lòng thử lại");
  }
}
