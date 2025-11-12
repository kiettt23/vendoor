import { serve } from "inngest/next";
import { inngest } from "@/shared/configs/client";
import {
  deleteCouponOnExpiry,
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate,
} from "@/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdate,
    syncUserDeletion,
    deleteCouponOnExpiry,
  ],
});
