import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("parchemin-card scroll-corner", className)} {...props} />
  )
);
Card.displayName = "Card";

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-3 flex flex-col gap-1", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("titre-liturgique text-2xl text-mousse-800 dark:text-parchemin-100", className)} {...props} />
);

export const CardSubtitle = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("font-sans text-xs uppercase tracking-widest text-mousse-600 dark:text-ocre-400", className)} {...props} />
);

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-mousse-900 dark:text-parchemin-100", className)} {...props} />
);
