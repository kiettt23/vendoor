import { Heart } from "lucide-react";

import { EmptyWishlist } from "@/shared/ui/feedback";
import { requireAuth } from "@/entities/user";
import { getUserWishlist } from "@/entities/wishlist/api/queries";
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
      <div className="container mx-auto py-24 px-4 min-h-[60vh] flex items-center justify-center">
        <EmptyWishlist />
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
