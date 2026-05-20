"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PacState,
  createInitialState,
  step,
  respawnAfterDeath,
  DIR_DOWN,
  DIR_LEFT,
  DIR_RIGHT,
  DIR_UP,
  Dir,
  Ghost,
} from "@/lib/pac-engine";
import { NIVEAUX, COLS, ROWS } from "@/data/pac-niveaux";
import { FANTOMES } from "@/data/fantomes";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Ornement } from "@/components/liturgical/Ornement";

const CELL_PX = 22; // pixels per cell at render time
const WIDTH = COLS * CELL_PX;
const HEIGHT = ROWS * CELL_PX;

const JUDGMENTS_SAINT = [
  "L'Ordre note silencieusement ta performance. Mère Mycorhize aurait hoché la tête.",
  "« On peut donc faire ça en marchant. » — la Marcheuse, paraît-il, satisfaite.",
  "Les Halictes posent un nid en ton honneur. Tu ne le sauras pas.",
];
const JUDGMENTS_OK = [
  "Pas mal. Pas mal du tout, même. (Sœur Compost l'aurait sans doute commenté plus longuement, mais Sœur Compost commente tout.)",
  "On approche de quelque chose qui pourrait, à terme, ressembler à de l'application.",
  "Sœur Compost dit : « Recense encore. Tu y es presque. »",
];
const JUDGMENTS_MOYEN = [
  "L'Ordre ne dit rien. Ce qui, dans certaines circonstances, est un commentaire.",
  "« Tu confondrais une Halicte avec une mouche bleue, mais on te pardonne. »",
  "Frère Théodule te conseille de souffler. Puis de réessayer.",
];
const JUDGMENTS_BAD = [
  "« Sapristi de zut alors. » — Frère Théodule, qui jure rarement.",
  "Les fantômes, eux, ont passé un bon moment. Ce qui n'est pas tout à fait l'objectif.",
  "Dame Précieuse a noté ton nom dans son carnet imaginaire. Tu n'en sauras rien.",
];

function pickJudgment(score: number, level: number): string {
  if (score >= 4000 && level >= 4) return JUDGMENTS_SAINT[Math.floor(Math.random() * JUDGMENTS_SAINT.length)];
  if (score >= 1500) return JUDGMENTS_OK[Math.floor(Math.random() * JUDGMENTS_OK.length)];
  if (score >= 500) return JUDGMENTS_MOYEN[Math.floor(Math.random() * JUDGMENTS_MOYEN.length)];
  return JUDGMENTS_BAD[Math.floor(Math.random() * JUDGMENTS_BAD.length)];
}

const MALEDICTIONS = [
  "Par les chaussettes de Ste Ortie !",
  "Que tes dosettes se remplissent de marc fluide !",
  "Va donc te recomposter ailleurs !",
  "Sapristi de zut alors.",
  "Tu peux retourner sous ton dolmen, merci.",
];

// ============ AUDIO ============
class PacAudio {
  ctx: AudioContext | null = null;
  enabled: boolean = false;
  init() {
    if (this.ctx) return;
    try {
      const Ctor = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      this.ctx = new Ctor();
    } catch {
      this.ctx = null;
    }
  }
  resume() {
    this.ctx?.resume?.();
  }
  beep(freq: number, dur = 0.06, type: OscillatorType = "square", vol = 0.07) {
    if (!this.enabled || !this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g);
    g.connect(this.ctx.destination);
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t);
    o.stop(t + dur);
  }
  insect() {
    this.beep(680, 0.04, "square", 0.05);
  }
  coffee() {
    this.beep(880, 0.12, "sine", 0.1);
    setTimeout(() => this.beep(1320, 0.18, "sine", 0.09), 90);
  }
  hitGhost() {
    this.beep(220, 0.18, "sawtooth", 0.12);
  }
  death() {
    this.beep(330, 0.4, "sawtooth", 0.15);
    setTimeout(() => this.beep(220, 0.4, "sawtooth", 0.15), 200);
    setTimeout(() => this.beep(110, 0.6, "sawtooth", 0.18), 400);
  }
  levelComplete() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.beep(f, 0.18, "triangle", 0.08), i * 130));
  }
}

// ============ COMPONENT ============
interface Props {
  onLevelComplete?: (level: number) => void;
  onGameOver?: (score: number, niveauAtteint: number, fantomes: number) => void;
}

