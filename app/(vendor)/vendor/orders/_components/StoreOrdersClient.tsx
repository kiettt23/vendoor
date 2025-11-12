"use client";
import { useState } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/features/orders/index.server";
import OrderModal from "./OrderModal";
import { formatPrice } from "@/shared/lib/format/currency";

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
  coupon: any;
  user?: {
    name: string | null;
    email: string | null;
  };
  address: {
    userId: string;
    name: string;
    id: string;
    email: string;
    createdAt: string;
    street: string;
    city: string;
    state: string;
    phone: string;
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
        Quản lý <span className="text-slate-800 font-medium">Đơn hàng</span>
      </h1>
      {initialOrders.length === 0 ? (
        <p>Không có đơn hàng nào</p>
      ) : (
        <div className="overflow-x-auto max-w-4xl rounded-md shadow border border-gray-200">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
              <tr>
                {[
                  "STT",
                  "Khách hàng",
                  "Tổng tiền",
                  "Thanh toán",
                  "Mã giảm giá",
                  "Trạng thái",
                  "Ngày đặt",
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
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    {order.isCouponUsed && order.coupon && order.coupon.code ? (
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                        {order.coupon.code}
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
                      className={`border-none rounded-full px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-offset-1 ${
                        order.status === "ORDER_PLACED"
                          ? "bg-slate-100 text-slate-700 focus:ring-slate-300"
                          : order.status === "PROCESSING"
                          ? "bg-yellow-100 text-yellow-700 focus:ring-yellow-300"
                          : order.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-700 focus:ring-blue-300"
                          : order.status === "DELIVERED"
                          ? "bg-green-100 text-green-700 focus:ring-green-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <option value="ORDER_PLACED">Đã đặt hàng</option>
                      <option value="PROCESSING">Đang xử lý</option>
                      <option value="SHIPPED">Đang giao</option>
                      <option value="DELIVERED">Đã giao</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
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
