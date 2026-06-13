"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Seuil de maîtrise d'une leçon : quiz réussi à >= 2 bonnes réponses sur 3 (dial-able).
export const SEUIL_MAITRISE = 2;

interface FrichesState {
  leconsMaitrisees: string[];
  scores: Record<string, number>; // meilleur score par leçon (sur le total du quiz)
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  // Enregistre un quiz ; marque la leçon maîtrisée si score >= seuil.
  enregistrerQuiz: (leconId: string, score: number, seuil: number) => void;
  reset: () => void;
}

export const useFriches = create<FrichesState>()(
  persist(
    (set) => ({
      leconsMaitrisees: [],
      scores: {},
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      enregistrerQuiz: (leconId, score, seuil) =>
        set((s) => {
          const scores = { ...s.scores, [leconId]: Math.max(s.scores[leconId] ?? 0, score) };
          const maitrisee = score >= seuil;
          const leconsMaitrisees =
            maitrisee && !s.leconsMaitrisees.includes(leconId)
              ? [...s.leconsMaitrisees, leconId]
              : s.leconsMaitrisees;
          return { scores, leconsMaitrisees };
        }),
      reset: () => set({ leconsMaitrisees: [], scores: {} }),
    }),
    {
      name: "friches:v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ leconsMaitrisees: s.leconsMaitrisees, scores: s.scores }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
);
