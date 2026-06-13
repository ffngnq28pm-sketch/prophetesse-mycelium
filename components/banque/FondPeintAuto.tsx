"use client";

import { usePathname } from "next/navigation";
import { FondPeint } from "./FondPeint";

// Monté UNE seule fois dans le layout racine, derrière le contenu. Choisit un
// fond peint DÉTERMINISTE par chemin (seed = pathname) → chaque page a son fond
// stable, variété entre écrans, zéro scintillement, pas de tirage qui change.

// Routes SANS fond (regex sur le chemin normalisé, sans slash final). Dial-able.
const EXCLURE: RegExp[] = [
  /^\/jeu\/.+/, // jeux individuels / plein écran (le jeu a son monde) — mais PAS /jeu (le hub)
  /^\/parametres/, // écran-outil, gardé sobre
  /^\/progression/, // tableau de bord dense
];

// Réglages fins par route (fond forcé / voile) — sinon défaut seed + voile 0.40.
const OVERRIDE: Record<string, { image?: string; voile?: number }> = {
  // Accueil : la nappe parchemin /80→/55 du porche est déjà chargée, on baisse
  // le voile interne et on force un fond structuré pour qu'il reste perceptible.
  "/": { image: "fond-06", voile: 0.25 },
};

export function FondPeintAuto() {
  const raw = usePathname();
  const path = (raw || "/").replace(/\/+$/, "") || "/"; // enlève le slash final (trailingSlash)
  if (EXCLURE.some((re) => re.test(path))) return null;
  const ov = OVERRIDE[path] ?? {};
  return <FondPeint seed={path} image={ov.image} voile={ov.voile} />;
}
