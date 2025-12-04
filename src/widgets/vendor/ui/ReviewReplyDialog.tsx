"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  showToast,
  showErrorToast,
  showCustomToast,
} from "@/shared/lib/constants";
import { replyToReview, deleteVendorReply } from "@/entities/review/api/actions";
import { StarRating } from "@/entities/review/ui";

interface ReviewReplyDialogProps {
  reviewId: string;
  vendorUserId: string;
  existingReply: string | null;
  userName: string | null;
  rating: number;
  content: string | null;
}

export function ReviewReplyDialog({
  reviewId,
  vendorUserId,
  existingReply,
  userName,
  rating,
  content,
}: ReviewReplyDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [reply, setReply] = useState(existingReply || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reply.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await replyToReview(vendorUserId, {
        reviewId,
        reply: reply.trim(),
      });

      if (result.success) {
        showToast("review", "replyAdded");
        setIsOpen(false);
        router.refresh();
      } else {
        showCustomToast.error(result.error);
      }
    } catch {
      showErrorToast("generic");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirm("Xác nhận xóa phản hồi?")) return;

    setIsSubmitting(true);
    try {
      const result = await deleteVendorReply(vendorUserId, reviewId);

      if (result.success) {
        showCustomToast.success("Đã xóa phản hồi");
        setReply("");
        setIsOpen(false);
        router.refresh();
      } else {
        showCustomToast.error(result.error);
      }
    } catch {
      showErrorToast("generic");
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          {existingReply ? "Sửa phản hồi" : "Phản hồi"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phản hồi đánh giá</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Review summary */}
          <div className="bg-muted p-3 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{userName || "Người dùng"}</span>
              <StarRating rating={rating} size="sm" />
            </div>
            {content && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {content}
              </p>
            )}
          </div>

          {/* Reply textarea */}
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Nhập phản hồi của bạn..."
            rows={4}
          />

          {/* Actions */}
          <div className="flex justify-between">
            {existingReply && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Xóa phản hồi
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !reply.trim()}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Gửi phản hồi
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
