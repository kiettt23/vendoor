"use client";
import StoreInfo from "../_components/StoreInfo";
import { vi } from "@/lib/i18n";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ApproveClient({ stores: initialStores }) {
  const { getToken } = useAuth();
  const router = useRouter();

  const handleApprove = async ({ storeId, status }) => {
    try {
      const token = await getToken();
      await axios.post(
        "/api/admin/approve-store",
        { storeId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(status === "approved" ? "Đã phê duyệt" : "Đã từ chối");
      router.refresh(); // Refresh server component data
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  return (
    <div className="text-slate-500 mb-28">
      <h1 className="text-2xl">
        {vi.admin.approve}{" "}
        <span className="text-slate-800 font-medium">{vi.admin.stores}</span>
      </h1>

      {initialStores.length ? (
        <div className="flex flex-col gap-4 mt-4">
          {initialStores.map((store) => (
            <div
              key={store.id}
              className="bg-white border rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl"
            >
              {/* Store Info */}
              <StoreInfo store={store} />

              {/* Actions */}
              <div className="flex gap-3 pt-2 flex-wrap">
                <button
                  onClick={() =>
                    toast.promise(
                      handleApprove({ storeId: store.id, status: "approved" }),
                      { loading: vi.admin.approving }
                    )
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  {vi.admin.approve}
                </button>
                <button
                  onClick={() =>
                    toast.promise(
                      handleApprove({ storeId: store.id, status: "rejected" }),
                      { loading: vi.admin.rejecting }
                    )
                  }
                  className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm"
                >
                  {vi.admin.reject}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-80">
          <h1 className="text-3xl text-slate-400 font-medium">
            {vi.admin.noApplications}
          </h1>
        </div>
      )}
    </div>
  );
}
