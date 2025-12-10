"use server";

import { z } from "zod";
import { getSession } from "@/shared/lib/auth/session";
import { prisma } from "@/shared/lib/db";
import { ok, err, type Result, createLogger } from "@/shared/lib/utils";
import { getZodFirstError } from "@/shared/lib/validation";

const logger = createLogger("user");

const updateProfileSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(100),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Số điện thoại không hợp lệ")
    .nullable()
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export async function updateUserProfile(
  input: UpdateProfileInput
): Promise<Result<void>> {
  try {
    const session = await getSession();
    if (!session?.user) {
      return err("Bạn cần đăng nhập");
    }

    const validated = updateProfileSchema.safeParse(input);
    if (!validated.success) {
      return err(getZodFirstError(validated.error));
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
    logger.error("updateUserProfile error:", error);
    return err("Có lỗi xảy ra, vui lòng thử lại");
  }
}
