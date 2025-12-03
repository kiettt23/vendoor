"use server";

import OpenAI from "openai";

import { ok, err, type Result } from "@/shared/lib/utils";

import {
  AIProductInfoSchema,
  type AIProductInfo,
  type GenerateProductInfoInput,
} from "../model";

// ============================================
// AI Product Generator Action
// ============================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const MODEL = process.env.OPENAI_MODEL || "gemini-2.0-flash";

/**
 * Prompt template cho việc phân tích hình ảnh sản phẩm
 */
function buildPrompt(existingCategories?: string[]): string {
  const categoryHint = existingCategories?.length
    ? `\nDanh mục có sẵn trong hệ thống: ${existingCategories.join(
        ", "
      )}. Ưu tiên gợi ý từ danh mục này nếu phù hợp.`
    : "";

  return `Bạn là chuyên gia phân tích sản phẩm e-commerce. Phân tích hình ảnh sản phẩm này và trả về thông tin dưới dạng JSON.
${categoryHint}

Yêu cầu:
1. name: Tên sản phẩm ngắn gọn, hấp dẫn (tiếng Việt)
2. shortDescription: Mô tả ngắn 1-2 câu highlight điểm nổi bật
3. description: Mô tả chi tiết 3-5 câu về tính năng, chất liệu, công dụng
4. suggestedCategory: Gợi ý 1 danh mục phù hợp nhất
5. tags: 3-5 keywords liên quan để SEO
6. estimatedPriceRange: Ước tính khoảng giá VND nếu có thể đoán được (optional)

Trả về CHÍNH XÁC định dạng JSON sau (không có markdown, không có text khác):
{
  "name": "string",
  "shortDescription": "string", 
  "description": "string",
  "suggestedCategory": "string",
  "tags": ["string"],
  "estimatedPriceRange": { "min": number, "max": number, "currency": "VND" }
}`;
}

/**
 * Generate thông tin sản phẩm từ hình ảnh bằng AI
 *
 * @param input - Hình ảnh base64 và metadata
 * @returns Thông tin sản phẩm được AI generate
 */
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

    // Parse JSON response
    // Gemini đôi khi wrap trong markdown code block
    const jsonString = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed = JSON.parse(jsonString);
    const validated = AIProductInfoSchema.parse(parsed);

    return ok(validated);
  } catch (error) {
    console.error("AI Generation Error:", error);

    if (error instanceof SyntaxError) {
      return err("Không thể parse response từ AI");
    }

    if (error instanceof Error) {
      // Check for API errors
      if (error.message.includes("API key")) {
        return err("Lỗi cấu hình API key");
      }
      if (error.message.includes("rate limit")) {
        return err("Đã vượt quá giới hạn request, vui lòng thử lại sau");
      }
    }

    return err("Không thể phân tích hình ảnh. Vui lòng thử lại.");
  }
}
