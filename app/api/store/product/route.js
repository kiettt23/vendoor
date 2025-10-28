import { getAuth } from "@clerk/nextjs/server";
import { authSeller } from "@/lib/auth/authSeller";
import imagekit from "@/lib/config/imageKit";
import { NextResponse } from "next/server";
import { productService } from "@/lib/services/productService";
import { handleError } from "@/lib/errors/errorHandler";
import { UnauthorizedError, BadRequestError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/lib/constants/errorMessages";
import { invalidateCaches } from "@/lib/cache";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const category = formData.get("category");
    const images = formData.getAll("images");

    if (
      !name ||
      !description ||
      !mrp ||
      !price ||
      !category ||
      images.length < 1
    ) {
      throw new BadRequestError(ERROR_MESSAGES.MISSING_PRODUCT_DETAILS);
    }

    // Upload images to ImageKit
    const imagesUrl = await Promise.all(
      images.map(async (image) => {
        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await imagekit.upload({
          file: buffer,
          fileName: image.name,
          folder: "products",
        });
        const url = imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1024" },
          ],
        });
        return url;
      })
    );

    await productService.createProduct({
      name,
      description,
      mrp,
      price,
      category,
      images: imagesUrl,
      storeId,
    });

    // 🗑️ Invalidate related caches
    await invalidateCaches([
      "products:all", // Global products list
      `store:${storeId}:dashboard`, // Store dashboard (product count)
    ]);

    return NextResponse.json({ message: "Product added successfully" });
  } catch (error) {
    return handleError(error, "Store Product POST");
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const products = await productService.getProducts({ storeId });

    return NextResponse.json({ products });
  } catch (error) {
    return handleError(error, "Store Product GET");
  }
}
