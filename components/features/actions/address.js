"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addAddress(addressData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    const { name, email, street, city, state, zip, country, phone } =
      addressData;

    // Validate required fields
    if (
      !name ||
      !email ||
      !street ||
      !city ||
      !state ||
      !zip ||
      !country ||
      !phone
    ) {
      throw new Error("Vui lòng điền đầy đủ thông tin");
    }

    // Create address
    const newAddress = await prisma.address.create({
      data: {
        name,
        email,
        street,
        city,
        state,
        zip,
        country,
        phone,
        userId,
      },
    });

    revalidatePath("/cart");

    return {
      success: true,
      message: "Đã thêm địa chỉ thành công!",
      newAddress,
    };
  } catch (error) {
    console.error("Error adding address:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể thêm địa chỉ"
    );
  }
}
