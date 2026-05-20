"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X } from "lucide-react";

interface Props {
  titre: string;
  children: ReactNode;
}

export function HelpButton({ titre, children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Aide"
        className="inline-flex items-center gap-1 rounded-full border border-mousse-500/30 bg-parchemin-50/60 px-3 py-1 font-serif text-xs text-mousse-700 hover:border-ocre-500/50 hover:bg-ocre-500/10 dark:bg-mousse-900/40 dark:text-parchemin-200"
      >
        <HelpCircle size={14} /> Que faire ici ?
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-mousse-950/70 p-4 backdrop-blur"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg border-2 border-ocre-500/40 bg-parchemin-50 p-6 shadow-xl dark:bg-mousse-950"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-full bg-mousse-500/20 p-1 hover:bg-mousse-500/40"
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
              <h3 className="titre-liturgique mb-3 text-2xl text-mousse-800 dark:text-parchemin-100">{titre}</h3>
              <div className="font-serif text-mousse-800 dark:text-parchemin-100">{children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
