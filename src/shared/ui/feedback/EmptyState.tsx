import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/shared/ui/empty";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

/** Wrapper component sử dụng shadcn Empty làm base */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        {Icon && (
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
        )}
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && (
        <EmptyContent>
          {action.href ? (
            <Button asChild>
              <a href={action.href}>{action.label}</a>
            </Button>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </EmptyContent>
      )}
    </Empty>
  );
}

export function EmptyProducts() {
  return (
    <EmptyState
      title="Không tìm thấy sản phẩm"
      description="Thử thay đổi bộ lọc hoặc tìm kiếm để xem các sản phẩm khác"
    />
  );
}

export function EmptyCart() {
  return (
    <EmptyState
      title="Giỏ hàng trống"
      description="Bạn chưa thêm sản phẩm nào vào giỏ hàng"
      action={{
        label: "Tiếp tục mua sắm",
        href: "/products",
      }}
    />
  );
}

export function EmptyOrders() {
  return (
    <EmptyState
      title="Chưa có đơn hàng"
      description="Bạn chưa đặt đơn hàng nào. Hãy khám phá các sản phẩm và đặt hàng ngay!"
      action={{
        label: "Khám phá sản phẩm",
        href: "/products",
      }}
    />
  );
}

export function EmptyVendorProducts() {
  return (
    <EmptyState
      title="Chưa có sản phẩm"
      description="Bắt đầu bằng cách tạo sản phẩm đầu tiên của bạn"
      action={{
        label: "Tạo sản phẩm",
        href: "/vendor/products/new",
      }}
    />
  );
}

export function EmptyVendorOrders() {
  return (
    <EmptyState
      title="Chưa có đơn hàng"
      description="Bạn chưa nhận được đơn hàng nào. Đơn hàng sẽ xuất hiện ở đây khi có khách mua hàng."
    />
  );
}

export function EmptyPendingVendors() {
  return (
    <EmptyState
      title="Không có vendor chờ duyệt"
      description="Tất cả các yêu cầu đăng ký vendor đã được xử lý"
    />
  );
}

export function EmptyCategories() {
  return (
    <EmptyState
      title="Chưa có danh mục"
      description="Tạo danh mục để phân loại sản phẩm trong hệ thống"
    />
  );
}

export function EmptyWishlist() {
  return (
    <EmptyState
      title="Chưa có sản phẩm yêu thích"
      description="Hãy thêm sản phẩm vào danh sách yêu thích để theo dõi"
      action={{
        label: "Khám phá sản phẩm",
        href: "/products",
      }}
    />
  );
}

export function EmptySearchResults({ query }: { query?: string }) {
  return (
    <EmptyState
      title={
        query
          ? `Không tìm thấy kết quả cho "${query}"`
          : "Không tìm thấy kết quả"
      }
      description="Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả"
    />
  );
}

export function EmptyStoreProducts() {
  return (
    <EmptyState
      title="Chưa có sản phẩm nào"
      description="Cửa hàng này chưa đăng bán sản phẩm nào"
      action={{
        label: "Xem sản phẩm khác",
        href: "/products",
      }}
    />
  );
}
