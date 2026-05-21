"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Grille,
  ConfigNuit,
  FAUNE,
  NUITS,
  BONUS_NUIT,
  grilleVierge,
  genererGrille,
  revelerCellule,
  nuitGagnee,
  clonerGrille,
  jugerEmpreintes,
} from "@/lib/empreintes-engine";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type Phase = "intro" | "jeu" | "verdict";
type Mode = "sonder" | "marquer";
type Fin = null | "clear" | "chat" | "ferme";

const NUM_COLOR: Record<number, string> = {
  1: "#6db3e8",
  2: "#82c878",
  3: "#e88d6b",
  4: "#b79ce0",
  5: "#e0b84a",
  6: "#57c4c4",
  7: "#cfcfcf",
  8: "#9a9a9a",
};

export function NuitDesEmpreintes({
  onGameOver,
}: {
  onGameOver: (score: number, mammiferes: number) => void;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [nuitIndex, setNuitIndex] = useState(0);
  const [grille, setGrille] = useState<Grille>(() => grilleVierge(NUITS[0]));
  const [boardPlaced, setBoardPlaced] = useState(false);
  const [mode, setMode] = useState<Mode>("sonder");
  const [score, setScore] = useState(0);
  const [mammiferes, setMammiferes] = useState(0);
  const [nuitFaune, setNuitFaune] = useState(0);
  const [fin, setFin] = useState<Fin>(null);

  const cfg: ConfigNuit = NUITS[nuitIndex];
  const marques = useMemo(
    () => grille.reduce((s, row) => s + row.filter((c) => c.marquee).length, 0),
    [grille]
  );

  const installerNuit = (idx: number) => {
    setNuitIndex(idx);
    setGrille(grilleVierge(NUITS[idx]));
    setBoardPlaced(false);
    setMode("sonder");
    setNuitFaune(0);
    setFin(null);
    setPhase("jeu");
  };

  const commencer = () => {
    setScore(0);
    setMammiferes(0);
    installerNuit(0);
  };

  const onCell = (x: number, y: number) => {
    if (phase !== "jeu" || fin) return;
    const cell = grille[y][x];

    if (mode === "marquer") {
      if (cell.revelee) return;
      const g = clonerGrille(grille);
      g[y][x].marquee = !g[y][x].marquee;
      setGrille(g);
      return;
    }

    // mode sonder
    if (cell.revelee || cell.marquee) return;
    const g = boardPlaced ? clonerGrille(grille) : genererGrille(cfg, x, y);
    if (!boardPlaced) setBoardPlaced(true);

    const revelees = revelerCellule(g, x, y);
    let gain = 0;
    let faune = 0;
    for (const { x: rx, y: ry } of revelees) {
      const c = g[ry][rx];
      if (c.contenu !== "vide" && c.contenu !== "chat") {
        gain += FAUNE[c.contenu].points;
        faune += 1;
      }
    }

    if (g[y][x].contenu === "chat") {
      g.forEach((row) => row.forEach((c) => (c.revelee = true)));
      setGrille(g);
      setFin("chat");
      return;
    }

    const gagne = nuitGagnee(g);
    if (gagne) g.forEach((row) => row.forEach((c) => (c.revelee = true)));
    setGrille(g);
    setScore((s) => s + gain + (gagne ? BONUS_NUIT : 0));
    setMammiferes((m) => m + faune);
    setNuitFaune((n) => n + faune);
    if (gagne) setFin("clear");
  };

  const refermer = () => {
    if (fin) return;
    const g = clonerGrille(grille);
    g.forEach((row) => row.forEach((c) => (c.revelee = true)));
    setGrille(g);
    setFin("ferme");
  };

  const continuer = () => {
    if (nuitIndex < NUITS.length - 1) {
      installerNuit(nuitIndex + 1);
    } else {
      setPhase("verdict");
      onGameOver(score, mammiferes);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border-2 border-ocre-500/40 bg-gradient-to-br from-mousse-950 via-black to-mousse-900 p-4 text-parchemin-100 shadow-xl md:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-serif text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="grace">Score : {score}</Badge>
          {phase === "jeu" && <Badge variant="outline">Nuit {nuitIndex + 1}/{NUITS.length} · {cfg.nom}</Badge>}
          <Badge variant="outline">{mammiferes} recensé{mammiferes > 1 ? "s" : ""}</Badge>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-ocre-400">La Nuit des Empreintes</p>
              <h2 className="titre-liturgique mt-2 text-2xl">Déduis, ne devine pas</h2>
              <div className="ornement" />
              <p className="mx-auto max-w-md font-serif italic text-parchemin-200/85">
                Le cimetière, la nuit, cache des chats et de la faune. Sonde une case : le chiffre
                révélé compte les chats des huit cases voisines. Croise les chiffres, déduis où dorment
                les chats, et dégage le terrain sûr pour recenser les bêtes — sans en déranger un seul.
              </p>
              <Button onClick={commencer} className="mt-4">
                Entrer dans le cimetière
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "jeu" && (
          <motion.div key="jeu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-serif text-xs">
              <span className="text-parchemin-200/75">
                🐈 chats marqués : {marques}/{cfg.chats} · 🐾 faune : {nuitFaune}/{cfg.faune}
              </span>
              <div className="flex gap-1">
                <ModeBtn actif={mode === "sonder"} onClick={() => setMode("sonder")} label="🔦 Sonder" />
                <ModeBtn actif={mode === "marquer"} onClick={() => setMode("marquer")} label="🚩 Marquer" />
              </div>
            </div>

            <div className="mx-auto w-full" style={{ maxWidth: cfg.cols * 52 }}>
              <div
                className="grid gap-[3px]"
                style={{ gridTemplateColumns: `repeat(${cfg.cols}, 1fr)` }}
              >
                {grille.flatMap((row, y) =>
                  row.map((c, x) => (
                    <CelluleBtn key={`${x}-${y}`} c={c} fige={!!fin} onClick={() => onCell(x, y)} />
                  ))
                )}
              </div>
            </div>

            {!fin && (
              <div className="mt-3 flex justify-center">
                <Button variant="ghost" onClick={refermer} disabled={!boardPlaced}>
                  Refermer la nuit
                </Button>
              </div>
            )}

            {fin && (
              <div className="mx-auto mt-3 max-w-md text-center font-serif">
                <div
                  className={`rounded-md border p-3 ${
                    fin === "clear"
                      ? "border-ocre-400/60 bg-ocre-500/15"
                      : fin === "chat"
                      ? "border-terre-400/50 bg-terre-500/10"
                      : "border-parchemin-200/20 bg-mousse-950/40"
                  }`}
                >
                  <p className="text-sm">
                    {fin === "clear" && (
                      <span className="text-ocre-300">Cimetière entièrement relevé. +{BONUS_NUIT}</span>
                    )}
                    {fin === "chat" && (
                      <span className="text-terre-300">Un chat dérangé — la colonie s'effraie, la nuit s'arrête.</span>
                    )}
                    {fin === "ferme" && (
                      <span className="text-parchemin-200/80">Nuit refermée. Tu gardes ce que tu as recensé.</span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-parchemin-200/70">
                    Faune recensée cette nuit : {nuitFaune}/{cfg.faune}
                  </p>
                </div>
                <Button onClick={continuer} className="mt-3">
                  {nuitIndex < NUITS.length - 1 ? "Nuit suivante" : "Refermer le carnet"}
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {phase === "verdict" && (
          <motion.div key="verdict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-ocre-400">Carnet de relevés refermé</p>
              <h2 className="titre-liturgique mt-2 text-3xl">Verdict du Veilleur</h2>
              <div className="ornement" />
              <p className="mx-auto max-w-md font-serif italic text-parchemin-200/85">
                « {jugerEmpreintes(score, mammiferes)} »
              </p>
              <p className="mt-3 font-serif">
                Score : <strong>{score}</strong> · Mammifères recensés : <strong>{mammiferes}</strong>
              </p>
              <Button onClick={commencer} className="mt-4">
                Recommencer le relevé
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModeBtn({ actif, onClick, label }: { actif: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-2.5 py-1 font-serif text-xs transition ${
        actif
          ? "border-ocre-400 bg-ocre-500/25 text-parchemin-50"
          : "border-parchemin-200/15 text-parchemin-200/70 hover:border-ocre-400/50"
      }`}
    >
      {label}
    </button>
  );
}

function CelluleBtn({
  c,
  fige,
  onClick,
}: {
  c: { contenu: string; chatsVoisins: number; revelee: boolean; marquee: boolean };
  fige: boolean;
  onClick: () => void;
}) {
  const estFaune = c.contenu === "herisson" || c.contenu === "micromammifere" || c.contenu === "fouine";

  let contenu: React.ReactNode = null;
  let bg = "rgba(255,255,255,0.06)";
  let border = "1px solid rgba(255,255,255,0.10)";

  if (!c.revelee) {
    if (c.marquee) contenu = <span style={{ fontSize: "0.8em" }}>🚩</span>;
    bg = "rgba(120,140,90,0.16)";
    border = "1px solid rgba(201,162,39,0.22)";
  } else if (c.contenu === "chat") {
    contenu = <span style={{ fontSize: "0.8em" }}>🐈</span>;
    bg = "rgba(130,40,40,0.4)";
    border = "1px solid rgba(180,70,70,0.4)";
  } else if (estFaune) {
    contenu = <span style={{ fontSize: "0.8em" }}>{FAUNE[c.contenu as keyof typeof FAUNE].embleme}</span>;
    bg = "rgba(201,162,39,0.16)";
    border = "1px solid rgba(201,162,39,0.3)";
  } else {
    bg = "rgba(0,0,0,0.35)";
    border = "1px solid rgba(255,255,255,0.04)";
    if (c.chatsVoisins > 0) {
      contenu = (
        <span style={{ color: NUM_COLOR[c.chatsVoisins] ?? "#cfcfcf", fontWeight: 700 }}>
          {c.chatsVoisins}
        </span>
      );
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={fige}
      aria-label={c.revelee ? "case révélée" : c.marquee ? "case marquée" : "case à sonder"}
      className="flex aspect-square items-center justify-center rounded-[3px] font-serif transition"
      style={{
        background: bg,
        border,
        fontSize: "min(4.2vw, 1.05rem)",
        cursor: fige || c.revelee ? "default" : "pointer",
      }}
    >
      {contenu}
    </button>
  );
}
