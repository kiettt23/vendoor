import { inngest } from "@/shared/configs/client";
import prisma from "@/shared/configs/prisma";

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;
    const primaryEmail = data.email_addresses?.[0]?.email_address;

    if (!primaryEmail) {
      throw new Error("No email address found for user");
    }

    await prisma.user.create({
      data: {
        id: data.id,
        email: primaryEmail,
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url,
      },
    });
  }
);

// Inngest Function to update user data in database
export const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;
    const primaryEmail = data.email_addresses?.[0]?.email_address;

    if (!primaryEmail) {
      throw new Error("No email address found for user");
    }

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: primaryEmail,
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url,
      },
    });
  }
);

// Inngest Function to delete user from database
export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "clerk/user.deleted" },
  async ({ event }: { event: { data: { id: string } } }) => {
    const { data } = event;
    await prisma.user.delete({
      where: { id: data.id },
    });
  }
);

// Inngest Function to delete coupon on expiry
export const deleteCouponOnExpiry = inngest.createFunction(
  { id: "delete-coupon-on-expiry" },
  { event: "app/coupon.expired" },
  async ({
    event,
    step,
  }: {
    event: { data: { expires_at: string; code: string } };
    step: {
      sleepUntil: (id: string, date: Date) => Promise<void>;
      run: <T>(id: string, fn: () => Promise<T>) => Promise<T>;
    };
  }) => {
    const { data } = event;
    const expiryDate = new Date(data.expires_at);
    await step.sleepUntil("wait-for-expiry", expiryDate);

    await step.run("delete-coupon-from-database", async () => {
      await prisma.coupon.delete({ where: { code: data.code } });
    });
  }
);
