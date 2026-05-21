import { NIVEAUX, Niveau, COLS, ROWS } from "@/data/pac-niveaux";
import { FANTOMES, Fantome, FantomeAI } from "@/data/fantomes";

export interface Cell {
  wall: boolean;
  insect: boolean;
  coffee: boolean;
  tunnel: boolean;
  door: boolean;
  house: boolean;
}

export type Dir = { x: number; y: number };
export const DIR_UP: Dir = { x: 0, y: -1 };
export const DIR_DOWN: Dir = { x: 0, y: 1 };
export const DIR_LEFT: Dir = { x: -1, y: 0 };
export const DIR_RIGHT: Dir = { x: 1, y: 0 };
export const DIR_NONE: Dir = { x: 0, y: 0 };
const DIRS: Dir[] = [DIR_UP, DIR_DOWN, DIR_LEFT, DIR_RIGHT];

export type GhostMode = "chase" | "frightened" | "eaten" | "house";

export interface Olivia {
  cx: number;
  cy: number;
  dir: Dir;
  queued: Dir;
  speed: number; // cells per second
  lives: number;
  angryUntil: number; // timestamp ms when sainte colère ends; 0 if not angry
  invulnerableUntil: number;
}

export interface Ghost {
  id: string;
  cx: number;
  cy: number;
  dir: Dir;
  mode: GhostMode;
  spawnX: number;
  spawnY: number;
  ai: FantomeAI;
  data: Fantome;
  speed: number;
  releaseAt: number; // ms timestamp when allowed to leave house
  justExited: boolean; // true au premier tick chase post-sortie, autorise demi-tour
}

export interface Stats {
  score: number;
  niveauIndex: number;
  insectsTotal: number;
  insectsRemaining: number;
  ghostsTabasses: number;
  ghostsCombo: number; // count tabassés in current Colère
}

export interface PacState {
  grid: Cell[][];
  niveau: Niveau;
  olivia: Olivia;
  ghosts: Ghost[];
  stats: Stats;
  status: "playing" | "paused" | "levelComplete" | "dying" | "gameOver" | "ready";
  message: string | null;
  messageUntil: number;
  effectFlashUntil: number;
}

const TILE_INSECT_RARE_IDS = new Set<string>(); // computed per level

export function parseNiveau(niveau: Niveau): {
  grid: Cell[][];
  oliviaSpawn: { x: number; y: number };
  ghostSpawns: { x: number; y: number }[];
  insectsTotal: number;
} {
  const grid: Cell[][] = [];
  let oliviaSpawn = { x: Math.floor(COLS / 2), y: ROWS - 4 };
  const ghostSpawns: { x: number; y: number }[] = [];
  let insectsTotal = 0;

  for (let y = 0; y < ROWS; y++) {
    const row: Cell[] = [];
    const line = niveau.layout[y] ?? "".padEnd(COLS, " ");
    for (let x = 0; x < COLS; x++) {
      const ch = line[x] ?? " ";
      const cell: Cell = {
        wall: ch === "#",
        insect: false,
        coffee: false,
        tunnel: false,
        door: ch === "-",
        house: ch === "H" || ch === "G" || ch === "-",
      };
      if (ch === ".") {
        cell.insect = true;
        insectsTotal++;
      } else if (ch === "o") {
        cell.coffee = true;
      } else if (ch === "T") {
        cell.tunnel = true;
      } else if (ch === "P") {
        oliviaSpawn = { x, y };
      } else if (ch === "G") {
        ghostSpawns.push({ x, y });
      }
      row.push(cell);
    }
    grid.push(row);
  }
  return { grid, oliviaSpawn, ghostSpawns, insectsTotal };
}

