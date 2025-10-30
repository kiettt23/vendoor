import prisma from "@/infra/prisma";

const authSeller = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { store: true },
    });

    if (!user || !user.store) {
      return false;
    }

    if (user.store && user.store.status === "approved") {
      return user.store.id;
    }

    return false;
  } catch (error) {
    console.error("[authSeller] Error:", error);
    return false;
  }
};

export default authSeller;
