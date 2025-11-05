"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

export async function createProduct(formData) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    // 2. Get user's store
    const store = await prisma.store.findUnique({
      where: { userId },
      select: { id: true, status: true, isActive: true },
    });

    if (!store) {
      throw new Error("Bạn chưa có cửa hàng. Vui lòng tạo cửa hàng trước");
    }

    if (store.status !== "approved" || !store.isActive) {
      throw new Error("Cửa hàng của bạn chưa được kích hoạt");
    }

    // 3. Extract form data
    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = parseFloat(formData.get("mrp"));
    const price = parseFloat(formData.get("price"));
    const category = formData.get("category");
    const imageFiles = formData.getAll("images");

    // 4. Validate required fields
    if (!name || !description || !mrp || !price || !category) {
      throw new Error("Vui lòng điền đầy đủ thông tin");
    }

    if (imageFiles.length === 0) {
      throw new Error("Vui lòng tải lên ít nhất 1 hình ảnh");
    }

    // 5. Validate prices
    if (price > mrp) {
      throw new Error("Giá bán không thể cao hơn giá gốc");
    }

    // 6. Upload images to Vercel Blob
    const imageUrls = [];
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

    // 7. Create product in database
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

    // 8. Refresh the page data
    revalidatePath("/store/add-product");
    revalidatePath("/store/manage-product");

    // 9. Return success
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

/**
 * AI analysis for product image (optional feature)
 * @param {string} base64Image - Base64 encoded image
 * @param {string} mimeType - Image MIME type
 * @returns {Promise<{name: string, description: string}>}
 */
export async function analyzeProductImage(base64Image, mimeType) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    // 2. Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key not configured");
      return {
        name: "",
        description: "",
      };
    }

    // 3. Call OpenAI Vision API
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
      // Extract JSON from response
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

    return {
      name: "",
      description: "",
    };
  } catch (error) {
    console.error("Error analyzing image:", error);
    return {
      name: "",
      description: "",
    };
  }
}
