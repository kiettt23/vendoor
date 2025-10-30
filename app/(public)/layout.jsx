"use client";
import Banner from "@/components/ui/Banner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchProducts } from "@/store/features/product/productSlice";
import { fetchCart, uploadCart } from "@/store/features/cart/cartSlice";
import { fetchAddress } from "@/store/features/address/addressSlice";
import { fetchUserRatings } from "@/store/features/rating/ratingSlice";
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PublicLayout({ children }) {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { getToken } = useAuth();

  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart({ getToken }));
      dispatch(fetchAddress({ getToken }));
      dispatch(fetchUserRatings({ getToken }));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      dispatch(uploadCart({ getToken }));
    }
  }, [cartItems]);

  return (
    <>
      <Banner />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