export function PacOlivia({ onLevelComplete, onGameOver }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<PacState | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);
  const audioRef = useRef<PacAudio>(new PacAudio());
  const lastInsectCountRef = useRef<number>(0);
  const lastTabassesRef = useRef<number>(0);

  const [, forceTick] = useState(0);
  const [audioOn, setAudioOn] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const [showLevelTransition, setShowLevelTransition] = useState<{ verset: string; nextLevel: number } | null>(null);
  const [malediction, setMalediction] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<{ score: number; level: number; fantomes: number } | null>(null);
  const [paused, setPaused] = useState(false);

  const startNewGame = useCallback(() => {
    console.log("[PacOlivia] start clicked");
    stateRef.current = createInitialState(0);
    stateRef.current.status = "playing";
    lastInsectCountRef.current = stateRef.current.stats.insectsTotal;
    lastTabassesRef.current = 0;
    lastTimeRef.current = 0; // reset deltaTime accumulator
    setShowStart(false);
    setShowLevelTransition(null);
    setGameOver(null);
    setPaused(false);
    if (audioRef.current.enabled) audioRef.current.resume();
    forceTick((n) => n + 1);
  }, []);

  const startLevel = useCallback((idx: number) => {
    const cur = stateRef.current;
    const newState = createInitialState(idx, cur?.olivia.lives, cur?.stats.score);
    newState.status = "playing";
    stateRef.current = newState;
    lastInsectCountRef.current = newState.stats.insectsTotal;
    lastTabassesRef.current = newState.stats.ghostsTabasses;
    setShowLevelTransition(null);
    forceTick((n) => n + 1);
  }, []);

  // Audio toggle
  useEffect(() => {
    audioRef.current.enabled = audioOn;
    if (audioOn) {
      audioRef.current.init();
      audioRef.current.resume();
    }
  }, [audioOn]);

  // Initialize state at mount so the static maze is visible immediately under the overlay
  useEffect(() => {
    if (!stateRef.current) {
      stateRef.current = createInitialState(0);
      console.log("[PacOlivia] mount, level:", stateRef.current.niveau.nom);
      forceTick((n) => n + 1);
    }
  }, []);

  // RAF loop — démarre au mount et reste actif. La logique de jeu est skippée si non-playing/paused.
  useEffect(() => {
    let firstFrame = true;
    const loop = (t: number) => {
      const last = lastTimeRef.current || t;
      const dt = Math.min(0.06, (t - last) / 1000);
      lastTimeRef.current = t;
      animFrameRef.current = t;
      if (firstFrame) {
        console.log("[PacOlivia] first loop frame");
        firstFrame = false;
      }
      const s = stateRef.current;
      if (s && s.status === "playing" && !paused) {
        step(s, dt, t);
        if (s.stats.insectsRemaining < lastInsectCountRef.current) {
          audioRef.current.insect();
          lastInsectCountRef.current = s.stats.insectsRemaining;
        }
        if (s.stats.ghostsTabasses > lastTabassesRef.current) {
          audioRef.current.hitGhost();
          lastTabassesRef.current = s.stats.ghostsTabasses;
          setMalediction(MALEDICTIONS[Math.floor(Math.random() * MALEDICTIONS.length)]);
          setTimeout(() => setMalediction(null), 1400);
        }
      }
      if (s) {
        render(canvasRef.current, s, t);
      }
      if (s?.status === "levelComplete") {
        audioRef.current.levelComplete();
        onLevelComplete?.(s.stats.niveauIndex);
        const nextLevel = s.stats.niveauIndex + 1;
        if (nextLevel >= NIVEAUX.length) {
          // Victoire totale
          setGameOver({ score: s.stats.score, level: nextLevel, fantomes: s.stats.ghostsTabasses });
          onGameOver?.(s.stats.score, nextLevel, s.stats.ghostsTabasses);
          s.status = "gameOver";
        } else {
          setShowLevelTransition({ verset: s.message ?? "", nextLevel });
          s.status = "paused";
        }
      } else if (s?.status === "dying") {
        audioRef.current.death();
        setTimeout(() => {
          if (stateRef.current) {
            respawnAfterDeath(stateRef.current);
            forceTick((n) => n + 1);
          }
        }, 1200);
        s.status = "paused";
      } else if (s?.status === "gameOver" && !gameOver) {
        setGameOver({
          score: s.stats.score,
          level: s.stats.niveauIndex + 1,
          fantomes: s.stats.ghostsTabasses,
        });
        onGameOver?.(s.stats.score, s.stats.niveauIndex + 1, s.stats.ghostsTabasses);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [paused, gameOver, onLevelComplete, onGameOver]);

  // Input
  const setDir = useCallback((d: Dir) => {
    if (!stateRef.current) return;
    stateRef.current.olivia.queued = d;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["arrowleft", "a", "q"].includes(k)) { e.preventDefault(); setDir(DIR_LEFT); }
      else if (["arrowright", "d"].includes(k)) { e.preventDefault(); setDir(DIR_RIGHT); }
      else if (["arrowup", "w", "z"].includes(k)) { e.preventDefault(); setDir(DIR_UP); }
      else if (["arrowdown", "s"].includes(k)) { e.preventDefault(); setDir(DIR_DOWN); }
      else if (k === " ") { e.preventDefault(); setPaused((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDir]);

  // Touch
  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (!audioRef.current.ctx) {
      audioRef.current.init();
      audioRef.current.resume();
    }
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    const dt = Date.now() - touchRef.current.t;
    if (ax < 18 && ay < 18 && dt < 280) {
      // Tap = pause
      setPaused((p) => !p);
    } else if (ax > ay) {
      setDir(dx > 0 ? DIR_RIGHT : DIR_LEFT);
    } else {
      setDir(dy > 0 ? DIR_DOWN : DIR_UP);
    }
    touchRef.current = null;
  };

  const s = stateRef.current;
  const score = s?.stats.score ?? 0;
  const lives = s?.olivia.lives ?? 3;
  const insectsLeft = s?.stats.insectsRemaining ?? 0;
  const insectsTot = s?.stats.insectsTotal ?? 0;
  const angry = s ? s.olivia.angryUntil > (animFrameRef.current || performance.now()) : false;
  const angryRemain = angry && s ? Math.max(0, Math.ceil((s.olivia.angryUntil - performance.now()) / 1000)) : 0;
  const niveau = s?.niveau;

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
      <div className="relative mx-auto w-full max-w-2xl">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 font-serif text-sm text-mousse-800 dark:text-parchemin-100">
          <div className="flex items-center gap-2">
            <Badge variant="grace">Score : {score}</Badge>
            {niveau && <Badge variant="outline">{niveau.nom}</Badge>}
            <Badge variant="outline">Vies : {"❀".repeat(Math.max(0, lives))}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default">{insectsTot - insectsLeft}/{insectsTot} recensés</Badge>
            {angry && <Badge variant="grace">Sainte Colère · {angryRemain}s</Badge>}
          </div>
        </div>

        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative overflow-hidden rounded-lg border-2 border-ocre-500/50 bg-gradient-to-br from-mousse-950 via-black to-mousse-900 shadow-xl"
          style={{ aspectRatio: `${COLS} / ${ROWS}` }}
        >
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className="block h-full w-full select-none"
            style={{ touchAction: "none", imageRendering: "auto" }}
          />

          <AnimatePresence>
            {malediction && (
              <motion.div
                key={malediction}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute left-0 right-0 top-2 flex justify-center"
              >
                <span className="rounded-full border border-ocre-500/40 bg-mousse-950/55 px-3 py-1 text-xs font-serif italic text-ocre-300 shadow-md">
                  « {malediction} »
                </span>
              </motion.div>
            )}
            {showStart && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-mousse-950/85 p-6 text-center text-parchemin-50 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-ocre-400">La Chasse aux Pollinisateurs</p>
                <h2 className="titre-liturgique mt-2 text-3xl">Recense les insectes</h2>
                <div className="ornement" />
                <p className="mx-auto max-w-md font-serif italic">
                  Une disciple entre dans les cimetières, filet à la main. Sa mission : recenser tous les insectes,
                  éviter les fantômes, et boire des Gorgées de Café Filtre pour entrer en Sainte Colère.
                </p>
                <p className="mt-2 font-serif text-xs text-parchemin-200/70">
                  Flèches / ZQSD au clavier. Swipe sur mobile. Espace pour pause. Tap pour pause sur mobile.
                </p>
                <div className="mt-4 flex gap-2">
                  <Button onClick={startNewGame}>Commencer le pèlerinage</Button>
                </div>
              </motion.div>
            )}
            {showLevelTransition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-mousse-950/90 p-6 text-center text-parchemin-50 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-ocre-400">
                  Niveau {showLevelTransition.nextLevel} dévoilé
                </p>
                <h2 className="titre-liturgique mt-2 text-2xl">
                  Tu pars pour {NIVEAUX[showLevelTransition.nextLevel].nom}
                </h2>
                <div className="ornement" />
                <p className="mx-auto max-w-md font-serif italic">{showLevelTransition.verset}</p>
                <Button onClick={() => startLevel(showLevelTransition.nextLevel)} className="mt-4">
                  Avancer
                </Button>
              </motion.div>
            )}
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-mousse-950/90 p-6 text-center text-parchemin-50 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-ocre-400">L'Annuaire des Défunts Marris</p>
                <h2 className="titre-liturgique mt-2 text-3xl">Verdict du Mycélium</h2>
                <div className="ornement" />
                <p className="mx-auto max-w-md font-serif italic">{pickJudgment(gameOver.score, gameOver.level)}</p>
                <p className="mt-3 font-serif">Score : <strong>{gameOver.score}</strong> · Niveau atteint : <strong>{gameOver.level}</strong></p>
                <p className="font-serif">Fantômes tabassés : {gameOver.fantomes}</p>
                <div className="mt-4 flex gap-2">
                  <Button onClick={startNewGame}>Recommencer</Button>
                </div>
              </motion.div>
            )}
            {paused && !showStart && !showLevelTransition && !gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-mousse-950/70 backdrop-blur"
              >
                <div className="rounded-md bg-mousse-950/80 px-4 py-3 text-center font-serif text-parchemin-50">
                  <p>Pause</p>
                  <p className="text-xs text-parchemin-200/70">Espace ou tap pour reprendre</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
            Mobile : swipe pour diriger, tap pour pause. Desktop : flèches / ZQSD, espace pour pause.
          </p>
          <label className="flex items-center gap-2 font-serif text-xs text-mousse-700 dark:text-parchemin-200/70">
            <input
              type="checkbox"
              checked={audioOn}
              onChange={(e) => setAudioOn(e.target.checked)}
              className="accent-mousse-700"
            />
            Audio
          </label>
        </div>
      </div>

      <aside className="grid gap-3 md:w-72">
        <Card>
          <CardSubtitle>L'Annuaire des Défunts Marris</CardSubtitle>
          <p className="mt-1 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
            Tes quatre adversaires, brièvement présentés.
          </p>
        </Card>
        {FANTOMES.map((f) => (
          <Card key={f.id} className="py-3">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-5 w-5 rounded-full"
                style={{ backgroundColor: f.couleur, border: `1px solid ${f.couleurSecondaire}` }}
              />
              <CardTitle className="text-base">{f.nom}</CardTitle>
            </div>
            <p className="mt-1 font-serif text-xs text-mousse-800 dark:text-parchemin-100">
              {f.backstory[0]}
            </p>
            <p className="mt-1 font-serif text-[10px] uppercase tracking-widest text-ocre-600 dark:text-ocre-400">
              IA : {f.ai === "lent" ? "poursuite lente" : f.ai === "anticipateur" ? "anticipation +3" : f.ai === "erratique" ? "aléatoire 60%" : "patrouille → agressif au seuil"}
            </p>
          </Card>
        ))}
      </aside>
    </div>
  );
}

