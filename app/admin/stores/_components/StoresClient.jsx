"use client";
import StoreInfo from "@/components/admin/StoreInfo";
import { vi } from "@/lib/i18n";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function StoresClient({ stores: initialStores }) {
  const { getToken } = useAuth();
  const router = useRouter();

  const toggleIsActive = async (storeId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/admin/toggle-store",
        { storeId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(data.message);
      router.refresh(); // Refresh server component data
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  return (
    <div className="text-slate-500 mb-28">
      <h1 className="text-2xl">
        {vi.admin.stores}{" "}
        <span className="text-slate-800 font-medium">{vi.admin.live}</span>
      </h1>

      {initialStores.length ? (
        <div className="flex flex-col gap-4 mt-4">
          {initialStores.map((store) => (
            <div
              key={store.id}
              className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl"
            >
              {/* Store Info */}
              <StoreInfo store={store} />

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <p>{vi.admin.active}</p>
                <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={() =>
                      toast.promise(toggleIsActive(store.id), {
                        loading: vi.common.updating,
                      })
                    }
                    checked={store.isActive}
                  />
                  <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                  <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-80">
          <h1 className="text-3xl text-slate-400 font-medium">
            {vi.admin.noStores}
          </h1>
        </div>
      )}
    </div>
  );
}
