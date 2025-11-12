"use server";

import { cache } from "react";
import prisma from "@/shared/configs/prisma";
import { getSession } from "@/features/auth/index.server";
import { cartService } from "../lib/cart.service";

export const getCart = cache(async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {};
  }

  return cartService.getCart(user.id);
});
