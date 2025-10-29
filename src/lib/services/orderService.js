import prisma from "@/lib/prisma";
import { NotFoundError, BadRequestError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/lib/constants/errorMessages";

const SHIPPING_FEE = 5;

class OrderService {
  async createOrder(userId, orderData, isPlusMember) {
    const { cart, couponCode, address, paymentMethod } = orderData;

    if (!cart || cart.length === 0 || !address || !paymentMethod) {
      throw new BadRequestError(ERROR_MESSAGES.MISSING_ORDER_DETAILS);
    }

    // Validate coupon if provided
    let coupon = null;
    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: { code: couponCode, expiresAt: { gt: new Date() } },
      });

      if (!coupon) {
        throw new NotFoundError(ERROR_MESSAGES.COUPON_NOT_FOUND);
      }

      // Validate coupon rules
      if (coupon.forNewUser) {
        const userOrders = await prisma.order.findMany({ where: { userId } });
        if (userOrders.length > 0) {
          throw new BadRequestError(ERROR_MESSAGES.COUPON_FOR_NEW_USERS);
        }
      }

      if (coupon.forMember && !isPlusMember) {
        throw new BadRequestError(ERROR_MESSAGES.COUPON_FOR_MEMBERS);
      }
    }

    // Group cart items by store
    const storeGroups = {};
    for (const item of cart) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        include: { store: true },
      });

      if (!product) {
        throw new NotFoundError(`Product ${item.id} not found`);
      }

      const storeId = product.storeId;
      if (!storeGroups[storeId]) {
        storeGroups[storeId] = {
          items: [],
          total: 0,
          store: product.store,
        };
      }

      const itemTotal = product.price * item.quantity;
      storeGroups[storeId].items.push({
        product,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      });
      storeGroups[storeId].total += itemTotal;
    }

    // Create orders for each store
    const createdOrders = [];
    for (const [storeId, group] of Object.entries(storeGroups)) {
      let orderTotal = group.total;

      // Apply coupon discount
      if (coupon) {
        orderTotal = orderTotal - (orderTotal * coupon.discount) / 100;
      }

      // Add shipping fee if not a Plus member
      if (!isPlusMember) {
        orderTotal += SHIPPING_FEE;
      }

      // Create order
      const order = await prisma.order.create({
        data: {
          userId,
          storeId,
          addressId: address,
          total: orderTotal,
          paymentMethod,
          status: "ORDER_PLACED",
          isPaid: paymentMethod === "STRIPE" ? false : false,
          isCouponUsed: !!coupon,
          coupon: coupon ? JSON.parse(JSON.stringify(coupon)) : {},
        },
      });

      // Create order items
      for (const item of group.items) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.price,
          },
        });
      }

      createdOrders.push(order);
    }

    return createdOrders;
  }

  async getUserOrders(userId) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { product: true },
        },
        store: true,
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  }

  async getStoreOrders(storeId) {
    const orders = await prisma.order.findMany({
      where: { storeId },
      include: {
        orderItems: {
          include: { product: true },
        },
        user: {
          select: { name: true, email: true },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  }

  async updateOrderStatus(orderId, storeId, status) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, storeId },
    });

    if (!order) {
      throw new NotFoundError(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return updatedOrder;
  }
}

export const orderService = new OrderService();
