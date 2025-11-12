"use client";
import StoreInfo from "../../_components/StoreInfo";
import { toast } from "sonner";
import { toggleStoreActive } from "@/features/stores/index.server";

interface StoresClientProps {
  stores: any[];
}

export default function StoresClient({
  stores: initialStores,
}: StoresClientProps) {
  const handleToggle = async (storeId: string) => {
    try {
      const result = await toggleStoreActive(storeId);
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã có lỗi xảy ra");
    }
  };

  return (
    <div className="text-slate-500 mb-28">
      <h1 className="text-2xl">
        Cửa hàng{" "}
        <span className="text-slate-800 font-medium">đang hoạt động</span>
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
                <p>Kích hoạt</p>
                <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={() =>
                      toast.promise(handleToggle(store.id), {
                        loading: "Đang cập nhật...",
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
            Chưa có cửa hàng nào
          </h1>
        </div>
      )}
    </div>
  );
}
