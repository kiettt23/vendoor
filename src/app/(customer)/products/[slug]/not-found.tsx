import Link from "next/link";
import { Button } from "@/shared/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Không Tìm Thấy Sản Phẩm</h1>
      <p className="text-muted-foreground mb-8">
        Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <Link href="/products">
        <Button>Quay lại trang sản phẩm</Button>
      </Link>
    </div>
  );
}
