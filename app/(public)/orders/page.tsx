"use client";
import PageTitle from "@/components/ui/PageTitle";
import { useEffect, useState } from "react";
import OrderItem from "@/components/features/order/OrderItem";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { vi } from "@/lib/i18n";
import { getUserOrders } from "@/lib/actions/user/order.action";
import { OrderListSkeleton } from "@/components/ui/OrderSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { PackageIcon } from "lucide-react";

export default function Orders() {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (isLoaded) {
      if (user) {
        fetchOrders();
      } else {
        router.push("/");
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-[70vh] my-20 max-w-7xl mx-auto px-6">
        <PageTitle
          heading={vi.order.myOrders}
          text="Đang tải..."
          linkText={vi.nav.home}
        />
        <OrderListSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] mx-6">
      {orders.length > 0 ? (
        <div className="my-20 max-w-7xl mx-auto">
          <PageTitle
            heading={vi.order.myOrders}
            text={`Hiển thị ${orders.length} đơn hàng`}
            linkText={vi.nav.home}
          />

          <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
            <thead>
              <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                <th className="text-left">{vi.product.name}</th>
                <th className="text-center">{vi.order.orderTotal}</th>
                <th className="text-left">{vi.address.title}</th>
                <th className="text-left">{vi.order.orderStatus}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderItem order={order} key={order.id} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card className="min-h-[60vh] flex items-center justify-center">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <PackageIcon size={40} className="text-slate-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-2">
              {vi.order.noOrders}
            </h1>
            <p className="text-slate-500">Bạn chưa có đơn hàng nào</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
