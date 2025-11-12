import prisma from "@/server/db/prisma";

export class CartService {
  async getCart(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { cart: true },
    });
    return (user?.cart as Record<string, number>) || {};
  }

  async getCartWithProducts(userId: string) {
    const cart = await this.getCart(userId);
    const productIds = Object.keys(cart);

    if (productIds.length === 0) {
      return { cart: {}, products: [] };
    }

    const products = await Promise.all(
      productIds.map((id) =>
        prisma.product.findUnique({
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
        })
      )
    );

    return {
      cart,
      products: products.filter((p) => p !== null),
    };
  }

  async addToCart(userId: string, productId: string, quantity: number = 1) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }

    if (!product.inStock) {
      throw new Error("Sản phẩm đã hết hàng");
    }

    const currentCart = await this.getCart(userId);
    const newCart = {
      ...currentCart,
      [productId]: (currentCart[productId] || 0) + quantity,
    };

    await prisma.user.update({
      where: { id: userId },
      data: { cart: newCart },
    });

    const total = Object.values(newCart).reduce((sum, qty) => sum + qty, 0);
    return { cart: newCart, total };
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    if (quantity < 0) {
      throw new Error("Số lượng không hợp lệ");
    }

    const currentCart = await this.getCart(userId);

    if (quantity === 0) {
      delete currentCart[productId];
    } else {
      currentCart[productId] = quantity;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { cart: currentCart },
    });

    const total = Object.values(currentCart).reduce((sum, qty) => sum + qty, 0);
    return { cart: currentCart, total };
  }

  async removeItem(userId: string, productId: string) {
    const currentCart = await this.getCart(userId);
    delete currentCart[productId];

    await prisma.user.update({
      where: { id: userId },
      data: { cart: currentCart },
    });

    const total = Object.values(currentCart).reduce((sum, qty) => sum + qty, 0);
    return { cart: currentCart, total };
  }

  async clearCart(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { cart: {} },
    });

    return { cart: {}, total: 0 };
  }

  async syncCart(userId: string, clientCart: Record<string, number>) {
    const serverCart = await this.getCart(userId);

    const mergedCart = { ...serverCart };
    for (const [productId, qty] of Object.entries(clientCart)) {
      mergedCart[productId] = (mergedCart[productId] || 0) + qty;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { cart: mergedCart },
    });

    const total = Object.values(mergedCart).reduce((sum, qty) => sum + qty, 0);
    return { cart: mergedCart, total };
  }
}

export const cartService = new CartService();
