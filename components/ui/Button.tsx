import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "sacre" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "sacre", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(variant === "sacre" ? "btn-sacre" : "btn-ghost", className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
