"use client";
import { useState } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/lib/actions/seller/order.action";
import OrderModal from "./OrderModal";

type OrderStatus = "ORDER_PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED";

interface OrderItem {
  productId: string;
  orderId: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    price: number;
    images: string[];
  };
}

interface Order {
  id: string;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  isCouponUsed: boolean;
  user?: {
    name: string;
  };
  coupon?: any;
  address: {
    createdAt: string;
    [key: string]: any;
  };
  orderItems: OrderItem[];
}

interface StoreOrdersClientProps {
  orders: Order[];
}

export default function StoreOrdersClient({
  orders: initialOrders,
}: StoreOrdersClientProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const result = await updateOrderStatus(orderId, status as OrderStatus);
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    }
  };

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <h1 className="text-2xl text-slate-500 mb-5">
        Store <span className="text-slate-800 font-medium">Orders</span>
      </h1>
      {initialOrders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="overflow-x-auto max-w-4xl rounded-md shadow border border-gray-200">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
              <tr>
                {[
                  "Sr. No.",
                  "Customer",
                  "Total",
                  "Payment",
                  "Coupon",
                  "Status",
                  "Date",
                ].map((heading, i) => (
                  <th key={i} className="px-4 py-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => openModal(order)}
                >
                  <td className="pl-6 text-purple-600">{index + 1}</td>
                  <td className="px-4 py-3">{order.user?.name}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {order.total}đ
                  </td>
                  <td className="px-4 py-3">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    {order.isCouponUsed ? (
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                        {order.coupon?.code || "—"}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateOrderStatus(order.id, e.target.value)
                      }
                      className="border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200"
                    >
                      <option value="ORDER_PLACED">ORDER_PLACED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && <OrderModal order={selectedOrder} onClose={closeModal} />}
    </>
  );
}
