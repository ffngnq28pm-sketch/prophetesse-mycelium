export type Categorie = "compost" | "recycle" | "maudit";

export interface Dechet {
  id: string;
  nom: string;
  embleme: string;
  categorie: Categorie;
  couleur: string;
}

export const DECHETS: Dechet[] = [
  { id: "epluchure", nom: "Épluchure de pomme", embleme: "🍎", categorie: "compost", couleur: "#7ea36a" },
  { id: "marc", nom: "Marc de café", embleme: "☕", categorie: "compost", couleur: "#825030" },
  { id: "feuille", nom: "Feuille morte", embleme: "🍂", categorie: "compost", couleur: "#a3bf91" },
  { id: "trognon", nom: "Trognon", embleme: "🍐", categorie: "compost", couleur: "#496c39" },
  { id: "coquille", nom: "Coquille d'œuf", embleme: "🥚", categorie: "compost", couleur: "#dcc29c" },
  { id: "carton", nom: "Carton", embleme: "📦", categorie: "recycle", couleur: "#c79e6a" },
  { id: "verre", nom: "Bouteille de verre", embleme: "🍾", categorie: "recycle", couleur: "#5f874c" },
  { id: "papier", nom: "Papier", embleme: "📰", categorie: "recycle", couleur: "#f4ecd2" },
  { id: "metal-propre", nom: "Boîte conserve", embleme: "🥫", categorie: "recycle", couleur: "#b07f48" },
  { id: "dosette", nom: "Dosette d'aluminium", embleme: "⊙", categorie: "maudit", couleur: "#9a1f24" },
  { id: "pile", nom: "Pile usagée", embleme: "🔋", categorie: "maudit", couleur: "#6b1a1d" },
  { id: "sac-plastique", nom: "Sac plastique", embleme: "🛍", categorie: "maudit", couleur: "#a52a2a" },
];

export type Shape = number[][];

export interface Piece {
  shapes: Shape[]; // rotations
  dechetId: string;
}

const I: Shape[] = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ],
];
const O: Shape[] = [
  [
    [1, 1],
    [1, 1],
  ],
];
const T: Shape[] = [
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];
const L: Shape[] = [
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
];
const J: Shape[] = [
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
];
const S: Shape[] = [
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 1],
  ],
];
const Z: Shape[] = [
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 0],
  ],
];

const SHAPES = [I, O, T, L, J, S, Z];

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export interface ActivePiece {
  shapes: Shape[];
  dechetId: string;
  rotation: number;
  x: number;
  y: number;
}

export type Board = (string | null)[][];

export function createBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
}

export function randomDechet(): Dechet {
  return DECHETS[Math.floor(Math.random() * DECHETS.length)];
}

export function spawnPiece(dechetIdSeed?: string): ActivePiece {
  const shapes = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const dechet = dechetIdSeed ? DECHETS.find((d) => d.id === dechetIdSeed) ?? randomDechet() : randomDechet();
  return {
    shapes,
    dechetId: dechet.id,
    rotation: 0,
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(shapes[0][0].length / 2),
    y: 0,
  };
}

export function getShape(p: ActivePiece): Shape {
  return p.shapes[p.rotation % p.shapes.length];
}

export function checkCollision(board: Board, p: ActivePiece, dx = 0, dy = 0, rot = p.rotation): boolean {
  const shape = p.shapes[rot % p.shapes.length];
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const x = p.x + c + dx;
      const y = p.y + r + dy;
      if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) return true;
      if (y >= 0 && board[y][x]) return true;
    }
  }
  return false;
}

export function mergePiece(board: Board, p: ActivePiece): Board {
  const next = board.map((row) => [...row]);
  const shape = getShape(p);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const x = p.x + c;
      const y = p.y + r;
      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        next[y][x] = p.dechetId;
      }
    }
  }
  return next;
}

export interface ClearResult {
  board: Board;
  linesCleared: number;
  categoriesCleared: Categorie[][];
  score: number;
  malus: number;
  curse: boolean;
}

export function clearLines(board: Board): ClearResult {
  const surviving: (string | null)[][] = [];
  const categoriesCleared: Categorie[][] = [];
  let linesCleared = 0;
  let score = 0;
  let malus = 0;
  let curse = false;

  for (let r = 0; r < BOARD_HEIGHT; r++) {
    const row = board[r];
    if (row.every((cell) => cell !== null)) {
      const cats = row.map((id) => {
        const d = DECHETS.find((x) => x.id === id);
        return d?.categorie ?? "recycle";
      }) as Categorie[];
      categoriesCleared.push(cats);
      linesCleared++;
      const compostCount = cats.filter((c) => c === "compost").length;
      const recycleCount = cats.filter((c) => c === "recycle").length;
      const mauditCount = cats.filter((c) => c === "maudit").length;
      if (mauditCount === 0) {
        const base = compostCount * 30 + recycleCount * 12;
        score += base;
        if (compostCount === BOARD_WIDTH) score += 80; // ligne sainte
      } else {
        curse = true;
        malus += mauditCount * 15;
        score += compostCount * 5 + recycleCount * 4;
      }
    } else {
      surviving.push(row);
    }
  }

  while (surviving.length < BOARD_HEIGHT) {
    surviving.unshift(Array(BOARD_WIDTH).fill(null));
  }

  // Bonus combo
  if (linesCleared > 1) score += (linesCleared - 1) * 25;

  return { board: surviving, linesCleared, categoriesCleared, score, malus, curse };
}

export function tickSpeed(level: number): number {
  return Math.max(120, 700 - (level - 1) * 70);
}

export function getDechet(id: string): Dechet | undefined {
  return DECHETS.find((d) => d.id === id);
}
