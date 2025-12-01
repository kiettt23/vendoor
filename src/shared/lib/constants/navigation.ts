import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  FolderTree,
  type LucideIcon,
} from "lucide-react";

/**
 * Navigation item definition
 */
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/**
 * Vendor dashboard navigation items
 */
export const VENDOR_NAV_ITEMS: NavItem[] = [
  {
    href: "/vendor",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/vendor/products",
    label: "Sản phẩm",
    icon: Package,
  },
  {
    href: "/vendor/orders",
    label: "Đơn hàng",
    icon: ShoppingCart,
  },
  {
    href: "/vendor/earnings",
    label: "Doanh thu",
    icon: DollarSign,
  },
] as const;

/**
 * Admin dashboard navigation items
 */
export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/vendors",
    label: "Vendors",
    icon: Users,
  },
  {
    href: "/admin/orders",
    label: "Đơn hàng",
    icon: ShoppingCart,
  },
  {
    href: "/admin/categories",
    label: "Danh mục",
    icon: FolderTree,
  },
] as const;
