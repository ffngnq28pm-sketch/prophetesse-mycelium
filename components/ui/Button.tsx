import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "sacre" | "ghost" | "or";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASS: Record<Variant, string> = {
  sacre: "btn-sacre",
  ghost: "btn-ghost",
  or: "btn-or",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "sacre", ...props }, ref) => (
    <button ref={ref} className={cn(VARIANT_CLASS[variant], className)} {...props} />
  )
);
Button.displayName = "Button";
