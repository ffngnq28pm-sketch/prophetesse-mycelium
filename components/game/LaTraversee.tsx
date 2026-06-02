"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, Smartphone } from "lucide-react";
import {
  TraverseeState,
  Input,
  createInitialState,
  step,
  startGame,
  Olivia,
  Platform,
  Hazard,
  Collectible,
} from "@/lib/traversee-engine";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";

export interface TraverseeResult {
  tempsMs: number;
  pollinisateurs: number;
  pollinisateursTotal: number;
  graines: number;
  sansDosette: boolean;
}

interface Props {
  onWin?: (r: TraverseeResult) => void;
}

// ============ PALETTE ============
const RED_CAP = "#c0392b";
const RED_CAP_DARK = "#8e2820";

// ============ AUDIO (procédural, WebAudio) ============
class TraverseeAudio {
  ctx: AudioContext | null = null;
  enabled = false;
  init() {
    if (this.ctx) return;
    try {
      const Ctor = (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) as typeof AudioContext;
      this.ctx = new Ctor();
    } catch {
      this.ctx = null;
    }
  }
  resume() {
    this.ctx?.resume?.();
  }
  private beep(freq: number, dur = 0.06, type: OscillatorType = "sine", vol = 0.06) {
    if (!this.enabled || !this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g);
    g.connect(this.ctx.destination);
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t);
    o.stop(t + dur);
  }
  jump() {
    this.beep(440, 0.1, "sine", 0.05);
    setTimeout(() => this.beep(620, 0.08, "sine", 0.04), 40);
  }
  land() {
    this.beep(180, 0.07, "triangle", 0.05);
  }
  catch_() {
    this.beep(880, 0.06, "triangle", 0.06);
    setTimeout(() => this.beep(1320, 0.1, "triangle", 0.05), 50);
  }
  convert() {
    this.beep(300, 0.12, "sine", 0.06);
    setTimeout(() => this.beep(500, 0.14, "sine", 0.05), 70);
  }
  graine() {
    this.beep(1046, 0.05, "sine", 0.05);
  }
  respawn() {
    this.beep(330, 0.2, "sine", 0.05);
    setTimeout(() => this.beep(247, 0.25, "sine", 0.05), 120);
  }
  win() {
    [523, 659, 784, 1047, 1319].forEach((f, i) =>
      setTimeout(() => this.beep(f, 0.22, "triangle", 0.07), i * 140)
    );
  }
}

// ============ DÉCOR (généré une fois, déterministe) ============
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface FarTree {
  x: number;
  h: number;
  w: number;
  cypres: boolean;
  shade: number;
}
interface Mausolee {
  x: number;
  w: number;
  h: number;
  kind: "chapelle" | "obelisque" | "urne";
  shade: number;
}
type MidKind = "stele" | "steleRonde" | "croix" | "caveau" | "obelisque";
interface MidProp {
  x: number;
  kind: MidKind;
  h: number;
  w: number;
  lean: number;
  moss: number; // 0..1 niveau de reverdissement
  lichen: number; // graine pour les taches de lichen
}
interface Grass {
  x: number;
  h: number;
  blades: number;
  hue: number;
}

interface Decor {
  farTrees: FarTree[];
  mausolees: Mausolee[];
  mid: MidProp[];
  grass: Grass[];
}

function buildDecor(worldW: number): Decor {
  const r = mulberry32(20260602);
  const farTrees: FarTree[] = [];
  for (let x = 0; x < worldW; x += 90 + r() * 70) {
    farTrees.push({
      x,
      h: 130 + r() * 160,
      w: 26 + r() * 26,
      cypres: r() > 0.45,
      shade: r(),
    });
  }
  // Mausolées / chapelles funéraires lointains, dans la brume (Père-Lachaise).
  const mausolees: Mausolee[] = [];
  for (let x = 120; x < worldW; x += 280 + r() * 260) {
    const roll = r();
    mausolees.push({
      x,
      w: 40 + r() * 36,
      h: 70 + r() * 80,
      kind: roll > 0.62 ? "chapelle" : roll > 0.3 ? "obelisque" : "urne",
      shade: r(),
    });
  }
  // Couche moyenne : tombes variées et reverdies, denses (on doit VOIR le cimetière).
  const mid: MidProp[] = [];
  const kinds: MidKind[] = ["stele", "steleRonde", "croix", "caveau", "obelisque"];
  for (let x = 50; x < worldW; x += 80 + r() * 110) {
    const roll = r();
    const kind =
      roll < 0.3 ? kinds[0] : roll < 0.5 ? kinds[1] : roll < 0.68 ? kinds[2] : roll < 0.85 ? kinds[3] : kinds[4];
    const isCaveau = kind === "caveau";
    mid.push({
      x,
      kind,
      h: isCaveau ? 22 + r() * 16 : 40 + r() * 52,
      w: isCaveau ? 40 + r() * 30 : 20 + r() * 16,
      lean: (r() - 0.5) * (kind === "croix" ? 0.7 : 0.35),
      moss: r(),
      lichen: r() * 1000,
    });
  }
  const grass: Grass[] = [];
  for (let x = 0; x < worldW; x += 26 + r() * 34) {
    grass.push({ x, h: 14 + r() * 26, blades: 3 + Math.floor(r() * 4), hue: r() });
  }
  return { farTrees, mausolees, mid, grass };
}

// ============ PARTICULES & FLEURS (rendu seulement) ============
interface Flower {
  x: number;
  y: number;
  born: number;
  hue: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  color: string;
  size: number;
}

