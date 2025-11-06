"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { uploadToImageKit } from "@/configs/image-kit";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types";

/**
 * Get store information
 */
export async function getStoreInfo(): Promise<
  ActionResponse<{
    id: string;
    name: string;
    username: string;
    description: string;
    logo: string;
    email: string;
    contact: string;
    address: string;
    status: string;
    isActive: boolean;
  }>
> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const store = await prisma.store.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        username: true,
        description: true,
        logo: true,
        email: true,
        contact: true,
        address: true,
        status: true,
        isActive: true,
      },
    });

    if (!store) {
      return { success: false, message: "Store not found" };
    }

    return { success: true, data: store };
  } catch (error) {
    console.error("Get store info error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

/**
 * Update store logo
 */
export async function updateStoreLogo(formData: FormData): Promise<
  ActionResponse<{
    id: string;
    name: string;
    username: string;
    description: string;
    logo: string;
    email: string;
    contact: string;
    address: string;
  }>
> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    // Get seller's store
    const store = await prisma.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      return { success: false, message: "Store not found" };
    }

    const imageFile = formData.get("image") as File;
    if (!imageFile) {
      return { success: false, message: "No image provided" };
    }

    // Upload to ImageKit
    const uploadResult = await uploadToImageKit(imageFile, "store-logos");

    if (!uploadResult.success || !uploadResult.url) {
      return {
        success: false,
        message: uploadResult.message || "Upload failed",
      };
    }

    // Update store logo in database
    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: { logo: uploadResult.url },
      select: {
        id: true,
        name: true,
        username: true,
        description: true,
        logo: true,
        email: true,
        contact: true,
        address: true,
      },
    });

    // Revalidate store pages
    revalidatePath("/store");
    revalidatePath("/store/settings");

    return {
      success: true,
      message: "Logo updated successfully",
      data: updatedStore,
    };
  } catch (error) {
    console.error("Update store logo error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

/**
 * Update store information
 */
export async function updateStoreInfo(data: {
  name: string;
  description: string;
  email: string;
  contact: string;
  address: string;
}): Promise<
  ActionResponse<{
    id: string;
    name: string;
    username: string;
    description: string;
    logo: string;
    email: string;
    contact: string;
    address: string;
  }>
> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    // Get seller's store
    const store = await prisma.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      return { success: false, message: "Store not found" };
    }

    // Update store info
    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: {
        name: data.name,
        description: data.description,
        email: data.email,
        contact: data.contact,
        address: data.address,
      },
      select: {
        id: true,
        name: true,
        username: true,
        description: true,
        logo: true,
        email: true,
        contact: true,
        address: true,
      },
    });

    // Revalidate store pages
    revalidatePath("/store");
    revalidatePath("/store/settings");

    return {
      success: true,
      message: "Store information updated successfully",
      data: updatedStore,
    };
  } catch (error) {
    console.error("Update store info error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
