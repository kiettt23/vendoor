"use client";

import { useSelector } from "react-redux";

export default function HomePage() {
  const state = useSelector((state) => state);
  console.log("Redux state:", state);

  return (
    <div className="p-6 bg-green-500 text-white rounded-lg">
      Tailwind v4 is working!
    </div>
  );
}
