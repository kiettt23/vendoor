"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ERROR_MESSAGE_MAP } from "../lib/constants";

export function AuthRedirectToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error && ERROR_MESSAGE_MAP[error]) {
      toast.warning(ERROR_MESSAGE_MAP[error]);

      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [searchParams, router]);

  return null;
}
