import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "category" | "breaking" | "featured";
  color?: string;
}

export function Badge({ className, variant = "default", color, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase",
        variant === "default" && "bg-[var(--color-ink-700)] text-[var(--color-ink-200)]",
        variant === "category" && "text-white",
        variant === "breaking" && "animate-pulse bg-[var(--color-crimson)] text-white",
        variant === "featured" && "bg-[var(--color-amber)] text-black",
        className,
      )}
      style={variant === "category" && color ? { backgroundColor: color } : undefined}
      {...props}
    >
      {children}
    </span>
  );
}
