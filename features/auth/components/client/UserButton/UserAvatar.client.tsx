"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

interface UserAvatarProps {
  image?: string | null;
  name?: string | null;
  email?: string | null;
  username?: string | null;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({
  image,
  name,
  email,
  username,
  size = "md",
}: UserAvatarProps) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    username?.slice(0, 2).toUpperCase() ||
    email?.slice(0, 2).toUpperCase() ||
    "??";

  const sizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <Avatar className={`${sizeClasses[size]} cursor-pointer`}>
      <AvatarImage src={image || undefined} alt={name || ""} />
      <AvatarFallback
        className={`bg-gradient-to-br from-purple-500 to-indigo-600 text-white ${textSizeClasses[size]}`}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
