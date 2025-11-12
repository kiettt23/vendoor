"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "../../../lib/client";
import { AUTH_ROUTES } from "../../../lib/constants";
import type { DeviceSession } from "../../../lib/types";

export function useUserButton(
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      username?: string;
      role?: string;
    };
    session: { token: string };
  } | null
) {
  const router = useRouter();
  const [allSessions, setAllSessions] = useState<DeviceSession[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      if (!session) return;

      try {
        const sessions = await authClient.multiSession.listDeviceSessions();
        if (sessions.data) {
          setAllSessions(sessions.data);
        }
      } catch (error) {
        console.error("Không thể tải danh sách phiên đăng nhập", error);
      }
    };

    if (session?.user) {
      loadSessions();
    }
  }, [session]);

  const handleSignOut = async () => {
    if (!session) return;

    const otherSessions = allSessions.filter(
      (s) => s.session.token !== session?.session.token
    );

    if (otherSessions.length > 0) {
      try {
        await authClient.multiSession.revoke({
          sessionToken: session.session.token,
        });
        await authClient.multiSession.setActive({
          sessionToken: otherSessions[0].session.token,
        });
        toast.success("Đã chuyển sang tài khoản khác");
        router.refresh();
      } catch (error) {
        await authClient.signOut();
        router.push(AUTH_ROUTES.HOME);
        router.refresh();
      }
    } else {
      await authClient.signOut();
      router.push(AUTH_ROUTES.HOME);
      router.refresh();
    }
  };

  const handleSwitchSession = async (sessionToken: string) => {
    try {
      await authClient.multiSession.setActive({ sessionToken });
      toast.success("Đã chuyển tài khoản");
      router.refresh();
    } catch (error) {
      toast.error("Không thể chuyển tài khoản");
    }
  };

  const handleAddAccount = () => {
    router.push(AUTH_ROUTES.SIGN_IN);
  };

  return {
    allSessions,
    handleSignOut,
    handleSwitchSession,
    handleAddAccount,
  };
}
