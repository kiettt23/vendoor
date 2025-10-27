import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import imagekit from "@/configs/imageKit";
import { storeService } from "@/lib/services/storeService";
import { handleError } from "@/lib/errors/errorHandler";
import { BadRequestError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    const formData = await request.formData();
    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const address = formData.get("address");
    const image = formData.get("image");

    if (
      !name ||
      !username ||
      !description ||
      !email ||
      !contact ||
      !address ||
      !image
    ) {
      throw new BadRequestError(ERROR_MESSAGES.MISSING_STORE_INFO);
    }

    // Check if user already has a store
    const existingStore = await storeService.getStoreByUserId(userId);
    if (existingStore) {
      return NextResponse.json({ status: existingStore.status });
    }

    // Upload image to ImageKit
    const buffer = Buffer.from(await image.arrayBuffer());
    const response = await imagekit.upload({
      file: buffer,
      fileName: image.name,
      folder: "logos",
    });

    const optimizedImage = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "512" },
      ],
    });

    await storeService.createStore({
      userId,
      name,
      description,
      username: username.toLowerCase(),
      email,
      contact,
      address,
      logo: optimizedImage,
    });

    return NextResponse.json({ message: "applied, waiting for approval" });
  } catch (error) {
    return handleError(error, "Store Create POST");
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const store = await storeService.getStoreByUserId(userId);

    if (store) {
      return NextResponse.json({ status: store.status });
    }

    return NextResponse.json({ status: "not registered" });
  } catch (error) {
    return handleError(error, "Store Create GET");
  }
}
