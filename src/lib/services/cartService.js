import prisma from "@/lib/prisma";

class CartService {
  async saveCart(userId, cart) {
    await prisma.cart.upsert({
      where: { userId },
      update: { items: cart },
      create: { userId, items: cart },
    });

    return { success: true };
  }

  async getCart(userId) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    return cart?.items || [];
  }

  async clearCart(userId) {
    await prisma.cart.delete({
      where: { userId },
    });

    return { success: true };
  }
}

export const cartService = new CartService();
