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
  const [audioOn, setAudioOn] = useState(false);
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
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, move, softDrop, rotate, hardDrop]);

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
  const currentDechet = piece ? getDechet(piece.dechetId) : null;
  const nextDechet = getDechet(nextDechetId);

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
      <div>
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative mx-auto w-full max-w-md select-none"
        >
          <div
            className="rounded-lg border-2 border-ocre-500/50 bg-gradient-to-br from-mousse-900 via-mousse-950 to-black p-1.5 shadow-xl"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
              gap: 2,
            }}
          >
            {display.flatMap((row, r) =>
              row.map((cell, c) => {
                const d = cell ? getDechet(cell) : null;
                return (
                  <div
                    key={`${r}-${c}`}
                    className="aspect-square"
                    style={{
                      backgroundColor: d?.couleur ?? "rgba(255,255,255,0.04)",
                      border: d ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.03)",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      transition: "background-color 0.08s linear",
                    }}
                  >
                    {d && <span style={{ opacity: 0.95 }}>{d.embleme}</span>}
                  </div>
                );
              })
            )}
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

        <div className="mt-3 grid grid-cols-4 gap-2 md:hidden">
          <button className="btn-ghost" onClick={() => move(-1)} disabled={!running}>◀</button>
          <button className="btn-ghost" onClick={rotate} disabled={!running}>↻</button>
          <button className="btn-ghost" onClick={softDrop} disabled={!running}>▼</button>
          <button className="btn-ghost" onClick={hardDrop} disabled={!running}>⇊</button>
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
          <CardSubtitle>Prochain déchet</CardSubtitle>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl">{nextDechet?.embleme}</span>
            <div>
              <p className="font-serif text-sm text-mousse-800 dark:text-parchemin-100">{nextDechet?.nom}</p>
              <CategorieTag c={nextDechet?.categorie ?? "recycle"} />
            </div>
          </div>
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
