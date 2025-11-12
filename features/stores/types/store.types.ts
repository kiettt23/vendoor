/**
 * Store Types
 */

export interface Store {
  id: string;
  userId: string;
  name: string;
  description: string;
  username: string;
  address: string;
  status: string;
  isActive: boolean;
  logo: string;
  email: string;
  contact: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StoreInfo {
  id: string;
  name: string;
  username: string;
  logo: string;
  status: string;
  isActive: boolean;
}

export interface StoreWithStats extends Store {
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  averageRating?: number;
}
