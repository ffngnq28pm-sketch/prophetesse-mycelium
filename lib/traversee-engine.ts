// Moteur du platformer « Le Sentier des Spores » — V6.
// Logique pure : aucune dépendance DOM, aucun rendu. Le composant React
// pilote la boucle RAF, lit l'état et dessine. Toute la physique tourne en
// pas de temps fixe (1/120 s) pour un game feel déterministe et stable.
//
// Nouveautés V6 : plateformes mobiles (transportent la Marcheuse), plateformes
// friables (s'effritent ~0,6 s après contact, repoussent), champignons-
// tremplins (super-saut), ronces (danger doux, non neutralisable — on évite),
// lanternes-checkpoints, spores dorées, gravité asymétrique (chute ~1,6×),
// caméra à look-ahead, score composite persisté.

import {
  buildPlatforms,
  buildHazards,
  buildCollectibles,
  buildCheckpoints,
  SANCTUAIRE,
  SPAWN,
  WORLD_W,
  WORLD_H,
  WORLD_BOTTOM,
  ACT2_X,
  ACT3_X,
} from "@/data/traversee-niveau";

// ============ TYPES ============

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type PlatformKind =
  | "sol"
  | "tombe"
  | "tronc"
  | "muret"
  | "racine"
  | "mobile"
  | "friable"
  | "tremplin";

export interface Platform extends Rect {
  kind: PlatformKind;
  oneWay?: boolean;
  // mobile : trajectoire en va-et-vient sur un axe, lente et prévisible
  axis?: "x" | "y";
  min?: number;
  max?: number;
  speed?: number;
  phase?: number; // direction courante (+1 / -1), runtime
  dx?: number; // déplacement du dernier pas (transport du joueur), runtime
  dy?: number;
  // friable : s'effrite peu après contact, repousse quelques secondes plus tard
  crumbleAt?: number; // ms — premier contact (0 = intact)
  gone?: boolean;
  respawnAt?: number; // ms — instant de repousse
}

export type HazardKind = "dosette" | "pesticide" | "tondeuse" | "ronces";

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

export type CollectibleKind = "pollinisateur" | "graine" | "spore";
export type PollinisateurEspece = "halicte" | "papillon";

export interface Collectible extends Rect {
  id: number;
  kind: CollectibleKind;
  taken: boolean;
  bobPhase: number;
  espece?: PollinisateurEspece;
}

export interface Checkpoint {
  id: number;
  x: number;
  baseY: number; // y du sol où la lanterne est posée
  lit: boolean;
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
  groundIndex: number | null; // plateforme porteuse (transport des mobiles)
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
  sporesCaught: number;
  sporesTotal: number;
  dosettesHit: number; // contacts subis (sert à la relique « immaculée »)
  dosettesConverties: number;
}

