import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { requireAuth, getCurrentUserProfile } from "@/entities/user";
import { Button } from "@/shared/ui/button";

import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  // requireAuth sẽ redirect nếu chưa đăng nhập
  await requireAuth();

  const profile = await getCurrentUserProfile();
  if (!profile) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 lg:py-16">
      <div className="mb-8">
        <Link href="/account">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Chỉnh sửa thông tin</h1>
        <p className="text-muted-foreground mt-2">
          Cập nhật thông tin cá nhân của bạn
        </p>
      </div>

      <ProfileForm
        defaultValues={{
          name: profile.name,
          phone: profile.phone,
          email: profile.email,
        }}
      />
    </div>
  );
}
