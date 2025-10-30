import { serve } from "inngest/next";
import { inngest } from "@/infra/inngest";
import {
  deleteCouponOnExpiry,
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate,
} from "@/core/events/handlers";

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
