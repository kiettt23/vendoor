/**
 * useAIImageAnalysis - Reusable AI image analysis hook
 * Separates AI logic from UI components
 */

import { useState } from "react";
import toast from "react-hot-toast";

interface AIAnalysisResult {
  name: string;
  description: string;
  category?: string;
  mrp?: number;
  price?: number;
}

export function useAIImageAnalysis() {
  const [aiUsed, setAiUsed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeImage = async (
    file: File | string
  ): Promise<AIAnalysisResult | null> => {
    let imageUrl: string;

    // Convert File to URL if needed
    if (file instanceof File) {
      imageUrl = URL.createObjectURL(file);
    } else {
      imageUrl = file;
    }

    if (!imageUrl) {
      toast.error("Vui lòng tải lên ảnh trước");
      return null;
    }

    if (aiUsed) {
      toast("Bạn chỉ có thể sử dụng AI một lần cho mỗi sản phẩm", {
        icon: "⚠️",
      });
      return null;
    }

    setAnalyzing(true);

    try {
      const response = await fetch("/api/ai/image-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setAiUsed(true);
        toast.success("Đã phân tích ảnh thành công!");

        return {
          name: data.analysis.name || "",
          description: data.analysis.description || "",
          category: data.analysis.category || "",
          mrp: data.analysis.mrp || 0,
          price: data.analysis.price || 0,
        };
      } else {
        toast.error(data.error || "Không thể phân tích ảnh");
        return null;
      }
    } catch (error) {
      console.error("AI Analysis Error:", error);
      toast.error("Có lỗi xảy ra khi phân tích ảnh");
      return null;
    } finally {
      setAnalyzing(false);
      // Cleanup object URL if created
      if (file instanceof File) {
        URL.revokeObjectURL(imageUrl);
      }
    }
  };

  return {
    analyzeImage,
    aiUsed,
    analyzing,
  };
}
