import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

/**
 * Global 404 page
 * Shown when no route matches
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-6xl font-bold mb-3">404</h1>

        <h2 className="text-2xl font-semibold mb-3">Không tìm thấy trang</h2>

        <p className="text-muted-foreground mb-6">
          Trang bạn đang tìm kiếm không tồn tại.
        </p>

        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
}
