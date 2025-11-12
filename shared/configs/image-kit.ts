import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

/**
 * Helper function to upload image to ImageKit
 */
export async function uploadToImageKit(
  imageFile: File,
  folder: string = "uploads"
): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    if (!imageFile || imageFile.size === 0) {
      return { success: false, message: "No image file provided" };
    }

    // Convert File to Buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension
    const fileExt = imageFile.name.split(".").pop() || "jpg";
    const fileName = `${folder}-${Date.now()}.${fileExt}`;

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName,
      folder: `/${folder}`,
    });

    return {
      success: true,
      url: uploadResponse.url,
      message: "Upload successful",
    };
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export default imagekit;
