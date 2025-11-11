"use server";

import prisma from "@/lib/prisma";
import { requireSeller } from "@/features/auth/index.server";
import { revalidatePath } from "next/cache";
import imagekit from "@/configs/image-kit";

interface ActionResponse {
  success: boolean;
  message: string;
  inStock?: boolean;
}

interface AIAnalysisResult {
  name: string;
  description: string;
}

// Get all products for the seller's store
export async function getProducts() {
  const user = await requireSeller();

  // Get seller's store
  const store = await prisma.store.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!store) {
    throw new Error("Store not found");
  }

  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
  });

  return products;
}

// Create a new product
export async function createProduct(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const user = await requireSeller();

    // Get seller's store
    const store = await prisma.store.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!store) {
      throw new Error("Store not found");
    }

    // Extract form data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const mrp = parseFloat(formData.get("mrp") as string);
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const imageFiles = formData.getAll("images") as File[];

    // Validate required fields
    if (!name || !description || !mrp || !price || !category) {
      throw new Error("Vui lòng điền đầy đủ thông tin");
    }

    if (imageFiles.length === 0) {
      throw new Error("Vui lòng tải lên ít nhất 1 hình ảnh");
    }

    // Validate prices
    if (price > mrp) {
      throw new Error("Giá bán không thể cao hơn giá gốc");
    }

    // Upload images to ImageKit
    const imageUrls: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (file && file.size > 0) {
        try {
          // Convert File to Buffer
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Upload to ImageKit
          const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: `product-${name.replace(/\s+/g, "-")}-${
              i + 1
            }-${Date.now()}.${file.name.split(".").pop()}`,
            folder: "/products",
          });

          imageUrls.push(uploadResponse.url);
        } catch (uploadError) {
          console.error(`Failed to upload image ${i + 1}:`, uploadError);
          // Continue with other images
        }
      }
    }

    if (imageUrls.length === 0) {
      throw new Error("Không thể tải lên hình ảnh. Vui lòng thử lại.");
    }

    // Create product in database
    await prisma.product.create({
      data: {
        name,
        description,
        mrp,
        price,
        category,
        images: imageUrls,
        storeId: store.id,
        inStock: true,
      },
    });

    revalidatePath("/store/add-product");
    revalidatePath("/store/manage-product");

    return {
      success: true,
      message: "Đã thêm sản phẩm thành công!",
    };
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể thêm sản phẩm"
    );
  }
}

// Update an existing product
export async function updateProduct(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const user = await requireSeller();

    const productId = formData.get("productId") as string;

    // Verify ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { store: { select: { userId: true } } },
    });

    if (!product || product.store.userId !== user.id) {
      throw new Error("Unauthorized: You don't own this product");
    }

    // Extract data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const mrp = parseFloat(formData.get("mrp") as string);
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const existingImagesStr = formData.get("existingImages") as string;
    const existingImages = existingImagesStr
      ? JSON.parse(existingImagesStr)
      : [];

    // Validate prices
    if (price > mrp) {
      throw new Error("Giá bán không thể cao hơn giá gốc");
    }

    // Upload new images to ImageKit
    const imageFiles = formData.getAll("images") as File[];
    const newImageUrls: string[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (file && file.size > 0) {
        try {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: `product-${name.replace(/\s+/g, "-")}-${Date.now()}-${
              i + 1
            }.${file.name.split(".").pop()}`,
            folder: "/products",
          });

          newImageUrls.push(uploadResponse.url);
        } catch (uploadError) {
          console.error(`Failed to upload image ${i + 1}:`, uploadError);
        }
      }
    }

    // Combine existing and new images
    const allImages = [...existingImages, ...newImageUrls];

    if (allImages.length === 0) {
      throw new Error("Vui lòng tải lên ít nhất 1 hình ảnh");
    }

    // Update product
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        mrp,
        price,
        category,
        images: allImages,
      },
    });

    revalidatePath("/store/manage-product");

    return {
      success: true,
      message: "Đã cập nhật sản phẩm!",
    };
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể cập nhật sản phẩm"
    );
  }
}

// Toggle product stock status
export async function toggleStock(productId: string): Promise<ActionResponse> {
  try {
    const user = await requireSeller();

    // Get product and verify ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { store: { select: { userId: true } } },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.store.userId !== user.id) {
      throw new Error("Unauthorized: You don't own this product");
    }

    // Toggle stock status
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { inStock: !product.inStock },
    });

    revalidatePath("/store/manage-product");

    return {
      success: true,
      message: updatedProduct.inStock
        ? "Sản phẩm đã có hàng!"
        : "Sản phẩm đã hết hàng!",
      inStock: updatedProduct.inStock,
    };
  } catch (error) {
    console.error("Error toggling product stock:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Không thể thay đổi trạng thái sản phẩm"
    );
  }
}

// Alias for backward compatibility
export { toggleStock as toggleProductStock };

// Delete a product
export async function deleteProduct(
  productId: string
): Promise<ActionResponse> {
  try {
    const user = await requireSeller();

    // Get product and verify ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        store: { select: { userId: true } },
        orderItems: {
          include: {
            order: {
              select: { status: true, createdAt: true },
            },
          },
        },
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.store.userId !== user.id) {
      throw new Error("Unauthorized: You don't own this product");
    }

    // Check if product has been ordered
    if (product.orderItems.length > 0) {
      // Check for pending orders
      const pendingOrders = product.orderItems.filter(
        (item) =>
          item.order.status === "ORDER_PLACED" ||
          item.order.status === "PROCESSING" ||
          item.order.status === "SHIPPED"
      );

      const hasDeliveredOrders = product.orderItems.some(
        (item) => item.order.status === "DELIVERED"
      );

      let message = "";
      if (pendingOrders.length > 0) {
        message = `Không thể xóa! Sản phẩm này có ${pendingOrders.length} đơn hàng đang xử lý. Sản phẩm đã được đánh dấu "Hết hàng" (bạn có thể bật lại bằng nút toggle).`;
      } else if (hasDeliveredOrders) {
        message = `Không thể xóa! Sản phẩm này đã có trong lịch sử đơn hàng. Sản phẩm đã được đánh dấu "Hết hàng" (bạn có thể bật lại bằng nút toggle).`;
      } else {
        message = `Không thể xóa! Sản phẩm này đã có trong đơn hàng. Đã đánh dấu "Hết hàng".`;
      }

      // Soft delete: mark as out of stock instead of deleting
      await prisma.product.update({
        where: { id: productId },
        data: { inStock: false },
      });

      revalidatePath("/store/manage-product");

      return {
        success: false,
        message,
      };
    }

    // If never ordered, can safely delete
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/store/manage-product");

    return {
      success: true,
      message: "Đã xóa sản phẩm!",
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể xóa sản phẩm"
    );
  }
}

// Analyze product image with AI
export async function analyzeProductImage(
  base64Image: string,
  mimeType: string
): Promise<AIAnalysisResult> {
  try {
    await requireSeller();

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key not configured");
      return { name: "", description: "" };
    }

    // Call OpenAI Vision API
    const { openai } = await import("@/configs/openai");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this product image and provide: 1) A short product name (max 50 chars), 2) A detailed description (max 200 chars). Respond in Vietnamese. Format: {name: 'name here', description: 'description here'}",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content || "";

    // Parse AI response
    try {
      const jsonMatch = content.match(/\{[^}]+\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          name: parsed.name || "",
          description: parsed.description || "",
        };
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
    }

    return { name: "", description: "" };
  } catch (error) {
    console.error("Error analyzing image:", error);
    return { name: "", description: "" };
  }
}
