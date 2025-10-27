import { NextResponse } from "next/server";
import { productService } from "@/lib/services/productService";
import { handleError } from "@/lib/errors/errorHandler";

export async function GET(request) {
  try {
    const products = await productService.getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    return handleError(error, "Products GET");
  }
}
