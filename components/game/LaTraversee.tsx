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
  computeScore,
  Olivia,
  Platform,
  Hazard,
  Collectible,
  Checkpoint,
} from "@/lib/traversee-engine";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { PeintureDecor } from "@/lib/traversee-peinture";
import { Skin, SKIN, noise1 } from "@/lib/traversee-skin";

export interface TraverseeResult {
  tempsMs: number;
  pollinisateurs: number;
  pollinisateursTotal: number;
  graines: number;
  spores: number;
  sporesTotal: number;
  score: number;
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
  spore() {
    this.beep(1318, 0.06, "sine", 0.05);
    setTimeout(() => this.beep(1568, 0.08, "sine", 0.04), 50);
  }
  bounce() {
    this.beep(330, 0.07, "sine", 0.06);
    setTimeout(() => this.beep(660, 0.12, "sine", 0.05), 50);
  }
  checkpoint() {
    [523, 784].forEach((f, i) => setTimeout(() => this.beep(f, 0.14, "triangle", 0.05), i * 90));
  }
  win() {
    [523, 659, 784, 1047, 1319].forEach((f, i) =>
      setTimeout(() => this.beep(f, 0.22, "triangle", 0.07), i * 140)
    );
  }
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
// Papillons du final : envol au-dessus du Sanctuaire quand on l'atteint.
interface ButterflyFx {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  hue: number;
  phase: number;
}

// ============ COMPOSANT ============
export function LaTraversee({ onWin }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<TraverseeState | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const inputRef = useRef<Input>({ left: false, right: false, jump: false, net: false });
  const audioRef = useRef<TraverseeAudio>(new TraverseeAudio());
  const peintureRef = useRef<PeintureDecor | null>(null);
  const skinRef = useRef<Skin | null>(null);
  const flowersRef = useRef<Flower[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const butterfliesRef = useRef<ButterflyFx[]>([]);
  const wonHandledRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const viewRef = useRef({ w: 800, h: 460 });

  const [showIntro, setShowIntro] = useState(true);
  const [won, setWon] = useState<TraverseeResult | null>(null);
  const [showRotateHint, setShowRotateHint] = useState(false);

  const audioOn = useStore((s) => s.audioActif);
  const setAudioOn = useStore((s) => s.setAudioActif);
  const meilleurScore = useStore((s) => s.meilleurScoreTraversee);

  // Init état + décor peint au montage (visible sous l'overlay d'intro).
  useEffect(() => {
    if (!stateRef.current) {
      stateRef.current = createInitialState(performance.now());
    }
    if (!peintureRef.current) {
      peintureRef.current = new PeintureDecor();
      peintureRef.current.preload(); // charge la set « porche » (repli universel)
    }
    if (!skinRef.current) {
      skinRef.current = new Skin();
      void skinRef.current.load(); // textures de la couche de jeu (repli plat si absentes)
    }
    const onResize = () => peintureRef.current?.refreshQuality();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  // prefers-reduced-motion : on coupe particules et envol décoratif.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedMotionRef.current = mq.matches;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
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
    butterfliesRef.current = [];
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

      if (s && canvas && peintureRef.current && skinRef.current) {
        const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
        const { viewW, viewH } = step(s, dt, inputRef.current, t, aspect);
        viewRef.current = { w: viewW, h: viewH };

        const peinture = peintureRef.current;
        const reduce = reducedMotionRef.current;
        peinture.setActe(s.acte);
        const scaleNow = (canvas.height || 1) / Math.max(1, viewH);
        peinture.update(dt, t, s.cam.x, scaleNow, reduce);

        drainEvents(s, t);
        render(
          canvas,
          peinture,
          skinRef.current,
          s,
          flowersRef.current,
          particlesRef.current,
          butterfliesRef.current,
          t,
          viewW,
          viewH,
          reduce,
          peinture.quality
        );
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
      const calm = reducedMotionRef.current; // prefers-reduced-motion : pas de particules
      if (ev.landed) {
        if (!calm) {
          flowersRef.current.push({ x: ev.landed.x, y: ev.landed.y, born: t, hue: Math.random() });
          if (flowersRef.current.length > 28) flowersRef.current.shift();
        }
        a.land();
      }
      if (ev.netSwing && s.olivia.vy < -50) {
        /* coup en l'air : pas de son spécifique */
      }
      if (ev.caught) {
        if (!calm) burst(particlesRef.current, ev.caught.x, ev.caught.y, t, "#f4d35e", 12);
        a.catch_();
      }
      if (ev.converted) {
        if (!calm) burst(particlesRef.current, ev.converted.x, ev.converted.y, t, "#7ea36a", 10);
        a.convert();
      }
      if (ev.graine) {
        if (!calm) burst(particlesRef.current, ev.graine.x, ev.graine.y, t, "#c9a227", 7);
        a.graine();
      }
      if (ev.spore) {
        if (!calm) burst(particlesRef.current, ev.spore.x, ev.spore.y, t, "#f1d56c", 9);
        a.spore();
      }
      if (ev.bounced) {
        if (!calm) burst(particlesRef.current, ev.bounced.x, ev.bounced.y, t, "#e9d8ad", 8);
        a.bounce();
      }
      if (ev.checkpoint) {
        if (!calm) burst(particlesRef.current, ev.checkpoint.x, ev.checkpoint.y, t, "#ffe9b0", 10);
        a.checkpoint();
        s.message = "Lanterne allumée — point de reprise.";
        s.messageUntil = t + 1600;
      }
      if (ev.respawn) a.respawn();
      if (ev.won && !wonHandledRef.current) {
        wonHandledRef.current = true;
        a.win();
        // Envol de papillons au-dessus du Sanctuaire (moment de grâce).
        if (!calm) {
          const sx = s.sanctuaire.x + s.sanctuaire.w / 2;
          const sy = s.sanctuaire.y + s.sanctuaire.h * 0.5;
          for (let i = 0; i < 16; i++) {
            butterfliesRef.current.push({
              x: sx + (Math.random() - 0.5) * 90,
              y: sy + (Math.random() - 0.5) * 50,
              vx: (Math.random() - 0.5) * 40,
              vy: -22 - Math.random() * 30,
              born: t + Math.random() * 600,
              hue: Math.random(),
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
        const result: TraverseeResult = {
          tempsMs: s.stats.elapsedMs,
          pollinisateurs: s.stats.pollinisateursCaught,
          pollinisateursTotal: s.stats.pollinisateursTotal,
          graines: s.stats.grainesCaught + s.stats.pollinisateursCaught,
          spores: s.stats.sporesCaught,
          sporesTotal: s.stats.sporesTotal,
          score: computeScore(s.stats),
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
              <h2 className="titre-liturgique mt-2 text-3xl">La traversée de la Marcheuse</h2>
              <div className="ornement" />
              <p className="mx-auto max-w-md font-serif italic text-parchemin-100">
                Casquette rouge, filet à la main, la Marcheuse traverse un cimetière reverdi — trois actes, du Porche à
                l'Ascension. Elle saute par-dessus les pièges de la modernité, attrape les pollinisateurs au filet,
                composte les dosettes, allume les lanternes et rejoint le grand If sacré.
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
                  Score : <strong>{won.score}</strong>
                  {won.score >= meilleurScore && meilleurScore > 0 ? " ✦ record" : ""}
                </span>
                <span className="rounded-full border border-ocre-400/50 bg-ocre-500/15 px-3 py-1">
                  ⏱ {formatTime(won.tempsMs)}
                </span>
                <span className="rounded-full border border-ocre-400/50 bg-ocre-500/15 px-3 py-1">
                  🦋 {won.pollinisateurs}/{won.pollinisateursTotal}
                </span>
                <span className="rounded-full border border-ocre-400/50 bg-ocre-500/15 px-3 py-1">
                  ✨ {won.spores}/{won.sporesTotal} spores
                </span>
                <span className="rounded-full border border-ocre-400/50 bg-ocre-500/15 px-3 py-1">
                  🌱 {won.graines} graines
                </span>
              </div>
              {meilleurScore > 0 && (
                <p className="mt-2 font-serif text-xs text-parchemin-200/70">
                  Meilleur score : {Math.max(meilleurScore, won.score)}
                </p>
              )}
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
  const toutesSpores = r.spores >= r.sporesTotal;
  if (tousPoll && toutesSpores && r.sansDosette) {
    return {
      titre: "Traversée immaculée",
      texte:
        "Tous les pollinisateurs, toutes les spores, pas une dosette pour te faire trébucher. Mère Mycorhize aurait posé une main sur ton épaule, sans rien dire — ce qui, chez elle, est un sacre.",
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
  peinture: PeintureDecor,
  skin: Skin,
  s: TraverseeState,
  flowers: Flower[],
  particles: Particle[],
  butterflies: ButterflyFx[],
  time: number,
  viewW: number,
  viewH: number,
  reduce: boolean,
  quality: number
) {
  const visible = canvas.getContext("2d");
  if (!visible) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = canvas.clientWidth || 800;
  const cssH = canvas.clientHeight || 500;
  const tw = Math.round(cssW * dpr);
  const th = Math.round(cssH * dpr);
  if (canvas.width !== tw || canvas.height !== th) {
    canvas.width = tw;
    canvas.height = th;
  }
  const cw = canvas.width;
  const ch = canvas.height;
  const scale = ch / viewH; // px appareil par unité monde
  const cam = s.cam;

  // ══ Scène hors-écran : fond peint (couches + god rays + spores) DERRIÈRE
  //    le gameplay, puis le gameplay par-dessus. Le post s'applique au tout. ══
  const ctx = peinture.beginScene(cw, ch);
  peinture.drawBackdrop(ctx, cam.x, cam.y, scale, cw, ch, time, reduce);

  // Plan de jeu (parallaxe 1) — inchangé fonctionnellement.
  const layer = (px: number, py: number) =>
    ctx.setTransform(scale, 0, 0, scale, -cam.x * px * scale, -cam.y * py * scale);
  layer(1, 1);

  for (let i = 0; i < s.platforms.length; i++) {
    const p = s.platforms[i];
    if (p.x + p.w < cam.x - 40 || p.x > cam.x + viewW + 40) continue;
    drawPlatform(ctx, p, time, skin, i, quality);
  }

  drawSanctuaire(ctx, s.sanctuaire, time);

  for (const cp of s.checkpoints) {
    if (cp.x < cam.x - 60 || cp.x > cam.x + viewW + 60) continue;
    drawCheckpoint(ctx, cp, time);
  }

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
  drawButterflies(ctx, butterflies, time);

  // Halo de lisibilité sous la Marcheuse : la détache du fond peint plus riche.
  drawWalkerBacking(ctx, s.olivia);
  drawOlivia(ctx, s.olivia, time);

  // ══ Composite vers le canvas visible + post (bloom, grade, vignette, grain) ══
  peinture.present(visible, cw, ch, time, reduce);

  // Scrim doux en haut : asseoit le HUD sur le décor peint sans l'alourdir.
  visible.setTransform(1, 0, 0, 1, 0, 0);
  const scrim = visible.createLinearGradient(0, 0, 0, ch * 0.16);
  scrim.addColorStop(0, "rgba(12,18,8,0.3)");
  scrim.addColorStop(1, "rgba(12,18,8,0)");
  visible.fillStyle = scrim;
  visible.fillRect(0, 0, cw, ch * 0.16);

  // ══ HUD crisp (au-dessus du post) ══
  visible.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawHUD(visible, s, cssW);

  // Message bienveillant (réapparition)
  if (s.message && time < s.messageUntil) {
    const alpha = Math.min(1, (s.messageUntil - time) / 400);
    visible.globalAlpha = alpha;
    visible.fillStyle = "rgba(19,32,15,0.7)";
    visible.font = "italic 15px Georgia, serif";
    const tw2 = visible.measureText(s.message).width;
    const bx = cssW / 2 - tw2 / 2 - 12;
    visible.fillRect(bx, 46, tw2 + 24, 28);
    visible.fillStyle = "#f4ecd2";
    visible.fillText(s.message, cssW / 2 - tw2 / 2, 65);
    visible.globalAlpha = 1;
  }

  visible.setTransform(1, 0, 0, 1, 0, 0);
}

// Halo sombre doux derrière la Marcheuse : sépare sa silhouette du décor peint
// sans l'alourdir. Dessiné en coords monde (le contexte est déjà en layer(1,1)).
function drawWalkerBacking(ctx: CanvasRenderingContext2D, o: Olivia) {
  const cx = o.x + o.w / 2;
  const cy = o.y + o.h * 0.45;
  const r = o.h * 0.9;
  const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
  g.addColorStop(0, "rgba(16,24,12,0.34)");
  g.addColorStop(0.6, "rgba(16,24,12,0.16)");
  g.addColorStop(1, "rgba(16,24,12,0)");
  ctx.fillStyle = g;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
}

// ====== Sous-fonctions de rendu (coordonnées monde) ======

type Tex = HTMLCanvasElement | HTMLImageElement;

// Remplit un rect (clippé, coins arrondis) par une texture tuilée — répétition
// simple, jamais de flip, léger décalage par plateforme pour casser le motif.
function skinFillRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  tex: Tex,
  radius: number
) {
  ctx.save();
  roundRectPath(ctx, x, y, w, h, radius);
  ctx.clip();
  const T = SKIN.TILE;
  const ox = (((x * 0.37) % T) + T) % T;
  const oy = (((y * 0.31) % T) + T) % T;
  for (let tx = x - ox; tx < x + w; tx += T) {
    for (let ty = y - oy; ty < y + h; ty += T) {
      ctx.drawImage(tex, tx, ty, T, T);
    }
  }
  ctx.restore();
}

// Frange de mousse sur l'arête haute : bande au bord inférieur irrégulier +
// quelques touffes débordantes. Repli : si pas de texture, on ne dessine rien
// (l'appelant garde ses touffes « V »).
function mossFringe(
  ctx: CanvasRenderingContext2D,
  x: number,
  w: number,
  topY: number,
  mousse: Tex | null,
  quality: number
) {
  if (!mousse) return false;
  const band = SKIN.FRANGE;
  const overhang = 4;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, topY - overhang);
  ctx.lineTo(x + w, topY - overhang);
  const stepN = quality < 0.7 ? 16 : 9;
  for (let gx = x + w; gx >= x; gx -= stepN) {
    const n = noise1(gx * 0.08);
    ctx.lineTo(gx, topY + band * (0.4 + n * 0.6));
  }
  ctx.closePath();
  ctx.clip();
  const T = SKIN.TILE;
  const ox = (((x * 0.4) % T) + T) % T;
  for (let tx = x - ox; tx < x + w; tx += T) {
    ctx.drawImage(mousse, tx, topY - overhang, T, T);
  }
  ctx.restore();

  // Quelques touffes débordant au-dessus de l'arête (sobres).
  if (quality >= 0.6) {
    for (let gx = x + 8; gx < x + w - 4; gx += 34) {
      const n = noise1(gx * 0.05);
      if (n < 0.45) continue;
      const tw = 7 + n * 6;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(gx, topY - overhang, tw, 5 + n * 3, 0, Math.PI, 0);
      ctx.clip();
      ctx.drawImage(mousse, gx - T / 2, topY - overhang - T + 6, T, T);
      ctx.restore();
    }
  }
  return true;
}

// Liseré clair chaud sur l'arête haute (contre-jour de la scène).
function topLight(ctx: CanvasRenderingContext2D, x: number, topY: number, w: number) {
  ctx.strokeStyle = "rgba(255,236,190,0.45)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x + 1, topY - 4);
  ctx.lineTo(x + w - 1, topY - 4);
  ctx.stroke();
}

// Ombre portée douce sous la plateforme : la fait lire comme un bloc solide.
function dropShadow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const sh = 11;
  const g = ctx.createLinearGradient(0, y + h, 0, y + h + sh);
  g.addColorStop(0, "rgba(8,12,6,0.32)");
  g.addColorStop(1, "rgba(8,12,6,0)");
  ctx.fillStyle = g;
  ctx.fillRect(x - 2, y + h, w + 4, sh);
}

function drawPlatform(
  ctx: CanvasRenderingContext2D,
  p: Platform,
  time: number,
  skin: Skin,
  index: number,
  quality: number
) {
  // Ombre portée pour tout ce qui n'est ni le sol ni un champignon-tremplin.
  if (p.kind !== "sol" && p.kind !== "tremplin") dropShadow(ctx, p.x, p.y, p.w, p.h);

  if (p.kind === "tremplin") {
    // Champignon-tremplin : chapeau bombé ocre-cuivré à taches pâles sur pied
    // trapu — bondissant mais sourd (le rouge reste à la casquette).
    const cx = p.x + p.w / 2;
    const baseY = p.y + p.h;
    const pulse = 1 + Math.sin(time / 420 + p.x) * 0.03;
    // pied
    ctx.fillStyle = "#d6cca9";
    ctx.beginPath();
    ctx.moveTo(cx - p.w * 0.22, baseY);
    ctx.quadraticCurveTo(cx - p.w * 0.14, p.y + p.h * 0.4, cx - p.w * 0.16, p.y + 4);
    ctx.lineTo(cx + p.w * 0.16, p.y + 4);
    ctx.quadraticCurveTo(cx + p.w * 0.14, p.y + p.h * 0.4, cx + p.w * 0.22, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#8a7e5e";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // chapeau (la surface qui rebondit)
    ctx.fillStyle = "#bf8d2c";
    ctx.beginPath();
    ctx.ellipse(cx, p.y + 3, (p.w / 2 + 5) * pulse, 8 * pulse, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#7a5b1e";
    ctx.stroke();
    // taches pâles
    ctx.fillStyle = "rgba(244,236,210,0.8)";
    ctx.beginPath();
    ctx.arc(cx - p.w * 0.22, p.y - 1, 2.2, 0, Math.PI * 2);
    ctx.arc(cx + p.w * 0.12, p.y - 3, 1.8, 0, Math.PI * 2);
    ctx.arc(cx + p.w * 0.3, p.y, 1.4, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (p.kind === "mobile") {
    // Dalle flottante portée par le mycélium : pierre moussue + filaments qui
    // pendent — lente, prévisible, on lit la trajectoire d'un regard.
    ctx.fillStyle = "rgba(40,34,24,0.18)";
    ctx.beginPath();
    ctx.ellipse(p.x + p.w / 2, p.y + p.h + 8, p.w * 0.4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    const slab = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
    slab.addColorStop(0, "#b7ac8c");
    slab.addColorStop(1, "#8c8268");
    ctx.fillStyle = slab;
    roundRectPath(ctx, p.x, p.y, p.w, p.h, 6);
    ctx.fill();
    ctx.strokeStyle = "#5a523c";
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = "#5f874c";
    roundRectPath(ctx, p.x, p.y, p.w, 6, 5);
    ctx.fill();
    // filaments dorés qui pendent (signature mycélienne)
    ctx.strokeStyle = "rgba(191,141,44,0.5)";
    ctx.lineWidth = 1;
    const sway = Math.sin(time / 800 + p.x * 0.01) * 2;
    for (let i = 0; i < 3; i++) {
      const fx = p.x + p.w * (0.25 + i * 0.25);
      ctx.beginPath();
      ctx.moveTo(fx, p.y + p.h);
      ctx.quadraticCurveTo(fx + sway, p.y + p.h + 7, fx + sway * 1.6, p.y + p.h + 13 + i * 2);
      ctx.stroke();
    }
    return;
  }
  if (p.kind === "friable") {
    // Planche vermoulue : fissures visibles ; tremble quand elle va céder,
    // disparaît, puis repousse. L'effritement est annoncé, jamais surprise.
    if (p.gone) {
      // pendant la repousse : esquisse fantôme en pointillés
      ctx.strokeStyle = "rgba(138,123,92,0.3)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.2;
      roundRectPath(ctx, p.x, p.y, p.w, p.h, 4);
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }
    let shakeX = 0;
    let crumbleK = 0;
    if (p.crumbleAt) {
      crumbleK = Math.min(1, (time - p.crumbleAt) / 600);
      shakeX = Math.sin(time / 26) * 1.6 * crumbleK;
    }
    ctx.save();
    ctx.translate(shakeX, crumbleK * 2);
    ctx.globalAlpha = 1 - crumbleK * 0.35;
    const wood = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
    wood.addColorStop(0, "#9c8a66");
    wood.addColorStop(1, "#6f6147");
    ctx.fillStyle = wood;
    roundRectPath(ctx, p.x, p.y, p.w, p.h, 4);
    ctx.fill();
    ctx.strokeStyle = "#4f4633";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // fissures (signal « friable »)
    ctx.strokeStyle = "rgba(40,32,20,0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.x + p.w * 0.3, p.y);
    ctx.lineTo(p.x + p.w * 0.36, p.y + p.h);
    ctx.moveTo(p.x + p.w * 0.66, p.y);
    ctx.lineTo(p.x + p.w * 0.58, p.y + p.h);
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
    return;
  }
  if (p.kind === "sol") {
    if (skin.terre) {
      // Terre peinte tuilée sur la frange visible + assombrissement vers le bas
      // (on ne tuile pas les 300 u de profondeur, inutiles à l'écran).
      const topDepth = Math.min(p.h, 200);
      const T = SKIN.TILE;
      ctx.save();
      ctx.beginPath();
      ctx.rect(p.x, p.y, p.w, p.h);
      ctx.clip();
      ctx.fillStyle = "#241910"; // base sombre du dessous
      ctx.fillRect(p.x, p.y, p.w, p.h);
      const ox = (((p.x * 0.37) % T) + T) % T;
      for (let tx = p.x - ox; tx < p.x + p.w; tx += T) {
        for (let ty = p.y; ty < p.y + topDepth; ty += T) {
          ctx.drawImage(skin.terre, tx, ty, T, T);
        }
      }
      const g = ctx.createLinearGradient(0, p.y, 0, p.y + topDepth);
      g.addColorStop(0, "rgba(20,14,8,0)");
      g.addColorStop(1, "rgba(20,14,8,0.6)");
      ctx.fillStyle = g;
      ctx.fillRect(p.x, p.y, p.w, topDepth);
      ctx.restore();
      mossFringe(ctx, p.x, p.w, p.y, skin.mousse, quality);
      topLight(ctx, p.x, p.y, p.w);
      return;
    }
    // —— repli plat (style d'origine) ——
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
    const tex = skin.pierrePour(index);
    if (tex) {
      skinFillRect(ctx, p.x, p.y, p.w, p.h, tex, 2);
      mossFringe(ctx, p.x, p.w, p.y, skin.mousse, quality);
      topLight(ctx, p.x, p.y, p.w);
      return;
    }
    // —— repli plat ——
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
  // tombe JOUABLE : dalle en pierre patinée (texture peinte) + frange de mousse.
  {
    const tex = skin.pierrePour(index);
    if (tex) {
      skinFillRect(ctx, p.x, p.y, p.w, p.h, tex, 6);
      mossFringe(ctx, p.x, p.w, p.y, skin.mousse, quality);
      topLight(ctx, p.x, p.y, p.w);
      return;
    }
  }
  // —— repli plat (style d'origine) : dalle parcheminé claire + liseré net ——
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
  if (hz.kind === "ronces") {
    // Ronces : tangle d'épines brun-vert sourd. Danger DOUX et lisible —
    // on saute par-dessus, on ne les coupe pas (c'est du vivant).
    const baseY = hz.y + hz.h;
    ctx.strokeStyle = "#3d3a22";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    const sway = Math.sin(time / 1100 + hz.x) * 1.2;
    for (let i = 0; i < Math.floor(hz.w / 14); i++) {
      const bx = hz.x + 6 + i * 14;
      ctx.beginPath();
      ctx.moveTo(bx, baseY);
      ctx.quadraticCurveTo(bx + 8 + sway, baseY - hz.h * 0.9, bx + 2 + sway, baseY - hz.h - 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bx + 4, baseY);
      ctx.quadraticCurveTo(bx - 6 + sway, baseY - hz.h * 0.7, bx - 1 + sway, baseY - hz.h + 2);
      ctx.stroke();
    }
    // épines pâles (lisibilité : forme + valeur, pas la couleur seule)
    ctx.strokeStyle = "rgba(230,222,197,0.8)";
    ctx.lineWidth = 1.2;
    for (let i = 0; i < Math.floor(hz.w / 11); i++) {
      const tx = hz.x + 4 + i * 11;
      const ty = baseY - 4 - ((i * 7) % (hz.h - 6));
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx + 3, ty - 3);
      ctx.stroke();
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
  if (c.kind === "spore") {
    // Spore dorée : mote lumineuse qui respire, plus précieuse que la graine.
    const pulse = 0.75 + 0.25 * Math.sin(time / 300 + c.bobPhase);
    const glow = ctx.createRadialGradient(cx, cy, 1, cx, cy, c.w * 1.6);
    glow.addColorStop(0, `rgba(241,213,108,${0.8 * pulse})`);
    glow.addColorStop(0.5, `rgba(241,213,108,${0.25 * pulse})`);
    glow.addColorStop(1, "rgba(241,213,108,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(cx - c.w * 1.6, cy - c.w * 1.6, c.w * 3.2, c.w * 3.2);
    ctx.fillStyle = "#f1d56c";
    ctx.beginPath();
    ctx.arc(cx, cy, 3.4 * pulse + 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,250,230,0.9)";
    ctx.beginPath();
    ctx.arc(cx - 1, cy - 1, 1.3, 0, Math.PI * 2);
    ctx.fill();
    // étincelles en croix, tournantes
    ctx.strokeStyle = `rgba(241,213,108,${0.6 * pulse})`;
    ctx.lineWidth = 1;
    const a = time / 900 + c.bobPhase;
    for (let i = 0; i < 4; i++) {
      const ang = a + (i * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * 5, cy + Math.sin(ang) * 5);
      ctx.lineTo(cx + Math.cos(ang) * 8, cy + Math.sin(ang) * 8);
      ctx.stroke();
    }
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

// Lanterne-checkpoint : borne de pierre moussue à fenêtre chaude. Éteinte =
// sourde ; allumée = halo doré + flamme. Le « dernier point sûr » se VOIT.
function drawCheckpoint(ctx: CanvasRenderingContext2D, cp: Checkpoint, time: number) {
  const x = cp.x;
  const base = cp.baseY;
  // ombre
  ctx.fillStyle = "rgba(40,34,24,0.2)";
  ctx.beginPath();
  ctx.ellipse(x, base + 1, 14, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // halo si allumée
  if (cp.lit) {
    const pulse = 0.7 + 0.3 * Math.sin(time / 500 + cp.id);
    const glow = ctx.createRadialGradient(x, base - 34, 4, x, base - 34, 46);
    glow.addColorStop(0, `rgba(255,233,176,${0.5 * pulse})`);
    glow.addColorStop(1, "rgba(255,233,176,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(x - 46, base - 80, 92, 92);
  }
  // fût de pierre
  const stone = ctx.createLinearGradient(x - 7, 0, x + 7, 0);
  stone.addColorStop(0, "#d6cca9");
  stone.addColorStop(1, "#a89c78");
  ctx.fillStyle = stone;
  ctx.fillRect(x - 6, base - 26, 12, 26);
  ctx.strokeStyle = "#5a523c";
  ctx.lineWidth = 1.4;
  ctx.strokeRect(x - 6, base - 26, 12, 26);
  // loge de la flamme
  ctx.fillStyle = stone;
  ctx.fillRect(x - 9, base - 44, 18, 18);
  ctx.strokeRect(x - 9, base - 44, 18, 18);
  // fenêtre
  ctx.fillStyle = cp.lit ? "#ffd98a" : "#3d3829";
  ctx.fillRect(x - 5, base - 41, 10, 12);
  if (cp.lit) {
    // flamme qui danse
    const f = Math.sin(time / 160 + cp.id * 2) * 1.4;
    ctx.fillStyle = "#e8a33c";
    ctx.beginPath();
    ctx.ellipse(x + f * 0.4, base - 36, 2.4, 4 + f * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff3d0";
    ctx.beginPath();
    ctx.ellipse(x + f * 0.3, base - 35, 1, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // toit
  ctx.fillStyle = "#8a7e5e";
  ctx.beginPath();
  ctx.moveTo(x - 12, base - 44);
  ctx.lineTo(x, base - 54);
  ctx.lineTo(x + 12, base - 44);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#5a523c";
  ctx.stroke();
  // mousse au pied
  ctx.fillStyle = "rgba(95,135,76,0.7)";
  ctx.beginPath();
  ctx.ellipse(x - 4, base - 1, 7, 3, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Papillons du final : montent en spirale douce au-dessus du Sanctuaire.
function drawButterflies(ctx: CanvasRenderingContext2D, list: ButterflyFx[], time: number) {
  for (let i = list.length - 1; i >= 0; i--) {
    const b = list[i];
    const age = time - b.born;
    if (age < 0) continue;
    if (age > 6000) {
      list.splice(i, 1);
      continue;
    }
    const k = age / 1000;
    const x = b.x + b.vx * k + Math.sin(time / 700 + b.phase) * 14;
    const y = b.y + b.vy * k;
    const flap = Math.abs(Math.sin(time / 80 + b.phase));
    const alpha = age > 4800 ? 1 - (age - 4800) / 1200 : 1;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = b.hue > 0.5 ? "#f4d35e" : "#e9c8d8";
    ctx.beginPath();
    ctx.ellipse(x - 3, y, 4 * (0.4 + flap * 0.6), 4.6, -0.5, 0, Math.PI * 2);
    ctx.ellipse(x + 3, y, 4 * (0.4 + flap * 0.6), 4.6, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7a5b1e";
    ctx.fillRect(x - 0.8, y - 4, 1.6, 8);
    ctx.globalAlpha = 1;
  }
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

  // FILET À PAPILLONS : manche (bois) + cerceau (métal neutre) + poche en filet
  // translucide. Tons sourds — la casquette rouge reste le seul accent vif.
  const reach = swinging ? 24 : 18;
  const hoopX = handX + reach;
  const hoopY = handY - (swinging ? 4 : 10);
  const rx = 7;
  const ry = 9;
  const tilt = swinging ? 0.15 : -0.2;

  // 1. MANCHE — tige de bois sourde
  ctx.strokeStyle = "#8a7b5c";
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(handX, handY);
  ctx.lineTo(hoopX - rx * 0.7, hoopY + ry * 0.55);
  ctx.stroke();

  // 2. POCHE EN FILET — cône translucide qui pend sous le cerceau
  const tipX = hoopX - 2;
  const tipY = hoopY + ry + (swinging ? 12 : 17);
  ctx.beginPath();
  ctx.moveTo(hoopX - rx, hoopY);
  ctx.quadraticCurveTo(hoopX - rx * 1.15, hoopY + ry, tipX, tipY);
  ctx.quadraticCurveTo(hoopX + rx * 1.15, hoopY + ry, hoopX + rx, hoopY);
  ctx.closePath();
  ctx.fillStyle = "rgba(245,240,225,0.16)";
  ctx.fill();
  // maillage suggéré (fines lignes croisées), borné à la poche
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = "rgba(245,240,225,0.28)";
  ctx.lineWidth = 0.6;
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(hoopX + i * 2.6, hoopY + 1);
    ctx.lineTo(tipX + i * 1.1, tipY);
    ctx.stroke();
  }
  for (let j = 0; j < 3; j++) {
    const yy = hoopY + ry * 0.6 + j * 5;
    ctx.beginPath();
    ctx.moveTo(hoopX - rx, yy);
    ctx.quadraticCurveTo(tipX, yy + 3.5, hoopX + rx, yy);
    ctx.stroke();
  }
  ctx.restore();

  // 3. CERCEAU — anneau métal neutre clair, sans remplissage vif
  ctx.strokeStyle = "#cfc7ad";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(hoopX, hoopY, rx, ry, tilt, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function netIsActiveLocal(o: Olivia, time: number): boolean {
  return time < o.netUntil;
}

function drawHUD(ctx: CanvasRenderingContext2D, s: TraverseeState, cssW: number) {
  const pad = 10;
  ctx.font = "600 14px Georgia, serif";
  ctx.textBaseline = "top";
  // fond léger
  const items = [
    `⏱ ${formatTime(s.stats.elapsedMs)}`,
    `🦋 ${s.stats.pollinisateursCaught}/${s.stats.pollinisateursTotal}`,
    `✨ ${s.stats.sporesCaught}/${s.stats.sporesTotal}`,
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
