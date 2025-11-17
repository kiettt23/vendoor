import { AlertCircle, XCircle, WifiOff, ServerCrash } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";

/**
 * Reusable error components
 * Used across all routes for consistent error handling
 */

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: "default" | "destructive";
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Generic error message component
 *
 * @example
 * <ErrorMessage
 *   title="Lỗi tải dữ liệu"
 *   message="Không thể tải danh sách sản phẩm. Vui lòng thử lại."
 *   action={{ label: "Thử lại", onClick: () => refetch() }}
 * />
 */
export function ErrorMessage({
  title = "Đã xảy ra lỗi",
  message,
  variant = "destructive",
  action,
}: ErrorMessageProps) {
  return (
    <Alert variant={variant} className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{message}</p>
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="mt-2"
          >
            {action.label}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Network error component
 */
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 rounded-full bg-destructive/10 p-6">
        <WifiOff className="h-10 w-10 text-destructive" />
      </div>

      <h3 className="text-lg font-semibold mb-2">Lỗi kết nối</h3>

      <p className="text-sm text-muted-foreground max-w-md mb-6">
        Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của
        bạn.
      </p>

      {onRetry && <Button onClick={onRetry}>Thử lại</Button>}
    </div>
  );
}

/**
 * Server error component (500)
 */
export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 rounded-full bg-destructive/10 p-6">
        <ServerCrash className="h-10 w-10 text-destructive" />
      </div>

      <h3 className="text-lg font-semibold mb-2">Lỗi máy chủ</h3>

      <p className="text-sm text-muted-foreground max-w-md mb-6">
        Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu
        vấn đề vẫn tiếp diễn.
      </p>

      {onRetry && <Button onClick={onRetry}>Thử lại</Button>}
    </div>
  );
}

/**
 * Validation error component
 */
export function ValidationError({ errors }: { errors: string[] }) {
  return (
    <Alert variant="destructive">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Dữ liệu không hợp lệ</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Form field error message (inline)
 */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-sm text-destructive mt-1">{message}</p>;
}

/**
 * Toast error helper (for use with sonner)
 *
 * @example
 * import { toast } from "sonner";
 * import { toastError } from "@/shared/components/feedback/ErrorMessage";
 *
 * toastError("Không thể tải dữ liệu");
 */
export function toastError(message: string, title = "Lỗi") {
  // This is a helper, actual implementation will use sonner in components
  return { title, message };
}
