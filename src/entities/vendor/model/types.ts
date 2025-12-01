import type { VendorStatus } from "@prisma/client";

export interface VendorProfile {
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
}

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

/**
 * Admin Dashboard Stats
 */
export interface AdminDashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  platformRevenue: number;
}

/**
 * Admin Recent Order
 */
export interface AdminRecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: Date;
  customer: { name: string | null; email: string };
  vendor: { shopName: string };
}

/**
 * Vendor Detail for Admin
 */
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

export type { VendorStatus };