// =================== RENDER ===================
function render(canvas: HTMLCanvasElement | null, state: PacState, time: number) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Background subtle gradient
  const bg = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 50, WIDTH / 2, HEIGHT / 2, WIDTH);
  bg.addColorStop(0, "#1a2310");
  bg.addColorStop(1, "#080d04");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Draw cells
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const c = state.grid[y][x];
      const px = x * CELL_PX;
      const py = y * CELL_PX;
      if (c.wall) drawWall(ctx, state, x, y);
      else if (c.house) {
        ctx.fillStyle = "rgba(180,140,80,0.06)";
        ctx.fillRect(px, py, CELL_PX, CELL_PX);
      }
      if (c.door) {
        ctx.fillStyle = "#c9a227";
        ctx.fillRect(px, py + CELL_PX / 2 - 2, CELL_PX, 4);
      }
      if (c.insect) drawInsect(ctx, x, y, time);
      if (c.coffee) drawCoffee(ctx, x, y, time);
    }
  }

  // Draw effect flash on coffee
  if (state.effectFlashUntil > time) {
    ctx.fillStyle = "rgba(201,162,39,0.18)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  // Draw ghosts
  for (const g of state.ghosts) {
    drawGhost(ctx, g, state, time);
  }

  // Draw Olivia
  drawOlivia(ctx, state, time);
}

