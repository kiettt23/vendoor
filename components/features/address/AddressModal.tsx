"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import type { RootState } from "@/lib/store";
import {
  addAddress as addAddressToStore,
  setAddresses,
} from "@/lib/features/address/address-slice";
import { vi } from "@/lib/i18n";
import { addAddress, updateAddress } from "@/lib/actions/user/address.action";
import { addressSchema, type AddressFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

interface AddressData {
  id?: string;
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface AddressModalProps {
  setShowAddressModal: (show: boolean) => void;
  editingAddress?: AddressData | null;
}

export default function AddressModal({
  setShowAddressModal,
  editingAddress = null,
}: AddressModalProps) {
  const dispatch = useAppDispatch();
  const addressList = useAppSelector((state: RootState) => state.address.list);
  const isEditing = !!editingAddress;

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "Vietnam",
      phone: "",
    },
  });

  useEffect(() => {
    if (editingAddress) {
      form.reset({
        name: editingAddress.name || "",
        email: editingAddress.email || "",
        street: editingAddress.street || "",
        city: editingAddress.city || "",
        state: editingAddress.state || "",
        zip: editingAddress.zip || "",
        country: editingAddress.country || "Vietnam",
        phone: editingAddress.phone || "",
      });
    }
  }, [editingAddress, form]);

  const onSubmit = async (data: AddressFormData) => {
    let result;

    if (isEditing && editingAddress?.id) {
      result = await updateAddress(editingAddress.id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      const updatedList = addressList.map((addr) =>
        addr.id === editingAddress.id ? result.address : addr
      );
      dispatch(setAddresses(updatedList));
    } else {
      result = await addAddress(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      dispatch(addAddressToStore(result.newAddress));
    }

    toast.success(result.message);
    setShowAddressModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur h-screen flex items-center justify-center">
      <form
        onSubmit={form.handleSubmit((data) =>
          toast.promise(onSubmit(data), {
            loading: isEditing ? "Đang cập nhật..." : "Đang thêm địa chỉ...",
          })
        )}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-6"
      >
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">
          {isEditing ? "Chỉnh sửa địa chỉ" : vi.address.addAddress}
        </h2>

        <FieldGroup className="space-y-4">
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel htmlFor="name">{vi.address.name}</FieldLabel>
            <Input
              id="name"
              placeholder={vi.address.name}
              aria-invalid={!!form.formState.errors.name}
              {...form.register("name")}
            />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.email}>
            <FieldLabel htmlFor="email">{vi.address.email}</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder={vi.address.email}
              aria-invalid={!!form.formState.errors.email}
              {...form.register("email")}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.street}>
            <FieldLabel htmlFor="street">{vi.address.street}</FieldLabel>
            <Input
              id="street"
              placeholder={vi.address.street}
              aria-invalid={!!form.formState.errors.street}
              {...form.register("street")}
            />
            <FieldError errors={[form.formState.errors.street]} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={!!form.formState.errors.city}>
              <FieldLabel htmlFor="city">{vi.address.city}</FieldLabel>
              <Input
                id="city"
                placeholder={vi.address.city}
                aria-invalid={!!form.formState.errors.city}
                {...form.register("city")}
              />
              <FieldError errors={[form.formState.errors.city]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.state}>
              <FieldLabel htmlFor="state">{vi.address.state}</FieldLabel>
              <Input
                id="state"
                placeholder={vi.address.state}
                aria-invalid={!!form.formState.errors.state}
                {...form.register("state")}
              />
              <FieldError errors={[form.formState.errors.state]} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={!!form.formState.errors.zip}>
              <FieldLabel htmlFor="zip">{vi.address.zip}</FieldLabel>
              <Input
                id="zip"
                placeholder={vi.address.zip}
                aria-invalid={!!form.formState.errors.zip}
                {...form.register("zip")}
              />
              <FieldError errors={[form.formState.errors.zip]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.country}>
              <FieldLabel htmlFor="country">{vi.address.country}</FieldLabel>
              <Input
                id="country"
                placeholder={vi.address.country}
                aria-invalid={!!form.formState.errors.country}
                {...form.register("country")}
              />
              <FieldError errors={[form.formState.errors.country]} />
            </Field>
          </div>

          <Field data-invalid={!!form.formState.errors.phone}>
            <FieldLabel htmlFor="phone">{vi.address.phone}</FieldLabel>
            <Input
              id="phone"
              placeholder={vi.address.phone}
              aria-invalid={!!form.formState.errors.phone}
              {...form.register("phone")}
            />
            <FieldError errors={[form.formState.errors.phone]} />
          </Field>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full mt-2"
          >
            {form.formState.isSubmitting
              ? "Đang xử lý..."
              : isEditing
              ? "CẬP NHẬT"
              : vi.common.save.toUpperCase()}
          </Button>
        </FieldGroup>
      </form>

      <XIcon
        size={30}
        className="absolute top-5 right-5 text-slate-500 hover:text-slate-700 cursor-pointer"
        onClick={() => setShowAddressModal(false)}
      />
    </div>
  );
}