export function createInitialState(levelIndex: number, livesCarry?: number, scoreCarry?: number): PacState {
  const niveau = NIVEAUX[levelIndex];
  const { grid, oliviaSpawn, ghostSpawns, insectsTotal } = parseNiveau(niveau);

  const olivia: Olivia = {
    cx: oliviaSpawn.x,
    cy: oliviaSpawn.y,
    dir: DIR_LEFT,
    queued: DIR_LEFT,
    speed: 5.32, // V2.5 : -5% pour qu'Olivia soit un peu plus posée. La vitesse des fantômes est dérivée → ratio conservé.
    lives: livesCarry ?? 3,
    angryUntil: 0,
    invulnerableUntil: 0,
  };

  const ghostSlots = [...ghostSpawns];
  while (ghostSlots.length < 4) {
    // Si pas assez de G dans le layout, dupliquer les spawns existants plutôt que tomber au centre (qui peut être une porte)
    if (ghostSpawns.length > 0) {
      ghostSlots.push(ghostSpawns[ghostSlots.length % ghostSpawns.length]);
    } else {
      ghostSlots.push({ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) });
    }
  }

  const ghosts: Ghost[] = FANTOMES.map((f, i) => {
    const slot = ghostSlots[i] ?? ghostSlots[0];
    return {
      id: f.id,
      cx: slot.x,
      cy: slot.y,
      dir: DIR_UP,
      // Tous démarrent en mode house : ils sortent un par un via le release timer.
      // Cendrillon (i=0) sort immédiatement.
      mode: "house",
      spawnX: slot.x,
      spawnY: slot.y,
      ai: f.ai,
      data: f,
      speed: olivia.speed * niveau.ghostSpeedFactor * 0.97, // -3% sur la vitesse des fantômes
      releaseAt: performance.now() + i * 3500,
      justExited: false,
    };
  });

  return {
    grid,
    niveau,
    olivia,
    ghosts,
    stats: {
      score: scoreCarry ?? 0,
      niveauIndex: levelIndex,
      insectsTotal,
      insectsRemaining: insectsTotal,
      ghostsTabasses: 0,
      ghostsCombo: 0,
    },
    status: "ready",
    message: "Prêt·e ?",
    messageUntil: performance.now() + 1500,
    effectFlashUntil: 0,
  };
}

export function inBounds(x: number, y: number): boolean {
  return y >= 0 && y < ROWS && x >= 0 && x < COLS;
}

export function isWall(state: PacState, x: number, y: number): boolean {
  if (!inBounds(x, y)) return false;
  return state.grid[y][x].wall;
}

// allowHouse: si true, les fantômes peuvent traverser door + house cells (utile en sortie/retour maison).
// Olivia (isGhost=false) ne peut jamais entrer dans la maison ni traverser une porte.
export function canMoveTo(state: PacState, x: number, y: number, isGhost: boolean, allowHouse = false): boolean {
  if (!inBounds(x, y)) return false;
  const c = state.grid[y][x];
  if (c.wall) return false;
  if (!isGhost && (c.door || c.house)) return false;
  if (isGhost && !allowHouse && (c.door || c.house)) return false;
  return true;
}

