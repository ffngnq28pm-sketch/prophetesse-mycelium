"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function ThemeBootstrap() {
  const theme = useStore((s) => s.theme);
  const hasHydrated = useStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    const root = document.documentElement;
    if (theme === "vigile") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme, hasHydrated]);

  return null;
}
