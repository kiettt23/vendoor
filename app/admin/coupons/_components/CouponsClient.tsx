"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import { DeleteIcon, UserPlusIcon, CrownIcon, XCircleIcon } from "lucide-react";
import { createCoupon, deleteCoupon } from "@/lib/actions/admin/coupon.action";
import { couponSchema, type CouponFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function CouponsClient({ coupons: initialCoupons }) {
  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      discount: undefined,
      forNewUser: false,
      forMember: false,
      isPublic: true,
      expiresAt: new Date(),
    },
  });

  const onSubmit = async (data: CouponFormData) => {
    const result = await createCoupon(data);
    toast.success(result.message);
    form.reset();
  };

  const handleDeleteCoupon = async (code: string) => {
    toast(`Bạn có chắc chắn muốn xóa mã giảm giá "${code}"?`, {
      action: {
        label: "Xóa",
        onClick: async () => {
          const result = await deleteCoupon(code);
          toast.success(result.message);
        },
      },
      cancel: {
        label: "Hủy",
        onClick: () => {},
      },
    });
  };

  return (
    <div className="text-slate-500 mb-40">
      <form
        onSubmit={form.handleSubmit((data) =>
          toast.promise(onSubmit(data), {
            loading: "Đang thêm mã giảm giá...",
          })
        )}
        className="max-w-sm"
      >
        <h2 className="text-2xl mb-4">
          Thêm <span className="text-slate-800 font-medium">Mã giảm giá</span>
        </h2>

        <FieldGroup className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={!!form.formState.errors.code}>
              <FieldLabel htmlFor="code">Mã</FieldLabel>
              <Input
                id="code"
                placeholder="VD: SUMMER2024"
                aria-invalid={!!form.formState.errors.code}
                className="uppercase placeholder:normal-case"
                {...form.register("code", {
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase();
                  },
                })}
              />
              <FieldError errors={[form.formState.errors.code]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.discount}>
              <FieldLabel htmlFor="discount">Giảm (%)</FieldLabel>
              <Input
                id="discount"
                type="number"
                min={1}
                max={100}
                placeholder="VD: 20"
                aria-invalid={!!form.formState.errors.discount}
                {...form.register("discount", { valueAsNumber: true })}
              />
              <FieldError errors={[form.formState.errors.discount]} />
            </Field>
          </div>

          <Field data-invalid={!!form.formState.errors.description}>
            <FieldLabel htmlFor="description">Mô tả</FieldLabel>
            <Input
              id="description"
              placeholder="VD: Giảm giá mùa hè cho tất cả sản phẩm"
              aria-invalid={!!form.formState.errors.description}
              {...form.register("description")}
            />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.expiresAt}>
            <FieldLabel htmlFor="expiresAt">Ngày hết hạn</FieldLabel>
            <Input
              id="expiresAt"
              type="date"
              aria-invalid={!!form.formState.errors.expiresAt}
              {...form.register("expiresAt", {
                setValueAs: (v) => (v ? new Date(v) : new Date()),
              })}
            />
            <FieldError errors={[form.formState.errors.expiresAt]} />
          </Field>

          <div className="flex gap-4 flex-wrap text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...form.register("isPublic")}
                className="w-4 h-4"
              />
              <span>Công khai</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...form.register("forNewUser")}
                className="w-4 h-4"
              />
              <span>Người mới</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...form.register("forMember")}
                className="w-4 h-4"
              />
              <span>Thành viên</span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Đang thêm..." : "Thêm mã giảm giá"}
          </Button>
        </FieldGroup>
      </form>

      {/* List Coupons */}
      <div className="mt-10">
        <h2 className="text-2xl mb-4">
          Danh sách{" "}
          <span className="text-slate-800 font-medium">Mã giảm giá</span>
        </h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 max-w-4xl">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Mã</th>
                <th className="py-3 px-4 text-left font-semibold">Mô tả</th>
                <th className="py-3 px-4 text-left font-semibold">Giảm</th>
                <th className="py-3 px-4 text-left font-semibold">Hết hạn</th>
                <th className="py-3 px-4 text-left font-semibold">Người mới</th>
                <th className="py-3 px-4 text-left font-semibold">
                  Thành viên
                </th>
                <th className="py-3 px-4 text-left font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {initialCoupons.map((coupon) => (
                <tr key={coupon.code} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium">{coupon.code}</td>
                  <td className="py-3 px-4">{coupon.description}</td>
                  <td className="py-3 px-4">{coupon.discount}%</td>
                  <td className="py-3 px-4">
                    {format(coupon.expiresAt, "dd 'tháng' MM, yyyy", {
                      locale: vi,
                    })}
                  </td>
                  <td className="py-3 px-4">
                    {coupon.forNewUser ? (
                      <UserPlusIcon className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-slate-300" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {coupon.forMember ? (
                      <CrownIcon className="w-5 h-5 text-amber-500" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-slate-300" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <DeleteIcon
                      onClick={() =>
                        toast.promise(handleDeleteCoupon(coupon.code), {
                          loading: "Đang xóa...",
                        })
                      }
                      className="w-5 h-5 text-red-500 hover:text-red-800 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
