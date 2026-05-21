"use client";

import { CHAPITRES, Objectif, ObjectifId, Chapitre } from "@/data/voie";
import { ProphetesseData } from "./store";

// Sous-ensemble exact de l'état dont dépend le calcul de progression.
// Permet aux pages de ne s'abonner qu'à ces champs plutôt qu'à tout le store.
export type ProgressState = Pick<
  ProphetesseData,
  | "nomBaptismale"
  | "totem"
  | "onboardingFait"
  | "rituelsParJour"
  | "livresChapitresLus"
  | "confessions"
  | "graines"
  | "partiesTetris"
  | "lignesCompostees"
  | "niveauMaxPac"
  | "pollinisateursRecenses"
  | "sanctuairesVisites"
  | "jardin"
  | "fetesCelebrees"
  | "chapitres"
>;

export interface ObjectifProgress {
  objectif: Objectif;
  valeur: number;
  complete: boolean;
}

export interface ChapitreProgress {
  chapitre: Chapitre;
  objectifs: ObjectifProgress[];
  ratio: number; // 0..1
  complete: boolean;
  claimed: boolean;
  unlocked: boolean;
}

function avancement(id: ObjectifId, s: ProgressState): number {
  switch (id) {
    case "choisir-nom":
      return s.nomBaptismale.trim().length > 0 ? 1 : 0;
    case "choisir-totem":
      // Le totem par défaut est "mycelium" — on considère validé si on a touché aux paramètres OU si onboarding fait
      return s.totem ? (s.onboardingFait || s.totem !== "mycelium" ? 1 : 0) : 0;
    case "rituels-3": {
      let total = 0;
      for (const day of Object.values(s.rituelsParJour ?? {})) {
        total += Object.values(day).filter(Boolean).length;
      }
      return total;
    }
    case "rituels-7-jours": {
      let days = 0;
      for (const day of Object.values(s.rituelsParJour ?? {})) {
        if (Object.values(day).filter(Boolean).length > 0) days++;
      }
      return days;
    }
    case "lire-genese":
      return (s.livresChapitresLus?.genese ?? []).length;
    case "lire-heresies":
      return (s.livresChapitresLus?.heresies ?? []).length;
    case "lire-vertus":
      return (s.livresChapitresLus?.vertus ?? []).length;
    case "lire-lamentations":
      return (s.livresChapitresLus?.lamentations ?? []).length;
    case "lire-7-paraboles":
      return (s.livresChapitresLus?.paraboles ?? []).length;
    case "confessions-3":
    case "confessions-15":
      return s.confessions?.length ?? 0;
    case "graines-100":
    case "graines-300":
    case "graines-1000":
      return s.graines;
    case "tetris-une-partie":
      return s.partiesTetris;
    case "tetris-50-lignes":
      return s.lignesCompostees;
    case "pac-niveau-2":
    case "pac-niveau-5":
      return s.niveauMaxPac;
    case "pac-200-pollinisateurs":
      return s.pollinisateursRecenses;
    case "visiter-8-sanctuaires":
      return s.sanctuairesVisites.length;
    case "planter-5-especes":
    case "planter-12-especes": {
      const unique = new Set(s.jardin.map((p) => p.especeId));
      return unique.size;
    }
    case "fetes-2":
    case "fetes-5":
      return s.fetesCelebrees.length;
    default:
      return 0;
  }
}

export function computeProgress(state: ProgressState): ChapitreProgress[] {
  const result: ChapitreProgress[] = [];
  let previousComplete = true; // chapitre 1 toujours unlocked
  for (const chapitre of CHAPITRES) {
    const objectifs = chapitre.objectifs.map<ObjectifProgress>((o) => {
      const valeur = avancement(o.id, state);
      return { objectif: o, valeur, complete: valeur >= o.cible };
    });
    const total = objectifs.length || 1;
    const done = objectifs.filter((o) => o.complete).length;
    const ratio = chapitre.objectifs.length === 0 ? 1 : done / total;
    const storedComplete = !!state.chapitres[chapitre.id]?.completed;
    const storedClaimed = !!state.chapitres[chapitre.id]?.claimed;
    const naturallyComplete: boolean = chapitre.objectifs.length === 0 ? previousComplete : done === total;
    const complete: boolean = storedComplete || naturallyComplete;
    const unlocked = previousComplete;
    result.push({
      chapitre,
      objectifs,
      ratio,
      complete,
      claimed: storedClaimed,
      unlocked,
    });
    previousComplete = complete;
  }
  return result;
}

export function currentChapitreIndex(progress: ChapitreProgress[]): number {
  for (let i = 0; i < progress.length; i++) {
    if (!progress[i].complete) return i;
  }
  return progress.length - 1;
}