function drawWall(ctx: CanvasRenderingContext2D, state: PacState, x: number, y: number) {
  const px = x * CELL_PX;
  const py = y * CELL_PX;
  ctx.fillStyle = "#22361a";
  ctx.fillRect(px, py, CELL_PX, CELL_PX);
  ctx.strokeStyle = "#4a6c39";
  ctx.lineWidth = 1.4;

  // Draw selective edges where neighbor is not wall
  const grid = state.grid;
  const isWall = (xx: number, yy: number) => yy >= 0 && yy < ROWS && xx >= 0 && xx < COLS && grid[yy][xx].wall;
  if (!isWall(x, y - 1)) {
    ctx.beginPath();
    ctx.moveTo(px + 2, py + 2);
    ctx.lineTo(px + CELL_PX - 2, py + 2);
    ctx.stroke();
  }
  if (!isWall(x, y + 1)) {
    ctx.beginPath();
    ctx.moveTo(px + 2, py + CELL_PX - 2);
    ctx.lineTo(px + CELL_PX - 2, py + CELL_PX - 2);
    ctx.stroke();
  }
  if (!isWall(x - 1, y)) {
    ctx.beginPath();
    ctx.moveTo(px + 2, py + 2);
    ctx.lineTo(px + 2, py + CELL_PX - 2);
    ctx.stroke();
  }
  if (!isWall(x + 1, y)) {
    ctx.beginPath();
    ctx.moveTo(px + CELL_PX - 2, py + 2);
    ctx.lineTo(px + CELL_PX - 2, py + CELL_PX - 2);
    ctx.stroke();
  }
}

