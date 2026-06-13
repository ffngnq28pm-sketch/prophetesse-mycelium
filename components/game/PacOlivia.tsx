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
import { useStore } from "@/lib/store";

const CELL_PX = 22; // pixels per cell at render time
const WIDTH = COLS * CELL_PX;
const HEIGHT = ROWS * CELL_PX;

// Classe partagée des boutons du pavé directionnel tactile.
const padBtn =
  "flex h-12 w-12 items-center justify-center rounded-md border border-ocre-500/30 bg-transparent font-serif text-lg text-mousse-800 transition hover:bg-mousse-500/10 active:scale-95 dark:text-parchemin-100";

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

  const fxRef = useRef<PacFx>({ particles: [], shakeUntil: 0, shakeMag: 0, reduced: false });

  const [, forceTick] = useState(0);
  const audioOn = useStore((s) => s.audioActif);
  const setAudioOn = useStore((s) => s.setAudioActif);
  const [showStart, setShowStart] = useState(true);
  const [showLevelTransition, setShowLevelTransition] = useState<{ verset: string; nextLevel: number } | null>(null);
  const [malediction, setMalediction] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<{ score: number; level: number; fantomes: number } | null>(null);
  const [paused, setPaused] = useState(false);

  const startNewGame = useCallback(() => {
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
      forceTick((n) => n + 1);
    }
  }, []);

  // prefers-reduced-motion : coupe particules et screenshake.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      fxRef.current.reduced = mq.matches;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // RAF loop — démarre au mount et reste actif. La logique de jeu est skippée si non-playing/paused.
  useEffect(() => {
    const loop = (t: number) => {
      const last = lastTimeRef.current || t;
      const dt = Math.min(0.06, (t - last) / 1000);
      lastTimeRef.current = t;
      animFrameRef.current = t;
      const s = stateRef.current;
      const fx = fxRef.current;
      if (s && s.status === "playing" && !paused) {
        step(s, dt, t);
        if (s.stats.insectsRemaining < lastInsectCountRef.current) {
          audioRef.current.insect();
          lastInsectCountRef.current = s.stats.insectsRemaining;
          // petit pop doré à l'endroit de la capture
          if (!fx.reduced) {
            spawnBurst(fx.particles, s.olivia.cx * CELL_PX + CELL_PX / 2, s.olivia.cy * CELL_PX + CELL_PX / 2, t, "#e8c25a", 6, 30);
          }
        }
        if (s.stats.ghostsTabasses > lastTabassesRef.current) {
          audioRef.current.hitGhost();
          lastTabassesRef.current = s.stats.ghostsTabasses;
          setMalediction(MALEDICTIONS[Math.floor(Math.random() * MALEDICTIONS.length)]);
          setTimeout(() => setMalediction(null), 1400);
          if (!fx.reduced) {
            spawnBurst(fx.particles, s.olivia.cx * CELL_PX + CELL_PX / 2, s.olivia.cy * CELL_PX + CELL_PX / 2, t, "#cfe9ff", 14, 60);
            fx.shakeUntil = t + 200;
            fx.shakeMag = 3; // micro-screenshake, jamais plus de 3 px
          }
        }
      }
      if (s) {
        render(canvasRef.current, s, t, fx);
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
                  La Marcheuse entre dans les cimetières, filet à la main. Sa mission : recenser tous les insectes,
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

        {/* Pavé directionnel — alternative au clavier et au swipe, visible partout */}
        <div className="mx-auto mt-3 grid w-fit grid-cols-3 gap-1.5">
          <span />
          <button className={padBtn} onClick={() => setDir(DIR_UP)} aria-label="Haut">▲</button>
          <span />
          <button className={padBtn} onClick={() => setDir(DIR_LEFT)} aria-label="Gauche">◀</button>
          <button
            className={`${padBtn} text-sm`}
            onClick={() => {
              if (!showStart && !gameOver && !showLevelTransition) setPaused((p) => !p);
            }}
            aria-label="Pause"
          >
            ⏸
          </button>
          <button className={padBtn} onClick={() => setDir(DIR_RIGHT)} aria-label="Droite">▶</button>
          <span />
          <button className={padBtn} onClick={() => setDir(DIR_DOWN)} aria-label="Bas">▼</button>
          <span />
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
// Direction artistique V6 : nuit chaude de cimetière — haies moussues en
// volume, nappes de lumière dorée (clair-obscur académique), fantômes
// spectraux au voile ondulant, vignette douce. Aucune allocation par cellule :
// les dégradés ne sont créés qu'à l'échelle de la frame.

interface PacParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  color: string;
  size: number;
}

interface PacFx {
  particles: PacParticle[];
  shakeUntil: number;
  shakeMag: number;
  reduced: boolean;
}

function spawnBurst(
  arr: PacParticle[],
  x: number,
  y: number,
  t: number,
  color: string,
  n: number,
  speed: number
) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.8;
    const sp = speed * (0.5 + Math.random());
    arr.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 14,
      born: t,
      life: 450 + Math.random() * 350,
      color,
      size: 1.4 + Math.random() * 1.6,
    });
  }
  if (arr.length > 160) arr.splice(0, arr.length - 160);
}

