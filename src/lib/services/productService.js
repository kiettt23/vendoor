import prisma from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/lib/constants/errorMessages";

class ProductService {
  async getProducts() {
    let products = await prisma.product.findMany({
      where: { inStock: true },
      include: {
        rating: {
          select: {
            createdAt: true,
            rating: true,
            review: true,
            user: { select: { name: true, image: true } },
          },
        },
        store: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Filter out products from inactive stores
    products = products.filter((product) => product.store.isActive);
    return products;
  }

  async getProductById(productId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        rating: {
          select: {
            createdAt: true,
            rating: true,
            review: true,
            user: { select: { name: true, image: true } },
          },
        },
        store: true,
      },
    });

    if (!product) {
      throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  async createProduct(storeId, productData) {
    const product = await prisma.product.create({
      data: {
        storeId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        mrp: productData.mrp,
        category: productData.category,
        images: productData.images,
        inStock: true,
      },
    });

    return product;
  }

  async getStoreProducts(storeId) {
    const products = await prisma.product.findMany({
      where: { storeId },
    });

    return products;
  }

  async toggleProductStock(productId, storeId) {
    const product = await prisma.product.findFirst({
      where: { id: productId, storeId },
    });

    if (!product) {
      throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { inStock: !product.inStock },
    });

    return updatedProduct;
  }

  async deleteProduct(productId, storeId) {
    const product = await prisma.product.findFirst({
      where: { id: productId, storeId },
    });

    if (!product) {
      throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return { success: true };
  }
}

export const productService = new ProductService();