const INSECT_TYPES = ["halicte", "papillon", "mouche", "bourdon", "cimbicide"] as const;
function pickInsectType(x: number, y: number): typeof INSECT_TYPES[number] {
  const h = (x * 37 + y * 71) % 100;
  if (h < 5) return "bourdon"; // rare
  if (h < 30) return "halicte";
  if (h < 55) return "papillon";
  if (h < 75) return "cimbicide";
  return "mouche";
}

function drawInsect(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  const cx = x * CELL_PX + CELL_PX / 2;
  const cy = y * CELL_PX + CELL_PX / 2;
  const t = INSECT_TYPES.indexOf(pickInsectType(x, y));
  const bob = Math.sin((time + x * 7 + y * 13) / 220) * 0.6;
  ctx.save();
  ctx.translate(cx, cy + bob);
  const type = pickInsectType(x, y);
  if (type === "halicte") {
    // Petite abeille dorée
    ctx.fillStyle = "#e3b341";
    ctx.beginPath();
    ctx.ellipse(0, 0, 3.2, 2.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#5a3a08";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(-1, -2.2);
    ctx.lineTo(-1, 2.2);
    ctx.moveTo(1, -2.2);
    ctx.lineTo(1, 2.2);
    ctx.stroke();
  } else if (type === "papillon") {
    ctx.fillStyle = "#9ec3e7";
    ctx.beginPath();
    ctx.ellipse(-2, 0, 2.5, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(2, 0, 2.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3a4f6a";
    ctx.fillRect(-0.5, -1.5, 1, 3);
  } else if (type === "mouche") {
    ctx.fillStyle = "#aaaaaa";
    ctx.beginPath();
    ctx.ellipse(0, 0, 2.5, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#dddddd";
    ctx.beginPath();
    ctx.ellipse(-1.4, 0, 1.2, 0.6, 0, 0, Math.PI * 2);
    ctx.ellipse(1.4, 0, 1.2, 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "bourdon") {
    // gros bourdon noir-jaune
    ctx.fillStyle = "#f5d23b";
    ctx.beginPath();
    ctx.ellipse(0, 0, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1408";
    ctx.fillRect(-3, -1, 6, 1);
    ctx.fillRect(-3, 1, 6, 1);
  } else {
    // cimbicide orange
    ctx.fillStyle = "#e88a3c";
    ctx.beginPath();
    ctx.ellipse(0, 0, 3, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#aa5520";
    ctx.fillRect(-2.4, -0.5, 4.8, 0.6);
  }
  ctx.restore();
}

function drawCoffee(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  const cx = x * CELL_PX + CELL_PX / 2;
  const cy = y * CELL_PX + CELL_PX / 2;
  const pulse = 1 + Math.sin(time / 200) * 0.07;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(pulse, pulse);
  // tasse
  ctx.fillStyle = "#f4ecd2";
  ctx.beginPath();
  ctx.arc(0, 1, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#7a5b1e";
  ctx.lineWidth = 0.8;
  ctx.stroke();
  // café interne
  ctx.fillStyle = "#5a3a08";
  ctx.beginPath();
  ctx.arc(0, 1, 3.2, 0, Math.PI * 2);
  ctx.fill();
  // fumée
  ctx.strokeStyle = "rgba(244,236,210,0.7)";
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(-2, -3);
  ctx.quadraticCurveTo(0, -5, 2, -6.5);
  ctx.moveTo(2, -3);
  ctx.quadraticCurveTo(0, -5, -2, -6.5);
  ctx.stroke();
  ctx.restore();
}

function drawGhost(ctx: CanvasRenderingContext2D, g: Ghost, state: PacState, time: number) {
  const px = g.cx * CELL_PX + CELL_PX / 2;
  const py = g.cy * CELL_PX + CELL_PX / 2;
  const angry = state.olivia.angryUntil > time;
  const flicker = (Math.sin(time / 80) > 0) ? 1 : 0.8;
  const r = CELL_PX * 0.45;

  ctx.save();
  ctx.translate(px, py);

  const isFrightened = g.mode === "frightened";
  const isEaten = g.mode === "eaten";

  if (isEaten) {
    // just eyes floating
    drawGhostEyes(ctx, g.dir, "#cfe9ff");
    ctx.restore();
    return;
  }

  // body
  let body = g.data.couleur;
  let stroke = g.data.couleurSecondaire;
  if (isFrightened) {
    // tremblotant
    const t = time / 120;
    const c1 = "#3a4f9a";
    const c2 = "#7388c6";
    body = (Math.sin(t) > 0 ? c1 : c2);
    stroke = "#172456";
    // last 2s warning
    const remaining = (state.olivia.angryUntil - time) / 1000;
    if (remaining < 2 && Math.sin(time / 60) > 0) {
      body = "#f4ecd2";
      stroke = "#9a6a14";
    }
  }
  if (g.data.ai === "patrouille") {
    // L'Innommé : contour qui clignote
    ctx.globalAlpha = flicker;
  }

  ctx.fillStyle = body;
  ctx.beginPath();
  // rounded top + wavy bottom
  ctx.moveTo(-r, 0);
  ctx.lineTo(-r, -r * 0.2);
  ctx.arc(0, -r * 0.2, r, Math.PI, 0, false);
  ctx.lineTo(r, r * 0.6);
  // wavy bottom 3 humps
  const humps = 3;
  for (let i = humps; i > 0; i--) {
    const x1 = -r + ((i - 0.5) * 2 * r) / humps;
    const x2 = -r + ((i - 1) * 2 * r) / humps;
    ctx.quadraticCurveTo(x1, r * 0.95, x2, r * 0.6);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.stroke();

  drawGhostEyes(ctx, g.dir, isFrightened ? "#ffd0d0" : "#ffffff");

  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawGhostEyes(ctx: CanvasRenderingContext2D, dir: { x: number; y: number }, scleraColor: string) {
  const r = 2.5;
  const pupilR = 1.4;
  const off = 3.4;
  ctx.fillStyle = scleraColor;
  ctx.beginPath();
  ctx.arc(-off, -2, r, 0, Math.PI * 2);
  ctx.arc(off, -2, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0c1840";
  ctx.beginPath();
  const dx = dir.x * 1.4;
  const dy = dir.y * 1.4;
  ctx.arc(-off + dx, -2 + dy, pupilR, 0, Math.PI * 2);
  ctx.arc(off + dx, -2 + dy, pupilR, 0, Math.PI * 2);
  ctx.fill();
}

function drawOlivia(ctx: CanvasRenderingContext2D, state: PacState, time: number) {
  const o = state.olivia;
  const px = o.cx * CELL_PX + CELL_PX / 2;
  const py = o.cy * CELL_PX + CELL_PX / 2;
  const angry = o.angryUntil > time;
  const frame = Math.floor(time / 140) % 2;

  ctx.save();
  ctx.translate(px, py);

  // Auréole si Sainte Colère
  if (angry) {
    const pulse = 0.4 + 0.6 * Math.abs(Math.sin(time / 200));
    ctx.beginPath();
    ctx.arc(0, 0, CELL_PX * 0.75, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(244,200,60,${0.18 * pulse})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, CELL_PX * 0.55, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,230,120,${0.85 * pulse})`;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }

  // Olivia sprite top-down (drawn for "down" then rotated for other dirs)
  const baseAngle = Math.atan2(o.dir.y, o.dir.x) - Math.PI / 2; // facing direction
  // default facing: down => angle = pi/2; baseAngle relative to "down":
  ctx.rotate(baseAngle); // rotation applied

  // T-shirt vert mousse
  ctx.fillStyle = "#3b6a2c";
  ctx.beginPath();
  ctx.ellipse(0, 2, 5.5, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Short beige (lower part)
  ctx.fillStyle = "#c79a64";
  ctx.beginPath();
  ctx.ellipse(0, 5.5, 4.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cheveux blonds avec mèche
  ctx.fillStyle = "#e8d486";
  ctx.beginPath();
  ctx.arc(0, -2, 5.2, 0, Math.PI * 2);
  ctx.fill();
  // mèche qui dépasse à droite (de la casquette)
  ctx.fillStyle = "#e8d486";
  ctx.beginPath();
  ctx.moveTo(3.4, -3);
  ctx.lineTo(5.6, -1.2);
  ctx.lineTo(4.6, 0);
  ctx.closePath();
  ctx.fill();

  // Visage (skin)
  ctx.fillStyle = "#f1c89a";
  ctx.beginPath();
  ctx.arc(0, -1.5, 3.8, 0, Math.PI * 2);
  ctx.fill();

  // Yeux marron
  ctx.fillStyle = "#3a1f0b";
  ctx.beginPath();
  ctx.arc(-1.4, -2.2, 0.7, 0, Math.PI * 2);
  ctx.arc(1.4, -2.2, 0.7, 0, Math.PI * 2);
  ctx.fill();

  // Sourire léger
  ctx.strokeStyle = "#7a3a16";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.arc(0, -0.5, 1.3, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Casquette rouge sur le dessus (vue de dessus)
  ctx.fillStyle = "#c0331c";
  ctx.beginPath();
  ctx.ellipse(0, -3.5, 4.6, 3.4, 0, 0, Math.PI * 2);
  ctx.fill();
  // visière
  ctx.fillStyle = "#8c2210";
  ctx.beginPath();
  ctx.ellipse(0, -6.6, 3.6, 1.4, 0, 0, Math.PI * 2);
  ctx.fill();
  // dos casquette
  ctx.fillStyle = "#f1c89a";
  ctx.beginPath();
  ctx.arc(0, -3.5, 0.9, 0, Math.PI * 2);
  ctx.fill();

  // Filet à insectes — toujours dans la direction du mouvement (= devant le sprite)
  // Le sprite a été tourné. "Devant" = -y dans le repère du sprite (vers le haut local quand on est tourné). Actually
  // For top-down sprite when facing down (angle 0), forward is +y in canvas. Since we rotated by baseAngle, forward is +y in this sprite's local frame.
  const swing = angry ? Math.sin(time / 90) * 1.2 : Math.sin(time / 220) * 0.4;
  ctx.save();
  // The forward of the sprite is +y (down). Make the net go forward.
  // We use a bit of asymmetry: manche partant du buste et finissant devant et un peu sur le côté.
  const manche = 11 + (frame === 0 ? 0 : 0.6);
  ctx.strokeStyle = "#8a5a26";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(1.8, 1.5);
  ctx.lineTo(1.8 + swing, manche + 1);
  ctx.stroke();
  // boucle du filet (cercle blanc devant)
  ctx.beginPath();
  ctx.arc(2.3 + swing * 1.2, manche + 1.6, 3.2, 0, Math.PI * 2);
  ctx.strokeStyle = "#cfd6c0";
  ctx.lineWidth = 0.9;
  ctx.stroke();
  ctx.fillStyle = "rgba(244,236,210,0.32)";
  ctx.fill();
  ctx.restore();

  ctx.restore();
}
