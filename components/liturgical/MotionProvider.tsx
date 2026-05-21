"use client";

import { MotionConfig } from "framer-motion";

// Respecte le réglage système « réduire les animations » : framer-motion
// désactive alors automatiquement les animations de transform et de layout.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
