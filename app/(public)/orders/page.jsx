"use client";
import PageTitle from "@/components/ui/PageTitle";
import { useEffect, useState } from "react";
import OrderItem from "@/components/features/OrderItem";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";
import toast from "react-hot-toast";
import { vi } from "@/lib/i18n";

export default function Orders() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter;
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data.orders);
        setLoading(false);
      } catch (error) {
        toast.error(error?.response?.data?.error || error.message);
      }
    };
    if (isLoaded) {
      if (user) {
        fetchOrders();
      } else {
        router.push("/");
      }
    }
  }, [isLoaded, user, getToken, router]);

  if (!isLoaded || loading) {
    return <Loading></Loading>;
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
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
          <h1 className="text-2xl sm:text-4xl font-semibold">
            {vi.order.noOrders}
          </h1>
        </div>
      )}
    </div>
  );
}