export function distance(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

function dirEqual(a: Dir, b: Dir): boolean {
  return a.x === b.x && a.y === b.y;
}

function dirOpposite(a: Dir, b: Dir): boolean {
  return a.x === -b.x && a.y === -b.y && (a.x !== 0 || a.y !== 0);
}

function isAtCellCenter(cx: number, cy: number, tol = 0.06): boolean {
  return Math.abs(cx - Math.round(cx)) < tol && Math.abs(cy - Math.round(cy)) < tol;
}

export function step(state: PacState, dtSec: number, now: number): PacState {
  if (state.status !== "playing") return state;

  // Olivia movement
  const o = state.olivia;
  const onCenter = isAtCellCenter(o.cx, o.cy);
  const oxR = Math.round(o.cx);
  const oyR = Math.round(o.cy);

  // Apply queued direction at center if possible
  if (onCenter && (o.queued.x !== o.dir.x || o.queued.y !== o.dir.y)) {
    if (canMoveTo(state, oxR + o.queued.x, oyR + o.queued.y, false)) {
      o.dir = o.queued;
      o.cx = oxR;
      o.cy = oyR;
    }
  }

  // Try to move in current direction
  const dt = dtSec;
  let nx = o.cx + o.dir.x * o.speed * dt;
  let ny = o.cy + o.dir.y * o.speed * dt;

  // Check the next cell we'd enter
  const targetCellX = Math.round(o.cx + o.dir.x * 0.51);
  const targetCellY = Math.round(o.cy + o.dir.y * 0.51);
  if (!canMoveTo(state, targetCellX, targetCellY, false)) {
    // collision: snap to nearest cell along current direction
    if (Math.abs(o.cx - Math.round(o.cx)) < 0.1 && Math.abs(o.cy - Math.round(o.cy)) < 0.1) {
      nx = Math.round(o.cx);
      ny = Math.round(o.cy);
      o.dir = DIR_NONE;
    } else {
      // continue until we hit center
      nx = o.cx + o.dir.x * o.speed * dt;
      ny = o.cy + o.dir.y * o.speed * dt;
      if ((o.dir.x > 0 && nx > Math.round(o.cx)) || (o.dir.x < 0 && nx < Math.round(o.cx)) ||
          (o.dir.y > 0 && ny > Math.round(o.cy)) || (o.dir.y < 0 && ny < Math.round(o.cy))) {
        nx = Math.round(o.cx);
        ny = Math.round(o.cy);
        o.dir = DIR_NONE;
      }
    }
  }

  o.cx = nx;
  o.cy = ny;

  // Tunnel warp
  if (o.cx < -0.5) o.cx = COLS - 0.5;
  if (o.cx > COLS - 0.5) o.cx = -0.5;

  // Insect / coffee collection at current cell
  const cellX = Math.round(o.cx);
  const cellY = Math.round(o.cy);
  if (inBounds(cellX, cellY)) {
    const c = state.grid[cellY][cellX];
    if (c.insect) {
      c.insect = false;
      state.stats.insectsRemaining--;
      state.stats.score += 10;
    }
    if (c.coffee) {
      c.coffee = false;
      state.stats.score += 50;
      o.angryUntil = now + 8000;
      state.effectFlashUntil = now + 220;
      state.stats.ghostsCombo = 0;
      // Set ghosts frightened
      for (const g of state.ghosts) {
        if (g.mode === "chase") {
          g.mode = "frightened";
          // reverse direction
          g.dir = { x: -g.dir.x, y: -g.dir.y };
        }
      }
    }
  }

  // Sainte Colère expiry
  if (o.angryUntil && now > o.angryUntil) {
    o.angryUntil = 0;
    for (const g of state.ghosts) {
      if (g.mode === "frightened") g.mode = "chase";
    }
  }

  // Update ghosts
  for (const g of state.ghosts) {
    updateGhost(state, g, dtSec, now);
  }

  // Collision with ghosts
  for (const g of state.ghosts) {
    if (g.mode === "eaten" || g.mode === "house") continue;
    const dist = distance(g.cx, g.cy, o.cx, o.cy);
    if (dist < 0.7) {
      if (g.mode === "frightened") {
        // Tabasser
        g.mode = "eaten";
        g.dir = DIR_UP;
        state.stats.ghostsTabasses++;
        state.stats.ghostsCombo++;
        const base = 200;
        const bonus = state.stats.ghostsCombo >= 2 ? 200 * state.stats.ghostsCombo : 0;
        state.stats.score += base + bonus;
        const phrases = g.data.defaitPhrase;
        state.message = phrases[Math.floor(Math.random() * phrases.length)];
        state.messageUntil = now + 1400;
      } else if (now > o.invulnerableUntil) {
        // Olivia perd une vie
        o.lives--;
        if (o.lives <= 0) {
          state.status = "gameOver";
          state.message = "« Sapristi. »";
          state.messageUntil = now + 99999;
        } else {
          state.status = "dying";
          state.message = "Touchée par " + g.data.nom;
          state.messageUntil = now + 1200;
        }
      }
    }
  }

  // Check level complete
  if (state.stats.insectsRemaining === 0) {
    state.status = "levelComplete";
    state.message = state.niveau.versetFin;
    state.messageUntil = now + 4200;
  }

  return state;
}

function updateGhost(state: PacState, g: Ghost, dt: number, now: number) {
  // Mode: house — wait until release, then move up through the door to an exit cell just above it.
  if (g.mode === "house") {
    if (now < g.releaseAt) return;
    const door = findDoorAbove(state, g.cx, g.cy);
    if (!door) {
      g.mode = "chase";
      g.dir = DIR_UP;
      return;
    }
    // Exit cell = cellule juste AU-DESSUS de la porte (en chemin libre)
    const exitX = door.x;
    const exitY = door.y - 1;
    moveTowards(state, g, exitX, exitY, dt, true);
    if (Math.abs(g.cx - exitX) < 0.15 && Math.abs(g.cy - exitY) < 0.15) {
      g.cx = exitX;
      g.cy = exitY;
      g.mode = state.olivia.angryUntil ? "frightened" : "chase";
      g.dir = DIR_UP;
      g.justExited = true; // permet au pickGhostDirection suivant d'explorer toutes les dirs (no-180 désactivé)
      // Pick une direction immédiatement pour ne pas attendre un frame en DIR_UP qui pourrait être bloqué.
      pickGhostDirection(state, g);
    }
    return;
  }

  // Mode: eaten — retour à la maison via spawn (moveTowards traverse les murs)
  if (g.mode === "eaten") {
    moveTowards(state, g, g.spawnX, g.spawnY, dt * 1.6, true);
    if (Math.abs(g.cx - g.spawnX) < 0.15 && Math.abs(g.cy - g.spawnY) < 0.15) {
      g.cx = g.spawnX;
      g.cy = g.spawnY;
      g.mode = "house";
      g.releaseAt = now + 2200;
    }
    return;
  }

  // chase / frightened
  const speed = g.mode === "frightened" ? g.speed * 0.55 : g.speed;

  // Test : la cellule devant nous est-elle franchissable ?
  const aheadX = Math.round(g.cx + g.dir.x * 0.51);
  const aheadY = Math.round(g.cy + g.dir.y * 0.51);
  if (!canMoveTo(state, aheadX, aheadY, true)) {
    // Bloqué (cul-de-sac ou mur devant) : snap au centre, autoriser demi-tour, re-décider.
    g.cx = Math.round(g.cx);
    g.cy = Math.round(g.cy);
    g.justExited = true; // réutilise le flag pour autoriser la marche arrière au prochain pick
    pickGhostDirection(state, g);
    return;
  }

  // Mouvement effectif. On clampe au PROCHAIN centre de cellule atteint,
  // sans jamais le dépasser : sinon le snap (g.cx = newCell) téléportait le
  // fantôme en avant à chaque cellule → vitesse réelle ~1,85× la nominale.
  const beforeX = g.cx;
  const beforeY = g.cy;
  g.cx += g.dir.x * speed * dt;
  g.cy += g.dir.y * speed * dt;

  let reachedCenter = false;
  if (g.dir.x > 0) {
    const c = Math.floor(beforeX) + 1;
    if (g.cx >= c) { g.cx = c; reachedCenter = true; }
  } else if (g.dir.x < 0) {
    const c = Math.ceil(beforeX) - 1;
    if (g.cx <= c) { g.cx = c; reachedCenter = true; }
  } else if (g.dir.y > 0) {
    const c = Math.floor(beforeY) + 1;
    if (g.cy >= c) { g.cy = c; reachedCenter = true; }
  } else if (g.dir.y < 0) {
    const c = Math.ceil(beforeY) - 1;
    if (g.cy <= c) { g.cy = c; reachedCenter = true; }
  }

  if (reachedCenter) {
    // Aligne l'axe perpendiculaire pour rester centré dans le couloir,
    // puis re-décide la direction depuis ce centre exact.
    g.cx = Math.round(g.cx);
    g.cy = Math.round(g.cy);
    pickGhostDirection(state, g);
  }

  // Tunnel
  if (g.cx < -0.5) g.cx = COLS - 0.5;
  if (g.cx > COLS - 0.5) g.cx = -0.5;
}

function findDoorAbove(state: PacState, cx: number, cy: number): { x: number; y: number } | null {
  // Renvoie la porte la plus proche située au-dessus (ou à la même ligne) du fantôme.
  const rx = Math.round(cx);
  const ry = Math.round(cy);
  let best: { x: number; y: number; d: number } | null = null;
  for (let y = 0; y <= ry; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!state.grid[y][x].door) continue;
      const dx = x - rx;
      const dy = y - ry;
      const d = dx * dx + dy * dy;
      if (!best || d < best.d) best = { x, y, d };
    }
  }
  return best ? { x: best.x, y: best.y } : null;
}

