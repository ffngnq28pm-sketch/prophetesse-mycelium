"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ConfessionEntry {
  id: string;
  pecheId: string;
  date: string;
  penitenceChoisie: string;
  grainesPerdues: number;
}

export interface PlantationEntry {
  especeId: string;
  plantedAt: string;
  slot: number;
}

export interface ChapitreState {
  completed: boolean;
  completedAt?: string;
  claimed: boolean;
}

export interface ProphetesseState {
  // Identité
  nomBaptismale: string;
  totem: string;
  theme: "aurore" | "vigile";
  // Économie spirituelle
  graines: number;
  // Date
  dateEntreeOrdre: string;
  // Rituels par jour
  rituelsParJour: Record<string, Record<string, boolean>>;
  // Confessions
  confessions: ConfessionEntry[];
  // Stats Tetris
  meilleurScoreTetris: number;
  partiesTetris: number;
  lignesCompostees: number;
  // Stats Pac (= Chasse aux Pollinisateurs)
  meilleurScorePac: number;
  partiesPac: number;
  niveauMaxPac: number;
  fantomesTabasses: number;
  pollinisateursRecenses: number; // cumulé
  // V3 — Voie (9 chapitres)
  chapitres: Record<number, ChapitreState>;
  // V3 — Jardin
  jardin: PlantationEntry[];
  jardinSlots: number; // capacité (16)
  visitesInsectesObservees: number; // compteur cosmétique cumulé
  // V3 — Tutoriels & onboarding
  tutoTetrisFait: boolean;
  tutoPacFait: boolean;
  onboardingFait: boolean;
  // V3 — Calendrier célébré
  fetesCelebrees: string[]; // ids des fêtes "célébrées"
  // V3 — Sanctuaires visités
  sanctuairesVisites: string[];
  // V3 — Paraboles lues
  parabolesLues: number[];
  // V3 — Livres complets lus (chapitres finis)
  livresChapitresLus: Record<string, string[]>; // livre id → chapitre id[]
  // Hydration
  hasHydrated: boolean;

  setHasHydrated: (v: boolean) => void;
  setNomBaptismale: (n: string) => void;
  setTotem: (t: string) => void;
  toggleTheme: () => void;
  ajouterGraines: (n: number) => void;
  retirerGraines: (n: number) => void;
  cocherRituel: (date: string, officeId: string) => boolean;
  decocherRituel: (date: string, officeId: string) => void;
  ajouterConfession: (c: ConfessionEntry) => void;
  enregistrerScoreTetris: (score: number, lignes: number) => void;
  enregistrerScorePac: (score: number, niveauAtteint: number, fantomes: number, pollinisateurs: number) => void;
  // V3 actions
  setOnboardingFait: (b: boolean) => void;
  setTutoTetrisFait: (b: boolean) => void;
  setTutoPacFait: (b: boolean) => void;
  planter: (especeId: string, coutGraines: number) => boolean;
  retirerPlante: (slot: number) => void;
  enregistrerVisiteInsecte: () => void;
  marquerChapitreComplete: (id: number) => void;
  marquerChapitreClaimed: (id: number) => void;
  celebrerFete: (feteId: string) => void;
  visiterSanctuaire: (sanctId: string) => void;
  lireParabole: (paraboleId: number) => void;
  lireChapitreLivre: (livreId: string, chapitreId: string) => void;
  reset: () => void;
}

const initialState = {
  nomBaptismale: "",
  totem: "mycelium",
  theme: "aurore" as const,
  graines: 0,
  dateEntreeOrdre: new Date().toISOString(),
  rituelsParJour: {},
  confessions: [],
  meilleurScoreTetris: 0,
  partiesTetris: 0,
  lignesCompostees: 0,
  meilleurScorePac: 0,
  partiesPac: 0,
  niveauMaxPac: 0,
  fantomesTabasses: 0,
  pollinisateursRecenses: 0,
  chapitres: {} as Record<number, ChapitreState>,
  jardin: [] as PlantationEntry[],
  jardinSlots: 16,
  visitesInsectesObservees: 0,
  tutoTetrisFait: false,
  tutoPacFait: false,
  onboardingFait: false,
  fetesCelebrees: [] as string[],
  sanctuairesVisites: [] as string[],
  parabolesLues: [] as number[],
  livresChapitresLus: {} as Record<string, string[]>,
};

