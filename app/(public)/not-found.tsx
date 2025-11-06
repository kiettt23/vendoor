import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeIcon, SearchIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50 px-6">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-16 pb-12 text-center">
          <div className="relative mb-8">
            <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              404
            </div>
            <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-purple-600 to-pink-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Trang không tồn tại
          </h1>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <HomeIcon size={18} className="mr-2" />
                Về Trang chủ
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/shop">
                <SearchIcon size={18} className="mr-2" />
                Khám phá sản phẩm
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
