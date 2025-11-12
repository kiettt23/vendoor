import Image from "next/image";
import { formatPrice } from "@/shared/lib/format/currency";
import type { OrderWithDetails } from "@/features/orders/types/order.types";

interface OrderModalProps {
  order: OrderWithDetails;
  onClose: () => void;
}

export default function OrderModal({ order, onClose }: OrderModalProps) {
  if (!order) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black/50 text-slate-700 text-sm backdrop-blur-xs z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-semibold text-slate-900 mb-4 text-center">
          Chi tiết đơn hàng
        </h2>

        {/* Customer Details */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
          <p>
            <span className="text-purple-700">Tên:</span> {order.user?.name}
          </p>
          <p>
            <span className="text-purple-700">Email:</span> {order.user?.email}
          </p>
          <p>
            <span className="text-purple-700">SĐT:</span> {order.address?.phone}
          </p>
          <p>
            <span className="text-purple-700">Địa chỉ:</span>{" "}
            {`${order.address?.street}, ${order.address?.city}, ${order.address?.state}`}
          </p>
        </div>

        {/* Products */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Sản phẩm</h3>
          <div className="space-y-2">
            {order.orderItems.map((item: any, i: number) => (
              <div
                key={i}
                className="flex items-center gap-4 border border-slate-100 shadow rounded p-2"
              >
                <Image
                  src={
                    item.product.images?.[0]?.src ||
                    item.product.images?.[0] ||
                    "/images/avatar_placeholder.png"
                  }
                  alt={item.product?.name || "Product"}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-slate-800">{item.product?.name}</p>
                  <p>Số lượng: {item.quantity}</p>
                  <p>Giá: {formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Status */}
        <div className="mb-4">
          <p>
            <span className="text-purple-700">Phương thức thanh toán:</span>{" "}
            {order.paymentMethod}
          </p>
          <p>
            <span className="text-purple-700">Đã thanh toán:</span>{" "}
            {order.isPaid ? "Rồi" : "Chưa"}
          </p>
          {order.isCouponUsed &&
            order.coupon &&
            Object.keys(order.coupon).length > 0 &&
            order.coupon.code && (
              <p>
                <span className="text-purple-700">Mã giảm giá:</span>{" "}
                {order.coupon.code} (Giảm {order.coupon.discount}%)
              </p>
            )}
          <p>
            <span className="text-purple-700">Tổng tiền:</span>{" "}
            {formatPrice(order.total)}
          </p>
          <p>
            <span className="text-purple-700">Trạng thái:</span> {order.status}
          </p>
          <p>
            <span className="text-purple-700">Ngày đặt:</span>{" "}
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
