"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ActivePiece,
  Board,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  Categorie,
  DECHETS,
  Shape,
  checkCollision,
  clearLines,
  createBoard,
  getDechet,
  getShape,
  mergePiece,
  spawnPiece,
  tickSpeed,
} from "@/lib/game-engine";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardSubtitle } from "@/components/ui/Card";
import { useStore } from "@/lib/store";

const JUGEMENTS = {
  saint: [
    "Le Mycélium te bénit. Le compost ne ment pas.",
    "Tu es la digne héritière de Frère Hérisson. Continue.",
    "Béni·e sois-tu, trieur·euse de l'invisible.",
  ],
  bon: [
    "Tu progresses, Spore Égarée. Reviens demain.",
    "L'Ordre te regarde sans déception. Sœur Compost murmure : « pas mal ».",
    "L'Halicte t'observe avec un mélange d'amour et de patience.",
  ],
  moyen: [
    "Le mycélium est indulgent. Reprends-toi.",
    "Tu as confondu plastique et compost. Frère Lichen soupire, mais sa journée commence à peine.",
    "Ce n'est pas un échec, c'est un entraînement.",
  ],
  enfer: [
    "Ô disciple ! Tu as nourri le compost de dosettes. Honte mycélienne.",
    "Trois piles dans la terre. Mère Mycorhize détourne le regard, ce qui, en 91 ans, ne lui était arrivé que deux fois.",
    "Tu as trahi le Ver de Terre. Pénitence : recommence et fais mieux.",
  ],
};

function juger(score: number, curses: number): string {
  if (curses === 0 && score >= 600) return JUGEMENTS.saint[Math.floor(Math.random() * JUGEMENTS.saint.length)];
  if (curses <= 1 && score >= 300) return JUGEMENTS.bon[Math.floor(Math.random() * JUGEMENTS.bon.length)];
  if (curses <= 3) return JUGEMENTS.moyen[Math.floor(Math.random() * JUGEMENTS.moyen.length)];
  return JUGEMENTS.enfer[Math.floor(Math.random() * JUGEMENTS.enfer.length)];
}

// La catégorie est le seul critère qui compte pour le score : c'est donc elle —
// pas l'identité du déchet — qui pilote le rendu d'une tuile.
const CAT_STYLE: Record<Categorie, { fill: string; ink: string; glyph: string; nom: string; pts: string }> = {
  compost: { fill: "#5f8a3e", ink: "#eef6e0", glyph: "✿", nom: "Compost", pts: "30 pts / case" },
  recycle: { fill: "#3f7a9c", ink: "#e6f1f7", glyph: "♺", nom: "Recyclable", pts: "12 pts / case" },
  maudit: { fill: "#9a1f24", ink: "#f6dccb", glyph: "☠", nom: "Maudit", pts: "malédiction en ligne" },
};

// Marqueur de marge : état d'une rangée déjà posée.
const ROW_MARK: Record<string, string> = {
  vide: "transparent",
  propre: "#5f8a3e",
  compost: "#c9a227",
  contaminee: "#c0392b",
};

