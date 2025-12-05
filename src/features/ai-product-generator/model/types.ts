import { z } from "zod";

/**
 * Response schema từ AI khi phân tích hình ảnh sản phẩm
 */
export const AIProductInfoSchema = z.object({
  name: z.string().describe("Tên sản phẩm gợi ý"),
  shortDescription: z.string().describe("Mô tả ngắn (1-2 câu)"),
  description: z.string().describe("Mô tả chi tiết"),
  suggestedCategory: z.string().describe("Gợi ý danh mục phù hợp"),
  tags: z.array(z.string()).describe("Keywords/tags liên quan"),
  estimatedPriceRange: z
    .object({
      min: z.number(),
      max: z.number(),
      currency: z.literal("VND"),
    })
    .nullable()
    .optional()
    .describe("Ước tính khoảng giá (nếu có thể)"),
});

export type AIProductInfo = z.infer<typeof AIProductInfoSchema>;

/**
 * Input cho action generate
 */
export interface GenerateProductInfoInput {
  imageBase64: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  existingCategories?: string[];
}
