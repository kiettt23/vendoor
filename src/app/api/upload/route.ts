import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { uploadImage } from "@/shared/lib/upload/cloudinary";
import { validateImageFile } from "@/shared/lib/upload";
import { auth } from "@/shared/lib/auth/config";
import { createLogger } from "@/shared/lib/utils/logger";

// ============================================
// POST /api/upload
// ============================================

export async function POST(request: NextRequest) {
  try {
    // 0. Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to upload images." },
        { status: 401 }
      );
    }

    // 1. Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2. Validate file using shared validation
    const validationResult = validateImageFile(file);
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    // 3. Upload to Cloudinary
    const result = await uploadImage(file, {
      folder: "vendoor/products",
      transformation: {
        width: 800,
        height: 800,
        crop: "fill",
        quality: "auto",
      },
    });

    // 4. Return result
    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    const logger = createLogger("UploadAPI");
    logger.error("Upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
