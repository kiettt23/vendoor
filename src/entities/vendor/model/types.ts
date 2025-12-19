import type { VendorProfileModel, VendorStatus } from "@/generated/prisma";

export type VendorProfile = VendorProfileModel;
export type { VendorStatus };

export interface VendorListItem {
  id: string;
  shopName: string;
  slug: string;
  status: VendorStatus;
  createdAt: Date;
  user: { name: string | null; email: string };
  _count: { orders: number };
}

export interface VendorDetail extends VendorProfile {
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
  _count: { orders: number };
}

export interface VendorDashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: Date;
  }[];
}

export interface FeaturedVendor {
  id: string;
  slug: string | null;
  name: string;
  logo: string | null;
  cover: string | null;
  rating: number;
  followers: string;
  products: number;
  location: string;
  verified: boolean;
  badge: string | null;
}

// ============================================================================
// For Admin
// ============================================================================

export interface AdminDashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  platformRevenue: number;
}

export interface AdminRecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: Date;
  customer: { name: string | null; email: string };
  vendor: { shopName: string };
}

export interface VendorDetailForAdmin {
  id: string;
  userId: string;
  shopName: string;
  slug: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  businessAddress: string | null;
  businessPhone: string | null;
  businessEmail: string | null;
  commissionRate: number;
  status: VendorStatus;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    email: string;
    phone: string | null;
    createdAt: Date;
  };
  _count: { orders: number };
  stats: {
    totalProducts: number;
    totalRevenue: number;
  };
}

// ============================================================================
// Guards
// ============================================================================

export interface VendorAuthResult {
  session: { user: { id: string } };
  user: {
    id: string;
    name: string | null;
    email: string;
    roles: string[];
  };
  vendorProfile: {
    id: string;
    shopName: string;
    status: string;
  };
}
