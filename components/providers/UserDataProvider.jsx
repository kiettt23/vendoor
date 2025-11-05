"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser, useAuth } from "@clerk/nextjs";
import { fetchCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { setAddresses } from "@/lib/features/address/addressSlice";
import { setRatings } from "@/lib/features/rating/ratingSlice";
import { getUserAddresses } from "@/components/features/actions/address";
import { getUserRatings } from "@/components/features/actions/rating";

export default function UserDataProvider({ children }) {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { cartItems } = useSelector((state) => state.cart);

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
  }, [user]);

  useEffect(() => {
    if (user) {
      dispatch(uploadCart({ getToken }));
    }
  }, [cartItems]);

  return children;
}