// ============ COMPOSANT ============
export function LaTraversee({ onWin }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<TraverseeState | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const inputRef = useRef<Input>({ left: false, right: false, jump: false, net: false });
  const audioRef = useRef<TraverseeAudio>(new TraverseeAudio());
  const decorRef = useRef<Decor | null>(null);
  const flowersRef = useRef<Flower[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const wonHandledRef = useRef(false);
  const viewRef = useRef({ w: 800, h: 460 });

  const [showIntro, setShowIntro] = useState(true);
  const [won, setWon] = useState<TraverseeResult | null>(null);
  const [showRotateHint, setShowRotateHint] = useState(false);

  const audioOn = useStore((s) => s.audioActif);
  const setAudioOn = useStore((s) => s.setAudioActif);

  // Init état + décor au montage (le décor est visible sous l'overlay d'intro).
  useEffect(() => {
    if (!stateRef.current) {
      stateRef.current = createInitialState(performance.now());
      decorRef.current = buildDecor(stateRef.current.worldW);
    }
  }, []);

  // Audio on/off
  useEffect(() => {
    audioRef.current.enabled = audioOn;
    if (audioOn) {
      audioRef.current.init();
      audioRef.current.resume();
    }
  }, [audioOn]);

  // Hint d'orientation (portrait étroit).
  useEffect(() => {
    const check = () => {
      const portrait = window.matchMedia("(orientation: portrait)").matches;
      const small = window.innerWidth < 820;
      setShowRotateHint(portrait && small);
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  const beginGame = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    if (audioOn) {
      audioRef.current.init();
      audioRef.current.resume();
    }
    startGame(s, performance.now());
    setShowIntro(false);
  }, [audioOn]);

  const restart = useCallback(() => {
    const fresh = createInitialState(performance.now());
    stateRef.current = fresh;
    flowersRef.current = [];
    particlesRef.current = [];
    wonHandledRef.current = false;
    lastTimeRef.current = 0;
    setWon(null);
    startGame(fresh, performance.now());
    setShowIntro(false);
  }, []);

  // ====== Clavier ======
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const i = inputRef.current;
      if (["arrowleft", "a", "q"].includes(k)) {
        i.left = true;
        e.preventDefault();
      } else if (["arrowright", "d"].includes(k)) {
        i.right = true;
        e.preventDefault();
      } else if (["arrowup", "w", "z", " ", "spacebar"].includes(k)) {
        i.jump = true;
        e.preventDefault();
      } else if (["k", "j", "f", "shift", "l"].includes(k)) {
        i.net = true;
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const i = inputRef.current;
      if (["arrowleft", "a", "q"].includes(k)) i.left = false;
      else if (["arrowright", "d"].includes(k)) i.right = false;
      else if (["arrowup", "w", "z", " ", "spacebar"].includes(k)) i.jump = false;
      else if (["k", "j", "f", "shift", "l"].includes(k)) i.net = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // ====== Boucle RAF ======
  useEffect(() => {
    const loop = (t: number) => {
      const s = stateRef.current;
      const canvas = canvasRef.current;
      const last = lastTimeRef.current || t;
      const dt = Math.min(0.05, (t - last) / 1000);
      lastTimeRef.current = t;

      if (s && canvas) {
        const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
        const { viewW, viewH } = step(s, dt, inputRef.current, t, aspect);
        viewRef.current = { w: viewW, h: viewH };

        drainEvents(s, t);
        render(canvas, s, decorRef.current, flowersRef.current, particlesRef.current, t, viewW, viewH);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drainEvents = useCallback(
    (s: TraverseeState, t: number) => {
      const ev = s.events;
      const a = audioRef.current;
      if (ev.landed) {
        flowersRef.current.push({ x: ev.landed.x, y: ev.landed.y, born: t, hue: Math.random() });
        if (flowersRef.current.length > 28) flowersRef.current.shift();
        a.land();
      }
      if (ev.netSwing && s.olivia.vy < -50) {
        /* coup en l'air : pas de son spécifique */
      }
      if (ev.caught) {
        burst(particlesRef.current, ev.caught.x, ev.caught.y, t, "#f4d35e", 12);
        a.catch_();
      }
      if (ev.converted) {
        burst(particlesRef.current, ev.converted.x, ev.converted.y, t, "#7ea36a", 10);
        a.convert();
      }
      if (ev.graine) {
        burst(particlesRef.current, ev.graine.x, ev.graine.y, t, "#c9a227", 7);
        a.graine();
      }
      if (ev.respawn) a.respawn();
      if (ev.won && !wonHandledRef.current) {
        wonHandledRef.current = true;
        a.win();
        const result: TraverseeResult = {
          tempsMs: s.stats.elapsedMs,
          pollinisateurs: s.stats.pollinisateursCaught,
          pollinisateursTotal: s.stats.pollinisateursTotal,
          graines: s.stats.grainesCaught + s.stats.pollinisateursCaught,
          sansDosette: s.stats.dosettesHit === 0,
        };
        setWon(result);
        onWin?.(result);
      }
    },
    [onWin]
  );

  // ====== Boutons tactiles ======
  const setHeld = (key: keyof Input, v: boolean) => {
    inputRef.current[key] = v;
    if (v && !audioRef.current.ctx && audioOn) {
      audioRef.current.init();
      audioRef.current.resume();
    }
  };

  const padBtn =
    "flex select-none items-center justify-center rounded-full border-2 border-ocre-400/60 bg-mousse-950/45 text-parchemin-50 backdrop-blur-sm active:scale-90 active:bg-ocre-500/40 transition-transform touch-none";

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div
        className="relative w-full overflow-hidden rounded-xl border-2 border-ocre-500/50 shadow-2xl"
        style={{ aspectRatio: "16 / 10", touchAction: "none" }}
      >
        <canvas ref={canvasRef} className="block h-full w-full select-none" style={{ touchAction: "none" }} />

        {/* Toggles haut-droite */}
        <div className="absolute right-2 top-2 z-20 flex gap-2">
          <button
            onClick={() => setAudioOn(!audioOn)}
            aria-label={audioOn ? "Couper le son" : "Activer le son"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ocre-400/50 bg-mousse-950/50 text-parchemin-50 backdrop-blur-sm"
          >
            {audioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          {!showIntro && !won && (
            <button
              onClick={restart}
              aria-label="Recommencer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ocre-400/50 bg-mousse-950/50 text-parchemin-50 backdrop-blur-sm"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>

        {/* Hint orientation */}
        <AnimatePresence>
          {showRotateHint && !showIntro && !won && (
            <motion.button
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRotateHint(false)}
              className="absolute left-1/2 top-2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-ocre-400/50 bg-mousse-950/60 px-3 py-1 text-[11px] text-parchemin-100 backdrop-blur-sm"
            >
              <Smartphone size={12} className="rotate-90" /> Tourne ton téléphone pour une plus belle vue
            </motion.button>
          )}
        </AnimatePresence>

        {/* ====== Contrôles tactiles ====== */}
        {!showIntro && !won && (
          <>
            {/* Gauche / Droite */}
            <div className="absolute bottom-3 left-3 z-10 flex gap-2">
              <button
                className={`${padBtn} h-16 w-16`}
                aria-label="Gauche"
                onPointerDown={(e) => {
                  e.preventDefault();
                  setHeld("left", true);
                }}
                onPointerUp={() => setHeld("left", false)}
                onPointerLeave={() => setHeld("left", false)}
                onPointerCancel={() => setHeld("left", false)}
              >
                <span className="text-2xl">◀</span>
              </button>
              <button
                className={`${padBtn} h-16 w-16`}
                aria-label="Droite"
                onPointerDown={(e) => {
                  e.preventDefault();
                  setHeld("right", true);
                }}
                onPointerUp={() => setHeld("right", false)}
                onPointerLeave={() => setHeld("right", false)}
                onPointerCancel={() => setHeld("right", false)}
              >
                <span className="text-2xl">▶</span>
              </button>
            </div>
            {/* Filet / Saut */}
            <div className="absolute bottom-3 right-3 z-10 flex items-end gap-2">
              <button
                className={`${padBtn} h-14 w-14 text-xs font-serif`}
                aria-label="Filet"
                onPointerDown={(e) => {
                  e.preventDefault();
                  setHeld("net", true);
                }}
                onPointerUp={() => setHeld("net", false)}
                onPointerLeave={() => setHeld("net", false)}
                onPointerCancel={() => setHeld("net", false)}
              >
                <span className="text-xl">🥅</span>
              </button>
              <button
                className={`${padBtn} h-20 w-20`}
                aria-label="Saut"
                onPointerDown={(e) => {
                  e.preventDefault();
                  setHeld("jump", true);
                }}
                onPointerUp={() => setHeld("jump", false)}
                onPointerLeave={() => setHeld("jump", false)}
                onPointerCancel={() => setHeld("jump", false)}
              >
                <span className="text-3xl">⤴</span>
              </button>
            </div>
          </>
        )}

        {/* ====== Overlay Intro ====== */}
        <AnimatePresence>
          {showIntro && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-mousse-950/85 p-6 text-center text-parchemin-50 backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-ocre-400">Jeu IV — Le Sentier des Spores</p>
              <h2 className="titre-liturgique mt-2 text-3xl">La traversée d&apos;Olivia</h2>
              <div className="ornement" />
              <p className="mx-auto max-w-md font-serif italic text-parchemin-100">
                Casquette rouge, filet à la main, Olivia traverse un cimetière reverdi. Elle saute par-dessus les
                pièges de la modernité, attrape les pollinisateurs au filet, composte les dosettes — et rejoint le
                Sanctuaire au bout du sentier.
              </p>
              <p className="mt-3 max-w-md font-serif text-xs text-parchemin-200/80">
                ← → pour avancer · saut pour bondir · filet pour attraper et convertir. Tomber ne tue pas : le
                mycélium te redonne pied.
              </p>
              <p className="mt-1 font-serif text-[11px] text-parchemin-200/60">
                Clavier : flèches/ZQSD · Espace = saut · K = filet. Mobile : boutons à l&apos;écran.
              </p>
              <Button onClick={beginGame} className="mt-5">
                Entrer dans le sentier
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== Overlay Victoire ====== */}
        <AnimatePresence>
          {won && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-mousse-950/90 p-6 text-center text-parchemin-50 backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-ocre-400">Le Sanctuaire est atteint</p>
              <h2 className="titre-liturgique mt-2 text-3xl">{verdict(won).titre}</h2>
              <div className="ornement" />
              <p className="mx-auto max-w-md font-serif italic text-parchemin-100">{verdict(won).texte}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 font-serif text-sm">
                <span className="rounded-full border border-ocre-400/50 bg-ocre-500/15 px-3 py-1">
                  ⏱ {formatTime(won.tempsMs)}
                </span>
                <span className="rounded-full border border-ocre-400/50 bg-ocre-500/15 px-3 py-1">
                  🦋 {won.pollinisateurs}/{won.pollinisateursTotal} pollinisateurs
                </span>
                <span className="rounded-full border border-ocre-400/50 bg-ocre-500/15 px-3 py-1">
                  🌱 {won.graines} graines
                </span>
              </div>
              <Button onClick={restart} className="mt-5">
                Refaire la traversée
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-3 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
        Astuce : maintiens le saut pour bondir plus haut. Le filet composte les dosettes et fait reverdir le
        pesticide.
      </p>
    </div>
  );
}

// ============ VERDICT MYCÉLIEN ============
function verdict(r: TraverseeResult): { titre: string; texte: string } {
  const tousPoll = r.pollinisateurs >= r.pollinisateursTotal;
  if (tousPoll && r.sansDosette) {
    return {
      titre: "Traversée immaculée",
      texte:
        "Tous les pollinisateurs recensés, pas une dosette pour te faire trébucher. Mère Mycorhize aurait posé une main sur ton épaule, sans rien dire — ce qui, chez elle, est un sacre.",
    };
  }
  if (tousPoll) {
    return {
      titre: "Ami des pollinisateurs",
      texte:
        "Aucun pollinisateur laissé derrière. Sœur Halicte note ton passage dans un carnet qu'elle n'a jamais montré à personne.",
    };
  }
  if (r.pollinisateurs >= r.pollinisateursTotal * 0.6) {
    return {
      titre: "Le sentier accompli",
      texte:
        "Tu as rejoint le Sanctuaire, le filet bien rempli. Quelques pollinisateurs t'ont échappé — ils reviendront, c'est leur métier.",
    };
  }
  return {
    titre: "Pèlerin pressé",
    texte:
      "Tu as atteint le Sanctuaire, et c'est l'essentiel. Mais Frère Lichen murmure que le sentier méritait qu'on s'y attarde un peu. Recommence, sans hâte.",
  };
}

function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ============ PARTICULES ============
function burst(arr: Particle[], x: number, y: number, t: number, color: string, n: number) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + Math.random();
    const sp = 40 + Math.random() * 90;
    arr.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 40,
      born: t,
      life: 600 + Math.random() * 400,
      color,
      size: 2 + Math.random() * 2.5,
    });
  }
  if (arr.length > 220) arr.splice(0, arr.length - 220);
}

// ============ RENDER ============
function render(
  canvas: HTMLCanvasElement,
  s: TraverseeState,
  decor: Decor | null,
  flowers: Flower[],
  particles: Particle[],
  time: number,
  viewW: number,
  viewH: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = canvas.clientWidth || 800;
  const cssH = canvas.clientHeight || 500;
  const tw = Math.round(cssW * dpr);
  const th = Math.round(cssH * dpr);
  if (canvas.width !== tw || canvas.height !== th) {
    canvas.width = tw;
    canvas.height = th;
  }
  const scale = canvas.height / viewH; // px appareil par unité monde
  const cam = s.cam;

  const layer = (px: number, py: number) =>
    ctx.setTransform(scale, 0, 0, scale, -cam.x * px * scale, -cam.y * py * scale);

  // —— 1. Ciel (fixe) ——
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#3a562f"); // mousse en haut
  sky.addColorStop(0.42, "#6f6a3e");
  sky.addColorStop(0.7, "#b89a5a"); // ocre voilé
  sky.addColorStop(1, "#e9d8ad"); // parchemin bas, brume
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Soleil voilé (léger parallaxe horizontal)
  const sunX = canvas.width * 0.74 - cam.x * 0.04 * scale;
  const sunY = canvas.height * 0.26;
  const sunR = canvas.height * 0.13;
  const halo = ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 3);
  halo.addColorStop(0, "rgba(255,244,210,0.85)");
  halo.addColorStop(0.3, "rgba(244,222,160,0.35)");
  halo.addColorStop(1, "rgba(244,222,160,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // —— 2. Arbres lointains (parallaxe 0.22) ——
  if (decor) {
    layer(0.22, 0.5);
    const camLx = cam.x * 0.22;
    for (const tr of decor.farTrees) {
      if (tr.x < camLx - 120 || tr.x > camLx + viewW + 120) continue;
      drawFarTree(ctx, tr);
    }
  }

  // —— 2bis. Mausolées lointains (parallaxe 0.32), avalés par la brume ——
  if (decor) {
    layer(0.32, 0.6);
    const camLx = cam.x * 0.32;
    for (const ma of decor.mausolees) {
      if (ma.x < camLx - 140 || ma.x > camLx + viewW + 140) continue;
      drawMausolee(ctx, ma);
    }
  }

  // —— 3. Brume basse (parallaxe 0.32) ——
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const mistY = canvas.height * 0.52;
  const mist = ctx.createLinearGradient(0, mistY, 0, canvas.height);
  mist.addColorStop(0, "rgba(233,216,173,0)");
  mist.addColorStop(0.5, "rgba(224,212,180,0.32)");
  mist.addColorStop(1, "rgba(214,205,180,0.55)");
  ctx.fillStyle = mist;
  ctx.fillRect(0, mistY, canvas.width, canvas.height - mistY);

  // —— 4. Décor moyen : tombes, croix, murs (parallaxe 0.55) ——
  if (decor) {
    layer(0.55, 0.78);
    const camLx = cam.x * 0.55;
    for (const m of decor.mid) {
      if (m.x < camLx - 100 || m.x > camLx + viewW + 100) continue;
      drawMidProp(ctx, m);
    }
  }

  // —— 5. Plan de jeu (parallaxe 1) ——
  layer(1, 1);

  for (const p of s.platforms) {
    if (p.x + p.w < cam.x - 40 || p.x > cam.x + viewW + 40) continue;
    drawPlatform(ctx, p);
  }

  drawSanctuaire(ctx, s.sanctuaire, time);

  for (const f of flowers) drawFlower(ctx, f, time);

  for (const hz of s.hazards) {
    if (hz.x + hz.w < cam.x - 40 || hz.x > cam.x + viewW + 40) continue;
    drawHazard(ctx, hz, time);
  }

  for (const c of s.collectibles) {
    if (c.taken) continue;
    if (c.x + c.w < cam.x - 40 || c.x > cam.x + viewW + 40) continue;
    drawCollectible(ctx, c, time);
  }

  drawParticles(ctx, particles, time);

  drawOlivia(ctx, s.olivia, time);

  // —— 6. Herbes de premier plan (parallaxe 1.25) ——
  if (decor) {
    layer(1.25, 1.08);
    const camLx = cam.x * 1.25;
    for (const g of decor.grass) {
      if (g.x < camLx - 60 || g.x > camLx + viewW + 60) continue;
      drawGrass(ctx, g, time);
    }
  }

  // —— 7. Rayons de lumière obliques (god rays, intensifient vers l'Ascension) ——
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawGodRays(ctx, canvas, time, cam.x / s.worldW);

  // —— 8. HUD ——
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawHUD(ctx, s, cssW);

  // Message bienveillant (réapparition)
  if (s.message && time < s.messageUntil) {
    const alpha = Math.min(1, (s.messageUntil - time) / 400);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(19,32,15,0.7)";
    ctx.font = "italic 15px Georgia, serif";
    const tw2 = ctx.measureText(s.message).width;
    const bx = cssW / 2 - tw2 / 2 - 12;
    ctx.fillRect(bx, 46, tw2 + 24, 28);
    ctx.fillStyle = "#f4ecd2";
    ctx.fillText(s.message, cssW / 2 - tw2 / 2, 65);
    ctx.globalAlpha = 1;
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// ====== Sous-fonctions de rendu (coordonnées monde) ======

function drawFarTree(ctx: CanvasRenderingContext2D, tr: FarTree) {
  const groundY = 600;
  const baseShade = 30 + Math.floor(tr.shade * 26);
  ctx.fillStyle = `rgb(${baseShade - 8}, ${baseShade + 18}, ${baseShade - 4})`;
  if (tr.cypres) {
    // Cyprès : colonne fuselée
    ctx.beginPath();
    ctx.moveTo(tr.x, groundY);
    ctx.quadraticCurveTo(tr.x - tr.w * 0.55, groundY - tr.h * 0.5, tr.x, groundY - tr.h);
    ctx.quadraticCurveTo(tr.x + tr.w * 0.55, groundY - tr.h * 0.5, tr.x, groundY);
    ctx.fill();
  } else {
    // If : touffe arrondie sur tronc court
    ctx.fillRect(tr.x - 3, groundY - tr.h * 0.4, 6, tr.h * 0.4);
    ctx.beginPath();
    ctx.ellipse(tr.x, groundY - tr.h * 0.55, tr.w * 0.8, tr.h * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMausolee(ctx: CanvasRenderingContext2D, ma: Mausolee) {
  const groundY = 600;
  // Silhouette douce, désaturée, dans la brume : vert-gris bleuté translucide.
  const v = 64 + Math.floor(ma.shade * 26);
  ctx.fillStyle = `rgba(${v - 6}, ${v + 6}, ${v}, 0.62)`;
  const x = ma.x;
  if (ma.kind === "chapelle") {
    const bw = ma.w;
    const bh = ma.h * 0.62;
    ctx.fillRect(x - bw / 2, groundY - bh, bw, bh);
    // toit pointu
    ctx.beginPath();
    ctx.moveTo(x - bw / 2 - 3, groundY - bh);
    ctx.lineTo(x, groundY - ma.h);
    ctx.lineTo(x + bw / 2 + 3, groundY - bh);
    ctx.closePath();
    ctx.fill();
    // petite croix au faîte
    ctx.fillRect(x - 1.5, groundY - ma.h - 8, 3, 9);
    ctx.fillRect(x - 4, groundY - ma.h - 5, 9, 3);
    // porte sombre
    ctx.fillStyle = `rgba(${v - 26}, ${v - 18}, ${v - 22}, 0.6)`;
    ctx.fillRect(x - bw * 0.16, groundY - bh * 0.7, bw * 0.32, bh * 0.7);
  } else if (ma.kind === "obelisque") {
    ctx.beginPath();
    ctx.moveTo(x - ma.w * 0.18, groundY);
    ctx.lineTo(x - ma.w * 0.1, groundY - ma.h * 0.86);
    ctx.lineTo(x, groundY - ma.h);
    ctx.lineTo(x + ma.w * 0.1, groundY - ma.h * 0.86);
    ctx.lineTo(x + ma.w * 0.18, groundY);
    ctx.closePath();
    ctx.fill();
  } else {
    // colonne surmontée d'une urne
    const cw = ma.w * 0.4;
    ctx.fillRect(x - cw / 2, groundY - ma.h * 0.78, cw, ma.h * 0.78);
    ctx.beginPath();
    ctx.ellipse(x, groundY - ma.h * 0.82, cw * 0.8, ma.h * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMidProp(ctx: CanvasRenderingContext2D, m: MidProp) {
  const groundY = 600;
  ctx.save();
  ctx.translate(m.x, groundY);
  ctx.rotate(m.lean * 0.16);

  const stone = "#928868";
  const stoneEdge = "#6c6450";
  const mossCol = `rgba(95,135,76,${0.45 + m.moss * 0.4})`;
  const hw = m.w / 2;

  ctx.strokeStyle = stoneEdge;
  ctx.lineWidth = 1.2;

  if (m.kind === "croix") {
    ctx.fillStyle = stone;
    ctx.fillRect(-3.5, -m.h, 7, m.h);
    ctx.fillRect(-12, -m.h + 9, 24, 6.5);
    ctx.strokeRect(-3.5, -m.h, 7, m.h);
    // lierre grimpant
    ctx.strokeStyle = mossCol;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-4, -m.h * 0.4, 1, -m.h * 0.75);
    ctx.stroke();
  } else if (m.kind === "caveau") {
    // tombeau-coffre bas, avec dalle qui déborde
    ctx.fillStyle = stone;
    roundRectPath(ctx, -hw, -m.h, m.w, m.h, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#a59b80";
    ctx.fillRect(-hw - 3, -m.h - 5, m.w + 6, 6); // dalle
    // gravure érodée suggérée (pas de noms)
    ctx.strokeStyle = "rgba(70,64,48,0.5)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const ly = -m.h + 8 + i * 6;
      ctx.beginPath();
      ctx.moveTo(-hw + 5, ly);
      ctx.lineTo(hw - 5 - (i % 2) * 8, ly);
      ctx.stroke();
    }
    ctx.fillStyle = mossCol;
    ctx.fillRect(-hw - 3, -m.h - 5, m.w + 6, 3);
  } else if (m.kind === "obelisque") {
    // colonne fuselée à cap pyramidal
    ctx.fillStyle = stone;
    ctx.beginPath();
    ctx.moveTo(-hw * 0.7, 0);
    ctx.lineTo(-hw * 0.45, -m.h * 0.85);
    ctx.lineTo(0, -m.h);
    ctx.lineTo(hw * 0.45, -m.h * 0.85);
    ctx.lineTo(hw * 0.7, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = mossCol;
    ctx.fillRect(-hw * 0.55, -m.h * 0.4, hw * 1.1, 4);
  } else {
    // stèle (haut plat ou arrondi)
    ctx.fillStyle = stone;
    ctx.beginPath();
    if (m.kind === "steleRonde") {
      ctx.moveTo(-hw, 0);
      ctx.lineTo(-hw, -m.h + hw);
      ctx.arc(0, -m.h + hw, hw, Math.PI, 0);
      ctx.lineTo(hw, 0);
    } else {
      roundRectPath(ctx, -hw, -m.h, m.w, m.h, 2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // mousse au sommet
    ctx.fillStyle = mossCol;
    ctx.fillRect(-hw, -m.h, m.w, 5);
    // gravure érodée suggérée
    ctx.strokeStyle = "rgba(70,64,48,0.45)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 2; i++) {
      const ly = -m.h * 0.55 + i * 6;
      ctx.beginPath();
      ctx.moveTo(-hw + 4, ly);
      ctx.lineTo(hw - 4 - i * 5, ly);
      ctx.stroke();
    }
  }

  // —— Reverdissement commun : lichen, herbe à la base, fleur éventuelle ——
  // taches de lichen claires (déterministe)
  ctx.fillStyle = "rgba(214,205,160,0.5)";
  const lr = mulberry32(Math.floor(m.lichen));
  const spots = 2 + Math.floor(lr() * 2);
  for (let i = 0; i < spots; i++) {
    ctx.beginPath();
    ctx.arc((lr() - 0.5) * m.w, -m.h * lr(), 1.6 + lr() * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  // touffe d'herbe à la base
  ctx.strokeStyle = "rgba(74,108,57,0.85)";
  ctx.lineWidth = 1.6;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 3, 0);
    ctx.lineTo(i * 3 + 1.5, -5 - Math.abs(i));
    ctx.stroke();
  }
  // petite fleur dans une fissure
  if (m.moss > 0.7) {
    ctx.fillStyle = "#f4ecd2";
    ctx.beginPath();
    ctx.arc(hw * 0.5, -m.h * 0.5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c9a227";
    ctx.beginPath();
    ctx.arc(hw * 0.5, -m.h * 0.5, 0.9, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawGrass(ctx: CanvasRenderingContext2D, g: Grass, time: number) {
  const groundY = 604;
  const sway = Math.sin(time / 900 + g.x) * 2;
  ctx.strokeStyle = g.hue > 0.5 ? "rgba(58,86,47,0.9)" : "rgba(74,108,57,0.85)";
  ctx.lineWidth = 2;
  for (let i = 0; i < g.blades; i++) {
    const bx = g.x + (i - g.blades / 2) * 3;
    ctx.beginPath();
    ctx.moveTo(bx, groundY);
    ctx.quadraticCurveTo(bx + sway, groundY - g.h * 0.6, bx + sway * 1.8, groundY - g.h);
    ctx.stroke();
  }
  // ombellifère occasionnelle
  if (g.hue > 0.82) {
    ctx.fillStyle = "rgba(244,236,210,0.8)";
    ctx.beginPath();
    ctx.arc(g.x + sway * 1.8, groundY - g.h, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlatform(ctx: CanvasRenderingContext2D, p: Platform) {
  if (p.kind === "sol") {
    // Terre + bande de mousse au sommet
    const grad = ctx.createLinearGradient(0, p.y, 0, p.y + Math.min(p.h, 200));
    grad.addColorStop(0, "#4c2d23");
    grad.addColorStop(1, "#2f1d16");
    ctx.fillStyle = grad;
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "#3a562f";
    ctx.fillRect(p.x, p.y, p.w, 12);
    ctx.fillStyle = "#5f874c";
    ctx.fillRect(p.x, p.y, p.w, 5);
    // touffes d'herbe sur la crête
    ctx.strokeStyle = "#496c39";
    ctx.lineWidth = 2;
    for (let gx = p.x + 8; gx < p.x + p.w; gx += 22) {
      ctx.beginPath();
      ctx.moveTo(gx, p.y);
      ctx.lineTo(gx - 2, p.y - 6);
      ctx.moveTo(gx + 3, p.y);
      ctx.lineTo(gx + 5, p.y - 7);
      ctx.stroke();
    }
    return;
  }
  if (p.kind === "tronc") {
    ctx.fillStyle = "#6b4a2f";
    roundRectPath(ctx, p.x, p.y, p.w, p.h, Math.min(8, p.h / 2));
    ctx.fill();
    ctx.fillStyle = "#5f874c";
    roundRectPath(ctx, p.x, p.y, p.w, Math.max(4, p.h * 0.35), Math.min(6, p.h / 2));
    ctx.fill();
    // anneaux
    ctx.strokeStyle = "rgba(60,40,25,0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(p.x + 4, p.y + p.h / 2, 3, p.h / 3, 0, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }
  if (p.kind === "racine") {
    ctx.fillStyle = "#5b3e28";
    roundRectPath(ctx, p.x, p.y, p.w, p.h, Math.min(7, p.h / 2));
    ctx.fill();
    ctx.fillStyle = "rgba(95,135,76,0.8)";
    ctx.fillRect(p.x, p.y, p.w, 5);
    ctx.strokeStyle = "rgba(40,28,18,0.5)";
    ctx.lineWidth = 1.4;
    for (let rx = p.x + 6; rx < p.x + p.w; rx += 16) {
      ctx.beginPath();
      ctx.moveTo(rx, p.y + 3);
      ctx.lineTo(rx + 6, p.y + p.h - 2);
      ctx.stroke();
    }
    return;
  }
  if (p.kind === "muret") {
    ctx.fillStyle = "#6a6450";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "rgba(126,163,106,0.7)";
    ctx.fillRect(p.x, p.y, p.w, 5);
    // pierres
    ctx.strokeStyle = "rgba(40,40,30,0.35)";
    ctx.lineWidth = 1;
    for (let sx = p.x; sx < p.x + p.w; sx += 14) {
      ctx.strokeRect(sx, p.y + 5, 14, p.h - 5);
    }
    return;
  }
  // tombe JOUABLE : dalle funéraire en pierre parcheminé claire, surface plane
  // bien marquée + liseré de mousse net = signal « on peut marcher ici »
  // (volontairement plus claire et nette que les tombes-décor de l'arrière-plan).
  const slab = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
  slab.addColorStop(0, "#b7ac8c");
  slab.addColorStop(1, "#8c8268");
  ctx.fillStyle = slab;
  roundRectPath(ctx, p.x, p.y, p.w, p.h, 6);
  ctx.fill();
  ctx.strokeStyle = "rgba(108,100,80,0.8)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  // liseré de mousse vif au sommet (la surface jouable)
  ctx.fillStyle = "#5f874c";
  roundRectPath(ctx, p.x, p.y, p.w, 7, 5);
  ctx.fill();
  ctx.fillStyle = "#7ea36a";
  ctx.fillRect(p.x + 3, p.y, p.w - 6, 3);
  // touffes d'herbe sur la crête (renforce « surface vivante »)
  ctx.strokeStyle = "#496c39";
  ctx.lineWidth = 2;
  for (let gx = p.x + 10; gx < p.x + p.w - 4; gx += 26) {
    ctx.beginPath();
    ctx.moveTo(gx, p.y);
    ctx.lineTo(gx - 2, p.y - 6);
    ctx.moveTo(gx + 3, p.y);
    ctx.lineTo(gx + 5, p.y - 7);
    ctx.stroke();
  }
  // lichen + gravure érodée suggérée (pas de noms)
  ctx.fillStyle = "rgba(191,141,44,0.22)";
  ctx.beginPath();
  ctx.arc(p.x + p.w * 0.28, p.y + p.h * 0.55, 4, 0, Math.PI * 2);
  ctx.arc(p.x + p.w * 0.72, p.y + p.h * 0.68, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(108,100,80,0.45)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 2 && p.h > 26; i++) {
    const ly = p.y + 16 + i * 6;
    ctx.beginPath();
    ctx.moveTo(p.x + 8, ly);
    ctx.lineTo(p.x + p.w - 12 - i * 6, ly);
    ctx.stroke();
  }
}

function drawSanctuaire(ctx: CanvasRenderingContext2D, r: { x: number; y: number; w: number; h: number }, time: number) {
  const cx = r.x + r.w / 2;
  const pulse = 0.6 + 0.4 * Math.sin(time / 600);
  // halo doré
  const glow = ctx.createRadialGradient(cx, r.y + r.h * 0.4, 8, cx, r.y + r.h * 0.4, r.w * 1.6);
  glow.addColorStop(0, `rgba(244,222,160,${0.5 * pulse})`);
  glow.addColorStop(1, "rgba(244,222,160,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(r.x - r.w, r.y - r.h, r.w * 3, r.h * 2.4);

  // Grand If sacré : tronc + frondaison luminescente
  ctx.fillStyle = "#3a2618";
  ctx.fillRect(cx - 9, r.y + r.h * 0.35, 18, r.h * 0.65);
  const foliage = ctx.createRadialGradient(cx, r.y + r.h * 0.28, 6, cx, r.y + r.h * 0.28, r.w * 0.95);
  foliage.addColorStop(0, "#7ea36a");
  foliage.addColorStop(0.7, "#3a562f");
  foliage.addColorStop(1, "#293a22");
  ctx.fillStyle = foliage;
  ctx.beginPath();
  ctx.ellipse(cx, r.y + r.h * 0.26, r.w * 0.92, r.h * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // lucioles dorées
  ctx.fillStyle = `rgba(255,240,200,${0.6 * pulse})`;
  for (let i = 0; i < 6; i++) {
    const a = time / 1000 + i;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * r.w * 0.5, r.y + r.h * 0.26 + Math.sin(a * 1.3) * r.h * 0.3, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHazard(ctx: CanvasRenderingContext2D, hz: Hazard, time: number) {
  if (hz.kind === "dosette") {
    if (!hz.active) {
      // composté : petit tas de compost + pousse
      drawCompost(ctx, hz);
      return;
    }
    // Capsule de café (type Nespresso) : tronc de cône, collerette marquée en
    // haut, cuivre métallique avec reflet. Cuivre et non rouge vif : la
    // casquette d'Olivia reste le seul accent rouge.
    const phase = hz.spin ?? 0;
    const tilt = Math.sin(phase) * 0.24; // bercement lent, jamais à l'envers
    const hop = Math.abs(Math.sin(phase)) * 1.2; // léger tressaut en glissant
    const cx = hz.x + hz.w / 2;
    const cy = hz.y + hz.h / 2 - hop;
    const w = hz.w;
    const h = hz.h;
    const topHalf = w / 2; // large en haut
    const botHalf = w * 0.26; // rétréci en bas (silhouette capsule)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tilt);

    // Corps : tronc de cône, dégradé cuivre pour le métal
    const body = ctx.createLinearGradient(-topHalf, 0, topHalf, 0);
    body.addColorStop(0, "#8a5424");
    body.addColorStop(0.4, "#c2823f");
    body.addColorStop(0.55, "#e6b878"); // reflet aluminium
    body.addColorStop(0.75, "#b06f33");
    body.addColorStop(1, "#7a481f");
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(-topHalf, -h / 2 + 2);
    ctx.lineTo(topHalf, -h / 2 + 2);
    ctx.lineTo(botHalf, h / 2);
    ctx.lineTo(-botHalf, h / 2);
    ctx.closePath();
    ctx.fill();

    // Collerette marquée (rebord circulaire en haut)
    ctx.fillStyle = "#8a5424";
    ctx.beginPath();
    ctx.ellipse(0, -h / 2 + 2, topHalf + 2, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d9a25e";
    ctx.beginPath();
    ctx.ellipse(0, -h / 2 + 1, topHalf, 2.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Opercule (foil café) au sommet
    ctx.fillStyle = "#3a2414";
    ctx.beginPath();
    ctx.ellipse(0, -h / 2 + 1, topHalf - 3, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Liseré clair vertical (sheen métallique)
    ctx.strokeStyle = "rgba(255,238,200,0.55)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-topHalf * 0.35, -h / 2 + 4);
    ctx.lineTo(-botHalf * 0.5, h / 2 - 2);
    ctx.stroke();

    ctx.restore();
    return;
  }
  if (hz.kind === "pesticide") {
    if (!hz.active) {
      // reverdi : touffe d'herbe fraîche
      ctx.strokeStyle = "#5f874c";
      ctx.lineWidth = 2.5;
      for (let gx = hz.x + 6; gx < hz.x + hz.w; gx += 12) {
        const sway = Math.sin(time / 700 + gx) * 2;
        ctx.beginPath();
        ctx.moveTo(gx, hz.y + hz.h);
        ctx.quadraticCurveTo(gx + sway, hz.y, gx + sway * 1.5, hz.y - 8);
        ctx.stroke();
      }
      return;
    }
    const shimmer = 0.5 + 0.5 * Math.sin(time / 400);
    const grad = ctx.createLinearGradient(hz.x, hz.y, hz.x, hz.y + hz.h);
    grad.addColorStop(0, `rgba(180,200,70,${0.55 + 0.25 * shimmer})`);
    grad.addColorStop(1, "rgba(120,140,40,0.7)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(hz.x + hz.w / 2, hz.y + hz.h, hz.w / 2, hz.h, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // bulles toxiques
    ctx.fillStyle = `rgba(220,240,120,${0.5 * shimmer})`;
    for (let i = 0; i < 3; i++) {
      const bx = hz.x + (i + 0.5) * (hz.w / 3);
      ctx.beginPath();
      ctx.arc(bx, hz.y + 2 - shimmer * 3, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }
  // tondeuse
  const dir = (hz.vx ?? 0) >= 0 ? 1 : -1;
  ctx.save();
  ctx.translate(hz.x + hz.w / 2, hz.y + hz.h / 2);
  ctx.scale(dir, 1);
  // carter
  ctx.fillStyle = "#4a4a52";
  roundRectPath(ctx, -hz.w / 2, -hz.h / 2 + 4, hz.w, hz.h - 4, 4);
  ctx.fill();
  ctx.fillStyle = "#bf8d2c"; // capot ocre (mécanique = danger sourd ; rouge réservé à Olivia)
  roundRectPath(ctx, -hz.w / 2 + 6, -hz.h / 2, hz.w * 0.45, 8, 2);
  ctx.fill();
  // roues
  ctx.fillStyle = "#1c1c20";
  ctx.beginPath();
  ctx.arc(-hz.w / 2 + 8, hz.h / 2 - 4, 5, 0, Math.PI * 2);
  ctx.arc(hz.w / 2 - 8, hz.h / 2 - 4, 5, 0, Math.PI * 2);
  ctx.fill();
  // manche
  ctx.strokeStyle = "#4a4a52";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-hz.w / 2 + 4, -hz.h / 2 + 4);
  ctx.lineTo(-hz.w / 2 - 10, -hz.h / 2 - 10);
  ctx.stroke();
  // lame qui dépasse (danger)
  ctx.strokeStyle = "rgba(220,220,230,0.8)";
  ctx.lineWidth = 2;
  const blade = Math.sin(time / 30) * 4;
  ctx.beginPath();
  ctx.moveTo(-6, hz.h / 2 - 2 + blade);
  ctx.lineTo(6, hz.h / 2 - 2 - blade);
  ctx.stroke();
  ctx.restore();
}

function drawCompost(ctx: CanvasRenderingContext2D, hz: Hazard) {
  const cx = hz.x + hz.w / 2;
  const by = hz.y + hz.h;
  ctx.fillStyle = "#4c2d23";
  ctx.beginPath();
  ctx.ellipse(cx, by, hz.w / 2 + 3, hz.h / 2, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#653b28";
  ctx.beginPath();
  ctx.arc(cx - 4, by - 3, 3, 0, Math.PI * 2);
  ctx.arc(cx + 4, by - 4, 3.5, 0, Math.PI * 2);
  ctx.fill();
  // pousse verte
  ctx.strokeStyle = "#5f874c";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, by - 2);
  ctx.lineTo(cx, by - 12);
  ctx.stroke();
  ctx.fillStyle = "#7ea36a";
  ctx.beginPath();
  ctx.ellipse(cx - 2, by - 12, 3, 2, -0.6, 0, Math.PI * 2);
  ctx.ellipse(cx + 2, by - 10, 3, 2, 0.6, 0, Math.PI * 2);
  ctx.fill();
}

function drawCollectible(ctx: CanvasRenderingContext2D, c: Collectible, time: number) {
  const bob = Math.sin(time / 500 + c.bobPhase) * 4;
  const cx = c.x + c.w / 2;
  const cy = c.y + c.h / 2 + bob;
  if (c.kind === "graine") {
    const glow = ctx.createRadialGradient(cx, cy, 1, cx, cy, c.w);
    glow.addColorStop(0, "rgba(201,162,39,0.7)");
    glow.addColorStop(1, "rgba(201,162,39,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(cx - c.w, cy - c.w, c.w * 2, c.w * 2);
    ctx.fillStyle = "#e9d8ad";
    ctx.beginPath();
    ctx.ellipse(cx, cy, c.w / 2 - 1, c.w / 2 + 2, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c9a227";
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  // pollinisateur : halo doré + ailes
  const glow = ctx.createRadialGradient(cx, cy, 1, cx, cy, c.w * 1.3);
  glow.addColorStop(0, "rgba(244,211,94,0.75)");
  glow.addColorStop(1, "rgba(244,211,94,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(cx - c.w * 1.3, cy - c.w * 1.3, c.w * 2.6, c.w * 2.6);
  const flap = Math.sin(time / 90 + c.bobPhase) * 0.5 + 0.6;
  if (c.espece === "papillon") {
    ctx.fillStyle = "#f4d35e";
    ctx.beginPath();
    ctx.ellipse(cx - 4, cy - 1, 5 * flap, 6, -0.5, 0, Math.PI * 2);
    ctx.ellipse(cx + 4, cy - 1, 5 * flap, 6, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#a0721f";
    ctx.fillRect(cx - 1, cy - 6, 2, 12);
  } else {
    // halicte : corps rond doré rayé
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.ellipse(cx, cy - 2, 7 * flap, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d4a747";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 1, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#5b3e28";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 3, cy + 1);
    ctx.lineTo(cx + 3, cy + 1);
    ctx.stroke();
  }
}

function drawFlower(ctx: CanvasRenderingContext2D, f: Flower, time: number) {
  const age = (time - f.born) / 1500;
  if (age >= 1 || age < 0) return;
  const grow = age < 0.25 ? age / 0.25 : 1;
  const fade = age > 0.7 ? 1 - (age - 0.7) / 0.3 : 1;
  ctx.globalAlpha = fade;
  const stem = 12 * grow;
  ctx.strokeStyle = "#5f874c";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(f.x, f.y);
  ctx.lineTo(f.x, f.y - stem);
  ctx.stroke();
  const petals = 5;
  const pr = 3.2 * grow;
  const colA = f.hue > 0.5 ? "#f4ecd2" : "#e9c8d8";
  ctx.fillStyle = colA;
  for (let i = 0; i < petals; i++) {
    const a = (Math.PI * 2 * i) / petals + time / 2000;
    ctx.beginPath();
    ctx.arc(f.x + Math.cos(a) * pr, f.y - stem + Math.sin(a) * pr, pr * 0.85, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#c9a227";
  ctx.beginPath();
  ctx.arc(f.x, f.y - stem, pr * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], time: number) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    const age = time - p.born;
    if (age >= p.life) {
      particles.splice(i, 1);
      continue;
    }
    const k = age / 1000;
    const px = p.x + p.vx * k;
    const py = p.y + p.vy * k + 120 * k * k;
    ctx.globalAlpha = 1 - age / p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawOlivia(ctx: CanvasRenderingContext2D, o: Olivia, time: number) {
  const moving = Math.abs(o.vx) > 12;
  const airborne = !o.onGround;
  const squashY = 1 - 0.2 * o.squash;
  const squashX = 1 + 0.14 * o.squash;
  let stretch = 1;
  if (airborne) {
    stretch = 1 + Math.max(-0.12, Math.min(0.16, -o.vy / 4200));
  }
  const sy = squashY * stretch;
  const sx = squashX / (stretch * 0.5 + 0.5);

  const footX = o.x + o.w / 2;
  const footY = o.y + o.h;

  ctx.save();
  ctx.translate(footX, footY);
  ctx.scale(o.facing * sx, sy);
  // origine = pieds, on dessine vers le haut (y négatif), repère « face à droite »

  const H = o.h; // 38

  // ombre portée
  ctx.fillStyle = "rgba(19,32,15,0.25)";
  ctx.beginPath();
  ctx.ellipse(0, 1, 11, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // jambes
  ctx.strokeStyle = "#2b2218";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  if (airborne) {
    ctx.beginPath();
    ctx.moveTo(-3, -H * 0.32);
    ctx.lineTo(-5, -2);
    ctx.moveTo(3, -H * 0.32);
    ctx.lineTo(6, -6);
    ctx.stroke();
  } else if (moving) {
    const sw = Math.sin(o.walkPhase) * 6;
    ctx.beginPath();
    ctx.moveTo(-2, -H * 0.32);
    ctx.lineTo(-2 + sw, -1);
    ctx.moveTo(2, -H * 0.32);
    ctx.lineTo(2 - sw, -1);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(-3, -H * 0.32);
    ctx.lineTo(-3, -1);
    ctx.moveTo(3, -H * 0.32);
    ctx.lineTo(3, -1);
    ctx.stroke();
  }

  // cape / corps (silhouette mousse foncé)
  const breath = o.onGround && !moving ? Math.sin(time / 700) * 0.6 : 0;
  ctx.fillStyle = "#304527";
  ctx.beginPath();
  ctx.moveTo(-8, -H * 0.3);
  ctx.quadraticCurveTo(-9, -H * 0.62 - breath, -5, -H * 0.74);
  ctx.lineTo(5, -H * 0.74);
  ctx.quadraticCurveTo(9, -H * 0.62 - breath, 8, -H * 0.3);
  ctx.quadraticCurveTo(0, -H * 0.24, -8, -H * 0.3);
  ctx.fill();
  // liseré clair (col)
  ctx.fillStyle = "#496c39";
  ctx.fillRect(-5, -H * 0.74, 10, 3);

  // tête (silhouette claire neutre, pas de visage détaillé)
  const headY = -H * 0.82 - breath;
  ctx.fillStyle = "#e8d5b5";
  ctx.beginPath();
  ctx.arc(1, headY, 6.2, 0, Math.PI * 2);
  ctx.fill();
  // mèche blonde sous la casquette
  ctx.fillStyle = "#caa45a";
  ctx.beginPath();
  ctx.ellipse(-3.5, headY + 1, 3, 4.5, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // CASQUETTE ROUGE — l'accent
  ctx.fillStyle = RED_CAP;
  ctx.beginPath();
  ctx.arc(1, headY - 1, 7, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = RED_CAP;
  ctx.beginPath();
  ctx.ellipse(1, headY - 7.5, 6.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // visière vers l'avant
  ctx.fillStyle = RED_CAP_DARK;
  ctx.beginPath();
  ctx.ellipse(7, headY - 1, 5, 2, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  // petit bouton
  ctx.fillStyle = RED_CAP_DARK;
  ctx.beginPath();
  ctx.arc(1, headY - 8, 1.3, 0, Math.PI * 2);
  ctx.fill();

  // BRAS + FILET
  const swinging = netIsActiveLocal(o, time);
  // bras
  ctx.strokeStyle = "#304527";
  ctx.lineWidth = 3.5;
  const shoulderY = -H * 0.6;
  let handX: number;
  let handY: number;
  if (swinging) {
    handX = 11;
    handY = -H * 0.5;
  } else if (moving) {
    handX = 9 + Math.sin(o.walkPhase) * 1.5;
    handY = -H * 0.42;
  } else {
    handX = 9;
    handY = -H * 0.4;
  }
  ctx.beginPath();
  ctx.moveTo(4, shoulderY);
  ctx.lineTo(handX, handY);
  ctx.stroke();

  // filet : manche + cerceau
  ctx.strokeStyle = "#7a5a32";
  ctx.lineWidth = 2;
  const reach = swinging ? 22 : 16;
  const hoopX = handX + reach;
  const hoopY = handY - (swinging ? 2 : 8);
  ctx.beginPath();
  ctx.moveTo(handX, handY);
  ctx.lineTo(hoopX - 6, hoopY + 4);
  ctx.stroke();
  ctx.strokeStyle = "#caa45a";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.ellipse(hoopX, hoopY, 7, 9, swinging ? 0.2 : -0.3, 0, Math.PI * 2);
  ctx.stroke();
  // maille
  ctx.strokeStyle = "rgba(233,216,173,0.5)";
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.ellipse(hoopX, hoopY, 4, 5, swinging ? 0.2 : -0.3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function netIsActiveLocal(o: Olivia, time: number): boolean {
  return time < o.netUntil;
}

function drawGodRays(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number, progress: number) {
  const intensity = 0.06 + progress * 0.14;
  ctx.globalCompositeOperation = "lighter";
  const rays = 4;
  for (let i = 0; i < rays; i++) {
    const drift = Math.sin(time / 4000 + i) * 30;
    const x = canvas.width * (0.2 + i * 0.22) + drift;
    const w = canvas.width * 0.12;
    ctx.fillStyle = `rgba(255,240,200,${intensity})`;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + w, 0);
    ctx.lineTo(x + w * 2.4, canvas.height);
    ctx.lineTo(x + w * 1.2, canvas.height);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

function drawHUD(ctx: CanvasRenderingContext2D, s: TraverseeState, cssW: number) {
  const pad = 10;
  ctx.font = "600 14px Georgia, serif";
  ctx.textBaseline = "top";
  // fond léger
  const items = [
    `⏱ ${formatTime(s.stats.elapsedMs)}`,
    `🦋 ${s.stats.pollinisateursCaught}/${s.stats.pollinisateursTotal}`,
    `🌱 ${s.stats.grainesCaught}`,
  ];
  let x = pad;
  for (const it of items) {
    const w = ctx.measureText(it).width + 16;
    ctx.fillStyle = "rgba(19,32,15,0.45)";
    roundRectPath(ctx, x, pad, w, 24, 12);
    ctx.fill();
    ctx.fillStyle = "#f4ecd2";
    ctx.fillText(it, x + 8, pad + 5);
    x += w + 6;
  }
  void cssW;
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
