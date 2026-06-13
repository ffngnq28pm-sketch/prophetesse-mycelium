"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cleDuJour } from "@/lib/verbe-logic";

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

export interface PartieTetris {
  score: number;
  lignes: number;
  date: string;
}

export interface PartiePac {
  score: number;
  niveau: number;
  date: string;
}

export interface PartieEmpreintes {
  score: number;
  mammiferes: number;
  date: string;
}

export interface PartieTraversee {
  tempsMs: number;
  pollinisateurs: number;
  date: string;
}

export type StatutPartieVerbe = "en_cours" | "gagne" | "perdu";

export interface PartieJourVerbe {
  essais: string[]; // mots saisis (normalisés)
  statut: StatutPartieVerbe;
}

export interface ProphetesseData {
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
  // Endgame — Veilles observées (clés de date AAAA-MM-JJ)
  veillesObservees: string[];
  // Annales — historique de scores et préférence audio
  historiqueTetris: PartieTetris[];
  historiquePac: PartiePac[];
  audioActif: boolean;
  // Jeu III — La Nuit des Empreintes
  meilleurScoreEmpreintes: number;
  partiesEmpreintes: number;
  mammiferesRecenses: number;
  historiqueEmpreintes: PartieEmpreintes[];
  tutoEmpreintesFait: boolean;
  // Jeu IV — Le Sentier des Spores (platformer)
  meilleurScoreTraversee: number; // score composite V6 (pollinisateurs + spores + temps)
  meilleurTempsTraversee: number; // ms, 0 = jamais terminé
  meilleursPollinisateursTraversee: number; // record en une traversée
  partiesTraversee: number;
  traverseeTerminee: boolean;
  traverseeSansDosette: boolean; // a déjà terminé sans toucher une dosette
  historiqueTraversee: PartieTraversee[];
  tutoTraverseeFait: boolean;
  // Jeu V — Le Verbe du Jour (Wordle éco-liturgique quotidien)
  verbeParties: Record<string, PartieJourVerbe>; // clé = cleDuJour()
  verbeStreak: number;
  verbeMeilleurStreak: number;
  verbeDerniereDateGagnee: string | null; // cleDuJour de la dernière victoire
}

export interface ProphetesseActions {
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
  enregistrerScoreEmpreintes: (score: number, mammiferes: number) => void;
  setTutoEmpreintesFait: (b: boolean) => void;
  enregistrerScoreTraversee: (tempsMs: number, pollinisateurs: number, sansDosette: boolean) => void;
  setTutoTraverseeFait: (b: boolean) => void;
  verbeAjouterEssai: (cle: string, mot: string) => void;
  verbeTerminer: (cle: string, statut: StatutPartieVerbe) => void;
  setAudioActif: (b: boolean) => void;
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
  observerVeille: (date: string) => boolean;
  exportData: () => string;
  importData: (raw: string) => { ok: boolean; error?: string };
  reset: () => void;
}

export type ProphetesseState = ProphetesseData & { hasHydrated: boolean } & ProphetesseActions;

const initialState: ProphetesseData = {
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
  veillesObservees: [] as string[],
  historiqueTetris: [] as PartieTetris[],
  historiquePac: [] as PartiePac[],
  audioActif: false,
  meilleurScoreEmpreintes: 0,
  partiesEmpreintes: 0,
  mammiferesRecenses: 0,
  historiqueEmpreintes: [] as PartieEmpreintes[],
  tutoEmpreintesFait: false,
  meilleurScoreTraversee: 0,
  meilleurTempsTraversee: 0,
  meilleursPollinisateursTraversee: 0,
  partiesTraversee: 0,
  traverseeTerminee: false,
  traverseeSansDosette: false,
  historiqueTraversee: [] as PartieTraversee[],
  tutoTraverseeFait: false,
  verbeParties: {} as Record<string, PartieJourVerbe>,
  verbeStreak: 0,
  verbeMeilleurStreak: 0,
  verbeDerniereDateGagnee: null,
};