class TetrisAudio {
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
  resume() { this.ctx?.resume?.(); }
  private beep(freq: number, dur = 0.06, type: OscillatorType = "square", vol = 0.06) {
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
  move() { this.beep(220, 0.03, "triangle", 0.035); }
  rotate() { this.beep(520, 0.05, "triangle", 0.05); }
  drop() { this.beep(120, 0.18, "sawtooth", 0.08); }
  clearGood(lines: number) {
    [523, 659, 784, 1047].slice(0, Math.max(1, lines)).forEach((f, i) =>
      setTimeout(() => this.beep(f, 0.16, "triangle", 0.07), i * 90)
    );
  }
  clearCursed() {
    this.beep(180, 0.18, "sawtooth", 0.1);
    setTimeout(() => this.beep(110, 0.32, "sawtooth", 0.1), 130);
  }
  gameOver() {
    [392, 311, 247, 165].forEach((f, i) =>
      setTimeout(() => this.beep(f, 0.28, "sawtooth", 0.1), i * 200)
    );
  }
}

export function Tetris({
  onGameOver,
  meilleurScore,
}: {
  onGameOver: (score: number, lignes: number) => void;
  meilleurScore: number;
}) {
  const [board, setBoard] = useState<Board>(() => createBoard());
  const [piece, setPiece] = useState<ActivePiece | null>(null);
  const [nextDechetId, setNextDechetId] = useState<string>(() => DECHETS[Math.floor(Math.random() * DECHETS.length)].id);
  const [score, setScore] = useState(0);
  const [lignes, setLignes] = useState(0);
  const [level, setLevel] = useState(1);
  const [curses, setCurses] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const audioOn = useStore((s) => s.audioActif);
  const setAudioOn = useStore((s) => s.setAudioActif);
  const [held, setHeld] = useState<{ shapes: Shape[]; dechetId: string } | null>(null);
  const [canHold, setCanHold] = useState(true);
  const audioRef = useRef<TetrisAudio>(new TetrisAudio());

  useEffect(() => {
    audioRef.current.enabled = audioOn;
    if (audioOn) {
      audioRef.current.init();
      audioRef.current.resume();
    }
  }, [audioOn]);

  const stateRef = useRef({ board, piece, score, lignes, level, curses });
  useEffect(() => {
    stateRef.current = { board, piece, score, lignes, level, curses };
  });

  const start = useCallback(() => {
    setBoard(createBoard());
    setScore(0);
    setLignes(0);
    setLevel(1);
    setCurses(0);
    setGameOver(false);
    setPiece(spawnPiece());
    setNextDechetId(DECHETS[Math.floor(Math.random() * DECHETS.length)].id);
    setHeld(null);
    setCanHold(true);
    setRunning(true);
    if (audioRef.current.enabled) audioRef.current.resume();
  }, []);

  const stop = useCallback(() => setRunning(false), []);

  const lock = useCallback((b: Board, p: ActivePiece) => {
    const merged = mergePiece(b, p);
    const result = clearLines(merged);
    setBoard(result.board);
    if (result.linesCleared > 0) {
      setScore((s) => s + result.score - result.malus);
      setLignes((l) => l + result.linesCleared);
      if (result.curse) {
        setCurses((c) => c + 1);
        setFlash("Malédiction du Mycélium : déchets maudits dans le compost.");
        audioRef.current.clearCursed();
      } else if (result.linesCleared >= 2) {
        setFlash(`+${result.linesCleared} lignes saintes !`);
        audioRef.current.clearGood(result.linesCleared);
      } else {
        setFlash("Ligne compostée. Bénédiction.");
        audioRef.current.clearGood(1);
      }
      setTimeout(() => setFlash(null), 1400);
    }
    const newLignes = stateRef.current.lignes + result.linesCleared;
    if (Math.floor(newLignes / 8) + 1 > stateRef.current.level) setLevel((lv) => lv + 1);
    const newPiece = spawnPiece(nextDechetId);
    setNextDechetId(DECHETS[Math.floor(Math.random() * DECHETS.length)].id);
    setCanHold(true);
    if (checkCollision(result.board, newPiece)) {
      setRunning(false);
      setGameOver(true);
      audioRef.current.gameOver();
      onGameOver(stateRef.current.score + result.score - result.malus, newLignes);
      return null;
    }
    return newPiece;
  }, [nextDechetId, onGameOver]);

  const tick = useCallback(() => {
    setPiece((current) => {
      if (!current) return current;
      const b = stateRef.current.board;
      if (!checkCollision(b, current, 0, 1)) {
        return { ...current, y: current.y + 1 };
      }
      const next = lock(b, current);
      return next;
    });
  }, [lock]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, tickSpeed(level));
    return () => clearInterval(id);
  }, [running, level, tick]);

  const move = useCallback((dx: number) => {
    setPiece((p) => {
      if (!p) return p;
      if (!checkCollision(stateRef.current.board, p, dx, 0)) {
        audioRef.current.move();
        return { ...p, x: p.x + dx };
      }
      return p;
    });
  }, []);

  const rotate = useCallback(() => {
    setPiece((p) => {
      if (!p) return p;
      const next = (p.rotation + 1) % p.shapes.length;
      const tryRot = (dx: number) => {
        if (!checkCollision(stateRef.current.board, p, dx, 0, next)) {
          audioRef.current.rotate();
          return { ...p, x: p.x + dx, rotation: next };
        }
        return null;
      };
      return tryRot(0) ?? tryRot(-1) ?? tryRot(1) ?? p;
    });
  }, []);

  const softDrop = useCallback(() => tick(), [tick]);

  const hardDrop = useCallback(() => {
    setPiece((p) => {
      if (!p) return p;
      let dy = 0;
      while (!checkCollision(stateRef.current.board, p, 0, dy + 1)) dy++;
      const dropped = { ...p, y: p.y + dy };
      setScore((s) => s + dy * 2);
      audioRef.current.drop();
      const next = lock(stateRef.current.board, dropped);
      return next;
    });
  }, [lock]);

  // Réserve : garde la pièce courante de côté, ou l'échange avec la pièce gardée.
  // Une seule fois par pièce (canHold), comme au Tetris moderne.
  const hold = useCallback(() => {
    if (!canHold) return;
    setPiece((current) => {
      if (!current) return current;
      const board = stateRef.current.board;
      if (held) {
        const swapped: ActivePiece = {
          shapes: held.shapes,
          dechetId: held.dechetId,
          rotation: 0,
          x: Math.floor(BOARD_WIDTH / 2) - Math.floor(held.shapes[0][0].length / 2),
          y: 0,
        };
        if (checkCollision(board, swapped)) return current;
        setHeld({ shapes: current.shapes, dechetId: current.dechetId });
        setCanHold(false);
        audioRef.current.rotate();
        return swapped;
      }
      const fresh = spawnPiece(nextDechetId);
      if (checkCollision(board, fresh)) return current;
      setHeld({ shapes: current.shapes, dechetId: current.dechetId });
      setNextDechetId(DECHETS[Math.floor(Math.random() * DECHETS.length)].id);
      setCanHold(false);
      audioRef.current.rotate();
      return fresh;
    });
  }, [canHold, held, nextDechetId]);

  // Keyboard
  useEffect(() => {
    if (!running) return;
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowLeft") move(-1);
      else if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowDown") softDrop();
      else if (e.key === "ArrowUp") rotate();
      else if (e.key === " ") hardDrop();
      else if (e.key === "c" || e.key === "C") hold();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, move, softDrop, rotate, hardDrop, hold]);

  // Touch
  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (audioOn && !audioRef.current.ctx) {
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
    const dt = Date.now() - touchRef.current.t;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (absX < 15 && absY < 15 && dt < 250) {
      rotate();
    } else if (absX > absY) {
      if (dx > 0) move(1);
      else move(-1);
    } else {
      if (dy > 60) hardDrop();
      else if (dy > 0) softDrop();
      else rotate();
    }
    touchRef.current = null;
  };

  // Render board with active piece
  const display: Board = board.map((row) => [...row]);
  if (piece) {
    const shape = getShape(piece);
    for (let r = 0; r < shape.length; r++)
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        const x = piece.x + c;
        const y = piece.y + r;
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) display[y][x] = piece.dechetId;
      }
  }

  // Ombre de chute : projection de la pièce + verdict de l'impact si on la pose ici.
  const ghostCells = new Set<string>();
  let ghostVerdict: "curse" | "sainte" | "clear" | "none" = "none";
  if (piece) {
    let dy = 0;
    while (!checkCollision(board, piece, 0, dy + 1)) dy++;
    const shape = getShape(piece);
    if (dy > 0) {
      for (let r = 0; r < shape.length; r++)
        for (let c = 0; c < shape[r].length; c++) {
          if (!shape[r][c]) continue;
          const x = piece.x + c;
          const y = piece.y + r + dy;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) ghostCells.add(`${y}-${x}`);
        }
    }
    // Que se passe-t-il si la pièce se verrouille à cette position ?
    const merged = mergePiece(board, { ...piece, y: piece.y + dy });
    for (let r = 0; r < BOARD_HEIGHT; r++) {
      if (!merged[r].every((cell) => cell !== null)) continue;
      const cats = merged[r].map((id) => getDechet(id as string)?.categorie ?? "recycle");
      if (cats.some((cat) => cat === "maudit")) { ghostVerdict = "curse"; break; }
      if (cats.every((cat) => cat === "compost")) ghostVerdict = "sainte";
      else if (ghostVerdict === "none") ghostVerdict = "clear";
    }
  }

  const ghostColor =
    ghostVerdict === "curse" ? "#c0392b"
      : ghostVerdict === "sainte" ? "#c9a227"
      : ghostVerdict === "clear" ? "#5f8a3e"
      : "#a9b39a";

  // État de chaque rangée posée, affiché dans la marge pour décider où compléter.
  const rowStates = board.map((row) => {
    const filled = row.filter((cell) => cell !== null) as string[];
    if (filled.length === 0) return "vide";
    const cats = filled.map((id) => getDechet(id)?.categorie ?? "recycle");
    if (cats.some((cat) => cat === "maudit")) return "contaminee";
    if (cats.every((cat) => cat === "compost")) return "compost";
    return "propre";
  });

  const currentDechet = piece ? getDechet(piece.dechetId) : null;
  const nextDechet = getDechet(nextDechetId);
  const heldDechet = held ? getDechet(held.dechetId) : null;

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
      <div>
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative mx-auto w-full max-w-md select-none"
        >
          <div className="flex justify-center gap-1">
            <div
              className="rounded-lg border-2 border-ocre-500/50 bg-gradient-to-br from-mousse-900 via-mousse-950 to-black p-1.5 shadow-xl"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
                gap: 2,
                flex: 1,
              }}
            >
              {display.flatMap((row, r) =>
                row.map((cell, c) => {
                  const d = cell ? getDechet(cell) : null;
                  const cs = d ? CAT_STYLE[d.categorie] : null;
                  const isGhost = !d && ghostCells.has(`${r}-${c}`);
                  return (
                    <div
                      key={`${r}-${c}`}
                      className="aspect-square"
                      style={{
                        backgroundColor: cs?.fill ?? (isGhost ? `${ghostColor}26` : "rgba(255,255,255,0.04)"),
                        border: cs
                          ? "1px solid rgba(255,255,255,0.22)"
                          : isGhost
                          ? `1px dashed ${ghostColor}cc`
                          : "1px solid rgba(255,255,255,0.03)",
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.9rem",
                        lineHeight: 1,
                        transition: "background-color 0.08s linear",
                      }}
                    >
                      {cs && <span style={{ color: cs.ink, opacity: 0.92 }}>{cs.glyph}</span>}
                    </div>
                  );
                })
              )}
            </div>
            {/* Marge d'état : or = ligne sainte en vue, vert = ligne propre, rouge = maudit présent (ne pas compléter). */}
            <div
              className="grid border-y-2 border-transparent py-1.5"
              style={{ gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`, gap: 2, width: 9 }}
              aria-hidden
            >
              {rowStates.map((st, r) => (
                <div
                  key={r}
                  style={{
                    borderRadius: 2,
                    backgroundColor: ROW_MARK[st],
                    opacity: st === "vide" ? 0 : 0.85,
                    transition: "background-color 0.12s linear",
                  }}
                />
              ))}
            </div>
          </div>
          <AnimatePresence>
            {flash && (
              <motion.div
                key={flash}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-x-0 top-3 text-center font-serif text-ocre-300"
              >
                <span className="rounded-md bg-mousse-950/80 px-3 py-1 text-sm shadow-lg backdrop-blur">
                  {flash}
                </span>
              </motion.div>
            )}
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-mousse-950/90 p-6 text-center text-parchemin-50 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-ocre-400">Verdict de l'Ordre</p>
                <h2 className="titre-liturgique mt-2 text-3xl">Game Over</h2>
                <div className="ornement" />
                <p className="font-serif italic">« {juger(score, curses)} »</p>
                <p className="mt-4 font-serif">Score : <strong>{score}</strong></p>
                <p className="font-serif">Lignes : {lignes}</p>
                <p className="font-serif">Malédictions : {curses}</p>
                <Button onClick={start} className="mt-4">Recommencer</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pavé tactile — alternative aux touches, visible sur tous les écrans */}
        <div className="mx-auto mt-3 grid w-full max-w-md grid-cols-5 gap-2">
          <button className="btn-ghost py-3 text-lg" onClick={() => move(-1)} disabled={!running} aria-label="Déplacer à gauche">◀</button>
          <button className="btn-ghost py-3 text-lg" onClick={() => move(1)} disabled={!running} aria-label="Déplacer à droite">▶</button>
          <button className="btn-ghost py-3 text-lg" onClick={rotate} disabled={!running} aria-label="Rotation">↻</button>
          <button className="btn-ghost py-3 text-lg" onClick={softDrop} disabled={!running} aria-label="Descendre">▼</button>
          <button className="btn-ghost py-3 text-lg" onClick={hardDrop} disabled={!running} aria-label="Chute rapide">⇊</button>
        </div>
      </div>

      <aside className="grid gap-3 md:w-64">
        <Card>
          <CardSubtitle>Score</CardSubtitle>
          <p className="font-serif text-3xl text-mousse-800 dark:text-parchemin-100">{score}</p>
          <p className="font-serif text-xs text-mousse-600 dark:text-parchemin-200/70">
            Meilleur : {meilleurScore}
          </p>
        </Card>
        <Card>
          <CardSubtitle>Statistiques</CardSubtitle>
          <p className="font-serif text-sm">Lignes : {lignes}</p>
          <p className="font-serif text-sm">Niveau : {level}</p>
          <p className="font-serif text-sm">Malédictions : {curses}</p>
        </Card>
        <Card>
          <CardSubtitle>Légende</CardSubtitle>
          <ul className="mt-2 space-y-1.5">
            {(["compost", "recycle", "maudit"] as Categorie[]).map((cat) => {
              const cs = CAT_STYLE[cat];
              return (
                <li key={cat} className="flex items-center gap-2 font-serif text-xs text-mousse-800 dark:text-parchemin-100">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
                    style={{ backgroundColor: cs.fill, color: cs.ink, border: "1px solid rgba(255,255,255,0.22)" }}
                  >
                    {cs.glyph}
                  </span>
                  <span><strong>{cs.nom}</strong> — {cs.pts}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
            Marge de droite : <span style={{ color: "#c9a227" }}>or</span> = ligne sainte en vue,{" "}
            <span style={{ color: "#5f8a3e" }}>vert</span> = ligne propre,{" "}
            <span style={{ color: "#c0392b" }}>rouge</span> = maudit présent, à ne pas compléter.
          </p>
          <p className="mt-2 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
            L'ombre de chute prend ces mêmes couleurs : elle annonce l'effet de la pièce avant que tu la poses.
          </p>
        </Card>
        <Card>
          <CardSubtitle>Prochain déchet</CardSubtitle>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl">{nextDechet?.embleme}</span>
            <div>
              <p className="font-serif text-sm text-mousse-800 dark:text-parchemin-100">{nextDechet?.nom}</p>
              <CategorieTag c={nextDechet?.categorie ?? "recycle"} />
            </div>
          </div>
        </Card>
        <Card>
          <CardSubtitle>Réserve</CardSubtitle>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl">{heldDechet?.embleme ?? "—"}</span>
            <div>
              <p className="font-serif text-sm text-mousse-800 dark:text-parchemin-100">
                {heldDechet?.nom ?? "Réserve vide"}
              </p>
              {heldDechet && <CategorieTag c={heldDechet.categorie} />}
            </div>
          </div>
          <button
            className="btn-ghost mt-3 w-full py-2 text-sm"
            onClick={hold}
            disabled={!running || !canHold}
          >
            Garder / échanger (C)
          </button>
        </Card>
        {currentDechet && (
          <Card>
            <CardSubtitle>En cours</CardSubtitle>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-3xl">{currentDechet.embleme}</span>
              <div>
                <p className="font-serif text-sm text-mousse-800 dark:text-parchemin-100">{currentDechet.nom}</p>
                <CategorieTag c={currentDechet.categorie} />
              </div>
            </div>
          </Card>
        )}
        <Card>
          <CardSubtitle>Commandes</CardSubtitle>
          <ul className="mt-2 space-y-1 font-serif text-xs text-mousse-800 dark:text-parchemin-100">
            <li>◀ ▶ : déplacer</li>
            <li>▲ : rotation</li>
            <li>▼ : descendre</li>
            <li>espace : chute rapide</li>
            <li>C : garder / échanger</li>
            <li>Mobile : swipe + tap rotation</li>
          </ul>
          <label className="mt-3 flex items-center gap-2 font-serif text-xs text-mousse-700 dark:text-parchemin-200/80">
            <input
              type="checkbox"
              checked={audioOn}
              onChange={(e) => setAudioOn(e.target.checked)}
              className="accent-mousse-700"
            />
            Audio (sons d'effets)
          </label>
        </Card>
        <div className="flex gap-2">
          {!running && !gameOver && <Button onClick={start} className="w-full">Commencer</Button>}
          {running && <Button variant="ghost" onClick={stop} className="w-full">Pause</Button>}
          {!running && !gameOver && false}
          {gameOver && <Button onClick={start} className="w-full">Rejouer</Button>}
          {!running && !gameOver && stateRef.current.score === 0 ? null : null}
        </div>
      </aside>
    </div>
  );
}

function CategorieTag({ c }: { c: Categorie }) {
  const label = c === "compost" ? "Compost" : c === "recycle" ? "Recyclable" : "Maudit";
  return (
    <Badge variant={c === "maudit" ? "outline" : "default"}>
      {c === "compost" && "✿"}
      {c === "recycle" && "♺"}
      {c === "maudit" && "☠"} {label}
    </Badge>
  );
}
