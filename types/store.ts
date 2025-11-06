/**
 * Store Types
 * Cửa hàng
 */

import type { Product } from "./product";
import type { Order } from "./order";

export interface Store {
  id: string;
  userId: string;
  name: string;
  description: string;
  username: string;
  address: string;
  status: string; // "pending" | "approved" | "rejected"
  isActive: boolean;
  logo: string;
  email: string;
  contact: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Relations
  products?: Product[];
  orders?: Order[];
}

/**
 * Store Info - Thông tin cơ bản cho seller check
 */
export interface StoreInfo {
  id: string;
  name: string;
  username: string;
  logo: string;
  status: string;
  isActive: boolean;
}

/**
 * Store với thống kê
 */
export interface StoreWithStats extends Store {
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  averageRating?: number;
}

/**
 * Store Form Data - Cho việc tạo/cập nhật store
 */
export interface StoreFormData {
  name: string;
  description: string;
  username: string;
  address: string;
  logo: string;
  email: string;
  contact: string;
}
