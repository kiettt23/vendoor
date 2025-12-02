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
  type LucideIcon,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

/**
 * Navigation item with icon (for sidebars, dashboards)
 */
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/**
 * Simple link item (for header, footer)
 */
export interface LinkItem {
  href: string;
  label: string;
}

/**
 * Footer link section
 */
export interface FooterLinkSection {
  title: string;
  links: LinkItem[];
}

/**
 * Header icon button configuration
 */
export interface HeaderIconButton {
  id: string;
  icon: LucideIcon;
  href: string | null; // null = không có link trực tiếp (dropdown, action)
  label: string; // Tooltip/aria-label
  showOnMobile: boolean;
  requiresAuth: boolean;
  badge?: "cart"; // Loại badge cần hiển thị
}

// ============================================
// HEADER NAVIGATION
// ============================================

/**
 * Main header navigation (public pages)
 */
export const HEADER_NAV_ITEMS: LinkItem[] = [
  { href: "/", label: "Trang Chủ" },
  { href: "/stores", label: "Cửa Hàng" },
  { href: "/products", label: "Sản Phẩm" },
  { href: "/flash-sale", label: "Flash Sale" },
  { href: "/support", label: "Hỗ Trợ" },
];

/**
 * Header icon buttons (right side)
 * Thứ tự trong array = thứ tự hiển thị
 */
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
    href: "/cart",
    label: "Giỏ hàng",
    showOnMobile: true,
    requiresAuth: false,
    badge: "cart",
  },
  {
    id: "wishlist",
    icon: Heart,
    href: "/wishlist",
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

/**
 * Header category suggestions (search dropdown)
 */
export const HEADER_CATEGORIES = [
  "Điện thoại",
  "Laptop",
  "Tablet",
  "Phụ kiện",
  "Đồng hồ thông minh",
  "Tai nghe",
  "Gaming",
  "Smart Home",
] as const;

// ============================================
// FOOTER NAVIGATION
// ============================================

/**
 * Footer link sections
 */
export const FOOTER_LINKS: Record<string, FooterLinkSection> = {
  shop: {
    title: "Danh mục",
    links: [
      { href: "/products?category=dien-thoai", label: "Điện thoại" },
      { href: "/products?category=laptop", label: "Laptop" },
      { href: "/products?category=tablet", label: "Tablet" },
      { href: "/products?category=phu-kien", label: "Phụ kiện" },
      { href: "/products?category=gaming", label: "Gaming" },
    ],
  },
  seller: {
    title: "Người bán",
    links: [
      { href: "/become-vendor", label: "Đăng ký bán hàng" },
      { href: "/vendor", label: "Seller Center" },
      { href: "/seller/policy", label: "Chính sách người bán" },
      { href: "/seller/guide", label: "Hướng dẫn bán hàng" },
    ],
  },
  support: {
    title: "Hỗ trợ",
    links: [
      { href: "/help", label: "Trung tâm trợ giúp" },
      { href: "/orders", label: "Theo dõi đơn hàng" },
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

// ============================================
// VENDOR DASHBOARD NAVIGATION
// ============================================

/**
 * Vendor dashboard sidebar navigation
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
    href: "/vendor/reviews",
    label: "Đánh giá",
    icon: Star,
  },
  {
    href: "/vendor/earnings",
    label: "Doanh thu",
    icon: DollarSign,
  },
];

// ============================================
// ADMIN DASHBOARD NAVIGATION
// ============================================

/**
 * Admin dashboard sidebar navigation
 */
export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
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
  {
    href: "/admin/vendors",
    label: "Vendors",
    icon: Users,
  },
];
