"use server";

import prisma from "@/server/db/prisma";
import { getCurrentUser } from "@/features/auth/index.server";
import { revalidatePath } from "next/cache";
import imagekit from "@/configs/image-kit";

export async function createStore(formData) {
  try {
    // 1. Check authentication
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized: Please sign in");
    }

    // 2. Check if user already has a store
    const existingStore = await prisma.store.findUnique({
      where: { userId: user.id },
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

    // 6. Upload store logo to ImageKit
    let logoUrl = "";
    if (imageFile && imageFile.size > 0) {
      try {
        // Convert File to Buffer
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to ImageKit
        const uploadResponse = await imagekit.upload({
          file: buffer,
          fileName: `store-${username}-${Date.now()}.${imageFile.name
            .split(".")
            .pop()}`,
          folder: "/stores",
        });

        logoUrl = uploadResponse.url;
      } catch (uploadError) {
        console.error("Failed to upload image to ImageKit:", uploadError);
        // Continue without image - don't fail the entire store creation
        logoUrl = "";
      }
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
        userId: user.id,
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
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized: Please sign in");
    }

    // 2. Get store status
    const store = await prisma.store.findUnique({
      where: { userId: user.id },
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
