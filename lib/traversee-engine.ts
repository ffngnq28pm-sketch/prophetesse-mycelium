// Moteur du platformer « Le Sentier des Spores ».
// Logique pure : aucune dépendance DOM, aucun rendu. Le composant React
// pilote la boucle RAF, lit l'état et dessine. Toute la physique tourne en
// pas de temps fixe (1/120 s) pour un game feel déterministe et stable.

import {
  buildPlatforms,
  buildHazards,
  buildCollectibles,
  SANCTUAIRE,
  SPAWN,
  WORLD_W,
  WORLD_H,
  WORLD_BOTTOM,
} from "@/data/traversee-niveau";

// ============ TYPES ============

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type PlatformKind = "sol" | "tombe" | "tronc" | "muret" | "racine";

export interface Platform extends Rect {
  kind: PlatformKind;
  oneWay?: boolean;
}

export type HazardKind = "dosette" | "pesticide" | "tondeuse";

export interface Hazard extends Rect {
  id: number;
  kind: HazardKind;
  active: boolean; // false une fois neutralisé (composté / reverdi)
  // Patrouille horizontale (dosette qui roule, tondeuse qui va-et-vient)
  minX?: number;
  maxX?: number;
  vx?: number;
  spin?: number; // angle de roulement cumulé (dosette), pour le rendu
  convertedAt?: number; // ms — instant de neutralisation (anim compost / reverdissement)
}

export type CollectibleKind = "pollinisateur" | "graine";
export type PollinisateurEspece = "halicte" | "papillon";

export interface Collectible extends Rect {
  id: number;
  kind: CollectibleKind;
  taken: boolean;
  bobPhase: number;
  espece?: PollinisateurEspece;
}

export interface Olivia {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  facing: 1 | -1;
  onGround: boolean;
  coyote: number; // temps restant de tolérance de saut après avoir quitté le sol
  jumpBuffer: number; // fenêtre de saut pré-enregistré
  jumpHeld: boolean;
  jumping: boolean;
  jumpCut: boolean;
  netUntil: number; // ms — fin du balayage de filet en cours
  netCooldown: number; // s — temps avant le prochain coup possible
  walkPhase: number; // cycle de marche, pour l'animation
  squash: number; // 0..1, écrasement à l'atterrissage (décroît)
  invulnUntil: number; // ms — invulnérabilité après réapparition
  lastSafe: { x: number; y: number }; // dernier point sûr (checkpoint implicite)
}

export interface TraverseeStats {
  startTime: number;
  elapsedMs: number;
  pollinisateursCaught: number;
  pollinisateursTotal: number;
  grainesCaught: number;
  grainesTotal: number;
  dosettesHit: number; // contacts subis (sert à la relique « immaculée »)
  dosettesConverties: number;
}

export interface TraverseeEvents {
  landed: { x: number; y: number } | null;
  caught: { x: number; y: number } | null;
  converted: { x: number; y: number } | null;
  graine: { x: number; y: number } | null;
  respawn: boolean;
  netSwing: boolean;
  won: boolean;
}

export type TraverseeStatus = "intro" | "playing" | "won";

export interface TraverseeState {
  status: TraverseeStatus;
  olivia: Olivia;
  platforms: Platform[];
  hazards: Hazard[];
  collectibles: Collectible[];
  sanctuaire: Rect;
  worldW: number;
  worldH: number;
  worldBottom: number;
  cam: { x: number; y: number };
  stats: TraverseeStats;
  time: number; // ms (temps de la boucle)
  acc: number; // accumulateur de pas fixe
  prevJump: boolean;
  prevNet: boolean;
  events: TraverseeEvents;
  message: string | null;
  messageUntil: number;
}

export interface Input {
  left: boolean;
  right: boolean;
  jump: boolean;
  net: boolean;
}

// ============ CONSTANTES PHYSIQUES ============

const H = 1 / 120; // pas de temps fixe
const MAX_SUBSTEPS = 8;

const GRAVITY = 2100;
const MOVE_MAX = 232;
const ACCEL_GROUND = 2000;
const ACCEL_AIR = 1350;
const FRICTION_GROUND = 2300;
const FRICTION_AIR = 240;
const JUMP_V = 660;
const JUMP_CUT = 0.45;
const MAX_FALL = 920;
const COYOTE = 0.09;
const JUMP_BUFFER = 0.11;

const NET_DURATION_MS = 260;
const NET_COOLDOWN = 0.34;
const NET_REACH = 34;

const OLIVIA_W = 24;
const OLIVIA_H = 38;

