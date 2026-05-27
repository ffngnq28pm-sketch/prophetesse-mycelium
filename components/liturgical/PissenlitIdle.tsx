"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Petit pissenlit SVG dessiné à la main : tige, feuille, capitule jaune, akènes.
// Taille intrinsèque 32×40, mis à l'échelle par le parent via width/height.
function PissenlitSvg() {
  return (
    <svg
      viewBox="0 0 32 40"
      width={28}
      height={32}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Tige */}
      <line x1="16" y1="38" x2="16" y2="14" stroke="#5e7541" strokeWidth="1.2" strokeLinecap="round" />
      {/* Feuille dentée à la base */}
      <path
        d="M 16 36 Q 8 33 5 28 Q 9 31 16 33 Z"
        fill="#7ea36a"
        stroke="#3a562f"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      {/* Réceptacle vert */}
      <ellipse cx="16" cy="14" rx="3" ry="2" fill="#5e7541" />
      {/* Capitule : huit pétales rayonnants */}
      <g stroke="#bf8d2c" strokeWidth="1.6" strokeLinecap="round">
        <line x1="16" y1="13" x2="16" y2="5" />
        <line x1="16" y1="13" x2="11" y2="7" />
        <line x1="16" y1="13" x2="21" y2="7" />
        <line x1="16" y1="13" x2="9" y2="11" />
        <line x1="16" y1="13" x2="23" y2="11" />
        <line x1="16" y1="13" x2="13" y2="6" />
        <line x1="16" y1="13" x2="19" y2="6" />
      </g>
      {/* Couronne plus claire */}
      <circle cx="16" cy="11" r="3.5" fill="#f1d56c" opacity="0.55" />
      <circle cx="16" cy="11" r="1.2" fill="#a07810" />
    </svg>
  );
}

const IDLE_MS = 60_000;

export function PissenlitIdle() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const planifier = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setVisible(true), IDLE_MS);
    };

    const reveiller = () => {
      // Tout signe de vie efface le pissenlit et relance le timer.
      setVisible((v) => (v ? false : v));
      planifier();
    };

    const events: Array<keyof WindowEventMap> = [
      "scroll",
      "mousemove",
      "keydown",
      "click",
      "touchstart",
    ];
    events.forEach((e) => window.addEventListener(e, reveiller, { passive: true }));
    planifier();

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reveiller));
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          // Position au-dessus du logo 🍄 de la nav. La nav a un padding-y de
          // 12 px (py-3) et le logo fait environ 32 px — on vise juste à droite
          // et un peu plus haut pour suggérer la pousse à travers la fissure.
          className="pointer-events-none fixed left-[58px] top-[6px] z-40 md:left-[78px]"
          aria-hidden
          initial={{ opacity: 0, scale: 0.4, rotate: -18, y: 6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 4 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <PissenlitSvg />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
