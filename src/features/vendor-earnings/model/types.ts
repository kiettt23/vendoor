export interface EarningsSummary {
  totalEarnings: number;
  pendingEarnings: number;
  completedEarnings: number;
  totalOrders: number;
  totalPlatformFee: number;
}

export interface EarningsTransaction {
  id: string;
  orderNumber: string;
  subtotal: number;
  platformFee: number;
  vendorEarnings: number;
  status: string;
  createdAt: Date;
  customerName: string;
}

export interface MonthlyEarnings {
  month: string;
  earnings: number;
  orders: number;
}
