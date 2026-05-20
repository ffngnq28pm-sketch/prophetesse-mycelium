import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "grace" | "outline";
}

export const Badge = ({ className, variant = "default", ...props }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
      variant === "grace" && "border border-ocre-500/40 bg-ocre-500/10 text-ocre-600 dark:text-ocre-400",
      variant === "default" && "border border-mousse-500/30 bg-mousse-100 text-mousse-800 dark:bg-mousse-900/30 dark:text-parchemin-200",
      variant === "outline" && "border border-mousse-500/40 text-mousse-700 dark:text-parchemin-100",
      className
    )}
    {...props}
  />
);
