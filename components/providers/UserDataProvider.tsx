"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useUser, useAuth } from "@clerk/nextjs";
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
  const { user } = useUser();
  const { getToken } = useAuth();
  const { cartItems } = useAppSelector((state) => state.cart);

  useEffect(() => {
    if (user) {
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
  }, [user, dispatch, getToken]);

  useEffect(() => {
    if (user) {
      dispatch(uploadCart({ getToken }));
    }
  }, [cartItems, user, dispatch, getToken]);

  return children;
}