const VIEW_H_BASE = 460; // hauteur de vue de référence (monde)
const MIN_VIEW_W = 430; // garantit assez de contexte horizontal en portrait
const CAM_LERP = 9; // vitesse de rattrapage de la caméra

const RESPAWN_PHRASES = [
  "Le mycélium te redonne pied.",
  "La terre te rattrape, douce et patiente.",
  "On recommence le passage. Sans hâte.",
  "Une racine te relève. Respire.",
  "L'Ordre ne connaît pas la chute, seulement la reprise.",
];

// ============ HELPERS ============

function overlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function freshEvents(): TraverseeEvents {
  return {
    landed: null,
    caught: null,
    converted: null,
    graine: null,
    respawn: false,
    netSwing: false,
    won: false,
  };
}

// ============ ÉTAT INITIAL ============

export function createInitialState(now = 0): TraverseeState {
  const collectibles = buildCollectibles();
  const pollinisateursTotal = collectibles.filter((c) => c.kind === "pollinisateur").length;
  const grainesTotal = collectibles.filter((c) => c.kind === "graine").length;

  const olivia: Olivia = {
    x: SPAWN.x,
    y: SPAWN.y,
    w: OLIVIA_W,
    h: OLIVIA_H,
    vx: 0,
    vy: 0,
    facing: 1,
    onGround: false,
    coyote: 0,
    jumpBuffer: 0,
    jumpHeld: false,
    jumping: false,
    jumpCut: false,
    netUntil: 0,
    netCooldown: 0,
    walkPhase: 0,
    squash: 0,
    invulnUntil: 0,
    lastSafe: { x: SPAWN.x, y: SPAWN.y },
  };

  return {
    status: "intro",
    olivia,
    platforms: buildPlatforms(),
    hazards: buildHazards(),
    collectibles,
    sanctuaire: { ...SANCTUAIRE },
    worldW: WORLD_W,
    worldH: WORLD_H,
    worldBottom: WORLD_BOTTOM,
    cam: { x: 0, y: 0 },
    stats: {
      startTime: now,
      elapsedMs: 0,
      pollinisateursCaught: 0,
      pollinisateursTotal,
      grainesCaught: 0,
      grainesTotal,
      dosettesHit: 0,
      dosettesConverties: 0,
    },
    time: now,
    acc: 0,
    prevJump: false,
    prevNet: false,
    events: freshEvents(),
    message: null,
    messageUntil: 0,
  };
}

// ============ FILET (coup instantané au moment de la pression) ============

function netRect(o: Olivia): Rect {
  const x = o.facing === 1 ? o.x + o.w - 4 : o.x - NET_REACH + 4;
  return { x, y: o.y - 8, w: NET_REACH, h: o.h + 12 };
}

function swingNet(state: TraverseeState): void {
  const o = state.olivia;
  const r = netRect(o);
  // Pollinisateurs attrapés
  for (const c of state.collectibles) {
    if (c.taken || c.kind !== "pollinisateur") continue;
    if (overlap(r, c)) {
      c.taken = true;
      state.stats.pollinisateursCaught++;
      state.events.caught = { x: c.x + c.w / 2, y: c.y + c.h / 2 };
    }
  }
  // Dosettes compostées, pesticide reverdi
  for (const hz of state.hazards) {
    if (!hz.active) continue;
    if (hz.kind === "tondeuse") continue; // la tondeuse ne se neutralise pas, on l'évite
    if (overlap(r, hz)) {
      hz.active = false;
      hz.convertedAt = state.time;
      if (hz.kind === "dosette") {
        state.stats.dosettesConverties++;
        state.events.converted = { x: hz.x + hz.w / 2, y: hz.y + hz.h / 2 };
      } else {
        state.events.converted = { x: hz.x + hz.w / 2, y: hz.y };
      }
    }
  }
}

// ============ PAS DE TEMPS FIXE ============

