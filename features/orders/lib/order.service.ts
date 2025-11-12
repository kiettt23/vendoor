import prisma from "@/shared/configs/prisma";
import { cartService } from "@/features/cart/lib/cart.service";

interface CreateOrderInput {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  address: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
  couponCode?: string;
}

export class OrderService {
  async getById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        address: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        store: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });
  }

  async getByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        store: {
          select: {
            name: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getByStoreId(storeId: string) {
    return prisma.order.findMany({
      where: { storeId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        address: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(input: CreateOrderInput) {
    const { userId, items, address, paymentMethod, couponCode } = input;

    if (items.length === 0) {
      throw new Error("Giỏ hàng trống");
    }

    let subtotal = 0;
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Sản phẩm ${item.productId} không tồn tại`);
      }
      if (!product.inStock) {
        throw new Error(`Sản phẩm ${product.name} đã hết hàng`);
      }
      subtotal += item.price * item.quantity;
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (coupon) {
        const now = new Date();
        if (now <= coupon.expiresAt) {
          discount = coupon.discount;
        }
      }
    }

    const total = subtotal - discount;

    const firstItem = items[0];
    const firstProduct = await prisma.product.findUnique({
      where: { id: firstItem.productId },
    });

    if (!firstProduct) {
      throw new Error("Sản phẩm không tồn tại");
    }

    const addressRecord = await prisma.address.create({
      data: {
        userId,
        name: address.fullName,
        email: "",
        street: address.street,
        city: address.city,
        state: address.state,
        phone: address.phone,
      },
    });

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        store: { connect: { id: firstProduct.storeId } },
        address: { connect: { id: addressRecord.id } },
        total,
        paymentMethod: paymentMethod === "cod" ? "COD" : "STRIPE",
        status: "ORDER_PLACED",
        coupon: couponCode ? { code: couponCode, discount } : {},
        isCouponUsed: !!couponCode,
        orderItems: {
          create: items.map((item) => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    await cartService.clearCart(userId);

    return order;
  }

  async updateStatus(
    orderId: string,
    status:
      | "ORDER_PLACED"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED"
  ) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async cancel(userId: string, orderId: string) {
    const order = await this.getById(orderId);
    if (!order) {
      throw new Error("Đơn hàng không tồn tại");
    }

    if (order.userId !== userId) {
      throw new Error("Không có quyền hủy đơn hàng này");
    }

    if (order.status !== "ORDER_PLACED") {
      throw new Error("Chỉ có thể hủy đơn hàng đang chờ xử lý");
    }

    return this.updateStatus(orderId, "CANCELLED");
  }

  async getStats(storeId: string, days: number = 30) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        storeId,
        createdAt: {
          gte: date,
        },
      },
    });

    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum: number, order) => sum + order.total, 0),
      pendingOrders: orders.filter((o) => o.status === "ORDER_PLACED").length,
      completedOrders: orders.filter((o) => o.status === "DELIVERED").length,
    };

    return stats;
  }
}

export const orderService = new OrderService();
