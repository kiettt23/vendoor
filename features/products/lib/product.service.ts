import prisma from "@/shared/configs/prisma";
import imagekit from "@/shared/configs/image-kit";
import type { Prisma } from "@prisma/client";

interface CreateProductInput {
  name: string;
  description: string;
  mrp: number;
  price: number;
  category: string;
  images: File[];
  storeId: string;
}

interface UpdateProductInput {
  name?: string;
  description?: string;
  mrp?: number;
  price?: number;
  category?: string;
  newImages?: File[];
  existingImages?: string[];
}

export class ProductService {
  async getById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        rating: true,
        store: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });
  }

  async getByStoreId(storeId: string) {
    return prisma.product.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAll(filters?: {
    inStock?: boolean;
    storeActive?: boolean;
    category?: string;
  }) {
    const where: Prisma.ProductWhereInput = {};

    if (filters?.inStock !== undefined) {
      where.inStock = filters.inStock;
    }

    if (filters?.storeActive !== undefined) {
      where.store = { isActive: filters.storeActive };
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    return prisma.product.findMany({
      where,
      include: {
        rating: true,
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

  async create(userId: string, input: CreateProductInput) {
    const { name, description, mrp, price, category, images, storeId } = input;

    if (price > mrp) {
      throw new Error("Giá bán không thể cao hơn giá gốc");
    }

    if (images.length === 0) {
      throw new Error("Vui lòng tải lên ít nhất 1 hình ảnh");
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store || store.userId !== userId) {
      throw new Error("Không có quyền tạo sản phẩm cho cửa hàng này");
    }

    const imageUrls = await this.uploadImages(images, name);

    return prisma.product.create({
      data: {
        name,
        description,
        mrp,
        price,
        category,
        images: imageUrls,
        inStock: true,
        store: {
          connect: { id: storeId },
        },
      },
    });
  }

  async update(userId: string, productId: string, input: UpdateProductInput) {
    const product = await this.getById(productId);
    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }

    const store = await prisma.store.findUnique({
      where: { id: product.storeId },
    });

    if (!store || store.userId !== userId) {
      throw new Error("Không có quyền chỉnh sửa sản phẩm này");
    }

    if (input.price && input.mrp && input.price > input.mrp) {
      throw new Error("Giá bán không thể cao hơn giá gốc");
    }

    let imageUrls = input.existingImages || product.images;

    if (input.newImages && input.newImages.length > 0) {
      const newImageUrls = await this.uploadImages(
        input.newImages,
        input.name || product.name
      );
      imageUrls = [...imageUrls, ...newImageUrls];
    }

    return prisma.product.update({
      where: { id: productId },
      data: {
        ...input,
        images: imageUrls,
      },
    });
  }

  async delete(userId: string, productId: string) {
    const product = await this.getById(productId);
    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }

    const store = await prisma.store.findUnique({
      where: { id: product.storeId },
    });

    if (!store || store.userId !== userId) {
      throw new Error("Không có quyền xóa sản phẩm này");
    }

    return prisma.product.delete({
      where: { id: productId },
    });
  }

  async toggleStock(userId: string, productId: string) {
    const product = await this.getById(productId);
    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }

    const store = await prisma.store.findUnique({
      where: { id: product.storeId },
    });

    if (!store || store.userId !== userId) {
      throw new Error("Không có quyền thay đổi trạng thái sản phẩm này");
    }

    return prisma.product.update({
      where: { id: productId },
      data: { inStock: !product.inStock },
    });
  }

  private async uploadImages(
    images: File[],
    productName: string
  ): Promise<string[]> {
    const imageUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      if (file && file.size > 0) {
        try {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: `product-${productName.replace(/\s+/g, "-")}-${
              i + 1
            }-${Date.now()}.${file.name.split(".").pop()}`,
            folder: "/products",
          });

          imageUrls.push(uploadResponse.url);
        } catch (uploadError) {
          console.error(`Không thể tải ảnh ${i + 1}:`, uploadError);
        }
      }
    }

    if (imageUrls.length === 0) {
      throw new Error("Không thể tải lên hình ảnh. Vui lòng thử lại.");
    }

    return imageUrls;
  }
}

export const productService = new ProductService();
