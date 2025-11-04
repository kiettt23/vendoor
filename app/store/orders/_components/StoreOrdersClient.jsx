"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { updateOrderStatus } from "../actions";
import OrderModal from "./OrderModal";

export default function StoreOrdersClient({ orders: initialOrders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const result = await updateOrderStatus(orderId, status);
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openModal = (order) => {
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