export interface TraverseeEvents {
  landed: { x: number; y: number } | null;
  caught: { x: number; y: number } | null;
  converted: { x: number; y: number } | null;
  graine: { x: number; y: number } | null;
  spore: { x: number; y: number } | null;
  bounced: { x: number; y: number } | null; // tremplin
  checkpoint: { x: number; y: number } | null; // lanterne allumée
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
  checkpoints: Checkpoint[];
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
  acte: 1 | 2 | 3; // acte courant (messages + lumière)
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

// ============ CONSTANTES DE GAME FEEL ============
// Regroupées et commentées pour itérer facilement.

const H = 1 / 120; // pas de temps fixe
const MAX_SUBSTEPS = 8;

const GRAVITY = 2100; // montée
const FALL_GRAVITY_MULT = 1.6; // la chute est plus rapide que la montée (saut « moderne »)
const MOVE_MAX = 232; // vitesse horizontale max
const ACCEL_GROUND = 2000;
const ACCEL_AIR = 1350;
const FRICTION_GROUND = 2300;
const FRICTION_AIR = 240;
const JUMP_V = 660; // vitesse de saut (hauteur ~103 u)
const JUMP_CUT = 0.45; // relâcher tôt coupe la montée (saut variable)
const TREMPLIN_V = 1050; // super-saut champignon (bond ~260 u)
const MAX_FALL = 980;
const COYOTE = 0.09; // ~90 ms de tolérance après avoir quitté un bord
const JUMP_BUFFER = 0.12; // ~120 ms de saut pré-enregistré

const NET_DURATION_MS = 260;
const NET_COOLDOWN = 0.34;
const NET_REACH = 34;

const FRIABLE_DELAY_MS = 600; // temps avant effritement après contact
const FRIABLE_RESPAWN_MS = 3200; // temps avant repousse

const OLIVIA_W = 24;
const OLIVIA_H = 38;

const VIEW_H_BASE = 460; // hauteur de vue de référence (monde)
const MIN_VIEW_W = 430; // garantit assez de contexte horizontal en portrait
const CAM_LERP = 9; // vitesse de rattrapage de la caméra
const CAM_LOOKAHEAD = 30; // avance dans la direction du regard
const CAM_VX_LEAD = 0.1; // + un peu plus quand on court

// Score composite (persisté) : pollinisateurs avant tout, spores ensuite,
// graines, puis bonus de promptitude — sans jamais punir la lenteur (plancher 0).
const SCORE_POLL = 100;
const SCORE_SPORE = 40;
const SCORE_GRAINE = 15;
const SCORE_TIME_REF_S = 420; // sous 7 minutes, chaque seconde gagnée vaut 2 pts
const SCORE_TIME_MULT = 2;

const RESPAWN_PHRASES = [
  "Le mycélium te redonne pied.",
  "La terre te rattrape, douce et patiente.",
  "On recommence le passage. Sans hâte.",
  "Une racine te relève. Respire.",
  "L'Ordre ne connaît pas la chute, seulement la reprise.",
  "La Marcheuse époussette sa casquette, et repart.",
];

const ACT_MESSAGES: Record<2 | 3, string> = {
  2: "Acte II — Les Allées",
  3: "Acte III — L'Ascension",
};

// ============ HELPERS ============

function overlap(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

// Hitbox de danger de la Marcheuse : resserrée sur son corps, sans les marges
// vides (halo de tête, côté filet). Le filet n'a JAMAIS de hitbox « danger ».
function oliviaHitbox(o: Olivia): Rect {
  return { x: o.x + 4, y: o.y + 3, w: o.w - 8, h: o.h - 5 };
}

// Hitbox de danger d'un obstacle : contenue dans le visuel, sommet quelques
// pixels sous le sommet dessiné. En cas de doute, la collision pardonne au
// joueur (règle d'or platformer).
function hazardHitbox(hz: Hazard): Rect {
  switch (hz.kind) {
    case "dosette":
      // capsule 26×26 → 18×17, sommet 4px sous le haut visuel
      return { x: hz.x + 4, y: hz.y + 4, w: hz.w - 8, h: hz.h - 5 };
    case "tondeuse":
      // 50×30 → 38×14, on retire les roues qui dépassent et le manche
      return { x: hz.x + 6, y: hz.y + 7, w: hz.w - 12, h: hz.h - 9 };
    case "ronces":
      // touffe épineuse : on pardonne les bords
      return { x: hz.x + 6, y: hz.y + 6, w: hz.w - 12, h: hz.h - 6 };
    case "pesticide":
    default:
      // flaque au sol : on garde la largeur, sommet 3px plus bas
      return { x: hz.x + 4, y: hz.y + 3, w: hz.w - 8, h: hz.h - 3 };
  }
}

function freshEvents(): TraverseeEvents {
  return {
    landed: null,
    caught: null,
    converted: null,
    graine: null,
    spore: null,
    bounced: null,
    checkpoint: null,
    respawn: false,
    netSwing: false,
    won: false,
  };
}

// Score final d'une traversée (aussi utilisé par l'écran de fin).
export function computeScore(stats: TraverseeStats): number {
  const sec = Math.floor(stats.elapsedMs / 1000);
  const timeBonus = Math.max(0, SCORE_TIME_REF_S - sec) * SCORE_TIME_MULT;
  return (
    stats.pollinisateursCaught * SCORE_POLL +
    stats.sporesCaught * SCORE_SPORE +
    stats.grainesCaught * SCORE_GRAINE +
    timeBonus
  );
}

// ============ ÉTAT INITIAL ============

export function createInitialState(now = 0): TraverseeState {
  const collectibles = buildCollectibles();
  const pollinisateursTotal = collectibles.filter((c) => c.kind === "pollinisateur").length;
  const grainesTotal = collectibles.filter((c) => c.kind === "graine").length;
  const sporesTotal = collectibles.filter((c) => c.kind === "spore").length;

  const olivia: Olivia = {
    x: SPAWN.x,
    y: SPAWN.y,
    w: OLIVIA_W,
    h: OLIVIA_H,
    vx: 0,
    vy: 0,
    facing: 1,
    onGround: false,
    groundIndex: null,
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
    checkpoints: buildCheckpoints(),
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
      sporesCaught: 0,
      sporesTotal,
      dosettesHit: 0,
      dosettesConverties: 0,
    },
    time: now,
    acc: 0,
    prevJump: false,
    prevNet: false,
    acte: 1,
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
  // Dosettes compostées, pesticide reverdi. La tondeuse et les ronces ne se
  // neutralisent pas : la mécanique, on l'évite ; le vivant, on le respecte.
  for (const hz of state.hazards) {
    if (!hz.active) continue;
    if (hz.kind === "tondeuse" || hz.kind === "ronces") continue;
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

// ============ PLATEFORMES DYNAMIQUES ============

function updatePlatforms(state: TraverseeState): void {
  for (const p of state.platforms) {
    p.dx = 0;
    p.dy = 0;
    if (p.kind === "mobile" && p.axis && p.min !== undefined && p.max !== undefined && p.speed) {
      if (!p.phase) p.phase = 1;
      const v = p.speed * p.phase * H;
      if (p.axis === "x") {
        const nx = clamp(p.x + v, p.min, p.max);
        p.dx = nx - p.x;
        p.x = nx;
        if (p.x <= p.min || p.x >= p.max) p.phase = -p.phase as 1 | -1;
      } else {
        const ny = clamp(p.y + v, p.min, p.max);
        p.dy = ny - p.y;
        p.y = ny;
        if (p.y <= p.min || p.y >= p.max) p.phase = -p.phase as 1 | -1;
      }
    } else if (p.kind === "friable") {
      if (p.gone) {
        if (p.respawnAt !== undefined && state.time >= p.respawnAt) {
          p.gone = false;
          p.crumbleAt = 0;
          p.respawnAt = undefined;
        }
      } else if (p.crumbleAt && state.time >= p.crumbleAt + FRIABLE_DELAY_MS) {
        p.gone = true;
        p.respawnAt = state.time + FRIABLE_RESPAWN_MS;
      }
    }
  }
}

function platformSolid(p: Platform): boolean {
  return !(p.kind === "friable" && p.gone);
}

// ============ PAS DE TEMPS FIXE ============

function stepFixed(state: TraverseeState, input: Input): void {
  const o = state.olivia;

  // Plateformes d'abord : mouvement des mobiles + cycle des friables.
  updatePlatforms(state);

  // Transport : si la Marcheuse est posée sur une plateforme mobile, elle suit.
  if (o.onGround && o.groundIndex !== null) {
    const p = state.platforms[o.groundIndex];
    if (p && p.kind === "mobile") {
      o.x += p.dx ?? 0;
      o.y += p.dy ?? 0;
    }
  }

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
    o.groundIndex = null;
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

  // Gravité asymétrique : la chute est ~1,6× plus rapide que la montée.
  o.vy += GRAVITY * (o.vy > 0 ? FALL_GRAVITY_MULT : 1) * H;
  if (o.vy > MAX_FALL) o.vy = MAX_FALL;

  // Déplacement + collisions (X puis Y).
  moveAndCollide(state);

  // Animation : cycle de marche, décroissance du squash.
  o.walkPhase += Math.abs(o.vx) * H * 0.16;
  o.squash = Math.max(0, o.squash - H * 4);

  // Dernier point sûr : enregistré quand on est posé hors danger, sur du solide
  // pérenne (jamais sur une friable ou une mobile — elles bougent ou cèdent).
  if (o.onGround && state.time >= o.invulnUntil) {
    const p = o.groundIndex !== null ? state.platforms[o.groundIndex] : null;
    const perenne = !p || (p.kind !== "friable" && p.kind !== "mobile");
    if (perenne && !standingOnHazard(state)) {
      o.lastSafe = { x: o.x, y: o.y };
    }
  }

  // Lanternes-checkpoints : s'allument au passage, fixent le point de reprise.
  for (const cp of state.checkpoints) {
    if (cp.lit) continue;
    const zone: Rect = { x: cp.x - 26, y: cp.baseY - 90, w: 52, h: 90 };
    if (overlap(o, zone)) {
      cp.lit = true;
      o.lastSafe = { x: cp.x - o.w / 2, y: cp.baseY - o.h };
      state.events.checkpoint = { x: cp.x, y: cp.baseY - 40 };
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
          // phase lente : sert au bercement (la capsule reste lisible, jamais à l'envers)
          hz.spin = (hz.spin ?? 0) + (hz.vx / Math.max(1, hz.w)) * H * 1.4;
        }
      }
    }
  }

  // Contact avec un danger → réapparition bienveillante (pas de game over).
  // Collision sur hitbox resserrées, en faveur du joueur.
  if (state.time >= o.invulnUntil) {
    const ob = oliviaHitbox(o);
    for (const hz of state.hazards) {
      if (!hz.active) continue;
      if (overlap(ob, hazardHitbox(hz))) {
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

  // Graines et spores ramassées au contact.
  for (const c of state.collectibles) {
    if (c.taken || c.kind === "pollinisateur") continue;
    if (overlap(o, c)) {
      c.taken = true;
      if (c.kind === "graine") {
        state.stats.grainesCaught++;
        state.events.graine = { x: c.x + c.w / 2, y: c.y + c.h / 2 };
      } else {
        state.stats.sporesCaught++;
        state.events.spore = { x: c.x + c.w / 2, y: c.y + c.h / 2 };
      }
    }
  }

  // Changement d'acte : petit message, une seule fois.
  const acte = o.x >= ACT3_X ? 3 : o.x >= ACT2_X ? 2 : 1;
  if (acte > state.acte) {
    state.acte = acte as 2 | 3;
    state.message = ACT_MESSAGES[state.acte as 2 | 3];
    state.messageUntil = state.time + 2400;
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
    if (p.oneWay || !platformSolid(p)) continue;
    if (p.kind === "tremplin") continue; // le tremplin n'agit qu'à l'atterrissage
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
  o.groundIndex = null;
  for (let i = 0; i < state.platforms.length; i++) {
    const p = state.platforms[i];
    if (!platformSolid(p)) continue;

    if (p.kind === "tremplin") {
      // Atterrir dessus = super-saut. Pas de station debout possible.
      if (o.vy <= 0) continue;
      const newBottom = o.y + o.h;
      const crossing = oldBottom <= p.y + 6 && newBottom >= p.y;
      if (crossing && o.x < p.x + p.w && o.x + o.w > p.x) {
        o.y = p.y - o.h;
        o.vy = -TREMPLIN_V;
        o.jumping = false; // le bond du tremplin n'est pas coupé par le relâcher
        o.jumpCut = true;
        o.squash = 1;
        state.events.bounced = { x: p.x + p.w / 2, y: p.y };
      }
      continue;
    }

    if (p.oneWay) {
      // Plateforme traversable par en dessous : ne bloque qu'à la descente.
      if (o.vy < 0) continue;
      const newBottom = o.y + o.h;
      // marge élargie pour les mobiles (elles bougent entre deux pas)
      const tol = p.kind === "mobile" ? 8 : 2;
      const crossing = oldBottom <= p.y + tol && newBottom >= p.y;
      if (crossing && o.x < p.x + p.w && o.x + o.w > p.x) {
        o.y = p.y - o.h;
        o.vy = 0;
        o.onGround = true;
        o.groundIndex = i;
        if (p.kind === "friable" && !p.crumbleAt) p.crumbleAt = state.time;
      }
      continue;
    }
    if (overlap(o, p)) {
      if (o.vy > 0) {
        o.y = p.y - o.h;
        o.vy = 0;
        o.onGround = true;
        o.groundIndex = i;
        if (p.kind === "friable" && !p.crumbleAt) p.crumbleAt = state.time;
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
  // La Marcheuse à ~40 % depuis la gauche + look-ahead dans la direction du
  // regard (on voit venir le sentier) ; ~58 % en hauteur, amorti par le lerp.
  const lead = o.facing * CAM_LOOKAHEAD + clamp(o.vx * CAM_VX_LEAD, -36, 36);
  const targetX = o.x + o.w / 2 - viewW * 0.4 + lead;
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
