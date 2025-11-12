"use server";

import { requireAuth } from "@/features/auth/index.server";
import { storeService } from "../lib/store.service";
import type { ActionResponse } from "@/shared/types/action-response";

export async function getStoreInfo(): Promise<
  ActionResponse<{
    id: string;
    name: string;
    username: string;
    description: string;
    logo: string;
    email: string;
    contact: string;
    address: string;
    status: string;
    isActive: boolean;
  }>
> {
  try {
    const user = await requireAuth();

    const store = await storeService.getByUserId(user.id);

    if (!store) {
      return {
        success: false,
        error: "Không tìm thấy cửa hàng",
      };
    }

    return {
      success: true,
      data: {
        id: store.id,
        name: store.name,
        username: store.username,
        description: store.description,
        logo: store.logo,
        email: store.email,
        contact: store.contact,
        address: store.address,
        status: store.status,
        isActive: store.isActive,
      },
    };
  } catch (error) {
    console.error("Get store info error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
