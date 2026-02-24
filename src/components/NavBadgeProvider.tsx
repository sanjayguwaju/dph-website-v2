"use client";

import React from "react";
import { SidebarBadgeProvider } from "payload-sidebar-plugin/components";

export function NavBadgeProvider({ children }: { children: React.ReactNode }) {
  // Define badges for navigation items
  // Keys must match collection/global slugs exactly
  const badges: Record<
    string,
    { count: number; color: "red" | "yellow" | "blue" | "green" | "orange" | "gray" }
  > = {
    // Example badges - uncomment and modify as needed
    // comments: { count: 5, color: "orange" },
    // notices: { count: 3, color: "blue" },
  };

  return (
    <SidebarBadgeProvider badges={badges}>{children}</SidebarBadgeProvider>
  );
}

export default NavBadgeProvider;
