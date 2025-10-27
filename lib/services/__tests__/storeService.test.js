import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, BadRequestError } from "@/lib/errors/AppError";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    store: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Import after mocking
import prisma from "@/lib/prisma";
import { storeService } from "../storeService";

describe("StoreService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createStore", () => {
    it("should return existing store status if user already has a store", async () => {
      const userId = "user-123";
      const existingStore = { id: "store-123", userId, status: "APPROVED" };

      prisma.store.findFirst.mockResolvedValue(existingStore);

      const result = await storeService.createStore(userId, {}, "image.jpg");

      expect(result).toEqual({ status: "APPROVED" });
      expect(prisma.store.create).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if username is already taken", async () => {
      const userId = "user-123";
      const storeData = {
        username: "TakenUsername",
        name: "Test Store",
        email: "test@example.com",
        contact: "0123456789",
        address: "Test Address",
        description: "Test description",
      };

      prisma.store.findFirst
        .mockResolvedValueOnce(null) // No existing store for user
        .mockResolvedValueOnce({ username: "takenusername" }); // Username is taken

      await expect(
        storeService.createStore(userId, storeData, "image.jpg")
      ).rejects.toThrow(BadRequestError);
    });

    it("should create store successfully with PENDING status", async () => {
      const userId = "user-123";
      const storeData = {
        username: "NewStore",
        name: "New Store",
        email: "new@example.com",
        contact: "0123456789",
        address: "Store Address",
        description: "Store description",
      };
      const imageUrl = "store-image.jpg";

      const mockCreatedStore = {
        id: "store-new",
        userId,
        ...storeData,
        username: storeData.username.toLowerCase(),
        image: imageUrl,
        status: "PENDING",
        isActive: false,
      };

      prisma.store.findFirst
        .mockResolvedValueOnce(null) // No existing store
        .mockResolvedValueOnce(null); // Username not taken
      prisma.store.create.mockResolvedValue(mockCreatedStore);

      const result = await storeService.createStore(
        userId,
        storeData,
        imageUrl
      );

      expect(prisma.store.create).toHaveBeenCalledWith({
        data: {
          userId,
          name: storeData.name,
          username: "newstore", // Should be lowercase
          description: storeData.description,
          email: storeData.email,
          contact: storeData.contact,
          address: storeData.address,
          image: imageUrl,
          status: "PENDING",
          isActive: false,
        },
      });
      expect(result).toEqual({ status: "PENDING" });
    });
  });

  describe("getStoreByUserId", () => {
    it("should return store for user", async () => {
      const userId = "user-123";
      const mockStore = { id: "store-123", userId, name: "Test Store" };

      prisma.store.findFirst.mockResolvedValue(mockStore);

      const result = await storeService.getStoreByUserId(userId);

      expect(prisma.store.findFirst).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(mockStore);
    });

    it("should return null when user has no store", async () => {
      prisma.store.findFirst.mockResolvedValue(null);

      const result = await storeService.getStoreByUserId("user-no-store");

      expect(result).toBeNull();
    });
  });

  describe("getStoreByUsername", () => {
    it("should return active store by username with products", async () => {
      const mockStore = {
        id: "store-123",
        username: "teststore",
        isActive: true,
        Product: [
          { id: "p1", name: "Product 1", rating: [] },
          { id: "p2", name: "Product 2", rating: [] },
        ],
      };

      prisma.store.findUnique.mockResolvedValue(mockStore);

      const result = await storeService.getStoreByUsername("TestStore");

      expect(prisma.store.findUnique).toHaveBeenCalledWith({
        where: { username: "teststore", isActive: true },
        include: {
          Product: {
            include: {
              rating: true,
            },
          },
        },
      });
      expect(result).toEqual(mockStore);
    });

    it("should throw NotFoundError when store not found or inactive", async () => {
      prisma.store.findUnique.mockResolvedValue(null);

      await expect(
        storeService.getStoreByUsername("nonexistent")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getStoreById", () => {
    it("should return store by id with products", async () => {
      const mockStore = {
        id: "store-123",
        name: "Test Store",
        Product: [{ id: "p1" }, { id: "p2" }],
      };

      prisma.store.findUnique.mockResolvedValue(mockStore);

      const result = await storeService.getStoreById("store-123");

      expect(result).toEqual(mockStore);
    });

    it("should throw NotFoundError when store not found", async () => {
      prisma.store.findUnique.mockResolvedValue(null);

      await expect(storeService.getStoreById("non-existent")).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("approveStore", () => {
    it("should approve store and set isActive to true", async () => {
      const storeId = "store-123";

      await storeService.approveStore(storeId, "approved");

      expect(prisma.store.update).toHaveBeenCalledWith({
        where: { id: storeId },
        data: { status: "approved", isActive: true },
      });
    });

    it("should reject store without changing isActive", async () => {
      const storeId = "store-123";

      await storeService.approveStore(storeId, "rejected");

      expect(prisma.store.update).toHaveBeenCalledWith({
        where: { id: storeId },
        data: { status: "rejected" },
      });
    });
  });

  describe("toggleStoreStatus", () => {
    it("should toggle store isActive from true to false", async () => {
      const storeId = "store-123";
      const mockStore = { id: storeId, isActive: true };

      prisma.store.findUnique.mockResolvedValue(mockStore);

      await storeService.toggleStoreStatus(storeId);

      expect(prisma.store.update).toHaveBeenCalledWith({
        where: { id: storeId },
        data: { isActive: false },
      });
    });

    it("should toggle store isActive from false to true", async () => {
      const storeId = "store-123";
      const mockStore = { id: storeId, isActive: false };

      prisma.store.findUnique.mockResolvedValue(mockStore);

      await storeService.toggleStoreStatus(storeId);

      expect(prisma.store.update).toHaveBeenCalledWith({
        where: { id: storeId },
        data: { isActive: true },
      });
    });

    it("should throw NotFoundError when store not found", async () => {
      prisma.store.findUnique.mockResolvedValue(null);

      await expect(
        storeService.toggleStoreStatus("non-existent")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getStoreDashboard", () => {
    it("should return store with analytics", async () => {
      const mockStore = {
        id: "store-123",
        name: "Test Store",
        Product: [{ id: "p1" }, { id: "p2" }, { id: "p3" }],
        Order: [
          { id: "o1", total: 100000, orderItems: [] },
          { id: "o2", total: 200000, orderItems: [] },
          { id: "o3", total: 150000, orderItems: [] },
        ],
      };

      prisma.store.findUnique.mockResolvedValue(mockStore);

      const result = await storeService.getStoreDashboard("store-123");

      expect(result).toEqual({
        store: mockStore,
        analytics: {
          totalProducts: 3,
          totalOrders: 3,
          totalRevenue: 450000,
        },
      });
    });

    it("should throw NotFoundError when store not found", async () => {
      prisma.store.findUnique.mockResolvedValue(null);

      await expect(
        storeService.getStoreDashboard("non-existent")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getAllStores", () => {
    it("should return all stores with user info and product count", async () => {
      const mockStores = [
        {
          id: "s1",
          name: "Store 1",
          user: { name: "User 1", email: "user1@example.com" },
          _count: { Product: 5 },
        },
        {
          id: "s2",
          name: "Store 2",
          user: { name: "User 2", email: "user2@example.com" },
          _count: { Product: 3 },
        },
      ];

      prisma.store.findMany.mockResolvedValue(mockStores);

      const result = await storeService.getAllStores();

      expect(result).toEqual(mockStores);
      expect(result).toHaveLength(2);
    });
  });

  describe("getPendingStores", () => {
    it("should return pending and rejected stores", async () => {
      const mockStores = [
        { id: "s1", status: "pending", user: {} },
        { id: "s2", status: "rejected", user: {} },
      ];

      prisma.store.findMany.mockResolvedValue(mockStores);

      const result = await storeService.getPendingStores();

      expect(prisma.store.findMany).toHaveBeenCalledWith({
        where: { status: { in: ["pending", "rejected"] } },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockStores);
    });
  });
});
