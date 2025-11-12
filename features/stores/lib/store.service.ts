import prisma from "@/server/db/prisma";
import imagekit from "@/configs/image-kit";
import type { Prisma } from "@prisma/client";

interface CreateStoreInput {
  name: string;
  username: string;
  description?: string;
  email: string;
  contact: string;
  address: string;
  logo?: File;
  userId: string;
}

interface UpdateStoreInput {
  name?: string;
  description?: string;
  email?: string;
  contact?: string;
  address?: string;
  logo?: File;
  logoUrl?: string;
}

export class StoreService {
  async getById(id: string) {
    return prisma.store.findUnique({
      where: { id },
    });
  }

  async getByUserId(userId: string) {
    return prisma.store.findUnique({
      where: { userId },
    });
  }

  async getByUsername(username: string) {
    return prisma.store.findUnique({
      where: { username },
      include: {
        Product: {
          where: { inStock: true },
          include: { rating: true },
        },
      },
    });
  }

  async getAll(filters?: { isActive?: boolean; isPending?: boolean }) {
    const where: Prisma.StoreWhereInput = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.isPending !== undefined) {
      where.status = filters.isPending ? "pending" : { not: "pending" };
    }

    return prisma.store.findMany({
      where,
      include: {
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

  async create(input: CreateStoreInput) {
    const existingStore = await this.getByUserId(input.userId);
    if (existingStore) {
      throw new Error("Bạn đã có cửa hàng rồi");
    }

    const existingUsername = await this.getByUsername(input.username);
    if (existingUsername) {
      throw new Error("Tên cửa hàng đã tồn tại");
    }

    let logoUrl = "";
    if (input.logo && input.logo.size > 0) {
      logoUrl = await this.uploadLogo(input.logo, input.name);
    }

    await prisma.user.update({
      where: { id: input.userId },
      data: { role: "SELLER" },
    });

    return prisma.store.create({
      data: {
        name: input.name,
        username: input.username,
        description: input.description || "",
        email: input.email,
        contact: input.contact,
        address: input.address,
        logo: logoUrl || "",
        isActive: false,
        status: "pending",
        user: {
          connect: { id: input.userId },
        },
      },
    });
  }

  async update(userId: string, storeId: string, input: UpdateStoreInput) {
    const store = await this.getById(storeId);
    if (!store || store.userId !== userId) {
      throw new Error("Không có quyền chỉnh sửa cửa hàng này");
    }

    let logoUrl = input.logoUrl || store.logo;
    if (input.logo && input.logo.size > 0) {
      logoUrl = await this.uploadLogo(input.logo, input.name || store.name);
    }

    return prisma.store.update({
      where: { id: storeId },
      data: {
        ...input,
        logo: logoUrl,
      },
    });
  }

  async approve(storeId: string) {
    const store = await this.getById(storeId);
    if (!store) {
      throw new Error("Cửa hàng không tồn tại");
    }

    await prisma.user.update({
      where: { id: store.userId },
      data: { role: "SELLER" },
    });

    return prisma.store.update({
      where: { id: storeId },
      data: {
        isActive: true,
        status: "approved",
      },
    });
  }

  async reject(storeId: string) {
    const store = await this.getById(storeId);
    if (!store) {
      throw new Error("Cửa hàng không tồn tại");
    }

    await prisma.user.update({
      where: { id: store.userId },
      data: { role: "USER" },
    });

    return prisma.store.update({
      where: { id: storeId },
      data: {
        isActive: false,
        status: "rejected",
      },
    });
  }

  async toggleStatus(storeId: string, isActive: boolean) {
    return prisma.store.update({
      where: { id: storeId },
      data: { isActive },
    });
  }

  private async uploadLogo(logo: File, storeName: string): Promise<string> {
    try {
      const bytes = await logo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `store-${storeName.replace(
          /\s+/g,
          "-"
        )}-${Date.now()}.${logo.name.split(".").pop()}`,
        folder: "/stores",
      });

      return uploadResponse.url;
    } catch (error) {
      console.error("Không thể tải logo:", error);
      throw new Error("Không thể tải lên logo. Vui lòng thử lại.");
    }
  }
}

export const storeService = new StoreService();
