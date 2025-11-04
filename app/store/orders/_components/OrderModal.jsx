export default function OrderModal({ order, onClose }) {
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
          Order Details
        </h2>

        {/* Customer Details */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Customer Details</h3>
          <p>
            <span className="text-green-700">Name:</span> {order.user?.name}
          </p>
          <p>
            <span className="text-green-700">Email:</span> {order.user?.email}
          </p>
          <p>
            <span className="text-green-700">Phone:</span>{" "}
            {order.address?.phone}
          </p>
          <p>
            <span className="text-green-700">Address:</span>{" "}
            {`${order.address?.street}, ${order.address?.city}, ${order.address?.state}, ${order.address?.zip}, ${order.address?.country}`}
          </p>
        </div>

        {/* Products */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Products</h3>
          <div className="space-y-2">
            {order.orderItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border border-slate-100 shadow rounded p-2"
              >
                <img
                  src={item.product.images?.[0].src || item.product.images?.[0]}
                  alt={item.product?.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-slate-800">{item.product?.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Status */}
        <div className="mb-4">
          <p>
            <span className="text-green-700">Payment Method:</span>{" "}
            {order.paymentMethod}
          </p>
          <p>
            <span className="text-green-700">Paid:</span>{" "}
            {order.isPaid ? "Yes" : "No"}
          </p>
          {order.isCouponUsed && (
            <p>
              <span className="text-green-700">Coupon:</span>{" "}
              {order.coupon?.code} ({order.coupon?.discount}% off)
            </p>
          )}
          <p>
            <span className="text-green-700">Status:</span> {order.status}
          </p>
          <p>
            <span className="text-green-700">Order Date:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
