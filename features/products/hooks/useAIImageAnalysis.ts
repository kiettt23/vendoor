import { useState } from "react";
import { toast } from "sonner";

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
    if (!file) {
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

    const loadingToast = toast.loading("🤖 Đang phân tích hình ảnh bằng AI...");

    try {
      let base64Image: string;
      let mimeType: string;

      if (file instanceof File) {
        mimeType = file.type;
        base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const base64 = result.split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } else {
        const response = await fetch(file);
        const blob = await response.blob();
        mimeType = blob.type;
        base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const base64 = result.split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image, mimeType }),
      });

      const data = await response.json();

      if (data.error) {
        toast.dismiss(loadingToast);
        toast.error(data.error || "Không thể phân tích ảnh");
        return null;
      }

      toast.dismiss(loadingToast);
      setAiUsed(true);
      toast.success("✨ Đã phân tích ảnh thành công!");

      return {
        name: data.name || "",
        description: data.description || "",
        category: data.category || "",
        mrp: data.mrp || 0,
        price: data.price || 0,
      };
    } catch (error) {
      console.error("AI Analysis Error:", error);
      toast.dismiss(loadingToast);
      toast.error("Có lỗi xảy ra khi phân tích ảnh");
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAI = () => {
    setAiUsed(false);
    setAnalyzing(false);
  };

  return {
    analyzeImage,
    aiUsed,
    analyzing,
    resetAI,
  };
}
