// Niveau V6 du « Sentier des Spores » — un pèlerinage en TROIS ACTES :
//   I.  Le Porche      (0 → 4600)   : doux, tutoriel implicite (saut, filet, lanternes)
//   II. Les Allées     (4600 → 9800): rythme et variété — plateformes mobiles,
//                                     ponts friables, ronces, tondeuses
//   III. L'Ascension   (9800 → fin) : champignons-tremplins et verticalité,
//                                     vers la lumière et le grand If sacré.
//
// Repère : y croît vers le bas. Le sol est à y = 600 (sommet). Les fonctions
// renvoient des copies fraîches à chaque appel pour pouvoir relancer le jeu
// sans contaminer l'état précédent.
//
// Contraintes de franchissabilité (constantes moteur V6) :
//   hauteur de saut ~103 u → marche montante ≤ 85 u, plateforme posable ≥ 500
//   depuis le sol plat ; portée horizontale à pleine vitesse ~130 u → trous
//   ≤ 120 u sans relais ; tremplin : bond ~260 u.

import type { Platform, Hazard, Collectible, Checkpoint, Rect } from "@/lib/traversee-engine";

export const WORLD_W = 13800;
export const WORLD_H = 800;
export const WORLD_BOTTOM = 900; // sous ce seuil = chute → réapparition

const GROUND_TOP = 600;
const GROUND_H = 300;

export const SPAWN = { x: 70, y: 540 };

// Frontières des actes (utilisées par le moteur pour les messages et la lumière).
export const ACT2_X = 4600;
export const ACT3_X = 9800;

export const SANCTUAIRE: Rect = { x: 13350, y: 30, w: 110, h: 140 };

// Totaux du niveau (utilisés par les reliques et l'écran de fin).
export const POLLINISATEURS_TOTAL = 16;
export const SPORES_TOTAL = 10;

export function buildPlatforms(): Platform[] {
  const sol = (x: number, w: number): Platform => ({
    x,
    y: GROUND_TOP,
    w,
    h: GROUND_H,
    kind: "sol",
  });

  return [
    // ════════ ACTE I — LE PORCHE ════════
    sol(0, 1560),
    { x: 680, y: 548, w: 96, h: 52, kind: "tombe" }, // apprend le saut
    { x: 980, y: 512, w: 96, h: 88, kind: "tombe" },

    sol(1660, 760), // 1re dosette + pesticide
    sol(2520, 900),
    { x: 2700, y: 540, w: 90, h: 60, kind: "tombe" },
    { x: 2860, y: 500, w: 90, h: 100, kind: "tombe" }, // marche haute (pollinisateur)

    sol(3530, 1070),
    { x: 3900, y: 548, w: 96, h: 52, kind: "tombe" },

    // ════════ ACTE II — LES ALLÉES ════════
    sol(4700, 600), // tondeuse d'ouverture

    // plateforme MOBILE horizontale (nouveauté d'acte) au-dessus du grand trou
    { x: 5310, y: 560, w: 90, h: 16, kind: "mobile", oneWay: true, axis: "x", min: 5310, max: 5460, speed: 60, phase: 0 },

    sol(5560, 700), // ronces (nouveauté) + lanterne
    sol(6520, 740), // tondeuse rapide
    { x: 6800, y: 540, w: 90, h: 60, kind: "tombe" }, // refuge anti-tondeuse

    // pont FRIABLE (nouveauté) au-dessus du vide
    { x: 6280, y: 600, w: 70, h: 16, kind: "friable", oneWay: true },
    { x: 6390, y: 600, w: 70, h: 16, kind: "friable", oneWay: true },

    sol(7370, 800), // allée des dosettes + chemin haut optionnel
    { x: 7480, y: 520, w: 90, h: 80, kind: "tombe" }, // marchepied du chemin haut
    { x: 7600, y: 470, w: 100, h: 16, kind: "muret", oneWay: true },
    { x: 7790, y: 400, w: 100, h: 16, kind: "tronc", oneWay: true },

    // plateforme MOBILE verticale au-dessus du second trou
    { x: 8210, y: 580, w: 90, h: 16, kind: "mobile", oneWay: true, axis: "y", min: 470, max: 580, speed: 50, phase: 0 },
    { x: 8330, y: 500, w: 120, h: 100, kind: "tombe" }, // corniche d'arrivée

    sol(8450, 1350), // grande allée finale de l'acte
    { x: 8650, y: 548, w: 90, h: 52, kind: "tombe" },
    { x: 9100, y: 540, w: 90, h: 60, kind: "tombe" },
    { x: 9500, y: 512, w: 90, h: 88, kind: "tombe" },

    // ════════ ACTE III — L'ASCENSION ════════
    sol(9920, 1080),
    // champignon-TREMPLIN (nouveauté) : bond vers la corniche haute
    { x: 10100, y: 572, w: 46, h: 28, kind: "tremplin" },
    { x: 10180, y: 380, w: 110, h: 16, kind: "tronc", oneWay: true }, // corniche du tremplin

    sol(11000, 500),
    // l'escalier vers la lumière
    { x: 11560, y: 540, w: 110, h: 60, kind: "tombe" },
    { x: 11750, y: 470, w: 110, h: 16, kind: "muret", oneWay: true },
    { x: 11940, y: 400, w: 120, h: 16, kind: "tronc", oneWay: true },
    { x: 12140, y: 386, w: 50, h: 14, kind: "tremplin" }, // second tremplin : grand bond
    { x: 12280, y: 230, w: 120, h: 16, kind: "racine", oneWay: true },
    { x: 12470, y: 300, w: 100, h: 16, kind: "muret", oneWay: true }, // branche basse optionnelle (spores)
    { x: 12480, y: 170, w: 110, h: 16, kind: "tronc", oneWay: true },
    { x: 12670, y: 120, w: 110, h: 16, kind: "muret", oneWay: true },

    // corniche du Sanctuaire
    { x: 12880, y: 170, w: 800, h: 130, kind: "tombe" },
  ];
}

