"use client";
import StoreInfo from "../../_components/StoreInfo";
import { toast } from "sonner";
import { approveStore, rejectStore } from "@/features/stores/index.server";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { CheckCircle2Icon, XCircleIcon, StoreIcon } from "lucide-react";

interface Store {
  id: string;
  name: string;
  username: string;
  email: string;
  contact: string;
  address: string;
  description: string;
  logo: string;
  status: string;
  isActive: boolean;
  createdAt: Date;
  user: {
    name: string | null;
    email: string | null;
    username: string | null;
    image: string | null;
  };
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
            Phê duyệt cửa hàng
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
                            loading: "Đang phê duyệt...",
                          })
                        }
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2Icon size={16} className="mr-2" />
                        Phê duyệt
                      </Button>
                      <Button
                        onClick={() =>
                          toast.promise(handleReject(store.id), {
                            loading: "Đang từ chối...",
                          })
                        }
                        variant="secondary"
                      >
                        <XCircleIcon size={16} className="mr-2" />
                        Từ chối
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
