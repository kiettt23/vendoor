"use server";

import OpenAI from "openai";

import { ok, err, type Result, createLogger } from "@/shared/lib/utils";

import {
  AIProductInfoSchema,
  type AIProductInfo,
  type GenerateProductInfoInput,
} from "../model";

const logger = createLogger("ai-product-generator");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const MODEL = process.env.OPENAI_MODEL || "gemini-2.0-flash";

function buildPrompt(existingCategories?: string[]): string {
  const categoryHint = existingCategories?.length
    ? `\nDanh mục có sẵn: ${existingCategories.join(", ")}. Ưu tiên chọn từ danh sách này.`
    : "";

  return `Phân tích hình ảnh sản phẩm và trả về JSON (tiếng Việt).
${categoryHint}

Yêu cầu:
- name: Tên sản phẩm ngắn gọn, hấp dẫn
- shortDescription: Mô tả 1-2 câu về điểm nổi bật
- description: Mô tả chi tiết 3-5 câu (tính năng, chất liệu, công dụng)
- suggestedCategory: 1 danh mục phù hợp nhất
- tags: 3-5 từ khóa SEO
- estimatedPriceRange: null (bỏ qua field này)

CHỈ trả về JSON, không giải thích:
{"name":"...","shortDescription":"...","description":"...","suggestedCategory":"...","tags":["..."],"estimatedPriceRange":null}`;
}

export async function generateProductInfo(
  input: GenerateProductInfoInput
): Promise<Result<AIProductInfo>> {
  try {
    const { imageBase64, mimeType, existingCategories } = input;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: buildPrompt(existingCategories),
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return err("AI không trả về kết quả");
    }

    // Parse JSON response - handle various AI response formats
    let jsonString = content.trim();
    
    // Remove markdown code blocks if present
    jsonString = jsonString.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    
    // Try to extract JSON from response if AI added extra text
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.error("AI returned non-JSON response:", content);
      return err("AI không trả về định dạng JSON hợp lệ");
    }
    
    jsonString = jsonMatch[0];

    const parsed = JSON.parse(jsonString);
    const validated = AIProductInfoSchema.parse(parsed);

    return ok(validated);
  } catch (error) {
    logger.error("AI Generation Error:", error);

    if (error instanceof SyntaxError) {
      return err("Không thể parse response từ AI");
    }

    // Handle API errors with status codes
    if (error && typeof error === "object" && "status" in error) {
      const status = (error as { status: number }).status;
      if (status === 429) {
        return err("Đã vượt quá giới hạn request AI, vui lòng thử lại sau 1 phút");
      }
      if (status === 401 || status === 403) {
        return err("Lỗi xác thực API key");
      }
    }

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return err("Lỗi cấu hình API key");
      }
      if (error.message.includes("rate limit") || error.message.includes("429")) {
        return err("Đã vượt quá giới hạn request AI, vui lòng thử lại sau 1 phút");
      }
    }

    return err("Không thể phân tích hình ảnh. Vui lòng thử lại.");
  }
}
