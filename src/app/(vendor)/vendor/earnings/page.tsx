import { requireRole } from "@/entities/user";
import { getCurrentVendorProfile } from "@/entities/vendor/api/queries";
import { redirect } from "next/navigation";
import {
  getVendorEarningsSummary,
  getVendorTransactions,
  getMonthlyEarnings,
  EarningsStats,
  EarningsChart,
  TransactionList,
} from "@/features/vendor-earnings";
import { ROUTES } from "@/shared/lib/constants";

export default async function EarningsPage() {
  await requireRole("VENDOR");
  
  const vendorProfile = await getCurrentVendorProfile();
  if (!vendorProfile) {
    redirect(ROUTES.BECOME_VENDOR);
  }

  const [summary, transactions, monthlyEarnings] = await Promise.all([
    getVendorEarningsSummary(vendorProfile.id),
    getVendorTransactions(vendorProfile.id),
    getMonthlyEarnings(vendorProfile.id),
  ]);

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Doanh thu</h1>
        <p className="text-muted-foreground">
          Quản lý thu nhập từ bán hàng của bạn
        </p>
      </div>

      <EarningsStats summary={summary} />

      <div className="grid gap-8 lg:grid-cols-2">
        <EarningsChart data={monthlyEarnings} />
        <div className="lg:col-span-2">
          <TransactionList
            transactions={transactions.transactions}
            total={transactions.total}
          />
        </div>
      </div>
    </div>
  );
}
