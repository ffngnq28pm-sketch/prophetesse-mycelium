import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-md border border-mousse-500/30 bg-parchemin-50/80 px-3 py-2 font-serif text-mousse-900 placeholder:text-mousse-600/60 focus:border-ocre-500 focus:outline-none dark:bg-mousse-900/40 dark:text-parchemin-100 dark:placeholder:text-parchemin-200/40",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
