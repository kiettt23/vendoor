"use client";
import { useEffect, useState, useOptimistic } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { CameraIcon, Loader2Icon } from "lucide-react";
import { vi } from "@/lib/i18n";
import {
  getStoreInfo,
  updateStoreLogo,
  updateStoreInfo,
} from "@/lib/actions/seller/store.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { storeUpdateSchema, type StoreUpdateFormData } from "@/lib/validations";

type StoreData = {
  id: string;
  name: string;
  username: string;
  description: string;
  logo: string;
  email: string;
  contact: string;
  address: string;
};

export default function StoreSettings() {
  const [storeInfo, setStoreInfo] = useState<StoreData | null>(null);
  const [optimisticStore, setOptimisticStore] = useOptimistic(storeInfo);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<StoreUpdateFormData>({
    resolver: zodResolver(storeUpdateSchema),
    defaultValues: {
      name: "",
      description: "",
      email: "",
      contact: "",
      address: "",
    },
  });

  // Fetch store info on mount
  useEffect(() => {
    async function fetchStore() {
      try {
        const result = await getStoreInfo();
        if (result.success && result.data) {
          setStoreInfo(result.data);
          setImagePreview(result.data.logo);
          form.reset({
            name: result.data.name,
            description: result.data.description,
            email: result.data.email,
            contact: result.data.contact,
            address: result.data.address,
          });
        } else {
          toast.error(result.message || "Không thể tải thông tin cửa hàng");
        }
      } catch (error) {
        toast.error("Không thể tải thông tin cửa hàng");
      } finally {
        setLoading(false);
      }
    }
    fetchStore();
  }, [form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpdate = async () => {
    const fileInput =
      document.querySelector<HTMLInputElement>('input[type="file"]');
    const file = fileInput?.files?.[0];

    if (!file) {
      toast.error("Vui lòng chọn ảnh");
      return;
    }

    setUploading(true);

    // Optimistic update
    const newLogo = imagePreview;
    setOptimisticStore({ ...storeInfo!, logo: newLogo });

    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await updateStoreLogo(formData);

      if (result.success && result.data) {
        toast.success("Cập nhật logo thành công");
        setStoreInfo(result.data);
        setImagePreview(result.data.logo);
        // Clear file input
        if (fileInput) fileInput.value = "";
      } else {
        toast.error(result.message || "Cập nhật logo thất bại");
        // Revert optimistic update
        setOptimisticStore(storeInfo);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra");
      setOptimisticStore(storeInfo);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: StoreUpdateFormData) => {
    // Optimistic update
    const updatedData = {
      ...storeInfo!,
      ...data,
    };
    setOptimisticStore(updatedData);

    try {
      const result = await updateStoreInfo(data);

      if (result.success && result.data) {
        toast.success("Cập nhật thông tin thành công");
        setStoreInfo(result.data);
        form.reset({
          name: result.data.name,
          description: result.data.description,
          email: result.data.email,
          contact: result.data.contact,
          address: result.data.address,
        });
      } else {
        toast.error(result.message || "Cập nhật thông tin thất bại");
        // Revert optimistic update
        setOptimisticStore(storeInfo);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra");
      setOptimisticStore(storeInfo);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <Loader2Icon className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="my-6">
        <h2 className="text-2xl font-semibold">Cài đặt cửa hàng</h2>
        <p className="text-slate-600">
          Quản lý thông tin và logo cửa hàng của bạn
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Logo Upload Section */}
        <Card className="p-6 md:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Logo cửa hàng</h2>

          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Image
                src={imagePreview || "/images/avatar_placeholder.png"}
                alt="Store Logo"
                width={150}
                height={150}
                className="rounded-full object-cover w-32 h-32 border-4 border-slate-200"
              />
              <label
                htmlFor="logo-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <CameraIcon className="w-8 h-8 text-white" />
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">
                {optimisticStore?.name || storeInfo?.name || "Tên cửa hàng"}
              </p>
              <p className="text-xs text-slate-400">
                Tối đa 5MB (JPG, PNG, WEBP)
              </p>
            </div>

            <Button
              onClick={handleLogoUpdate}
              disabled={
                uploading || !imagePreview || imagePreview === storeInfo?.logo
              }
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                "Cập nhật logo"
              )}
            </Button>
          </div>
        </Card>

        {/* Store Info Section */}
        <Card className="p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Thông tin cửa hàng</h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel>{vi.store.storeName}</FieldLabel>
                  <Input
                    {...form.register("name")}
                    placeholder="Nhập tên cửa hàng"
                  />
                  <FieldError>{form.formState.errors.name?.message}</FieldError>
                </Field>

                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...form.register("email")}
                    type="email"
                    placeholder="email@example.com"
                  />
                  <FieldError>
                    {form.formState.errors.email?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel>Số điện thoại</FieldLabel>
                  <Input
                    {...form.register("contact")}
                    placeholder="0123456789"
                  />
                  <FieldError>
                    {form.formState.errors.contact?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel>Địa chỉ</FieldLabel>
                  <Textarea
                    {...form.register("address")}
                    placeholder="Nhập địa chỉ cửa hàng"
                    rows={2}
                  />
                  <FieldError>
                    {form.formState.errors.address?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel>Mô tả</FieldLabel>
                  <Textarea
                    {...form.register("description")}
                    placeholder="Mô tả về cửa hàng của bạn"
                    rows={4}
                  />
                  <FieldError>
                    {form.formState.errors.description?.message}
                  </FieldError>
                </Field>
              </FieldGroup>
            </FieldSet>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
