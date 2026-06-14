"use client";

import { usePathname } from "next/navigation";
import { FondJeuAmbiance } from "./FondJeu";

// Monté une fois dans le layout des jeux : pose le filigrane peint dans les
// marges de CHAQUE page de jeu, avec l'image propre à chaque jeu (choisie par
// route). Le hub /jeu garde le FondPeint générique ; seules les pages de jeu
// individuelles sont habillées ici.
const SLUG_PAR_ROUTE: Record<string, string> = {
  "/jeu/pac-marcheuse": "chasse-fond", // fond large dédié
  "/jeu/compost": "compost",
  "/jeu/nuit-des-empreintes": "nuit-des-empreintes",
  "/jeu/traversee": "traversee",
  "/jeu/verbe": "verbe",
  "/jeu/veillee": "veillee",
};

export function FondJeuAuto() {
  const raw = usePathname();
  const path = (raw || "/").replace(/\/+$/, "") || "/"; // sans slash final (trailingSlash)
  const slug = SLUG_PAR_ROUTE[path];
  if (!slug) return null;
  return <FondJeuAmbiance slug={slug} />;
}
