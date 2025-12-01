import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";

/**
 * Reusable empty state component
 * Used across all routes when no data is available
 */

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

/**
 * Generic empty state component
 *
 * @example
 * <EmptyState
 *   icon={Package}
 *   title="Chưa có sản phẩm"
 *   description="Bắt đầu bằng cách tạo sản phẩm đầu tiên của bạn"
 *   action={{
 *     label: "Tạo sản phẩm",
 *     href: "/vendor/products/new"
 *   }}
 * />
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-muted p-6">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
      )}

      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {description}
        </p>
      )}

      {action &&
        (action.href ? (
          <Button asChild>
            <a href={action.href}>{action.label}</a>
          </Button>
        ) : (
          <Button onClick={action.onClick}>{action.label}</Button>
        ))}
    </div>
  );
}

/**
 * Empty state for products page (customer view)
 */
export function EmptyProducts() {
  return (
    <EmptyState
      title="Không tìm thấy sản phẩm"
      description="Thử thay đổi bộ lọc hoặc tìm kiếm để xem các sản phẩm khác"
    />
  );
}

/**
 * Empty state for cart page
 */
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

/**
 * Empty state for orders page (customer view)
 */
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

/**
 * Empty state for vendor products
 */
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

/**
 * Empty state for vendor orders
 */
export function EmptyVendorOrders() {
  return (
    <EmptyState
      title="Chưa có đơn hàng"
      description="Bạn chưa nhận được đơn hàng nào. Đơn hàng sẽ xuất hiện ở đây khi có khách mua hàng."
    />
  );
}

/**
 * Empty state for admin vendors (pending approval)
 */
export function EmptyPendingVendors() {
  return (
    <EmptyState
      title="Không có vendor chờ duyệt"
      description="Tất cả các yêu cầu đăng ký vendor đã được xử lý"
    />
  );
}

/**
 * Empty state for admin categories
 */
export function EmptyCategories() {
  return (
    <EmptyState
      title="Chưa có danh mục"
      description="Tạo danh mục để phân loại sản phẩm trong hệ thống"
    />
  );
}

/**
 * Empty state for search results
 */
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