function pickGhostDirection(state: PacState, g: Ghost) {
  const cx = Math.round(g.cx);
  const cy = Math.round(g.cy);
  const opts: Dir[] = [];
  // Si justExited (sortie maison ce frame), la règle no-180 ne s'applique pas — le fantôme peut partir dans toutes les directions valides.
  const allowReverse = g.justExited;
  if (g.justExited) {
    g.justExited = false;
  }
  for (const d of DIRS) {
    if (!allowReverse && d.x === -g.dir.x && d.y === -g.dir.y) continue;
    if (canMoveTo(state, cx + d.x, cy + d.y, true)) opts.push(d);
  }
  if (opts.length === 0) {
    // Cul-de-sac : autoriser le demi-tour en fallback
    for (const d of DIRS) {
      if (canMoveTo(state, cx + d.x, cy + d.y, true)) opts.push(d);
    }
  }
  if (opts.length === 0) {
    // Cas extrême : tout est bloqué (sur un mur p.ex après moveTowards) → on autorise l'entrée maison pour se débloquer
    for (const d of DIRS) {
      if (canMoveTo(state, cx + d.x, cy + d.y, true, true)) opts.push(d);
    }
  }
  if (opts.length === 0) return;

  if (g.mode === "frightened") {
    g.dir = opts[Math.floor(Math.random() * opts.length)];
    return;
  }

  // Determine target by AI
  const target = ghostTarget(state, g);
  let best = opts[0];
  let bestDist = Infinity;
  for (const d of opts) {
    const nx = cx + d.x;
    const ny = cy + d.y;
    const dist = distance(nx, ny, target.x, target.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = d;
    }
  }
  g.dir = best;
}

