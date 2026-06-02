// Niveau unique du « Sentier des Spores », conçu comme un petit voyage en
// trois mouvements : Le Réveil (apprentissage), L'Épreuve (montée en
// intensité), L'Ascension (verticalité → Sanctuaire).
//
// Repère : y croît vers le bas. Le sol est à y = 600 (sommet). Les fonctions
// renvoient des copies fraîches à chaque appel pour pouvoir relancer le jeu
// sans contaminer l'état précédent.

import type { Platform, Hazard, Collectible, Rect } from "@/lib/traversee-engine";

export const WORLD_W = 5600;
export const WORLD_H = 800;
export const WORLD_BOTTOM = 900; // sous ce seuil = chute → réapparition

const GROUND_TOP = 600;
const GROUND_H = 300;

export const SPAWN = { x: 70, y: 540 };

export const SANCTUAIRE: Rect = { x: 5120, y: 30, w: 110, h: 140 };

// Nombre total de pollinisateurs du niveau (utilisé par les reliques).
export const POLLINISATEURS_TOTAL = 10;

export function buildPlatforms(): Platform[] {
  const sol = (x: number, w: number): Platform => ({
    x,
    y: GROUND_TOP,
    w,
    h: GROUND_H,
    kind: "sol",
  });

  return [
    // —— Le Réveil : sol plat continu ——
    sol(0, 1500),
    // petites tombes basses pour apprendre le saut
    { x: 680, y: 548, w: 96, h: 52, kind: "tombe" },
    { x: 980, y: 512, w: 96, h: 88, kind: "tombe" },

    // —— L'Épreuve : sols entrecoupés de trous ——
    sol(1620, 480), // pesticide + 1re dosette
    sol(2220, 520), // tondeuse en patrouille
    sol(2860, 640), // dosettes qui roulent
    // une plateforme-relais au-dessus d'un trou
    { x: 2120, y: 500, w: 90, h: 16, kind: "tronc", oneWay: true },

    // —— L'Ascension : socle puis escalier vers le Sanctuaire ——
    sol(3500, 300),
    { x: 3860, y: 540, w: 110, h: 60, kind: "tombe" },
    { x: 4040, y: 470, w: 110, h: 16, kind: "muret", oneWay: true },
    { x: 4230, y: 400, w: 120, h: 16, kind: "tronc", oneWay: true },
    { x: 4430, y: 330, w: 110, h: 16, kind: "muret", oneWay: true },
    { x: 4620, y: 270, w: 120, h: 16, kind: "racine", oneWay: true },
    { x: 4820, y: 210, w: 130, h: 16, kind: "tronc", oneWay: true },
    // corniche du Sanctuaire
    { x: 5010, y: 170, w: 260, h: 130, kind: "tombe" },
  ];
}

export function buildHazards(): Hazard[] {
  return [
    // Première dosette (Réveil/transition) — douce, on peut la composter ou sauter.
    {
      id: 1,
      kind: "dosette",
      x: 1700,
      y: GROUND_TOP - 26,
      w: 26,
      h: 26,
      active: true,
      minX: 1640,
      maxX: 2060,
      vx: -82,
      spin: 0,
    },
    // Flaque de pesticide sur le premier sol de l'Épreuve.
    {
      id: 2,
      kind: "pesticide",
      x: 1760,
      y: GROUND_TOP - 12,
      w: 110,
      h: 14,
      active: true,
    },
    // Tondeuse en patrouille.
    {
      id: 3,
      kind: "tondeuse",
      x: 2260,
      y: GROUND_TOP - 30,
      w: 50,
      h: 30,
      active: true,
      minX: 2240,
      maxX: 2680,
      vx: 78,
    },
    // Deuxième flaque de pesticide.
    {
      id: 4,
      kind: "pesticide",
      x: 3040,
      y: GROUND_TOP - 12,
      w: 100,
      h: 14,
      active: true,
    },
    // Deux dosettes qui roulent dans le dernier couloir de l'Épreuve.
    {
      id: 5,
      kind: "dosette",
      x: 2900,
      y: GROUND_TOP - 26,
      w: 26,
      h: 26,
      active: true,
      minX: 2880,
      maxX: 3260,
      vx: 96,
      spin: 0,
    },
    {
      id: 6,
      kind: "dosette",
      x: 3440,
      y: GROUND_TOP - 26,
      w: 26,
      h: 26,
      active: true,
      minX: 3220,
      maxX: 3470,
      vx: -112,
      spin: 0,
    },
  ];
}

export function buildCollectibles(): Collectible[] {
  const poll = (
    id: number,
    x: number,
    y: number,
    espece: "halicte" | "papillon"
  ): Collectible => ({ id, kind: "pollinisateur", x, y, w: 20, h: 20, taken: false, bobPhase: id * 0.7, espece });

  const graine = (id: number, x: number, y: number): Collectible => ({
    id,
    kind: "graine",
    x,
    y,
    w: 14,
    h: 14,
    taken: false,
    bobPhase: id * 0.5,
  });

  return [
    // —— Le Réveil —— (2 pollinisateurs)
    poll(101, 420, 544, "halicte"), // attrapable debout : enseigne le filet
    poll(102, 1000, 470, "papillon"), // au-dessus d'une tombe : enseigne le saut
    graine(201, 250, 572),
    graine(202, 560, 572),
    graine(203, 1010, 472),
    graine(204, 1320, 572),

    // —— L'Épreuve —— (4 pollinisateurs)
    poll(103, 1900, 486, "papillon"),
    poll(104, 2470, 470, "halicte"),
    poll(105, 3100, 466, "papillon"),
    poll(106, 3340, 504, "halicte"),
    graine(205, 1700, 540),
    graine(206, 2310, 572),
    graine(207, 2960, 572),
    graine(208, 3300, 540),

    // —— L'Ascension —— (4 pollinisateurs)
    poll(107, 3950, 470, "papillon"),
    poll(108, 4290, 336, "halicte"),
    poll(109, 4690, 206, "papillon"),
    poll(110, 4960, 132, "halicte"),
    graine(209, 3700, 572),
    graine(210, 4080, 446),
    graine(211, 4670, 246),
    graine(212, 5080, 146),
  ];
}
