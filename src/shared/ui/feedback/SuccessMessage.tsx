import { CheckCircle2, Check } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/ui/alert";
import { cn } from "@/shared/lib/utils/cn";

/**
 * Reusable success message components
 * Used across all routes for consistent success feedback
 */

interface SuccessMessageProps {
  title?: string;
  message: string;
  className?: string;
}

/**
 * Generic success message component
 *
 * @example
 * <SuccessMessage
 *   title="Thành công!"
 *   message="Sản phẩm đã được tạo thành công"
 * />
 */
export function SuccessMessage({
  title = "Thành công!",
  message,
  className,
}: SuccessMessageProps) {
  return (
    <Alert
      variant="default"
      className={cn("border-green-500 bg-green-50 text-green-900", className)}
    >
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

/**
 * Inline success message (smaller, for forms)
 */
export function InlineSuccess({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <Check className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}

/**
 * Success banner (full width, dismissible)
 */
export function SuccessBanner({
  title,
  message,
  onDismiss,
}: SuccessMessageProps & { onDismiss?: () => void }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          {title && (
            <p className="font-semibold text-green-900 mb-1">{title}</p>
          )}
          <p className="text-sm text-green-800">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-green-600 hover:text-green-800 shrink-0"
            aria-label="Đóng"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Toast success helper (for use with sonner)
 *
 * @example
 * import { toast } from "sonner";
 * import { toastSuccess } from "@/shared/components/feedback/SuccessMessage";
 *
 * toastSuccess("Đã lưu thành công");
 */
export function toastSuccess(message: string, title = "Thành công") {
  // This is a helper, actual implementation will use sonner in components
  return { title, message };
}
