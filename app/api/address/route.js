import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { addressService } from "@/core/services/addressService";
import { handleError } from "@/errors/errorHandler";
import { validateData } from "@/core/validations/validate";
import { saveAddressSchema } from "@/core/validations/schemas";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const body = await request.json();

    // ✨ Validate địa chỉ: phone 10 số, pincode 5-6 số, etc.
    const { address } = validateData(saveAddressSchema, { address: body });

    const newAddress = await addressService.saveAddress(userId, address);

    return NextResponse.json({
      newAddress,
      message: "Address added successfully",
    });
  } catch (error) {
    return handleError(error, "Address POST");
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const address = await addressService.getAddress(userId);

    return NextResponse.json({ address });
  } catch (error) {
    return handleError(error, "Address GET");
  }
}
