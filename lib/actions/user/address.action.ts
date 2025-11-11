"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/server";
import { revalidatePath } from "next/cache";
import type { AddressActionResponse, SerializedAddress } from "@/types";
import type { AddressFormData } from "@/lib/validations";

export async function getUserAddresses(): Promise<{
  addresses: SerializedAddress[];
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { addresses: [] };
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
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

export async function addAddress(
  addressData: AddressFormData
): Promise<AddressActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Vui lòng đăng nhập" };
    }

    const { name, email, street, city, state, phone } = addressData;

    // Validate required fields
    if (!name || !email || !street || !city || !state || !phone) {
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
        phone,
        userId: user.id,
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

export async function updateAddress(
  addressId: string,
  addressData: AddressFormData
): Promise<AddressActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Vui lòng đăng nhập" };
    }

    const { name, email, street, city, state, phone } = addressData;

    // Validate required fields
    if (!name || !email || !street || !city || !state || !phone) {
      return { success: false, error: "Vui lòng điền đầy đủ thông tin" };
    }

    // Check ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress || existingAddress.userId !== user.id) {
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

export async function deleteAddress(
  addressId: string
): Promise<AddressActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Vui lòng đăng nhập" };
    }

    // Check ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress || existingAddress.userId !== user.id) {
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