export function buildHazards(): Hazard[] {
  let id = 0;
  const dosette = (x: number, minX: number, maxX: number, vx: number): Hazard => ({
    id: ++id,
    kind: "dosette",
    x,
    y: GROUND_TOP - 26,
    w: 26,
    h: 26,
    active: true,
    minX,
    maxX,
    vx,
    spin: 0,
  });
  const pesticide = (x: number, w: number): Hazard => ({
    id: ++id,
    kind: "pesticide",
    x,
    y: GROUND_TOP - 12,
    w,
    h: 14,
    active: true,
  });
  const tondeuse = (minX: number, maxX: number, vx: number): Hazard => ({
    id: ++id,
    kind: "tondeuse",
    x: minX + 20,
    y: GROUND_TOP - 30,
    w: 50,
    h: 30,
    active: true,
    minX,
    maxX,
    vx,
  });
  const ronces = (x: number, w: number): Hazard => ({
    id: ++id,
    kind: "ronces",
    x,
    y: GROUND_TOP - 22,
    w,
    h: 22,
    active: true,
  });

  return [
    // —— Acte I : doux ——
    dosette(1700, 1700, 2120, -82),
    pesticide(2250, 100),
    dosette(3060, 3060, 3380, 96),
    pesticide(3700, 110),

    // —— Acte II : le rythme ——
    tondeuse(4750, 5230, 78),
    ronces(5800, 90),
    tondeuse(6560, 7180, 95),
    pesticide(7500, 120),
    dosette(7700, 7700, 8100, 110),
    ronces(8700, 110),
    tondeuse(8900, 9300, 88),
    dosette(9400, 9400, 9700, -104),

    // —— Acte III : un dernier piège, puis la lumière ——
    dosette(10160, 10160, 10500, 100),
  ];
}

export function buildCollectibles(): Collectible[] {
  let id = 0;
  const poll = (x: number, y: number, espece: "halicte" | "papillon"): Collectible => ({
    id: ++id,
    kind: "pollinisateur",
    x,
    y,
    w: 20,
    h: 20,
    taken: false,
    bobPhase: id * 0.7,
    espece,
  });
  const graine = (x: number, y = GROUND_TOP - 28): Collectible => ({
    id: ++id,
    kind: "graine",
    x,
    y,
    w: 14,
    h: 14,
    taken: false,
    bobPhase: id * 0.5,
  });
  const spore = (x: number, y: number): Collectible => ({
    id: ++id,
    kind: "spore",
    x,
    y,
    w: 14,
    h: 14,
    taken: false,
    bobPhase: id * 0.9,
  });

  return [
    // ════════ ACTE I (5 pollinisateurs) ════════
    poll(420, 544, "halicte"), // attrapable debout : enseigne le filet
    poll(1000, 470, "papillon"), // au-dessus d'une tombe : enseigne le saut
    poll(1950, 486, "papillon"),
    poll(2890, 450, "halicte"), // au sommet de la marche haute
    poll(3930, 500, "papillon"),
    graine(250),
    graine(560),
    graine(1320),
    graine(1800),
    graine(2620),
    graine(3650),
    graine(4100),

    // ════════ ACTE II (6 pollinisateurs, spores sur les chemins risqués) ════════
    poll(4980, 470, "halicte"),
    poll(5830, 500, "papillon"), // au-dessus des ronces : risque/récompense
    poll(6830, 490, "halicte"),
    poll(7900, 480, "papillon"),
    poll(8730, 500, "halicte"), // au-dessus des secondes ronces
    poll(9620, 460, "papillon"),
    graine(5700),
    graine(6100),
    graine(7450),
    graine(8550),
    graine(9350),
    // spores du pont friable (vite, avant qu'il ne cède)
    spore(6300, 500),
    spore(6420, 500),
    // spores du chemin haut (au-dessus de l'allée des dosettes)
    spore(7820, 360),
    spore(7880, 360),

    // ════════ ACTE III (5 pollinisateurs, spores d'altitude) ════════
    poll(10300, 350, "halicte"), // sur la corniche du tremplin
    poll(10700, 480, "papillon"),
    poll(12330, 190, "halicte"), // au sommet de l'escalier
    poll(13000, 120, "papillon"),
    poll(13250, 100, "halicte"),
    graine(10000),
    graine(10600),
    spore(10220, 340),
    spore(10360, 520), // au-dessus de la dernière dosette
    spore(12500, 260), // branche basse optionnelle
    spore(12550, 260),
    spore(13150, 110),
    spore(13210, 110),
  ];
}

// Lanternes moussues : repères visibles du « dernier point sûr ». S'allument
// au passage de la Marcheuse — petites étapes du pèlerinage.
export function buildCheckpoints(): Checkpoint[] {
  let id = 0;
  const lanterne = (x: number, baseY = GROUND_TOP): Checkpoint => ({
    id: ++id,
    x,
    baseY,
    lit: false,
  });
  return [
    lanterne(1480),
    lanterne(3360),
    lanterne(4520),
    lanterne(6200),
    lanterne(8140),
    lanterne(9740),
    lanterne(10900),
    lanterne(12980, 170),
  ];
}
