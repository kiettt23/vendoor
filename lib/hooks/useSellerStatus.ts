import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getSellerStatus } from "@/lib/actions/user/create-store.action";

export function useSellerStatus() {
  const router = useRouter();
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchStatus = useCallback(async () => {
    try {
      const { status } = await getSellerStatus();
      if (["approved", "rejected", "pending"].includes(status)) {
        setStatus(status);
        setAlreadySubmitted(true);

        const messages = {
          approved:
            "Cửa hàng của bạn đã được duyệt. Bạn có thể thêm sản phẩm từ bảng điều khiển",
          rejected:
            "Yêu cầu tạo cửa hàng của bạn đã bị từ chối. Vui lòng liên hệ admin để biết thêm chi tiết",
          pending:
            "Yêu cầu tạo cửa hàng đang chờ duyệt. Vui lòng đợi admin phê duyệt",
        };

        setMessage(messages[status as keyof typeof messages]);

        if (status === "approved") {
          setTimeout(() => router.push("/store"), 5000);
        }
      } else {
        setAlreadySubmitted(false);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
    setLoading(false);
  }, [router]);

  return { alreadySubmitted, status, loading, message, fetchStatus };
}
