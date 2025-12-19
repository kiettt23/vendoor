"use server";

import { z } from "zod";
import { getZodFirstError } from "@/shared/lib/validation";
import { getSession } from "@/shared/lib/auth/session";
import { prisma } from "@/shared/lib/db";
import {
  ok,
  err,
  type AsyncVoidResult,
  createLogger,
} from "@/shared/lib/utils";

const logger = createLogger("user");

// ============================================================================
// Schema
// ============================================================================

const updateProfileSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(100),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Số điện thoại không hợp lệ")
    .nullable()
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ============================================================================
// Actions
// ============================================================================

export async function updateUserProfile(
  input: UpdateProfileInput
): AsyncVoidResult {
  try {
    // Guard: Check session
    const session = await getSession();
    if (!session?.user) return err("Bạn cần đăng nhập");

    // Guard: Validate input
    const validated = updateProfileSchema.safeParse(input);
    if (!validated.success) return err(getZodFirstError(validated.error));

    // Update
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validated.data.name,
        phone: validated.data.phone,
      },
    });

    return ok(undefined);
  } catch (error) {
    logger.error("updateUserProfile error:", error);
    return err("Có lỗi xảy ra, vui lòng thử lại");
  }
}
