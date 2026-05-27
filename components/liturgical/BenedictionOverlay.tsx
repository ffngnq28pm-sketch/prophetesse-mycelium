"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Ornement } from "./Ornement";

interface Props {
  embleme: string;
  nom: string;
  benediction: string;
  graines: number;
  onClose: () => void;
}

// Sparkles : 8 étoiles qui partent du centre, à des angles régulièrement répartis.
const SPARKLES = Array.from({ length: 8 }, (_, i) => ({
  angle: (i * 360) / 8,
  delay: i * 0.04,
}));

export function BenedictionOverlay({ embleme, nom, benediction, graines, onClose }: Props) {
  // Auto-dismiss après 2,8 s — assez pour lire la bénédiction sans bloquer le rythme.
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [onClose]);

  // ESC ferme aussi, pour les pèlerins pressés.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ pointerEvents: "auto" }}
      onClick={onClose}
    >
      {/* Voile sombre, discret */}
      <div className="absolute inset-0 bg-mousse-950/40 backdrop-blur-[2px]" aria-hidden />

      {/* Halo ocre */}
      <motion.div
        aria-hidden
        className="absolute h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,167,71,0.35) 0%, rgba(201,162,39,0.1) 40%, transparent 70%)",
        }}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Sparkles : 8 étoiles qui s'éloignent depuis le centre */}
      {SPARKLES.map((s, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute text-2xl text-ocre-400"
          style={{
            transform: `rotate(${s.angle}deg)`,
            transformOrigin: "center",
          }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: Math.cos((s.angle * Math.PI) / 180) * 140,
            y: Math.sin((s.angle * Math.PI) / 180) * 140,
            scale: [0.4, 1.1, 1, 0.9],
          }}
          transition={{ duration: 1.6, delay: s.delay, ease: "easeOut" }}
        >
          ✦
        </motion.span>
      ))}

      {/* Carte centrale */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative max-w-md rounded-lg border-2 border-ocre-500/50 bg-parchemin-50/95 px-6 py-5 text-center shadow-2xl dark:bg-mousse-950/95"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Office accompli
        </p>
        <div className="mt-1 flex items-baseline justify-center gap-2">
          <span className="text-2xl text-ocre-600 dark:text-ocre-400" aria-hidden>{embleme}</span>
          <h2 className="titre-liturgique text-2xl text-mousse-800 dark:text-parchemin-100">{nom}</h2>
        </div>
        <Ornement />
        <p className="font-serif text-base italic leading-relaxed text-mousse-900 dark:text-parchemin-100">
          « {benediction} »
        </p>
        <p className="mt-3 font-serif text-sm text-ocre-700 dark:text-ocre-400">
          + {graines} Graine{graines > 1 ? "s" : ""} de Grâce
        </p>
      </motion.div>
    </motion.div>
  );
}