function stepFixed(state: TraverseeState, input: Input): void {
  const o = state.olivia;

  // Coyote time : rechargé tant qu'on est au sol, sinon décompte.
  if (o.onGround) o.coyote = COYOTE;
  else o.coyote = Math.max(0, o.coyote - H);

  o.jumpBuffer = Math.max(0, o.jumpBuffer - H);
  o.netCooldown = Math.max(0, o.netCooldown - H);

  // Accélération horizontale + friction.
  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (dir !== 0) {
    o.facing = dir as 1 | -1;
    const a = o.onGround ? ACCEL_GROUND : ACCEL_AIR;
    o.vx += dir * a * H;
    o.vx = clamp(o.vx, -MOVE_MAX, MOVE_MAX);
  } else {
    const f = (o.onGround ? FRICTION_GROUND : FRICTION_AIR) * H;
    if (o.vx > 0) o.vx = Math.max(0, o.vx - f);
    else if (o.vx < 0) o.vx = Math.min(0, o.vx + f);
  }

  // Saut : buffer + coyote, déclenché une seule fois.
  const canJump = o.onGround || o.coyote > 0;
  if (o.jumpBuffer > 0 && canJump) {
    o.vy = -JUMP_V;
    o.onGround = false;
    o.coyote = 0;
    o.jumpBuffer = 0;
    o.jumping = true;
    o.jumpCut = false;
  }
  // Saut à hauteur variable : relâcher coupe la montée.
  if (o.jumping && !o.jumpHeld && o.vy < 0 && !o.jumpCut) {
    o.vy *= JUMP_CUT;
    o.jumpCut = true;
  }
  if (o.vy >= 0) o.jumping = false;

  // Gravité.
  o.vy += GRAVITY * H;
  if (o.vy > MAX_FALL) o.vy = MAX_FALL;

  // Déplacement + collisions (X puis Y).
  moveAndCollide(state);

  // Animation : cycle de marche, décroissance du squash.
  o.walkPhase += Math.abs(o.vx) * H * 0.16;
  o.squash = Math.max(0, o.squash - H * 4);

  // Dernier point sûr : enregistré quand on est posé hors danger.
  if (o.onGround && state.time >= o.invulnUntil) {
    if (!standingOnHazard(state)) {
      o.lastSafe = { x: o.x, y: o.y };
    }
  }

  // Mouvement des dangers mobiles.
  for (const hz of state.hazards) {
    if (!hz.active) continue;
    if (hz.kind === "dosette" || hz.kind === "tondeuse") {
      if (hz.vx !== undefined && hz.minX !== undefined && hz.maxX !== undefined) {
        hz.x += hz.vx * H;
        if (hz.x <= hz.minX) {
          hz.x = hz.minX;
          hz.vx = Math.abs(hz.vx);
        } else if (hz.x >= hz.maxX) {
          hz.x = hz.maxX;
          hz.vx = -Math.abs(hz.vx);
        }
        if (hz.kind === "dosette") {
          hz.spin = (hz.spin ?? 0) + (hz.vx / Math.max(1, hz.w)) * H * 6;
        }
      }
    }
  }

  // Contact avec un danger → réapparition bienveillante (pas de game over).
  if (state.time >= o.invulnUntil) {
    for (const hz of state.hazards) {
      if (!hz.active) continue;
      if (overlap(o, hz)) {
        if (hz.kind === "dosette") state.stats.dosettesHit++;
        respawn(state);
        break;
      }
    }
  }

  // Chute dans un trou → réapparition.
  if (o.y > state.worldBottom) {
    respawn(state);
  }

  // Graines ramassées au contact.
  for (const c of state.collectibles) {
    if (c.taken || c.kind !== "graine") continue;
    if (overlap(o, c)) {
      c.taken = true;
      state.stats.grainesCaught++;
      state.events.graine = { x: c.x + c.w / 2, y: c.y + c.h / 2 };
    }
  }

  // Arrivée au Sanctuaire.
  if (overlap(o, state.sanctuaire)) {
    state.status = "won";
    state.events.won = true;
  }
}

function standingOnHazard(state: TraverseeState): boolean {
  const o = state.olivia;
  const feet: Rect = { x: o.x, y: o.y + o.h - 2, w: o.w, h: 6 };
  for (const hz of state.hazards) {
    if (hz.active && hz.kind === "pesticide" && overlap(feet, hz)) return true;
  }
  return false;
}

function moveAndCollide(state: TraverseeState): void {
  const o = state.olivia;

  // --- Axe X ---
  o.x += o.vx * H;
  for (const p of state.platforms) {
    if (p.oneWay) continue;
    if (overlap(o, p)) {
      if (o.vx > 0) o.x = p.x - o.w;
      else if (o.vx < 0) o.x = p.x + p.w;
      o.vx = 0;
    }
  }
  // Bornes du monde.
  if (o.x < 0) {
    o.x = 0;
    if (o.vx < 0) o.vx = 0;
  }
  if (o.x + o.w > state.worldW) {
    o.x = state.worldW - o.w;
    if (o.vx > 0) o.vx = 0;
  }

  // --- Axe Y ---
  const oldBottom = o.y + o.h;
  o.y += o.vy * H;
  const wasOnGround = o.onGround;
  o.onGround = false;
  for (const p of state.platforms) {
    if (p.oneWay) {
      // Plateforme traversable par en dessous : ne bloque qu'à la descente.
      if (o.vy < 0) continue;
      const newBottom = o.y + o.h;
      const crossing = oldBottom <= p.y + 2 && newBottom >= p.y;
      if (crossing && o.x < p.x + p.w && o.x + o.w > p.x) {
        o.y = p.y - o.h;
        o.vy = 0;
        o.onGround = true;
      }
      continue;
    }
    if (overlap(o, p)) {
      if (o.vy > 0) {
        o.y = p.y - o.h;
        o.vy = 0;
        o.onGround = true;
      } else if (o.vy < 0) {
        o.y = p.y + p.h;
        o.vy = 0;
      }
    }
  }

  // Atterrissage : squash + événement (fleur).
  if (o.onGround && !wasOnGround) {
    o.squash = 1;
    state.events.landed = { x: o.x + o.w / 2, y: o.y + o.h };
  }
}

