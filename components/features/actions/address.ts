"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { Address, AddressActionResponse, SerializedAddress } from "@/types";

/**
 * Get all addresses của user hiện tại
 * 
 * @returns Object chứa array addresses đã serialize
 */
export async function getUserAddresses(): Promise<{ addresses: SerializedAddress[] }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { addresses: [] };
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Serialize for Redux - Convert Date → string
    const serializedAddresses: SerializedAddress[] = addresses.map((addr) => ({
      ...addr,
      createdAt: addr.createdAt.toISOString(),
    }));

    return { addresses: serializedAddresses };
  } catch (error) {
    console.error("Get addresses error:", error);
    return { addresses: [] };
  }
}

/**
 * Thêm địa chỉ mới
 * 
 * @param addressData - Thông tin địa chỉ (không cần id, userId)
 * @returns Response với newAddress nếu thành công
 */
export async function addAddress(
  addressData: Omit<Address, 'id' | 'userId' | 'createdAt'>
): Promise<AddressActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập" };
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
      return { success: false, error: "Vui lòng điền đầy đủ thông tin" };
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

    // Serialize for Redux
    const serializedAddress = {
      ...newAddress,
      createdAt: newAddress.createdAt.toISOString(),
    };

    return {
      success: true,
      message: "Đã thêm địa chỉ thành công!",
      newAddress: serializedAddress,
    };
  } catch (error) {
    console.error("Error adding address:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể thêm địa chỉ",
    };
  }
}

/**
 * Cập nhật địa chỉ hiện có
 * 
 * @param addressId - ID của address cần update
 * @param addressData - Data mới (không cần id, userId, createdAt)
 * @returns Response với address đã update
 */
export async function updateAddress(
  addressId: string,
  addressData: Omit<Address, 'id' | 'userId' | 'createdAt'>
): Promise<AddressActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập" };
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
      return { success: false, error: "Vui lòng điền đầy đủ thông tin" };
    }

    // Check ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress || existingAddress.userId !== userId) {
      return {
        success: false,
        error: "Không tìm thấy địa chỉ hoặc bạn không có quyền chỉnh sửa",
      };
    }

    // Update address
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        name,
        email,
        street,
        city,
        state,
        zip,
        country,
        phone,
      },
    });

    revalidatePath("/cart");

    const serializedAddress = {
      ...updatedAddress,
      createdAt: updatedAddress.createdAt.toISOString(),
    };

    return {
      success: true,
      message: "Đã cập nhật địa chỉ thành công!",
      address: serializedAddress,
    };
  } catch (error) {
    console.error("Error updating address:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Không thể cập nhật địa chỉ",
    };
  }
}

/**
 * Xóa địa chỉ
 * 
 * @param addressId - ID của address cần xóa
 * @returns Response với deletedId nếu thành công
 */
export async function deleteAddress(addressId: string): Promise<AddressActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập" };
    }

    // Check ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress || existingAddress.userId !== userId) {
      return {
        success: false,
        error: "Không tìm thấy địa chỉ hoặc bạn không có quyền xóa",
      };
    }

    // Delete address
    await prisma.address.delete({
      where: { id: addressId },
    });

    revalidatePath("/cart");

    return {
      success: true,
      message: "Đã xóa địa chỉ thành công!",
      deletedId: addressId,
    };
  } catch (error) {
    console.error("Error deleting address:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể xóa địa chỉ",
    };
  }
}
