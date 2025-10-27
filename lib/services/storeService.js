import prisma from "@/lib/prisma";
import { NotFoundError, BadRequestError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

class StoreService {
  async createStore(userId, storeData, imageUrl) {
    // Check if user already has a store
    const existingStore = await prisma.store.findFirst({
      where: { userId },
    });

    if (existingStore) {
      return { status: existingStore.status };
    }

    // Check if username is taken
    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: storeData.username.toLowerCase() },
    });

    if (isUsernameTaken) {
      throw new BadRequestError(ERROR_MESSAGES.USERNAME_ALREADY_TAKEN);
    }

    // Create store
    const store = await prisma.store.create({
      data: {
        userId,
        name: storeData.name,
        username: storeData.username.toLowerCase(),
        description: storeData.description,
        email: storeData.email,
        contact: storeData.contact,
        address: storeData.address,
        image: imageUrl,
        status: "PENDING",
        isActive: false,
      },
    });

    return { status: store.status };
  }

  async getStoreStatus(userId) {
    const store = await prisma.store.findFirst({
      where: { userId },
      select: { status: true },
    });

    return store;
  }

  async getStoreByUsername(username) {
    const store = await prisma.store.findUnique({
      where: { username: username.toLowerCase(), isActive: true },
      include: {
        Product: {
          include: {
            rating: true,
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundError(ERROR_MESSAGES.STORE_NOT_FOUND);
    }

    return store;
  }

  async getStoreById(storeId) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        Product: true,
      },
    });

    if (!store) {
      throw new NotFoundError(ERROR_MESSAGES.STORE_NOT_FOUND);
    }

    return store;
  }

  async getAllStores() {
    const stores = await prisma.store.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
        _count: {
          select: { Product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return stores;
  }

  async getPendingStores() {
    const stores = await prisma.store.findMany({
      where: { status: "PENDING" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return stores;
  }

  async approveStore(storeId, approved) {
    const store = await prisma.store.findFirst({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundError(ERROR_MESSAGES.STORE_NOT_FOUND);
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        status: approved ? "APPROVED" : "REJECTED",
        isActive: approved,
      },
    });

    return updatedStore;
  }

  async toggleStoreActive(storeId) {
    const store = await prisma.store.findFirst({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundError(ERROR_MESSAGES.STORE_NOT_FOUND);
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { isActive: !store.isActive },
    });

    return updatedStore;
  }

  async getStoreDashboard(storeId) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        Product: true,
        Order: {
          include: {
            orderItems: true,
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundError(ERROR_MESSAGES.STORE_NOT_FOUND);
    }

    // Calculate analytics
    const totalProducts = store.Product.length;
    const totalOrders = store.Order.length;
    const totalRevenue = store.Order.reduce(
      (sum, order) => sum + order.total,
      0
    );

    return {
      store,
      analytics: {
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    };
  }
}

export const storeService = new StoreService();
