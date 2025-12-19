"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Sparkles, Loader2, AlertCircle, CheckCircle } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { showToast, showErrorToast } from "@/shared/lib/constants";

import { generateProductInfo } from "../api";
import type { AIProductInfo } from "../model";

interface AIGenerateButtonProps {
  /** File ảnh để phân tích */
  imageFile: File | null;
  /** Danh sách categories có sẵn để AI gợi ý */
  existingCategories?: string[];
  /** Callback khi generate thành công */
  onGenerated: (info: AIProductInfo) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom className */
  className?: string;
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  }

export function AIGenerateButton({
  imageFile,
  existingCategories,
  onGenerated,
  disabled,
  className,
}: AIGenerateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!imageFile) {
      showErrorToast("imageRequired");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(imageFile.type)) {
      showErrorToast("invalidImageType");
      return;
    }

    // Validate file size (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      showErrorToast("imageTooLarge");
      return;
    }

    setIsLoading(true);
    setStatus("idle");

    try {
      // Convert file to base64
      const base64 = await fileToBase64(imageFile);

      const result = await generateProductInfo({
        imageBase64: base64,
        mimeType: imageFile.type as
          | "image/jpeg"
          | "image/png"
          | "image/webp"
          | "image/gif",
        existingCategories,
      });

      if (result.success) {
        setStatus("success");
        onGenerated(result.data);
        showToast("ai", "generated");
      } else {
        setStatus("error");
        showErrorToast("generic", result.error);
      }
    } catch (error) {
      console.error("AIGenerateButton error:", error);
      setStatus("error");
      showErrorToast("generic");
    } finally {
      setIsLoading(false);
      // Reset status after 3s
      timeoutRef.current = setTimeout(() => setStatus("idle"), 3000);
    }
  }, [imageFile, existingCategories, onGenerated]);

  const isDisabled = disabled || isLoading || !imageFile;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={isDisabled}
            className={className}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang phân tích...
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Đã tạo!
              </>
            ) : status === "error" ? (
              <>
                <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                Thử lại
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                AI Tự động điền
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {!imageFile
              ? "Upload hình ảnh trước để sử dụng AI"
              : "AI sẽ phân tích hình ảnh và điền các thông tin sản phẩm"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}