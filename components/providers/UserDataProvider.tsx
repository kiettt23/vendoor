"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useSession } from "@/lib/auth/client";
import { fetchCart, uploadCart } from "@/lib/features/cart/cart-slice";
import { setAddresses } from "@/lib/features/address/address-slice";
import { setRatings } from "@/lib/features/rating/rating-slice";
import { getUserAddresses } from "@/lib/actions/user/address.action";
import { getUserRatings } from "@/lib/actions/user/rating.action";

interface UserDataProviderProps {
  children: React.ReactNode;
}

export default function UserDataProvider({ children }: UserDataProviderProps) {
  const dispatch = useAppDispatch();
  const { data: session, isPending } = useSession();
  const { cartItems } = useAppSelector((state) => state.cart);

  const user = session?.user;

  // Create a mock getToken function for compatibility
  // Better Auth doesn't use tokens the same way as Clerk
  const getToken = async () => {
    // Return empty string or implement proper token fetching if needed
    return "";
  };

  useEffect(() => {
    if (user && !isPending) {
      dispatch(fetchCart({ getToken }));

      // Fetch addresses
      getUserAddresses().then(({ addresses }) => {
        dispatch(setAddresses(addresses));
      });

      // Fetch ratings
      getUserRatings().then(({ ratings }) => {
        dispatch(setRatings(ratings));
      });
    }
  }, [user, dispatch, isPending]);

  useEffect(() => {
    if (user && !isPending) {
      dispatch(uploadCart({ getToken }));
    }
  }, [cartItems, user, dispatch, isPending]);

  return children;
}
