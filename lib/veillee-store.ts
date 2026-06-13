"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Progression de L'Épreuve de la Veillée (escape contemplatif). Persistée comme
// les scores de jeux, clé dédiée. Pas de chrono ; on compte les essais ratés
// seulement pour la mention de fin (jamais de punition).
interface VeilleeState {
  sceauxResolus: string[]; // ids des sceaux ouverts
  indices: Record<string, string>; // sceauId -> symbole / indice inscrit au Carnet
  essais: number; // tentatives ratées (mention de fin)
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  resoudre: (sceauId: string, indice: string) => void;
  rater: () => void;
  reset: () => void;
}

export const useVeillee = create<VeilleeState>()(
  persist(
    (set) => ({
      sceauxResolus: [],
      indices: {},
      essais: 0,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      resoudre: (sceauId, indice) =>
        set((s) =>
          s.sceauxResolus.includes(sceauId)
            ? {}
            : { sceauxResolus: [...s.sceauxResolus, sceauId], indices: { ...s.indices, [sceauId]: indice } }
        ),
      rater: () => set((s) => ({ essais: s.essais + 1 })),
      reset: () => set({ sceauxResolus: [], indices: {}, essais: 0 }),
    }),
    {
      name: "friches-escape:v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ sceauxResolus: s.sceauxResolus, indices: s.indices, essais: s.essais }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
);
