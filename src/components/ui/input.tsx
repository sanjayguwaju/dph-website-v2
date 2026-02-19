import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "h-10 w-full rounded-lg border border-[var(--color-ink-600)] bg-[var(--color-ink-800)] px-4 text-sm text-[var(--color-ink-100)] transition-colors duration-200 placeholder:text-[var(--color-ink-400)]",
          "focus:border-transparent focus:ring-2 focus:ring-[var(--color-crimson)] focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