export const useStore = create<ProphetesseState>()(
  persist(
    (set, get) => ({
      ...initialState,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      setNomBaptismale: (n) => set({ nomBaptismale: n }),
      setTotem: (t) => set({ totem: t }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "aurore" ? "vigile" : "aurore" })),
      ajouterGraines: (n) => set((s) => ({ graines: s.graines + n })),
      retirerGraines: (n) =>
        set((s) => ({ graines: Math.max(0, s.graines - n) })),
      cocherRituel: (date, officeId) => {
        const state = get();
        const jour = state.rituelsParJour[date] ?? {};
        if (jour[officeId]) return false;
        set((s) => ({
          rituelsParJour: {
            ...s.rituelsParJour,
            [date]: { ...(s.rituelsParJour[date] ?? {}), [officeId]: true },
          },
        }));
        return true;
      },
      decocherRituel: (date, officeId) => {
        set((s) => {
          const jour = { ...(s.rituelsParJour[date] ?? {}) };
          delete jour[officeId];
          return {
            rituelsParJour: { ...s.rituelsParJour, [date]: jour },
          };
        });
      },
      ajouterConfession: (c) =>
        set((s) => ({ confessions: [c, ...s.confessions].slice(0, 200) })),
      enregistrerScoreTetris: (score, lignes) =>
        set((s) => ({
          meilleurScoreTetris: Math.max(s.meilleurScoreTetris, score),
          partiesTetris: s.partiesTetris + 1,
          lignesCompostees: s.lignesCompostees + lignes,
        })),
      enregistrerScorePac: (score, niveauAtteint, fantomes, pollinisateurs) =>
        set((s) => ({
          meilleurScorePac: Math.max(s.meilleurScorePac, score),
          partiesPac: s.partiesPac + 1,
          niveauMaxPac: Math.max(s.niveauMaxPac, niveauAtteint),
          fantomesTabasses: s.fantomesTabasses + fantomes,
          pollinisateursRecenses: s.pollinisateursRecenses + pollinisateurs,
        })),
      setOnboardingFait: (b) => set({ onboardingFait: b }),
      setTutoTetrisFait: (b) => set({ tutoTetrisFait: b }),
      setTutoPacFait: (b) => set({ tutoPacFait: b }),
      planter: (especeId, coutGraines) => {
        const s = get();
        if (s.graines < coutGraines) return false;
        if (s.jardin.length >= s.jardinSlots) return false;
        const usedSlots = new Set(s.jardin.map((p) => p.slot));
        let slot = 0;
        while (usedSlots.has(slot) && slot < s.jardinSlots) slot++;
        if (slot >= s.jardinSlots) return false;
        set((st) => ({
          graines: st.graines - coutGraines,
          jardin: [...st.jardin, { especeId, plantedAt: new Date().toISOString(), slot }],
        }));
        return true;
      },
      retirerPlante: (slot) => {
        set((s) => ({ jardin: s.jardin.filter((p) => p.slot !== slot) }));
      },
      enregistrerVisiteInsecte: () =>
        set((s) => ({ visitesInsectesObservees: s.visitesInsectesObservees + 1 })),
      marquerChapitreComplete: (id) =>
        set((s) => {
          if (s.chapitres[id]?.completed) return {};
          return {
            chapitres: {
              ...s.chapitres,
              [id]: { completed: true, completedAt: new Date().toISOString(), claimed: false },
            },
          };
        }),
      marquerChapitreClaimed: (id) =>
        set((s) => {
          const ex = s.chapitres[id];
          if (!ex || !ex.completed) return {};
          return { chapitres: { ...s.chapitres, [id]: { ...ex, claimed: true } } };
        }),
      celebrerFete: (feteId) =>
        set((s) => (s.fetesCelebrees.includes(feteId) ? {} : { fetesCelebrees: [...s.fetesCelebrees, feteId] })),
      visiterSanctuaire: (sanctId) =>
        set((s) =>
          s.sanctuairesVisites.includes(sanctId) ? {} : { sanctuairesVisites: [...s.sanctuairesVisites, sanctId] }
        ),
      lireParabole: (paraboleId) =>
        set((s) => (s.parabolesLues.includes(paraboleId) ? {} : { parabolesLues: [...s.parabolesLues, paraboleId] })),
      lireChapitreLivre: (livreId, chapitreId) =>
        set((s) => {
          const ex = s.livresChapitresLus[livreId] ?? [];
          if (ex.includes(chapitreId)) return {};
          return { livresChapitresLus: { ...s.livresChapitresLus, [livreId]: [...ex, chapitreId] } };
        }),
      reset: () =>
        set({
          ...initialState,
          dateEntreeOrdre: new Date().toISOString(),
        }),
    }),
    {
      name: "prophetesse-mycelium",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
