import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "focus-ring inline-flex items-center justify-center font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          // Variants
          variant === "primary" &&
            "bg-[var(--color-crimson)] text-white hover:bg-[var(--color-crimson-dark)]",
          variant === "secondary" &&
            "bg-[var(--color-ink-700)] text-[var(--color-ink-100)] hover:bg-[var(--color-ink-600)]",
          variant === "ghost" &&
            "bg-transparent text-[var(--color-ink-200)] hover:bg-[var(--color-ink-800)] hover:text-white",
          variant === "outline" &&
            "border border-[var(--color-ink-600)] bg-transparent text-[var(--color-ink-200)] hover:border-[var(--color-ink-500)] hover:bg-[var(--color-ink-800)]",
          variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
          // Sizes
          size === "sm" && "h-8 rounded-md px-3 text-sm",
          size === "md" && "h-10 rounded-lg px-4 text-sm",
          size === "lg" && "h-12 rounded-lg px-6 text-base",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