// Hash déterministe (texture des haies, nappes de lumière par niveau).
function hash2(x: number, y: number): number {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function render(canvas: HTMLCanvasElement | null, state: PacState, time: number, fx: PacFx) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Résolution interne alignée sur la taille affichée × densité de pixels (anti-flou rétina).
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cssW = canvas.clientWidth || WIDTH;
  const targetW = Math.round(cssW * dpr);
  const targetH = Math.round(targetW * (ROWS / COLS));
  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }
  const scale = targetW / WIDTH;

  // Micro-screenshake (≤ 3 px), coupé par prefers-reduced-motion.
  let shx = 0;
  let shy = 0;
  if (!fx.reduced && time < fx.shakeUntil) {
    const k = (fx.shakeUntil - time) / 200;
    shx = (Math.random() - 0.5) * 2 * fx.shakeMag * k;
    shy = (Math.random() - 0.5) * 2 * fx.shakeMag * k;
  }
  ctx.setTransform(scale, 0, 0, scale, shx * scale, shy * scale);

  ctx.clearRect(-4, -4, WIDTH + 8, HEIGHT + 8);

  // —— Fond : nuit de terre et de mousse, plus profonde ——
  const bg = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.42, 40, WIDTH / 2, HEIGHT / 2, WIDTH * 0.85);
  bg.addColorStop(0, "#19220f");
  bg.addColorStop(0.65, "#0e1207");
  bg.addColorStop(1, "#050803");
  ctx.fillStyle = bg;
  ctx.fillRect(-4, -4, WIDTH + 8, HEIGHT + 8);

  // —— Nappes de lumière chaude (clair-obscur, fixes par niveau) ——
  const seed = state.stats.niveauIndex + 1;
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 3; i++) {
    const lx = WIDTH * (0.18 + hash2(seed, i * 7) * 0.64);
    const ly = HEIGHT * (0.15 + hash2(i * 13, seed) * 0.7);
    const lr = 90 + hash2(seed * 3, i) * 70;
    const breathe = 1 + Math.sin(time / 2600 + i * 2.1) * 0.06;
    const pool = ctx.createRadialGradient(lx, ly, 6, lx, ly, lr * breathe);
    pool.addColorStop(0, "rgba(244,220,160,0.085)");
    pool.addColorStop(1, "rgba(244,220,160,0)");
    ctx.fillStyle = pool;
    ctx.fillRect(lx - lr, ly - lr, lr * 2, lr * 2);
  }
  ctx.globalCompositeOperation = "source-over";

  // —— Cellules ——
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const c = state.grid[y][x];
      const px = x * CELL_PX;
      const py = y * CELL_PX;
      if (c.wall) drawHedge(ctx, state, x, y);
      else if (c.house) {
        ctx.fillStyle = "rgba(180,140,80,0.06)";
        ctx.fillRect(px, py, CELL_PX, CELL_PX);
      }
      if (c.door) {
        ctx.fillStyle = "#c9a227";
        ctx.fillRect(px, py + CELL_PX / 2 - 2, CELL_PX, 4);
        ctx.fillStyle = "rgba(255,233,176,0.35)";
        ctx.fillRect(px, py + CELL_PX / 2 - 1, CELL_PX, 1.4);
      }
      if (c.insect) drawInsect(ctx, x, y, time);
      if (c.coffee) drawCoffee(ctx, x, y, time);
    }
  }

  // —— Lucioles ambiantes (déterministes, dérivent lentement) ——
  if (!fx.reduced) {
    ctx.fillStyle = "rgba(255,240,190,0.5)";
    for (let i = 0; i < 5; i++) {
      const a = time / (2600 + i * 700) + i * 1.7;
      const lx = WIDTH * (0.5 + 0.42 * Math.sin(a + hash2(i, seed) * 6));
      const ly = HEIGHT * (0.5 + 0.4 * Math.cos(a * 0.8 + i));
      const tw = 0.5 + 0.5 * Math.sin(time / 320 + i * 2.3);
      ctx.globalAlpha = 0.25 + tw * 0.4;
      ctx.beginPath();
      ctx.arc(lx, ly, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Flash du café (Sainte Colère)
  if (state.effectFlashUntil > time) {
    ctx.fillStyle = "rgba(201,162,39,0.18)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  // —— Fantômes puis Marcheuse ——
  for (const g of state.ghosts) {
    drawGhost(ctx, g, state, time);
  }
  drawOlivia(ctx, state, time);

  // —— Particules ——
  drawPacParticles(ctx, fx.particles, time);

  // —— Vignette nocturne ——
  const vg = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, HEIGHT * 0.38, WIDTH / 2, HEIGHT / 2, HEIGHT * 0.78);
  vg.addColorStop(0, "rgba(5,10,3,0)");
  vg.addColorStop(1, "rgba(5,10,3,0.42)");
  ctx.fillStyle = vg;
  ctx.fillRect(-4, -4, WIDTH + 8, HEIGHT + 8);
}

function drawPacParticles(ctx: CanvasRenderingContext2D, particles: PacParticle[], time: number) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    const age = time - p.born;
    if (age >= p.life) {
      particles.splice(i, 1);
      continue;
    }
    const k = age / 1000;
    ctx.globalAlpha = 1 - age / p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x + p.vx * k, p.y + p.vy * k + 30 * k * k, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// Haie moussue de cimetière : volume simple (face sombre, crête éclairée par
// la lune côté haut-gauche), feuillage pointilliste déterministe.
function drawHedge(ctx: CanvasRenderingContext2D, state: PacState, x: number, y: number) {
  const px = x * CELL_PX;
  const py = y * CELL_PX;
  const grid = state.grid;
  const isWall = (xx: number, yy: number) => yy >= 0 && yy < ROWS && xx >= 0 && xx < COLS && grid[yy][xx].wall;

  // masse de base : haie sur terre — mousse sourde, plus brune que verte
  ctx.fillStyle = "#2e3322";
  ctx.fillRect(px, py, CELL_PX, CELL_PX);

  // feuillage : 3 touches déterministes — mousse claire + ombre de terreau
  const h1 = hash2(x * 3 + 1, y * 5 + 2);
  const h2 = hash2(x * 7 + 3, y * 11 + 1);
  const h3 = hash2(x * 13 + 5, y * 17 + 7);
  ctx.fillStyle = "#4a5436";
  ctx.beginPath();
  ctx.arc(px + 4 + h1 * 14, py + 4 + h2 * 14, 2.6 + h3 * 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#241d12";
  ctx.beginPath();
  ctx.arc(px + 4 + h2 * 14, py + 4 + h3 * 14, 2 + h1 * 2, 0, Math.PI * 2);
  ctx.fill();

  // crête éclairée (bords exposés au chemin) — la lumière vient du haut-gauche
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  if (!isWall(x, y - 1)) {
    ctx.strokeStyle = "#7a8456";
    ctx.beginPath();
    ctx.moveTo(px + 2, py + 1.6);
    ctx.lineTo(px + CELL_PX - 2, py + 1.6);
    ctx.stroke();
    // quelques brins qui dépassent
    if (h1 > 0.55) {
      ctx.strokeStyle = "#8b9466";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px + 5 + h2 * 10, py + 1);
      ctx.lineTo(px + 4 + h2 * 10, py - 2.5);
      ctx.stroke();
      ctx.lineWidth = 1.6;
    }
  }
  if (!isWall(x - 1, y)) {
    ctx.strokeStyle = "#5e6541";
    ctx.beginPath();
    ctx.moveTo(px + 1.6, py + 2);
    ctx.lineTo(px + 1.6, py + CELL_PX - 2);
    ctx.stroke();
  }
  if (!isWall(x, y + 1)) {
    ctx.strokeStyle = "#161009";
    ctx.beginPath();
    ctx.moveTo(px + 2, py + CELL_PX - 1.6);
    ctx.lineTo(px + CELL_PX - 2, py + CELL_PX - 1.6);
    ctx.stroke();
  }
  if (!isWall(x + 1, y)) {
    ctx.strokeStyle = "#3a3320";
    ctx.beginPath();
    ctx.moveTo(px + CELL_PX - 1.6, py + 2);
    ctx.lineTo(px + CELL_PX - 1.6, py + CELL_PX - 2);
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

// Index stable d'un fantôme (anime voile et flottement en décalé).
const GHOST_PHASE: Record<string, number> = { cendrillon: 0, precieuse: 1.6, marcel: 3.1, innomme: 4.7 };

function drawGhost(ctx: CanvasRenderingContext2D, g: Ghost, state: PacState, time: number) {
  const phase = GHOST_PHASE[g.id] ?? 0;
  const bob = Math.sin(time / 340 + phase) * 1.3;
  const px = g.cx * CELL_PX + CELL_PX / 2;
  const py = g.cy * CELL_PX + CELL_PX / 2 + bob;
  const r = CELL_PX * 0.46;

  ctx.save();
  ctx.translate(px, py);

  const isFrightened = g.mode === "frightened";
  const isEaten = g.mode === "eaten";

  if (isEaten) {
    // âme qui rentre : deux lueurs pâles + traîne
    ctx.fillStyle = "rgba(207,233,255,0.25)";
    ctx.beginPath();
    ctx.ellipse(-g.dir.x * 5, -g.dir.y * 5 - 2, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    drawGhostEyes(ctx, g, "#cfe9ff", time, true);
    ctx.restore();
    return;
  }

  // —— Couleurs du voile ——
  let body = g.data.couleur;
  let deep = g.data.couleurSecondaire;
  if (isFrightened) {
    const t = time / 120;
    body = Math.sin(t) > 0 ? "#3a4f9a" : "#52689e";
    deep = "#172456";
    const remaining = (state.olivia.angryUntil - time) / 1000;
    if (remaining < 2 && Math.sin(time / 60) > 0) {
      body = "#f4ecd2";
      deep = "#9a6a14";
    }
  }

  const isInnomme = g.id === "innomme";
  if (isInnomme) {
    // l'Innommé n'est jamais tout à fait là
    ctx.globalAlpha = 0.82 + Math.sin(time / 90) * 0.12;
  }

  // —— Halo spectral ——
  const halo = ctx.createRadialGradient(0, -2, 2, 0, -2, r * 2.2);
  halo.addColorStop(0, `${body}3d`);
  halo.addColorStop(1, `${body}00`);
  ctx.fillStyle = halo;
  ctx.fillRect(-r * 2.2, -2 - r * 2.2, r * 4.4, r * 4.4);

  // —— Voile : dôme + ourlet ondulant (drapé qui flotte) ——
  const grad = ctx.createLinearGradient(0, -r * 1.2, 0, r);
  grad.addColorStop(0, body);
  grad.addColorStop(1, deep);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(-r, 0);
  ctx.lineTo(-r, -r * 0.2);
  ctx.arc(0, -r * 0.2, r, Math.PI, 0, false);
  ctx.lineTo(r, r * 0.55);
  const humps = 4;
  const w = time / 130 + phase;
  for (let i = humps; i > 0; i--) {
    const x1 = -r + ((i - 0.5) * 2 * r) / humps;
    const x2 = -r + ((i - 1) * 2 * r) / humps;
    const lift = Math.sin(w + i * 1.5) * 2.2;
    ctx.quadraticCurveTo(x1, r * 0.95 + lift, x2, r * 0.55 + Math.sin(w + i * 1.5 - 0.7) * 1.6);
  }
  ctx.closePath();
  ctx.fill();

  // lueur interne (la lanterne de l'âme)
  const core = ctx.createRadialGradient(0, -r * 0.45, 1, 0, -r * 0.45, r * 0.8);
  core.addColorStop(0, "rgba(255,255,255,0.22)");
  core.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(0, -r * 0.3, r * 0.85, 0, Math.PI * 2);
  ctx.fill();

  // liseré du voile
  ctx.strokeStyle = deep;
  ctx.lineWidth = 1;
  ctx.stroke();

  // —— Identité (accessoires sobres, lisibles à 22 px) ——
  if (!isFrightened) {
    if (g.id === "cendrillon") {
      // casquette plate de jardinier + brin de balai sur l'épaule
      ctx.fillStyle = "#5e7591";
      ctx.beginPath();
      ctx.ellipse(0, -r - 1.5, r * 0.62, 2.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#46586e";
      ctx.fillRect(-r * 0.15, -r - 5, r * 0.5, 3);
      ctx.strokeStyle = "#7a5b30";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(r * 0.7, r * 0.4);
      ctx.lineTo(r * 1.15, -r * 0.9);
      ctx.stroke();
      ctx.strokeStyle = "#c9b178";
      ctx.lineWidth = 1;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(r * 1.15, -r * 0.9);
        ctx.lineTo(r * 1.15 + i * 1.6, -r * 1.28);
        ctx.stroke();
      }
    } else if (g.id === "precieuse") {
      // diadème à trois pointes + collier de perles
      ctx.fillStyle = "#e0c25e";
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 4 - 2, -r - 1);
        ctx.lineTo(i * 4, -r - 6 + Math.abs(i));
        ctx.lineTo(i * 4 + 2, -r - 1);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = "#f2ead8";
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.arc(i * 2.6, r * 0.16 + Math.abs(i) * 0.7, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (g.id === "marcel") {
      // épi de cheveux + taches de rousseur
      ctx.strokeStyle = "#70a070";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(1, -r - 1);
      ctx.quadraticCurveTo(3, -r - 6, 6, -r - 4);
      ctx.stroke();
      ctx.fillStyle = "rgba(60,90,60,0.55)";
      ctx.beginPath();
      ctx.arc(-4.6, 1.4, 0.7, 0, Math.PI * 2);
      ctx.arc(4.6, 1.4, 0.7, 0, Math.PI * 2);
      ctx.arc(0, 2.4, 0.7, 0, Math.PI * 2);
      ctx.fill();
    } else if (isInnomme) {
      // volutes de fumée qui montent
      ctx.fillStyle = "rgba(70,70,70,0.3)";
      const sphase = time / 700;
      for (let i = 0; i < 2; i++) {
        const sy = -r - 4 - ((sphase * 8 + i * 7) % 14);
        const sx = Math.sin(sphase * 2 + i * 2.4) * 3;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.4 - i * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawGhostEyes(ctx, g, isFrightened ? "#ffd0d0" : "#ffffff", time, false);

  ctx.restore();
  ctx.globalAlpha = 1;
}

// Yeux expressifs : chaque défunt a son regard.
function drawGhostEyes(
  ctx: CanvasRenderingContext2D,
  g: Ghost,
  scleraColor: string,
  time: number,
  eatenOnly: boolean
) {
  const dir = g.dir;
  const off = 3.4;
  const dx = dir.x * 1.4;
  const dy = dir.y * 1.4;

  if (g.id === "innomme" && !eatenOnly) {
    // pas de sclère : deux lueurs pâles, insondables
    const tw = 0.7 + 0.3 * Math.sin(time / 280);
    ctx.fillStyle = `rgba(230,235,240,${tw})`;
    ctx.beginPath();
    ctx.arc(-off + dx, -2 + dy, 1.7, 0, Math.PI * 2);
    ctx.arc(off + dx, -2 + dy, 1.7, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  const r = g.id === "marcel" ? 3 : 2.5; // Marcel : grands yeux d'enfant
  ctx.fillStyle = scleraColor;
  ctx.beginPath();
  ctx.arc(-off, -2, r, 0, Math.PI * 2);
  ctx.arc(off, -2, r, 0, Math.PI * 2);
  ctx.fill();

  // paupières : Cendrillon fatigué-tendre, Précieuse hautaine
  if (!eatenOnly && (g.id === "cendrillon" || g.id === "precieuse")) {
    ctx.fillStyle = g.id === "cendrillon" ? "#8aa0b8" : "#c8a0e0";
    const lid = g.id === "cendrillon" ? 0.45 : 0.38;
    ctx.beginPath();
    ctx.rect(-off - r, -2 - r, r * 2, r * 2 * lid);
    ctx.rect(off - r, -2 - r, r * 2, r * 2 * lid);
    ctx.fill();
  }

  ctx.fillStyle = "#0c1840";
  ctx.beginPath();
  ctx.arc(-off + dx, -2 + dy + (g.id === "marcel" ? 0.4 : 0), 1.4, 0, Math.PI * 2);
  ctx.arc(off + dx, -2 + dy + (g.id === "marcel" ? 0.4 : 0), 1.4, 0, Math.PI * 2);
  ctx.fill();
  // reflet
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.arc(-off + dx - 0.5, -2.6 + dy, 0.5, 0, Math.PI * 2);
  ctx.arc(off + dx - 0.5, -2.6 + dy, 0.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawOlivia(ctx: CanvasRenderingContext2D, state: PacState, time: number) {
  const o = state.olivia;
  const px = o.cx * CELL_PX + CELL_PX / 2;
  const py = o.cy * CELL_PX + CELL_PX / 2;
  const angry = o.angryUntil > time;
  const frame = Math.floor(time / 140) % 2;

  // Traîne dorée pendant la Sainte Colère (lisible : « je suis insaisissable »)
  if (angry && (o.dir.x !== 0 || o.dir.y !== 0)) {
    for (let i = 1; i <= 3; i++) {
      const tx = px - o.dir.x * i * 5.5;
      const ty = py - o.dir.y * i * 5.5;
      ctx.fillStyle = `rgba(244,211,94,${0.16 - i * 0.04})`;
      ctx.beginPath();
      ctx.arc(tx, ty, 7 - i * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

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
    // étincelles en orbite
    for (let i = 0; i < 3; i++) {
      const a = time / 260 + (i * Math.PI * 2) / 3;
      ctx.fillStyle = "rgba(255,236,160,0.9)";
      ctx.beginPath();
      ctx.arc(Math.cos(a) * CELL_PX * 0.62, Math.sin(a) * CELL_PX * 0.62, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Sprite vu de face, toujours debout (lisibilité à 22 px). Seul le
  // filet pivote vers la direction de déplacement — le visage reste lisible.
  const moving = o.dir.x !== 0 || o.dir.y !== 0;
  const netAngle = moving ? Math.atan2(o.dir.y, o.dir.x) - Math.PI / 2 : 0;
  const bob = Math.sin(time / 160) * (moving ? 1 : 0.4);
  const swing = angry ? Math.sin(time / 90) * 0.5 : Math.sin(time / 240) * 0.22;

  // Ombre portée au sol
  ctx.beginPath();
  ctx.ellipse(0, 8, 6, 2.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fill();

  ctx.translate(0, bob);

  // Filet à insectes (derrière le corps, pivote vers la direction)
  ctx.save();
  ctx.rotate(netAngle + swing);
  const manche = 10.5 + (frame === 1 ? 0.7 : 0);
  ctx.strokeStyle = "#7a4e1f";
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 1);
  ctx.lineTo(0, manche);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, manche + 2.4, 4.2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(238,240,225,0.45)";
  ctx.fill();
  ctx.strokeStyle = "#eef0e1";
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.restore();

  // Corps (veste vert mousse) avec contour sombre + reflet d'épaule
  ctx.beginPath();
  ctx.ellipse(0, 3, 5.2, 5.6, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#3f7330";
  ctx.fill();
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = "#16240f";
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath();
  ctx.ellipse(-1.6, 0.8, 2.6, 1.6, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // Cheveux blonds (derrière la tête) + couettes qui suivent le mouvement
  const hairSway = (o.dir.x !== 0 || o.dir.y !== 0) ? Math.sin(time / 150) * 0.9 : Math.sin(time / 520) * 0.35;
  ctx.fillStyle = "#e7cf6f";
  ctx.beginPath();
  ctx.arc(0, -3.8, 5.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-4.4 - hairSway, 1.4, 1.9, 5.6, 0.12 + hairSway * 0.05, 0, Math.PI * 2);
  ctx.ellipse(4.4 - hairSway, 1.4, 1.9, 5.6, -0.12 + hairSway * 0.05, 0, Math.PI * 2);
  ctx.fill();
  // reflet doré dans les couettes
  ctx.fillStyle = "#f2e29a";
  ctx.beginPath();
  ctx.ellipse(-4.6 - hairSway, 0.4, 0.7, 2.6, 0.12, 0, Math.PI * 2);
  ctx.ellipse(4.2 - hairSway, 0.4, 0.7, 2.6, -0.12, 0, Math.PI * 2);
  ctx.fill();
  // élastiques — cheveux attachés
  ctx.fillStyle = "#b8893a";
  ctx.beginPath();
  ctx.ellipse(-4.5, -1.8, 1.6, 0.9, 0.12, 0, Math.PI * 2);
  ctx.ellipse(4.5, -1.8, 1.6, 0.9, -0.12, 0, Math.PI * 2);
  ctx.fill();

  // Visage
  ctx.beginPath();
  ctx.arc(0, -3.4, 4.3, 0, Math.PI * 2);
  ctx.fillStyle = "#f3cd9e";
  ctx.fill();
  ctx.lineWidth = 1.1;
  ctx.strokeStyle = "#c69b67";
  ctx.stroke();
  // joues
  ctx.fillStyle = "rgba(224,140,110,0.35)";
  ctx.beginPath();
  ctx.ellipse(-2.6, -1.8, 1.1, 0.7, 0, 0, Math.PI * 2);
  ctx.ellipse(2.6, -1.8, 1.1, 0.7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Casquette rouge — l'unique accent vif du site, soigné en conséquence
  ctx.beginPath();
  ctx.arc(0, -4, 4.8, Math.PI * 1.03, Math.PI * 1.97, false);
  ctx.closePath();
  ctx.fillStyle = "#e23b22";
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = "#7c1d0e";
  ctx.stroke();
  // calotte : reflet
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.ellipse(-1.6, -6.4, 2.2, 1.1, -0.4, 0, Math.PI * 2);
  ctx.fill();
  // visière orientée vers la direction de marche (horizontale)
  const visorShift = o.dir.x !== 0 ? o.dir.x * 1.6 : 0;
  ctx.beginPath();
  ctx.ellipse(visorShift, -5.3, 4.7, 1.7, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#bf3019";
  ctx.fill();
  ctx.strokeStyle = "#7c1d0e";
  ctx.stroke();

  // Sourcils : déterminés, féroces en Sainte Colère
  ctx.strokeStyle = "#9a7b3a";
  ctx.lineWidth = 1;
  ctx.lineCap = "round";
  const brow = angry ? 0.9 : 0;
  ctx.beginPath();
  ctx.moveTo(-3, -4.6 + brow);
  ctx.lineTo(-0.9, -4.1 - brow * 0.4);
  ctx.moveTo(3, -4.6 + brow);
  ctx.lineTo(0.9, -4.1 - brow * 0.4);
  ctx.stroke();

  // Yeux marron, perçants — pupilles tournées vers la direction
  const lookX = o.dir.x * 0.5;
  const lookY = o.dir.y * 0.4;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(-1.8, -3, 1.3, 1.6, 0, 0, Math.PI * 2);
  ctx.ellipse(1.8, -3, 1.3, 1.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3a1f0b";
  ctx.beginPath();
  ctx.arc(-1.8 + lookX, -2.7 + lookY, 1, 0, Math.PI * 2);
  ctx.arc(1.8 + lookX, -2.7 + lookY, 1, 0, Math.PI * 2);
  ctx.fill();
  // reflets
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(-2.1 + lookX, -3.1 + lookY, 0.4, 0, Math.PI * 2);
  ctx.arc(1.5 + lookX, -3.1 + lookY, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
