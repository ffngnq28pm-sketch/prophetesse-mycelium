"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Ornement } from "@/components/liturgical/Ornement";
import { X } from "lucide-react";

// Citation unique à cet easter egg : volontairement absente de data/citations.ts
// (= la curiosité a une récompense propre).
const CITATION =
  "Tu as trouvé le clic-clic du Mycélium. Bravo. Sache que sous chaque pas que tu fais sur le sol forestier, un kilomètre de filaments te porte sans applaudir. Maintenant ferme cette fenêtre et va boire de l'eau.";

export function MereMycorhizeOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mere-mycorhize-titre"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-mousse-950/70 p-4 backdrop-blur"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-lg rounded-lg border-2 border-ocre-500/50 bg-parchemin-50 p-6 shadow-2xl dark:bg-mousse-950"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-3 top-3 rounded-full bg-mousse-500/15 p-1 text-mousse-700 hover:bg-mousse-500/30 dark:text-parchemin-200"
        >
          <X size={16} aria-hidden />
        </button>

        <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Apparition rare
        </p>
        <h2
          id="mere-mycorhize-titre"
          className="titre-liturgique mt-1 text-2xl text-mousse-800 dark:text-parchemin-100"
        >
          Mère Mycorhize parle
        </h2>
        <Ornement />
        <p className="font-serif text-base italic leading-relaxed text-mousse-900 dark:text-parchemin-100">
          « {CITATION} »
        </p>
        <div className="mt-5 flex justify-end">
          <button type="button" onClick={onClose} className="btn-or">
            Fermer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
