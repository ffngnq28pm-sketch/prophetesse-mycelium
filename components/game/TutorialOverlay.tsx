"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Ornement } from "@/components/liturgical/Ornement";
import { ChevronRight, X } from "lucide-react";

export interface Etape {
  titre: string;
  texte: string;
}

interface Props {
  etapes: Etape[];
  onFini: () => void;
  onSkip: () => void;
  titreOuverture: string;
}

export function TutorialOverlay({ etapes, onFini, onSkip, titreOuverture }: Props) {
  const [step, setStep] = useState(0);
  const last = step === etapes.length - 1;
  const next = () => {
    if (last) onFini();
    else setStep((s) => s + 1);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-mousse-950/80 p-4 backdrop-blur"
      >
        <motion.div
          key={step}
          initial={{ scale: 0.92, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0 }}
          className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border-2 border-ocre-500/50 bg-parchemin-50 p-6 shadow-xl dark:bg-mousse-950"
        >
          <button
            onClick={onSkip}
            className="absolute right-3 top-3 rounded-full bg-mousse-500/20 p-1 text-mousse-700 hover:bg-mousse-500/40 dark:text-parchemin-200"
            aria-label="Passer le tutoriel"
          >
            <X size={16} />
          </button>
          <p className="text-xs uppercase tracking-[0.3em] text-ocre-600 dark:text-ocre-400">
            {titreOuverture}
          </p>
          <h3 className="titre-liturgique mt-1 text-2xl text-mousse-800 dark:text-parchemin-100">
            {etapes[step].titre}
          </h3>
          <Ornement />
          <p className="font-serif text-mousse-800 dark:text-parchemin-100">
            {etapes[step].texte}
          </p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex gap-1">
              {etapes.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-6 rounded-full transition ${
                    i <= step ? "bg-ocre-500" : "bg-mousse-500/20"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onSkip}>
                Passer
              </Button>
              <Button onClick={next}>
                {last ? "Commencer" : "Suivant"} <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