function respawn(state: TraverseeState): void {
  const o = state.olivia;
  o.x = o.lastSafe.x;
  o.y = o.lastSafe.y - 6;
  o.vx = 0;
  o.vy = 0;
  o.jumping = false;
  o.invulnUntil = state.time + 1100;
  state.events.respawn = true;
  state.message = RESPAWN_PHRASES[Math.floor(Math.random() * RESPAWN_PHRASES.length)];
  state.messageUntil = state.time + 1900;
}

// ============ CAMÉRA ============

function updateCamera(state: TraverseeState, dt: number, viewW: number, viewH: number): void {
  const o = state.olivia;
  // Olivia placée à ~40% depuis la gauche pour voir devant ; ~58% en hauteur.
  const targetX = o.x + o.w / 2 - viewW * 0.4;
  const targetY = o.y + o.h / 2 - viewH * 0.58;

  const maxX = Math.max(0, state.worldW - viewW);
  const maxY = Math.max(0, state.worldH - viewH);
  const cx = clamp(targetX, 0, maxX);
  const cy = clamp(targetY, 0, maxY);

  const t = 1 - Math.exp(-CAM_LERP * dt); // lerp exponentiel, stable quel que soit dt
  state.cam.x += (cx - state.cam.x) * t;
  state.cam.y += (cy - state.cam.y) * t;
}

// ============ STEP PUBLIC ============

// viewAspect = largeur/hauteur du canvas. Sert à dimensionner la vue caméra
// pour rester jouable en portrait comme en paysage.
export function step(
  state: TraverseeState,
  frameDt: number,
  input: Input,
  timeMs: number,
  viewAspect: number
): { viewW: number; viewH: number } {
  state.time = timeMs;
  state.events = freshEvents();

  // Dimensions de la vue : on zoome dehors en portrait pour garder du contexte.
  let viewW = VIEW_H_BASE * viewAspect;
  if (viewW < MIN_VIEW_W) viewW = MIN_VIEW_W;
  const viewH = viewW / viewAspect;

  if (state.status !== "playing") {
    updateCamera(state, frameDt, viewW, viewH);
    return { viewW, viewH };
  }

  // Détection de fronts (saut / filet) une fois par frame.
  const jumpPressed = input.jump && !state.prevJump;
  const netPressed = input.net && !state.prevNet;
  state.prevJump = input.jump;
  state.prevNet = input.net;
  state.olivia.jumpHeld = input.jump;

  if (jumpPressed) state.olivia.jumpBuffer = JUMP_BUFFER;
  if (netPressed && state.olivia.netCooldown <= 0) {
    state.olivia.netUntil = state.time + NET_DURATION_MS;
    state.olivia.netCooldown = NET_COOLDOWN;
    state.events.netSwing = true;
    swingNet(state);
  }

  // Pas fixes.
  state.acc += frameDt;
  let n = 0;
  while (state.acc >= H && n < MAX_SUBSTEPS) {
    stepFixed(state, input);
    state.acc -= H;
    n++;
    if (state.events.won) break;
  }
  if (n === MAX_SUBSTEPS) state.acc = 0; // évite la spirale de la mort

  state.stats.elapsedMs = state.time - state.stats.startTime;

  // Léger flottement des collectibles (cosmétique, hors physique).
  for (const c of state.collectibles) {
    if (!c.taken) c.bobPhase += frameDt;
  }

  updateCamera(state, frameDt, viewW, viewH);
  return { viewW, viewH };
}

export function startGame(state: TraverseeState, now: number): void {
  state.status = "playing";
  state.stats.startTime = now;
  state.time = now;
  state.acc = 0;
  state.prevJump = false;
  state.prevNet = false;
}

export function netIsActive(state: TraverseeState): boolean {
  return state.time < state.olivia.netUntil;
}
