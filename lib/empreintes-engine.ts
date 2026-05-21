// La Nuit des Empreintes — puzzle de déduction (lignée du démineur).
//
// Une grille de cimetière, la nuit. Des chats et de la faune y sont cachés.
// Sonder une case sûre révèle le nombre de chats dans les huit cases voisines :
// en croisant ces nombres, on DÉDUIT où sont les chats. On découvre la faune
// en dégageant le terrain sûr — sans jamais déranger un chat.

export type FauneId = "herisson" | "micromammifere" | "fouine";
export type Contenu = "vide" | "chat" | FauneId;

export interface EspeceFaune {
  id: FauneId;
  nom: string;
  embleme: string;
  points: number;
}

export const FAUNE: Record<FauneId, EspeceFaune> = {
  herisson: { id: "herisson", nom: "Hérisson", embleme: "🦔", points: 80 },
  micromammifere: { id: "micromammifere", nom: "Micromammifère", embleme: "🐭", points: 50 },
  fouine: { id: "fouine", nom: "Fouine", embleme: "🐾", points: 150 },
};

export interface Cellule {
  contenu: Contenu;
  chatsVoisins: number;
  revelee: boolean;
  marquee: boolean;
}
export type Grille = Cellule[][];

export interface ConfigNuit {
  nom: string;
  cols: number;
  rows: number;
  chats: number;
  faune: number;
}

export const NUITS: ConfigNuit[] = [
  { nom: "Le petit cimetière", cols: 7, rows: 7, chats: 7, faune: 6 },
  { nom: "Le cimetière paysager", cols: 8, rows: 8, chats: 13, faune: 9 },
  { nom: "La grande nécropole", cols: 9, rows: 8, chats: 19, faune: 11 },
];

export const BONUS_NUIT = 250;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickEspece(): FauneId {
  const r = Math.random();
  if (r < 0.15) return "fouine";
  if (r < 0.5) return "micromammifere";
  return "herisson";
}

function celluleVide(): Cellule {
  return { contenu: "vide", chatsVoisins: 0, revelee: false, marquee: false };
}

// Grille vierge (toutes cases cachées) — affichée avant la première sonde.
export function grilleVierge(cfg: ConfigNuit): Grille {
  return Array.from({ length: cfg.rows }, () =>
    Array.from({ length: cfg.cols }, celluleVide)
  );
}

// Place chats et faune. La première case sondée et ses 8 voisines sont
// garanties sans chat — la première sonde ouvre donc toujours une zone.
export function genererGrille(cfg: ConfigNuit, safeX: number, safeY: number): Grille {
  const { cols, rows, chats, faune } = cfg;
  const g = grilleVierge(cfg);

  const interdit = new Set<string>();
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) interdit.add(`${safeX + dx},${safeY + dy}`);

  const cellules: [number, number][] = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) cellules.push([x, y]);

  const candidatsChats = shuffle(cellules.filter(([x, y]) => !interdit.has(`${x},${y}`)));
  for (let i = 0; i < chats && i < candidatsChats.length; i++) {
    const [x, y] = candidatsChats[i];
    g[y][x].contenu = "chat";
  }

  const candidatsFaune = shuffle(
    cellules.filter(([x, y]) => g[y][x].contenu === "vide" && !(x === safeX && y === safeY))
  );
  for (let i = 0; i < faune && i < candidatsFaune.length; i++) {
    const [x, y] = candidatsFaune[i];
    g[y][x].contenu = pickEspece();
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let n = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && g[ny][nx].contenu === "chat") n++;
        }
      g[y][x].chatsVoisins = n;
    }
  }
  return g;
}

// Révèle une case ; si elle n'a aucun chat voisin, propage aux voisines (flood).
// Mute la grille passée. Renvoie les cases nouvellement révélées.
export function revelerCellule(g: Grille, x: number, y: number): { x: number; y: number }[] {
  const rows = g.length;
  const cols = g[0].length;
  const out: { x: number; y: number }[] = [];
  const pile: [number, number][] = [[x, y]];
  while (pile.length) {
    const item = pile.pop();
    if (!item) break;
    const [cx, cy] = item;
    if (cy < 0 || cy >= rows || cx < 0 || cx >= cols) continue;
    const c = g[cy][cx];
    if (c.revelee || c.marquee) continue;
    c.revelee = true;
    out.push({ x: cx, y: cy });
    // Un flot ne part que d'une case à 0 chat voisin : ses voisines ne sont
    // donc jamais des chats. Le flot ne révèle jamais de chat.
    if (c.contenu !== "chat" && c.chatsVoisins === 0) {
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          pile.push([cx + dx, cy + dy]);
        }
    }
  }
  return out;
}

// Nuit gagnée : toutes les cases non-chat sont révélées.
export function nuitGagnee(g: Grille): boolean {
  for (const row of g) {
    for (const c of row) {
      if (c.contenu !== "chat" && !c.revelee) return false;
    }
  }
  return true;
}

export function clonerGrille(g: Grille): Grille {
  return g.map((row) => row.map((c) => ({ ...c })));
}

export function recompenseGraines(score: number): number {
  return Math.floor(score / 50);
}

const JUGEMENTS_SAINT = [
  "Pas un chat dérangé, pas une bête manquée. Mère Mycorhize aurait hoché la tête.",
  "Tu lis le cimetière comme une page. Frère Hérisson te confierait son carnet.",
  "Relevé d'une logique sans faille. L'Ordre archive, et se tait — c'est un éloge.",
];
const JUGEMENTS_BON = [
  "Du beau travail de déduction. Sœur Compost note quelque chose, brièvement.",
  "Tu as su voir les chats avant de les déranger. C'est tout l'art.",
  "Honorable. Le cimetière a livré la plupart de ses bêtes.",
];
const JUGEMENTS_MOYEN = [
  "Quelques chats dérangés, quelques bêtes perdues. La nuit revient toujours.",
  "Frère Théodule te rappelle que déduire est plus sûr que deviner.",
  "Tu progresses. Croiser les nombres deviendra un réflexe.",
];
const JUGEMENTS_BAS = [
  "Trop de chats dérangés. La faune a fui avant d'être comptée.",
  "L'Ordre ne dit rien. Ce qui, on le sait, est déjà un commentaire.",
  "Recommence : un chiffre, bien lu, vaut mieux qu'une case, mal tentée.",
];

export function jugerEmpreintes(score: number, mammiferes: number): string {
  const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)];
  if (score >= 1900 && mammiferes >= 18) return pick(JUGEMENTS_SAINT);
  if (score >= 1100) return pick(JUGEMENTS_BON);
  if (score >= 500) return pick(JUGEMENTS_MOYEN);
  return pick(JUGEMENTS_BAS);
}
