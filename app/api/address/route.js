import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { addressService } from "@/lib/services/addressService";
import { handleError } from "@/lib/errors/errorHandler";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address } = await request.json();

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
