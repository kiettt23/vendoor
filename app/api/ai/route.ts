import { getAuth } from "@clerk/nextjs/server";
import { checkIsSeller } from "@/lib/auth/check-seller";
import { openai } from "@/configs/openai";
import { NextRequest, NextResponse } from "next/server";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

async function main(base64Image: string, mimeType: string) {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a product listing assistant for a Vietnamese e-commerce store. Your job is to analyze an image of a product and generate structured data including pricing estimation.
      
      Respond ONLY with raw JSON (no code block, no markdown, no explanation). 
      The JSON must strictly follow this schema:
      
      {
        "name": string,          // Product name in ENGLISH (keep brand names and technical terms in original language)
        "description": string,    // Marketing-friendly description in VIETNAMESE language (use Vietnamese for all descriptions)
        "category": string,       // Category in ENGLISH (e.g., "Electronics", "Fashion", "Home", "Beauty", "Sports", "Books", "Toys")
        "mrp": number,            // Estimated market retail price in VND (Vietnamese Dong)
        "price": number           // Suggested selling price in VND (typically 5-20% lower than MRP for competitive pricing)
      }
      
      IMPORTANT PRICING RULES:
      - Estimate prices based on product type, brand, and condition visible in image
      - Use realistic Vietnamese market prices (e.g., iPhone: 20,000,000-40,000,000 VND, T-shirt: 100,000-500,000 VND)
      - MRP should be the typical market price
      - Price should be slightly lower than MRP to be competitive (5-20% discount)
      - Round prices nicely (e.g., 250,000 instead of 247,583)
      
      EXAMPLES:
      - iPhone 15 Pro: {"mrp": 30000000, "price": 27000000}
      - Basic T-shirt: {"mrp": 200000, "price": 180000}
      - Coffee Maker: {"mrp": 2000000, "price": 1800000}
      
      LANGUAGE RULES:
      - "name" must be in English (e.g., "Samsung Freestyle Projector", "iPhone 15 Pro Max")
      - "description" must be in Vietnamese (e.g., "Máy chiếu di động với chất lượng hình ảnh tuyệt vời...")
      - "category" must be in English`,
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Phân tích hình ảnh này và trả về tên sản phẩm (tiếng Anh), mô tả (tiếng Việt), danh mục (tiếng Anh), và đoán giá phù hợp với thị trường Việt Nam.",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`,
          },
        },
      ],
    },
  ] as ChatCompletionMessageParam[];

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages,
  });

  const raw = response.choices[0].message.content;

  // remove ```json or ``` wrappers if present
  const cleaned = raw?.replace(/```json|```/g, "").trim() || "";

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    throw new Error("AI did not return valid JSON.");
  }
  return parsed;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    const { isSeller } = await checkIsSeller();

    if (!isSeller) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const { base64Image, mimeType } = await request.json();
    const result = await main(base64Image, mimeType);

    return NextResponse.json({ ...result });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
