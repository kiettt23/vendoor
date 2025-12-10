import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  FolderTree,
  Search,
  Heart,
  User,
  Star,
  Warehouse,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface LinkItem {
  href: string;
  label: string;
}

export interface FooterLinkSection {
  title: string;
  links: LinkItem[];
}

export interface HeaderIconButton {
  id: string;
  icon: LucideIcon;
  href: string | null; // null = không có link trực tiếp (dropdown, action)
  label: string; // Tooltip/aria-label
  showOnMobile: boolean;
  requiresAuth: boolean;
  badge?: "cart"; // Loại badge cần hiển thị
}

export const HEADER_NAV_ITEMS: LinkItem[] = [
  { href: ROUTES.HOME, label: "Trang Chủ" },
  { href: ROUTES.FLASH_SALE, label: "Flash Sale" },
  { href: ROUTES.PRODUCTS, label: "Sản Phẩm" },
  { href: ROUTES.STORES, label: "Cửa Hàng" },
];

export const HEADER_ICON_BUTTONS: HeaderIconButton[] = [
  {
    id: "search",
    icon: Search,
    href: null,
    label: "Tìm kiếm",
    showOnMobile: true,
    requiresAuth: false,
  },
  {
    id: "cart",
    icon: ShoppingCart,
    href: ROUTES.CART,
    label: "Giỏ hàng",
    showOnMobile: true,
    requiresAuth: false,
    badge: "cart",
  },
  {
    id: "wishlist",
    icon: Heart,
    href: ROUTES.WISHLIST,
    label: "Yêu thích",
    showOnMobile: false, // Ẩn trên mobile
    requiresAuth: false, // Vẫn cho xem, redirect login khi click
  },
  {
    id: "user",
    icon: User,
    href: null, // Dropdown menu
    label: "Tài khoản",
    showOnMobile: true,
    requiresAuth: false,
  },
];

// Header category suggestions (search dropdown)
export const HEADER_CATEGORIES = [
  { name: "Điện thoại", slug: "dien-thoai" },
  { name: "Laptop", slug: "laptop" },
  { name: "Tablet", slug: "tablet" },
  { name: "Phụ kiện", slug: "phu-kien" },
  { name: "Tai nghe", slug: "tai-nghe" },
  { name: "Gaming", slug: "gaming" },
] as const;

export const FOOTER_LINKS: Record<string, FooterLinkSection> = {
  shop: {
    title: "Danh mục",
    links: [
      { href: `${ROUTES.PRODUCTS}?category=dien-thoai`, label: "Điện thoại" },
      { href: `${ROUTES.PRODUCTS}?category=laptop`, label: "Laptop" },
      { href: `${ROUTES.PRODUCTS}?category=tablet`, label: "Tablet" },
      { href: `${ROUTES.PRODUCTS}?category=phu-kien`, label: "Phụ kiện" },
      { href: `${ROUTES.PRODUCTS}?category=gaming`, label: "Gaming" },
    ],
  },
  seller: {
    title: "Người bán",
    links: [
      { href: ROUTES.BECOME_VENDOR, label: "Đăng ký bán hàng" },
      { href: ROUTES.VENDOR_DASHBOARD, label: "Seller Center" },
      { href: "/seller/policy", label: "Chính sách người bán" },
      { href: "/seller/guide", label: "Hướng dẫn bán hàng" },
    ],
  },
  support: {
    title: "Hỗ trợ",
    links: [
      { href: "/help", label: "Trung tâm trợ giúp" },
      { href: ROUTES.ORDERS, label: "Theo dõi đơn hàng" },
      { href: "/returns", label: "Chính sách đổi trả" },
      { href: "/contact", label: "Liên hệ" },
    ],
  },
  company: {
    title: "Về Vendoor",
    links: [
      { href: "/about", label: "Giới thiệu" },
      { href: "/careers", label: "Tuyển dụng" },
      { href: "/terms", label: "Điều khoản sử dụng" },
      { href: "/privacy", label: "Chính sách bảo mật" },
    ],
  },
};

export const VENDOR_NAV_ITEMS: NavItem[] = [
  {
    href: ROUTES.VENDOR_DASHBOARD,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: ROUTES.VENDOR_PRODUCTS,
    label: "Sản phẩm",
    icon: Package,
  },
  {
    href: ROUTES.VENDOR_INVENTORY,
    label: "Tồn kho",
    icon: Warehouse,
  },
  {
    href: ROUTES.VENDOR_ORDERS,
    label: "Đơn hàng",
    icon: ShoppingCart,
  },
  {
    href: ROUTES.VENDOR_REVIEWS,
    label: "Đánh giá",
    icon: Star,
  },
  {
    href: ROUTES.VENDOR_ANALYTICS,
    label: "Phân tích",
    icon: BarChart3,
  },
  {
    href: ROUTES.VENDOR_EARNINGS,
    label: "Doanh thu",
    icon: DollarSign,
  },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    href: ROUTES.ADMIN_DASHBOARD,
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    href: ROUTES.ADMIN_ORDERS,
    label: "Đơn hàng",
    icon: ShoppingCart,
  },
  {
    href: ROUTES.ADMIN_CATEGORIES,
    label: "Danh mục",
    icon: FolderTree,
  },
  {
    href: ROUTES.ADMIN_VENDORS,
    label: "Vendors",
    icon: Users,
  },
];

export const DASHBOARD_CONFIG = {
  vendor: {
    title: "Vendor Dashboard",
    baseRoute: ROUTES.VENDOR_DASHBOARD,
    navItems: VENDOR_NAV_ITEMS,
  },
  admin: {
    title: "Admin Panel",
    baseRoute: ROUTES.ADMIN_DASHBOARD,
    navItems: ADMIN_NAV_ITEMS,
  },
} as const;

export type DashboardType = keyof typeof DASHBOARD_CONFIG;
