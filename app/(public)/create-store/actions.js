"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

export async function createStore(formData) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    // 2. Check if user already has a store
    const existingStore = await prisma.store.findUnique({
      where: { userId },
    });

    if (existingStore) {
      throw new Error("Bạn đã có cửa hàng rồi");
    }

    // 3. Extract form data
    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const address = formData.get("address");
    const imageFile = formData.get("image");

    // 4. Validate required fields
    if (!name || !username || !description || !email || !contact || !address) {
      throw new Error("Vui lòng điền đầy đủ thông tin");
    }

    // 5. Check if username is already taken
    const existingUsername = await prisma.store.findUnique({
      where: { username },
    });

    if (existingUsername) {
      throw new Error("Tên định danh cửa hàng đã tồn tại");
    }

    // 6. Upload store logo to Vercel Blob
    let logoUrl = "";
    if (imageFile && imageFile.size > 0) {
      const blob = await put(imageFile.name, imageFile, {
        access: "public",
      });
      logoUrl = blob.url;
    }

    // 7. Create store in database with pending status
    await prisma.store.create({
      data: {
        name,
        username,
        description,
        email,
        contact,
        address,
        logo: logoUrl,
        userId,
        status: "pending",
        isActive: false,
      },
    });

    // 8. Refresh the page data
    revalidatePath("/create-store");

    // 9. Return success
    return {
      success: true,
      message: "Đã gửi yêu cầu tạo cửa hàng. Vui lòng đợi admin phê duyệt",
    };
  } catch (error) {
    console.error("Error creating store:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể tạo cửa hàng"
    );
  }
}

export async function getSellerStatus() {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    // 2. Get store status
    const store = await prisma.store.findUnique({
      where: { userId },
      select: {
        status: true,
        isActive: true,
      },
    });

    if (!store) {
      return { status: "none" };
    }

    return { status: store.status };
  } catch (error) {
    console.error("Error getting seller status:", error);
    return { status: "error" };
  }
}
