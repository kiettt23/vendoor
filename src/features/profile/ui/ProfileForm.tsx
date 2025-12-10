"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { z } from "zod";

import { updateUserProfile } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { showToast, showErrorToast } from "@/shared/lib/constants";

const profileFormSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(100),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Số điện thoại không hợp lệ (VD: 0901234567)")
    .or(z.literal(""))
    .nullable()
    .optional(),
});

interface ProfileFormProps {
  defaultValues: {
    name: string | null;
    phone: string | null;
    email: string;
  };
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(defaultValues.name || "");
  const [phone, setPhone] = useState(defaultValues.phone || "");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = profileFormSchema.safeParse({ name, phone: phone || null });
    if (!result.success) {
      const fieldErrors: { name?: string; phone?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as "name" | "phone";
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const updateResult = await updateUserProfile({
        name: result.data.name,
        phone: result.data.phone,
      });

      if (updateResult.success) {
        showToast("profile", "updated");
        router.refresh();
      } else {
        showErrorToast("generic", updateResult.error);
      }
    } catch {
      showErrorToast("generic");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (readonly) */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={defaultValues.email} disabled className="bg-muted" />
            <p className="text-muted-foreground text-sm">
              Email không thể thay đổi. Liên hệ hỗ trợ nếu cần.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              placeholder="0901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-muted-foreground text-sm">
              Dùng để liên lạc khi giao hàng
            </p>
            {errors.phone && (
              <p className="text-destructive text-sm">{errors.phone}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
