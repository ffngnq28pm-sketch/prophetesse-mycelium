"use client";

import { useStore } from "@/lib/store";
import { ReactNode } from "react";

export function Hydrated({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const hasHydrated = useStore((s) => s.hasHydrated);
  if (!hasHydrated) {
    return (
      <>
        {fallback ?? (
          <div className="flex min-h-[40vh] items-center justify-center font-serif italic text-mousse-700 dark:text-parchemin-200/70">
            « Le mycélium s'éveille… »
          </div>
        )}
      </>
    );
  }
  return <>{children}</>;
}
