import { Heart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { requireAuth } from "@/entities/user";
import { getUserWishlist } from "@/entities/wishlist";
import { WishlistGrid } from "@/widgets/wishlist";

export const metadata = {
  title: "Danh sách yêu thích",
  description: "Các sản phẩm bạn đã lưu vào danh sách yêu thích",
};

export default async function WishlistPage() {
  const { user } = await requireAuth();
  const items = await getUserWishlist(user.id);

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-24 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <Heart className="h-20 w-20 text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-2">Chưa có sản phẩm yêu thích</h1>
        <p className="text-muted-foreground mb-8">
          Hãy thêm sản phẩm vào danh sách yêu thích để theo dõi
        </p>
        <Button size="lg" asChild>
          <Link href="/products">Khám phá sản phẩm</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl min-h-[60vh]">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-primary fill-primary" />
          <h1 className="text-3xl font-bold">Yêu thích ({items.length})</h1>
        </div>
      </div>

      <WishlistGrid items={items} userId={user.id} />
    </div>
  );
}
