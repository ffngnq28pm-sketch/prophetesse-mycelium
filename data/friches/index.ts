// L'Université des Friches — modèle de données + grades. Structure prévue pour
// 8 facultés ; une seule remplie pour l'instant (Le Peuple Souterrain).

export interface Question {
  q: string;
  options: string[];
  correct: number;
  explication: string;
}
export interface Lecon {
  id: string;
  titre: string;
  epigraphe?: string;
  corps: string[];
  quiz: Question[];
}
export interface Faculte {
  id: string;
  titre: string;
  resume: string;
  lecons: Lecon[];
}

import { peupleSouterrain } from "./peuple-souterrain";
import { pollinisateurs } from "./pollinisateurs";

export const FACULTES: Faculte[] = [peupleSouterrain, pollinisateurs];

// Nombre total de leçons PUBLIÉES (sert au calcul du grade global).
export const TOTAL_LECONS = FACULTES.reduce((n, f) => n + f.lecons.length, 0);

export function getFaculte(id: string): Faculte | undefined {
  return FACULTES.find((f) => f.id === id);
}
export function getLecon(faculteId: string, leconId: string): Lecon | undefined {
  return getFaculte(faculteId)?.lecons.find((l) => l.id === leconId);
}

// ——— Grades (10, dial-ables) ———
// Grade global = plus haut palier atteint par (leçons maîtrisées / leçons publiées).
export interface Grade {
  nom: string;
  seuil: number; // fraction 0..1
}
export const GRADES: Grade[] = [
  { nom: "Spore", seuil: 0 },
  { nom: "Filament", seuil: 0.1 },
  { nom: "Hyphe", seuil: 0.2 },
  { nom: "Pousse", seuil: 0.3 },
  { nom: "Gardien des Friches", seuil: 0.45 },
  { nom: "Lichen", seuil: 0.6 },
  { nom: "Mycélium", seuil: 0.7 },
  { nom: "Sporophore", seuil: 0.8 },
  { nom: "Sève", seuil: 0.9 },
  { nom: "Marcheur·euse", seuil: 1 },
];

export interface CalculGrade {
  idx: number;
  actuel: Grade;
  suivant: Grade | null;
  vers: number; // progression 0..1 vers le grade suivant
}

export function calculerGrade(fraction: number): CalculGrade {
  let idx = 0;
  for (let i = 0; i < GRADES.length; i++) if (fraction >= GRADES[i].seuil) idx = i;
  const actuel = GRADES[idx];
  const suivant = GRADES[idx + 1] ?? null;
  let vers = 1;
  if (suivant) {
    const span = suivant.seuil - actuel.seuil;
    vers = span > 0 ? Math.min(1, Math.max(0, (fraction - actuel.seuil) / span)) : 1;
  }
  return { idx, actuel, suivant, vers };
}
