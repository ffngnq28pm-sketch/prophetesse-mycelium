// La Nuit des Empreintes — moteur du jeu d'observation, tour par tour.
// Inspiré du protocole de relevé des mammifères par tunnels à empreintes
// de l'étude « Cimetières vivants » (ARB Île-de-France).
//
// Deux décisions portent le jeu :
//  — le PLACEMENT des tunnels, guidé par un objectif de carnet et les habitats ;
//  — la LECTURE des empreintes : on ne reconnaît pas une image, on déduit
//    l'espèce à partir d'un relevé partiel (deux indices sur trois lisibles).

export type MorphoId = "herisson" | "micromammifere" | "fouine" | "chat" | "vide";
export type TraitKey = "doigts" | "griffes" | "taille";

export const TRAIT_LABEL: Record<TraitKey, string> = {
  doigts: "Doigts",
  griffes: "Griffes",
  taille: "Taille",
};

export interface Morphogroupe {
  id: MorphoId;
  nom: string;
  embleme: string;
  points: number;
  recense: boolean;
  indice: string;
  traits: Record<TraitKey, string>;
}

export const MORPHOGROUPES: Record<MorphoId, Morphogroupe> = {
  herisson: {
    id: "herisson",
    nom: "Hérisson",
    embleme: "🦔",
    points: 120,
    recense: true,
    indice: "Empreinte large et trapue, cinq doigts griffus nettement écartés.",
    traits: { doigts: "Cinq", griffes: "Présentes", taille: "Large" },
  },
  micromammifere: {
    id: "micromammifere",
    nom: "Micromammifère",
    embleme: "🐭",
    points: 60,
    recense: true,
    indice: "Traces minuscules en étoile — mulot, musaraigne ou campagnol confondus.",
    traits: { doigts: "Minuscules", griffes: "Indistinctes", taille: "Très petite" },
  },
  fouine: {
    id: "fouine",
    nom: "Fouine",
    embleme: "🐾",
    points: 170,
    recense: true,
    indice: "Empreinte élancée, cinq doigts en demi-cercle, griffes fines. Rare.",
    traits: { doigts: "Cinq", griffes: "Présentes", taille: "Moyenne" },
  },
  chat: {
    id: "chat",
    nom: "Chat domestique",
    embleme: "🐈",
    points: 25,
    recense: false,
    indice: "Coussinet rond, quatre doigts, aucune griffe. Les autres bêtes ont fui.",
    traits: { doigts: "Quatre", griffes: "Absentes", taille: "Moyenne" },
  },
  vide: {
    id: "vide",
    nom: "Tunnel vide",
    embleme: "·",
    points: 0,
    recense: false,
    indice: "Aucune empreinte. La nuit fut discrète.",
    traits: { doigts: "—", griffes: "—", taille: "—" },
  },
};

export const IDENTIFIABLES: MorphoId[] = ["herisson", "micromammifere", "fouine", "chat"];

export type IndiceTerrain = null | "chat" | "fraiche" | "fauche";

export interface Habitat {
  id: string;
  nom: string;
  ambiance: string;
  poids: Record<MorphoId, number>;
}

// Pondérations tirées des tendances du mémoire : le hérisson préfère le
// minéralisé, les micromammifères la végétation haute, le chat rôde dans les allées.
export const HABITATS: Habitat[] = [
  {
    id: "allee",
    nom: "Allée minérale",
    ambiance: "Gravier sec entre les rangées de tombes.",
    poids: { herisson: 4, micromammifere: 1, fouine: 1, chat: 4, vide: 3 },
  },
  {
    id: "prairie",
    nom: "Prairie en fauche tardive",
    ambiance: "Herbes hautes laissées libres au carré 28.",
    poids: { herisson: 2, micromammifere: 5, fouine: 1, chat: 1, vide: 2 },
  },
  {
    id: "haie",
    nom: "Vieille haie",
    ambiance: "Un corridor de feuillage qui relie deux carrés.",
    poids: { herisson: 4, micromammifere: 3, fouine: 2, chat: 1, vide: 2 },
  },
  {
    id: "mur",
    nom: "Pied de vieux mur",
    ambiance: "Pierres descellées, interstices et fraîcheur.",
    poids: { herisson: 1, micromammifere: 4, fouine: 3, chat: 2, vide: 2 },
  },
  {
    id: "ifs",
    nom: "Sous les ifs",
    ambiance: "Ombre dense, litière épaisse, silence.",
    poids: { herisson: 1, micromammifere: 3, fouine: 3, chat: 2, vide: 3 },
  },
  {
    id: "lisiere",
    nom: "Lisière du carré abandonné",
    ambiance: "La friche sacrée que nul ne fauche.",
    poids: { herisson: 3, micromammifere: 4, fouine: 3, chat: 1, vide: 1 },
  },
];

// Les deux espèces que l'habitat favorise — affiché pour guider le placement.
export function favorisHabitat(h: Habitat): MorphoId[] {
  return (Object.keys(h.poids) as MorphoId[])
    .filter((k) => k !== "vide")
    .sort((a, b) => h.poids[b] - h.poids[a])
    .slice(0, 2);
}

export interface Emplacement {
  habitat: Habitat;
  indice: IndiceTerrain;
}

// ===== Objectifs de carnet =====
export interface ObjectifCarnet {
  id: string;
  demande: string; // « Le carnet réclame … »
  detail: string;
  bonus: number;
  verifier: (morphos: MorphoId[]) => boolean;
}