// Clés des données persistées — sert à l'export/import sans énumérer chaque champ.
const DATA_KEYS = Object.keys(initialState) as (keyof ProphetesseData)[];

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
          historiqueTetris: [
            ...s.historiqueTetris,
            { score, lignes, date: new Date().toISOString() },
          ].slice(-60),
        })),
      enregistrerScorePac: (score, niveauAtteint, fantomes, pollinisateurs) =>
        set((s) => ({
          meilleurScorePac: Math.max(s.meilleurScorePac, score),
          partiesPac: s.partiesPac + 1,
          niveauMaxPac: Math.max(s.niveauMaxPac, niveauAtteint),
          fantomesTabasses: s.fantomesTabasses + fantomes,
          pollinisateursRecenses: s.pollinisateursRecenses + pollinisateurs,
          historiquePac: [
            ...s.historiquePac,
            { score, niveau: niveauAtteint, date: new Date().toISOString() },
          ].slice(-60),
        })),
      enregistrerScoreEmpreintes: (score, mammiferes) =>
        set((s) => ({
          meilleurScoreEmpreintes: Math.max(s.meilleurScoreEmpreintes, score),
          partiesEmpreintes: s.partiesEmpreintes + 1,
          mammiferesRecenses: s.mammiferesRecenses + mammiferes,
          historiqueEmpreintes: [
            ...s.historiqueEmpreintes,
            { score, mammiferes, date: new Date().toISOString() },
          ].slice(-60),
        })),
      setTutoEmpreintesFait: (b) => set({ tutoEmpreintesFait: b }),
      enregistrerScoreTraversee: (tempsMs, pollinisateurs, sansDosette) =>
        set((s) => ({
          partiesTraversee: s.partiesTraversee + 1,
          traverseeTerminee: true,
          // meilleur temps = le plus court (0 signifie « jamais terminé »)
          meilleurTempsTraversee:
            s.meilleurTempsTraversee === 0 ? tempsMs : Math.min(s.meilleurTempsTraversee, tempsMs),
          meilleursPollinisateursTraversee: Math.max(s.meilleursPollinisateursTraversee, pollinisateurs),
          traverseeSansDosette: s.traverseeSansDosette || sansDosette,
          pollinisateursRecenses: s.pollinisateursRecenses + pollinisateurs,
          historiqueTraversee: [
            ...s.historiqueTraversee,
            { tempsMs, pollinisateurs, date: new Date().toISOString() },
          ].slice(-60),
        })),
      setTutoTraverseeFait: (b) => set({ tutoTraverseeFait: b }),
      verbeAjouterEssai: (cle, mot) =>
        set((s) => {
          const ex = s.verbeParties[cle] ?? { essais: [], statut: "en_cours" as StatutPartieVerbe };
          return {
            verbeParties: {
              ...s.verbeParties,
              [cle]: { ...ex, essais: [...ex.essais, mot] },
            },
          };
        }),
      verbeTerminer: (cle, statut) =>
        set((s) => {
          const ex = s.verbeParties[cle] ?? { essais: [], statut: "en_cours" as StatutPartieVerbe };
          const parties = { ...s.verbeParties, [cle]: { ...ex, statut } };
          if (statut === "gagne") {
            // cle = "AAAA-MM-JJ" : on reconstruit la date locale pour calculer la veille.
            const [y, m, d] = cle.split("-").map(Number);
            const hier = cleDuJour(new Date(y, m - 1, d - 1));
            const nouveauStreak = s.verbeDerniereDateGagnee === hier ? s.verbeStreak + 1 : 1;
            return {
              verbeParties: parties,
              verbeStreak: nouveauStreak,
              verbeMeilleurStreak: Math.max(s.verbeMeilleurStreak, nouveauStreak),
              verbeDerniereDateGagnee: cle,
            };
          }
          return { verbeParties: parties, verbeStreak: 0 };
        }),
      setAudioActif: (b) => set({ audioActif: b }),
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
      observerVeille: (date) => {
        if (get().veillesObservees.includes(date)) return false;
        set((s) => ({ veillesObservees: [...s.veillesObservees, date] }));
        return true;
      },
      exportData: () => {
        const s = get();
        const data: Record<string, unknown> = {};
        for (const k of DATA_KEYS) data[k] = s[k];
        return JSON.stringify(
          { app: "prophetesse-mycelium", version: 3, exportedAt: new Date().toISOString(), data },
          null,
          2
        );
      },
      importData: (raw) => {
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {
          return { ok: false, error: "Fichier illisible : ce n'est pas du JSON valide." };
        }
        if (typeof parsed !== "object" || parsed === null) {
          return { ok: false, error: "Fichier vide ou corrompu." };
        }
        const obj = parsed as { app?: unknown; data?: unknown };
        if (obj.app !== "prophetesse-mycelium") {
          return { ok: false, error: "Ce fichier n'est pas une sauvegarde Mycélium." };
        }
        if (typeof obj.data !== "object" || obj.data === null) {
          return { ok: false, error: "Sauvegarde sans données exploitables." };
        }
        const incoming = obj.data as Record<string, unknown>;
        const next: Record<string, unknown> = {};
        for (const k of DATA_KEYS) {
          if (k in incoming) next[k] = incoming[k];
        }
        if (Object.keys(next).length === 0) {
          return { ok: false, error: "Sauvegarde sans aucun champ reconnu." };
        }
        set(next as Partial<ProphetesseState>);
        return { ok: true };
      },
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
