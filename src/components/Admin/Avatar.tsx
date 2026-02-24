"use client";

import React from "react";

interface AvatarProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}

export const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.[0].toUpperCase() || "U";

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name || user.email || "User"}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
      {initials}
    </div>
  );
};

export default Avatar;
