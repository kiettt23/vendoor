import prisma from "@/infra/prisma";

class CartService {
  async saveCart(userId, cart) {
    // Skip if no userId (user not logged in)
    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }

    // Convert cart to object format if it's an array
    let cartObject = cart;
    if (Array.isArray(cart)) {
      cartObject = cart.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {});
    }

    // Update User.cart field instead of separate Cart model
    await prisma.user.update({
      where: { id: userId },
      data: { cart: cartObject },
    });

    return { success: true };
  }

  async getCart(userId) {
    // Return empty cart if no userId (user not logged in)
    if (!userId) {
      return {};
    }

    // Get cart from User.cart field
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { cart: true },
    });

    // Parse cart JSON if it exists, otherwise return empty object
    if (!user) return {};

    // If cart is already an object, return it
    if (typeof user.cart === "object") {
      return user.cart;
    }

    // If cart is a string, parse it
    try {
      return typeof user.cart === "string" ? JSON.parse(user.cart) : {};
    } catch (e) {
      return {};
    }
  }

  async clearCart(userId) {
    // Skip if no userId (user not logged in)
    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }

    // Clear User.cart field
    await prisma.user.update({
      where: { id: userId },
      data: { cart: {} },
    });

    return { success: true };
  }
}

export const cartService = new CartService();
