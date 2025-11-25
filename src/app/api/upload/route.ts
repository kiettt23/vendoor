import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/shared/lib/cloudinary";
import { auth } from "@/shared/lib/auth";
import { createLogger } from "@/shared/lib/logger";

// ============================================
// VALIDATION SCHEMA
// ============================================

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

    // 2. Validate file
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WEBP allowed" },
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
