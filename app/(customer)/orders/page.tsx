"use client";
import PageTitle from "@/shared/components/ui/PageTitle";
import { useEffect, useState } from "react";
import { OrderItem } from "@/features/orders/index.client";
import { useSession } from "@/features/auth/index.client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUserOrders } from "@/features/orders/index.server";
import { OrderListSkeleton } from "@/shared/components/ui/OrderSkeleton";
import { Card, CardContent } from "@/shared/components/ui/card";
import { PackageIcon } from "lucide-react";
import type { Order } from "@/features/orders/types/order.types";

export default function Orders() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data as any);
        setLoading(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Đã có lỗi xảy ra"
        );
      }
    };
    if (!isPending) {
      if (user) {
        fetchOrders();
      } else {
        router.push("/");
      }
    }
  }, [isPending, user, router]);

  if (isPending || loading) {
    return (
      <div className="min-h-[70vh] my-20 max-w-7xl mx-auto px-6">
        <PageTitle
          heading="Đơn hàng của tôi"
          text="Đang tải..."
          linkText="Trang chủ"
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
            heading="Đơn hàng của tôi"
            text={`Hiển thị ${orders.length} đơn hàng`}
            linkText="Trang chủ"
          />

          <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
            <thead>
              <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                <th className="text-left">Tên sản phẩm</th>
                <th className="text-center">Tổng tiền</th>
                <th className="text-left">Địa chỉ</th>
                <th className="text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderItem order={order as any} key={order.id} />
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
              Chưa có đơn hàng
            </h1>
            <p className="text-slate-500">Bạn chưa có đơn hàng nào</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