function ghostTarget(state: PacState, g: Ghost): { x: number; y: number } {
  const o = state.olivia;
  const ox = Math.round(o.cx);
  const oy = Math.round(o.cy);
  switch (g.ai) {
    case "lent":
      return { x: ox, y: oy };
    case "anticipateur":
      return { x: ox + o.dir.x * 3, y: oy + o.dir.y * 3 };
    case "erratique":
      if (Math.random() < 0.6) {
        // pick random cell as target
        return {
          x: Math.floor(Math.random() * COLS),
          y: Math.floor(Math.random() * ROWS),
        };
      }
      return { x: ox, y: oy };
    case "patrouille": {
      const ratio =
        (state.stats.insectsTotal - state.stats.insectsRemaining) / state.stats.insectsTotal;
      if (ratio > state.niveau.innommeThreshold) return { x: ox, y: oy };
      // patrol corners
      const corners = [
        { x: 1, y: 1 },
        { x: COLS - 2, y: 1 },
        { x: 1, y: ROWS - 2 },
        { x: COLS - 2, y: ROWS - 2 },
      ];
      const idx = Math.floor(performance.now() / 4000) % 4;
      return corners[idx];
    }
  }
}

function moveTowards(state: PacState, g: Ghost, tx: number, ty: number, dt: number, asGhost: boolean) {
  const dx = tx - g.cx;
  const dy = ty - g.cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 0.05) return;
  const vx = (dx / dist) * g.speed * dt;
  const vy = (dy / dist) * g.speed * dt;
  // Allow free movement through walls only for eaten and house states
  g.cx += vx;
  g.cy += vy;
  if (Math.abs(vx) > Math.abs(vy)) g.dir = vx > 0 ? DIR_RIGHT : DIR_LEFT;
  else g.dir = vy > 0 ? DIR_DOWN : DIR_UP;
}

export function respawnAfterDeath(state: PacState): PacState {
  const niveau = state.niveau;
  const { oliviaSpawn, ghostSpawns } = parseNiveau(niveau);
  const o = state.olivia;
  o.cx = oliviaSpawn.x;
  o.cy = oliviaSpawn.y;
  o.dir = DIR_LEFT;
  o.queued = DIR_LEFT;
  o.angryUntil = 0;
  o.invulnerableUntil = performance.now() + 1500;
  for (let i = 0; i < state.ghosts.length; i++) {
    const g = state.ghosts[i];
    const slot = ghostSpawns[i] ?? ghostSpawns[0] ?? { x: g.spawnX, y: g.spawnY };
    g.cx = slot.x;
    g.cy = slot.y;
    g.dir = DIR_UP;
    g.mode = "house";
    g.releaseAt = performance.now() + 1500 + i * 2500;
  }
  state.status = "playing";
  state.message = null;
  return state;
}

export function NIVEAUX_TOTAL(): number {
  return NIVEAUX.length;
}
