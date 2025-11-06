"use client";
import StoreInfo from "../../_components/StoreInfo";
import { vi } from "@/lib/i18n";
import { toast } from "sonner";
import { approveStore, rejectStore } from "@/lib/actions/admin/store.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2Icon, XCircleIcon, StoreIcon } from "lucide-react";

interface Store {
  id: string;
  name: string;
  username: string;
  email: string;
  contact: string;
  address: string;
  description: string;
  image?: string;
}

interface ApproveClientProps {
  stores: Store[];
}

export default function ApproveClient({
  stores: initialStores,
}: ApproveClientProps) {
  const handleApprove = async (storeId: string) => {
    try {
      const result = await approveStore(storeId);
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    }
  };

  const handleReject = async (storeId: string) => {
    try {
      const result = await rejectStore(storeId);
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <CheckCircle2Icon size={24} className="text-green-600" />
            {vi.admin.approve} {vi.admin.stores}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {initialStores.length ? (
            <div className="flex flex-col gap-4">
              {initialStores.map((store) => (
                <Card key={store.id}>
                  <CardContent className="p-6 flex max-md:flex-col gap-4 md:items-end">
                    <StoreInfo store={store} />
                    <div className="flex gap-3 pt-2 flex-wrap">
                      <Button
                        onClick={() =>
                          toast.promise(handleApprove(store.id), {
                            loading: vi.admin.approving,
                          })
                        }
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2Icon size={16} className="mr-2" />
                        {vi.admin.approve}
                      </Button>
                      <Button
                        onClick={() =>
                          toast.promise(handleReject(store.id), {
                            loading: vi.admin.rejecting,
                          })
                        }
                        variant="secondary"
                      >
                        <XCircleIcon size={16} className="mr-2" />
                        {vi.admin.reject}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <StoreIcon size={40} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Không có đơn đăng ký nào
              </h3>
              <p className="text-slate-500">
                Chưa có cửa hàng nào chờ phê duyệt
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
