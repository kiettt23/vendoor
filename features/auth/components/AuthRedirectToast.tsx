"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const ERROR_MESSAGES: Record<string, string> = {
  auth_required: "Bạn cần đăng nhập để tiếp tục",
  admin_required: "Bạn không có quyền Admin",
  seller_required: "Bạn cần đăng ký Store để tiếp tục",
  no_store: "Bạn chưa có Store. Vui lòng tạo Store",
  store_pending: "Store của bạn đang chờ phê duyệt",
  store_disabled: "Store của bạn đã bị vô hiệu hóa",
};

export function AuthRedirectToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error && ERROR_MESSAGES[error]) {
      toast.warning(ERROR_MESSAGES[error]);

      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [searchParams, router]);

  return null;
}
