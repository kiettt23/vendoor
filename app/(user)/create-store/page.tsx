"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import Loading from "@/components/ui/Loading";
import { useSession } from "@/lib/auth/client";
import { vi } from "@/lib/i18n";
import { createStore } from "@/lib/actions/user/create-store.action";
import { useSellerStatus } from "@/lib/hooks/useSellerStatus";
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
import { storeSchema, type StoreFormData } from "@/lib/validations";

export default function CreateStore() {
  const { data: session } = useSession();
  const user = session?.user;
  const [imagePreview, setImagePreview] = useState<string>("");
  const { alreadySubmitted, status, loading, message, fetchStatus } =
    useSellerStatus();

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      username: "",
      description: "",
      email: "",
      contact: "",
      address: "",
    },
  });

  const onSubmit = async (data: StoreFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("contact", data.contact);
    formData.append("address", data.address);
    if (data.image) {
      formData.append("image", data.image);
    }

    const result = await createStore(formData);
    toast.success(result.message);
    await fetchStatus();
  };

  useEffect(() => {
    if (user) {
      fetchStatus();
    }
  }, [user, fetchStatus]);

  if (!user) {
    return (
      <div className="min-h-[80vh] flex mx-6 items-center justify-center text-slate-400">
        <h1 className="text-2xl sm:text-4xl font-semibold">
          {vi.messages.loginRequired}
        </h1>
      </div>
    );
  }

  if (loading) return <Loading />;

  if (alreadySubmitted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">
          {message}
        </p>
        {status === "approved" && (
          <p className="mt-5 text-slate-400">
            Chuyển đến bảng điều khiển trong{" "}
            <span className="font-semibold">5 giây</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-6 min-h-[70vh] my-16">
      <form
        onSubmit={form.handleSubmit((data) =>
          toast.promise(onSubmit(data), {
            loading: "Đang gửi thông tin...",
          })
        )}
        className="max-w-7xl mx-auto"
      >
        <FieldSet>
          <div className="mb-6">
            <h1 className="text-3xl text-slate-500">{vi.store.createStore}</h1>
            <p className="max-w-lg text-slate-500 mt-2">
              Để trở thành người bán trên Vendoor, gửi thông tin cửa hàng để xét
              duyệt. Cửa hàng sẽ được kích hoạt sau khi admin xác minh.
            </p>
          </div>

          <Field className="mb-6">
            <FieldLabel>{vi.store.storeLogo}</FieldLabel>
            <label className="cursor-pointer block">
              <Image
                src={imagePreview || "/images/upload_area.svg"}
                className="rounded-lg mt-2 h-16 w-auto"
                alt="Store logo preview"
                width={150}
                height={100}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    form.setValue("image", file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                hidden
              />
            </label>
          </Field>

          <FieldGroup className="max-w-lg space-y-4">
            <Field data-invalid={!!form.formState.errors.username}>
              <FieldLabel htmlFor="username">
                {vi.store.storeUsername}
              </FieldLabel>
              <Input
                id="username"
                placeholder="Nhập tên định danh cửa hàng"
                aria-invalid={!!form.formState.errors.username}
                {...form.register("username")}
              />
              <FieldError errors={[form.formState.errors.username]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="name">{vi.store.storeName}</FieldLabel>
              <Input
                id="name"
                placeholder="Nhập tên cửa hàng"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.description}>
              <FieldLabel htmlFor="description">
                {vi.store.storeDescription}
              </FieldLabel>
              <Textarea
                id="description"
                rows={5}
                placeholder="Nhập mô tả cửa hàng"
                aria-invalid={!!form.formState.errors.description}
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email cửa hàng"
                aria-invalid={!!form.formState.errors.email}
                {...form.register("email")}
              />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.contact}>
              <FieldLabel htmlFor="contact">{vi.address.phone}</FieldLabel>
              <Input
                id="contact"
                type="text"
                placeholder="Nhập số điện thoại liên hệ"
                aria-invalid={!!form.formState.errors.contact}
                {...form.register("contact")}
              />
              <FieldError errors={[form.formState.errors.contact]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.address}>
              <FieldLabel htmlFor="address">{vi.address.street}</FieldLabel>
              <Textarea
                id="address"
                rows={5}
                placeholder="Nhập địa chỉ cửa hàng"
                aria-invalid={!!form.formState.errors.address}
                {...form.register("address")}
              />
              <FieldError errors={[form.formState.errors.address]} />
            </Field>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full mt-6"
            >
              {form.formState.isSubmitting ? "Đang gửi..." : vi.common.submit}
            </Button>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
