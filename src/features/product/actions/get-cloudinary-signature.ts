"use server";

import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";

// ============================================
// CONFIG
// ============================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ============================================
// GET CLOUDINARY SIGNATURE
// ============================================

interface GetCloudinarySignatureResult {
  success: boolean;
  signature?: {
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    folder: string;
  };
  error?: string;
}

export async function getCloudinarySignature(): Promise<GetCloudinarySignatureResult> {
  try {
    // 1. Check auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // 2. Check if user is vendor
    if (!session.user.roles?.includes("VENDOR")) {
      return {
        success: false,
        error: "Only vendors can upload product images",
      };
    }

    // 3. Generate signature
    const timestamp = Math.round(Date.now() / 1000);
    const folder = "vendoor/products";

    // Sign the upload parameters
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    // 4. Return signature
    return {
      success: true,
      signature: {
        signature,
        timestamp,
        apiKey: process.env.CLOUDINARY_API_KEY!,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
        folder,
      },
    };
  } catch (error) {
    console.error("[getCloudinarySignature] Error:", error);
    return {
      success: false,
      error: "Failed to generate signature",
    };
  }
}
