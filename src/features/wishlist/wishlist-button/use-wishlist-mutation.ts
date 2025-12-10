"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { toggleWishlist } from "@/entities/wishlist";
import {
  showToast,
  showCustomToast,
  TOAST_MESSAGES,
} from "@/shared/lib/constants";
import { queryKeys } from "@/shared/lib/constants/query-keys";

interface UseWishlistMutationOptions {
  productId: string;
  userId: string | null;
  initialIsInWishlist?: boolean;
}

export function useWishlistMutation({
  productId,
  userId,
  initialIsInWishlist = false,
}: UseWishlistMutationOptions) {
  const queryClient = useQueryClient();
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error("LOGIN_REQUIRED");
      }
      return toggleWishlist(userId, productId);
    },
    onMutate: async () => {
      // Optimistic update - instant UI feedback
      const previousValue = isInWishlist;
      setIsInWishlist(!isInWishlist);
      return { previousValue };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousValue !== undefined) {
        setIsInWishlist(context.previousValue);
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        // Confirm optimistic update
        setIsInWishlist(result.data.added);
        showToast("wishlist", result.data.added ? "added" : "removed");

        // Invalidate wishlist queries to refresh list
        queryClient.invalidateQueries({
          queryKey: queryKeys.wishlist.all,
        });
      } else {
        // Rollback and show error
        setIsInWishlist(!isInWishlist);
        showCustomToast.error(result.error);
      }
    },
  });

  const toggle = useCallback(() => {
    if (!userId) {
      showCustomToast.error(TOAST_MESSAGES.wishlist.loginRequired);
      return;
    }
    mutation.mutate();
  }, [userId, mutation]);

  return {
    isInWishlist,
    isPending: mutation.isPending,
    toggle,
  };
}
