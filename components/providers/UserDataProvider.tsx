"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store";
import { useSession } from "@/features/auth/index.client";
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

  const user = session?.user;

  useEffect(() => {
    if (user && !isPending) {
      getUserAddresses().then(({ addresses }) => {
        dispatch(setAddresses(addresses));
      });

      getUserRatings().then(({ ratings }) => {
        dispatch(setRatings(ratings));
      });
    }
  }, [user, dispatch, isPending]);

  return children;
}
