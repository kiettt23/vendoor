"use server";

import prisma from "@/lib/prisma";
import { requireSeller } from "@/lib/auth/check-seller";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

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
  const storeId = await requireSeller();

  const products = await prisma.product.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

  return products;
}

// Create a new product
export async function createProduct(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const storeId = await requireSeller();

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

    // Upload images to Vercel Blob
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const blob = await put(file.name, file, {
          access: "public",
        });
        imageUrls.push(blob.url);
      }
    }

    if (imageUrls.length === 0) {
      throw new Error("Không thể tải lên hình ảnh");
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
        storeId,
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
  productId: string,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { store: { select: { userId: true } } },
    });

    if (!product || product.store.userId !== userId) {
      throw new Error("Unauthorized: You don't own this product");
    }

    // Extract and update data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const mrp = parseFloat(formData.get("mrp") as string);
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;

    if (price > mrp) {
      throw new Error("Giá bán không thể cao hơn giá gốc");
    }

    await prisma.product.update({
      where: { id: productId },
      data: { name, description, mrp, price, category },
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
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get product and verify ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { store: { select: { userId: true } } },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.store.userId !== userId) {
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
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get product and verify ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { store: { select: { userId: true } } },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.store.userId !== userId) {
      throw new Error("Unauthorized: You don't own this product");
    }

    // Delete product
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
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

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
