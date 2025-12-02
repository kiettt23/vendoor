import Link from "next/link";
import { Star, ExternalLink } from "lucide-react";
import { headers } from "next/headers";

import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { auth } from "@/shared/lib/auth/config";
import { prisma } from "@/shared/lib/db";
import { getVendorReviews, StarRating } from "@/entities/review";
import { ReviewReplyDialog } from "./ReviewReplyDialog";

export async function VendorReviewsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  // Lấy vendor profile
  const vendorProfile = await prisma.vendorProfile.findFirst({
    where: { userId: session.user.id },
    select: { id: true, userId: true },
  });

  if (!vendorProfile) return null;

  const { reviews, total } = await getVendorReviews(vendorProfile.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Đánh giá sản phẩm</h1>
          <p className="text-muted-foreground">
            {total} đánh giá từ khách hàng
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Chưa có đánh giá</h3>
            <p className="text-muted-foreground">
              Đánh giá từ khách hàng sẽ hiển thị ở đây
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Review info */}
                  <div className="flex-1 space-y-2">
                    {/* Header: user + rating */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {(review.user.name || "U").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {review.user.name || "Người dùng"}
                          </span>
                          {review.isVerifiedPurchase && (
                            <Badge variant="secondary" className="text-xs">
                              Đã mua hàng
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product link */}
                    <Link
                      href={`/products/${review.product.slug}`}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {review.product.name}
                      <ExternalLink className="h-3 w-3" />
                    </Link>

                    {/* Review content */}
                    {review.title && (
                      <p className="font-medium">{review.title}</p>
                    )}
                    {review.content && (
                      <p className="text-sm text-muted-foreground">
                        {review.content}
                      </p>
                    )}

                    {/* Vendor reply */}
                    {review.vendorReply && (
                      <div className="mt-3 pl-4 border-l-2 border-primary/30">
                        <p className="text-xs text-muted-foreground mb-1">
                          Phản hồi của bạn (
                          {new Date(review.vendorReplyAt!).toLocaleDateString(
                            "vi-VN"
                          )}
                          ):
                        </p>
                        <p className="text-sm">{review.vendorReply}</p>
                      </div>
                    )}
                  </div>

                  {/* Action - Client Component */}
                  <ReviewReplyDialog
                    reviewId={review.id}
                    vendorUserId={vendorProfile.userId}
                    existingReply={review.vendorReply}
                    userName={review.user.name}
                    rating={review.rating}
                    content={review.content}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