export const OBJECTIFS: ObjectifCarnet[] = [
  {
    id: "herisson",
    demande: "un Hérisson",
    detail: "Capture au moins un hérisson dans tes trois tunnels.",
    bonus: 220,
    verifier: (m) => m.includes("herisson"),
  },
  {
    id: "fouine",
    demande: "une Fouine",
    detail: "La fouine est rare : vise les habitats qui la favorisent.",
    bonus: 340,
    verifier: (m) => m.includes("fouine"),
  },
  {
    id: "micro2",
    demande: "deux Micromammifères",
    detail: "Il en faut deux : la prairie haute est ton amie.",
    bonus: 260,
    verifier: (m) => m.filter((x) => x === "micromammifere").length >= 2,
  },
  {
    id: "plein",
    demande: "trois tunnels habités",
    detail: "Aucun tunnel vide cette nuit. Évite les terrains fauchés.",
    bonus: 240,
    verifier: (m) => m.every((x) => x !== "vide"),
  },
  {
    id: "sansChat",
    demande: "une nuit sans chat",
    detail: "Aucun chat dans tes relevés. Fuis les odeurs de chat.",
    bonus: 240,
    verifier: (m) => !m.includes("chat"),
  },
  {
    id: "varie",
    demande: "trois espèces différentes",
    detail: "Tes trois tunnels doivent livrer trois bêtes distinctes.",
    bonus: 320,
    verifier: (m) => new Set(m.filter((x) => x !== "vide")).size >= 3,
  },
];

export const TUNNELS_PAR_NUIT = 3;
export const NUITS_TOTAL = 5;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface Nuit {
  emplacements: Emplacement[];
  objectif: ObjectifCarnet;
}

// Génère une nuit : six emplacements (avec indices de terrain) + un objectif de carnet.
export function genererNuit(): Nuit {
  const habitats = shuffle(HABITATS);
  const indices: IndiceTerrain[] = [null, null, null, null, null, null];
  const nbIndices = 1 + Math.floor(Math.random() * 3);
  const types: IndiceTerrain[] = ["chat", "fraiche", "fauche"];
  const positions = shuffle([0, 1, 2, 3, 4, 5]).slice(0, nbIndices);
  for (const p of positions) {
    indices[p] = types[Math.floor(Math.random() * types.length)];
  }
  return {
    emplacements: habitats.map((habitat, i) => ({ habitat, indice: indices[i] })),
    objectif: OBJECTIFS[Math.floor(Math.random() * OBJECTIFS.length)],
  };
}

// Résout un tunnel posé : tire un morphogroupe selon l'habitat et l'indice de terrain.
export function resoudreTunnel(emp: Emplacement): MorphoId {
  const poids: Record<MorphoId, number> = { ...emp.habitat.poids };
  if (emp.indice === "chat") {
    poids.chat *= 3;
    poids.herisson = Math.max(1, Math.round(poids.herisson / 2));
    poids.micromammifere = Math.max(1, Math.round(poids.micromammifere / 2));
  } else if (emp.indice === "fraiche") {
    poids.vide = Math.max(1, Math.round(poids.vide / 2));
    poids.herisson += 2;
    poids.micromammifere += 2;
    poids.fouine += 1;
  } else if (emp.indice === "fauche") {
    poids.vide += 8;
  }
  const total = (Object.values(poids) as number[]).reduce((s, n) => s + n, 0);
  let r = Math.random() * total;
  for (const id of Object.keys(poids) as MorphoId[]) {
    r -= poids[id];
    if (r <= 0) return id;
  }
  return "vide";
}

// Deux traits sur trois sont lisibles sur l'empreinte ; le troisième est brouillé.
export function traitsLisibles(): TraitKey[] {
  const tous: TraitKey[] = ["doigts", "griffes", "taille"];
  const cache = Math.floor(Math.random() * 3);
  return tous.filter((_, i) => i !== cache);
}

export function recompenseGraines(score: number): number {
  return Math.floor(score / 50);
}

const JUGEMENTS_SAINT = [
  "Relevé impeccable. Mère Mycorhize aurait, dit-on, hoché la tête une fois.",
  "Frère Hérisson lui-même n'aurait pas mieux lu ces empreintes.",
  "L'Ordre archive ton carnet. Personne ne le lira. C'est très bien ainsi.",
];
const JUGEMENTS_BON = [
  "Du bon travail de veilleur. Sœur Compost note quelque chose, brièvement.",
  "Tu sais déduire une bête de deux indices. C'est un vrai savoir.",
  "Honorable. La nuit a livré ses secrets sans trop résister.",
];
const JUGEMENTS_MOYEN = [
  "Quelques empreintes mal déduites, quelques tunnels mal placés. La nuit pardonne.",
  "Frère Théodule te rappelle que même les Vers de Terre se trompent d'urne.",
  "Tu progresses. Lire la nuit est un art lent.",
];
const JUGEMENTS_BAS = [
  "Carnet maigre. Le chat, lui, a passé une bonne nuit.",
  "L'Ordre ne dit rien. Ce qui, on le sait, est déjà un commentaire.",
  "Recommence. La patience est une vertu mycélienne, et elle se travaille la nuit.",
];

export function jugerEmpreintes(score: number, mammiferes: number): string {
  const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)];
  if (score >= 2200 && mammiferes >= 9) return pick(JUGEMENTS_SAINT);
  if (score >= 1300) return pick(JUGEMENTS_BON);
  if (score >= 600) return pick(JUGEMENTS_MOYEN);
  return pick(JUGEMENTS_BAS);
}
