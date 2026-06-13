"use client";

import { useMemo, useRef, useState } from "react";
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

interface JournalEntry {
  nom: string;
  fin: Exclude<Fin, null>;
  grille: Grille;
  faune: number;
  fauneMax: number;
}

// Palette nocturne SOURDE (DA : pas de néons) : sauge → ocre → terre cuite,
// graduée en chaleur ET en valeur. La graisse + la taille portent aussi
// l'information — jamais la couleur seule.
const NUM_COLOR: Record<number, string> = {
  1: "#a8b890",
  2: "#c9b178",
  3: "#d49a5e",
  4: "#c98a6a",
  5: "#d4b04a",
  6: "#9ab0a0",
  7: "#cfc8b0",
  8: "#a89a88",
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
  const [journal, setJournal] = useState<JournalEntry[]>([]);

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
    setJournal([]);
    installerNuit(0);
  };

  // Bascule un drapeau (mode marquer, clic droit ou appui long).
  const basculerMarque = (x: number, y: number) => {
    if (phase !== "jeu" || fin) return;
    if (grille[y][x].revelee) return;
    const g = clonerGrille(grille);
    g[y][x].marquee = !g[y][x].marquee;
    setGrille(g);
  };

  // Applique le résultat d'une ou plusieurs sondes sur une grille clonée.
  const conclureSonde = (g: Grille, gain: number, faune: number, chatDerange: boolean) => {
    if (chatDerange) {
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

  const compterGains = (g: Grille, revelees: { x: number; y: number }[]) => {
    let gain = 0;
    let faune = 0;
    for (const { x: rx, y: ry } of revelees) {
      const c = g[ry][rx];
      if (c.contenu !== "vide" && c.contenu !== "chat") {
        gain += FAUNE[c.contenu].points;
        faune += 1;
      }
    }
    return { gain, faune };
  };

  const onCell = (x: number, y: number) => {
    if (phase !== "jeu" || fin) return;
    const cell = grille[y][x];

    if (mode === "marquer") {
      basculerMarque(x, y);
      return;
    }

    // ACCORD (chord) : sonder un chiffre révélé dont les drapeaux voisins
    // satisfont le compte ouvre d'un coup toutes les voisines non marquées.
    // Le réflexe des habitué·es du démineur — et un vrai gain de confort.
    if (cell.revelee) {
      if (cell.chatsVoisins === 0) return;
      const rows = grille.length;
      const cols = grille[0].length;
      let drapeaux = 0;
      const cibles: [number, number][] = [];
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (ny < 0 || ny >= rows || nx < 0 || nx >= cols) continue;
          const v = grille[ny][nx];
          if (v.marquee) drapeaux++;
          else if (!v.revelee) cibles.push([nx, ny]);
        }
      if (drapeaux !== cell.chatsVoisins || cibles.length === 0) return;
      const g = clonerGrille(grille);
      let gain = 0;
      let faune = 0;
      let chatDerange = false;
      for (const [nx, ny] of cibles) {
        if (g[ny][nx].revelee) continue; // déjà ouverte par un flot précédent
        const r = compterGains(g, revelerCellule(g, nx, ny));
        gain += r.gain;
        faune += r.faune;
        if (g[ny][nx].contenu === "chat") chatDerange = true;
      }
      conclureSonde(g, gain, faune, chatDerange);
      return;
    }

    // sonde normale
    if (cell.marquee) return;
    const g = boardPlaced ? clonerGrille(grille) : genererGrille(cfg, x, y);
    if (!boardPlaced) setBoardPlaced(true);

    const { gain, faune } = compterGains(g, revelerCellule(g, x, y));
    conclureSonde(g, gain, faune, g[y][x].contenu === "chat");
  };

  const refermer = () => {
    if (fin) return;
    const g = clonerGrille(grille);
    g.forEach((row) => row.forEach((c) => (c.revelee = true)));
    setGrille(g);
    setFin("ferme");
  };

  const continuer = () => {
    if (!fin) return;
    const entry: JournalEntry = {
      nom: cfg.nom,
      fin,
      grille: clonerGrille(grille),
      faune: nuitFaune,
      fauneMax: cfg.faune,
    };
    setJournal((j) => [...j, entry]);
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
                🐈 marqués : {marques}/{cfg.chats} (reste {Math.max(0, cfg.chats - marques)}) · 🐾 faune :{" "}
                {nuitFaune}/{cfg.faune}
              </span>
              <div className="flex gap-1">
                <ModeBtn actif={mode === "sonder"} onClick={() => setMode("sonder")} label="🔦 Sonder" />
                <ModeBtn actif={mode === "marquer"} onClick={() => setMode("marquer")} label="🚩 Marquer" />
              </div>
            </div>
            <p className="mb-2 text-center font-serif text-[11px] italic text-parchemin-200/55">
              Appui long ou clic droit : marquer. Toucher un chiffre satisfait : ouvrir ses voisines d'un coup.
            </p>

            <div className="mx-auto w-full" style={{ maxWidth: cfg.cols * 52 }}>
              <div
                className="grid gap-[3px]"
                style={{ gridTemplateColumns: `repeat(${cfg.cols}, 1fr)` }}
              >
                {grille.flatMap((row, y) =>
                  row.map((c, x) => (
                    <CelluleBtn
                      key={`${x}-${y}`}
                      c={c}
                      fige={!!fin}
                      onClick={() => onCell(x, y)}
                      onFlag={() => basculerMarque(x, y)}
                    />
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
              <div className="ornement" aria-hidden />
              <p className="mx-auto max-w-md font-serif italic text-parchemin-200/85">
                « {jugerEmpreintes(score, mammiferes)} »
              </p>
              <p className="mt-3 font-serif">
                Score : <strong>{score}</strong> · Mammifères recensés : <strong>{mammiferes}</strong>
              </p>
            </div>

            {journal.length > 0 && (
              <div className="mx-auto mt-5 grid max-w-3xl gap-3 sm:grid-cols-3">
                {journal.map((entry, i) => (
                  <NuitRecap key={i} entry={entry} numero={i + 1} />
                ))}
              </div>
            )}

            <p className="mx-auto mt-4 max-w-md text-center font-serif text-xs italic text-parchemin-200/65">
              Vert : chat correctement déduit (drapeau bien placé). Rouge : chat manqué (sans drapeau). Drapeau seul sur fond clair : fausse alerte sur une bête recensée.
            </p>

            <div className="mt-5 text-center">
              <Button onClick={commencer}>Recommencer le relevé</Button>
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

function NuitRecap({ entry, numero }: { entry: JournalEntry; numero: number }) {
  const { grille, fin, faune, fauneMax, nom } = entry;
  const cols = grille[0]?.length ?? 0;
  // Comptes pour le résumé textuel sous la mini-grille
  let chatsBienDeduits = 0;
  let chatsManques = 0;
  let faussesAlertes = 0;
  for (const row of grille) {
    for (const c of row) {
      if (c.contenu === "chat") {
        if (c.marquee) chatsBienDeduits++;
        else chatsManques++;
      } else if (c.contenu !== "vide" && c.marquee) {
        // un drapeau placé sur une bête recensée = fausse alerte
        faussesAlertes++;
      }
    }
  }
  const finLabel =
    fin === "clear" ? "Cimetière relevé" : fin === "chat" ? "Chat dérangé" : "Nuit refermée";
  const finColor =
    fin === "clear" ? "text-ocre-300" : fin === "chat" ? "text-terre-300" : "text-parchemin-200/75";

  return (
    <div className="rounded-md border border-parchemin-200/15 bg-mousse-950/40 p-3">
      <div className="mb-2 flex items-baseline justify-between gap-2 font-serif text-xs">
        <span className="uppercase tracking-widest text-ocre-400/80">Nuit {numero} · {nom}</span>
        <span className={`font-medium ${finColor}`}>{finLabel}</span>
      </div>
      <div
        className="mx-auto grid gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: cols * 18 }}
        aria-hidden
      >
        {grille.flatMap((row, y) =>
          row.map((c, x) => <CelluleMini key={`${x}-${y}`} c={c} />)
        )}
      </div>
      <p className="mt-2 text-center font-serif text-[11px] leading-relaxed text-parchemin-200/80">
        <span className="text-emerald-300">{chatsBienDeduits}</span> bien déduit{chatsBienDeduits > 1 ? "s" : ""}
        {" · "}
        <span className="text-red-300">{chatsManques}</span> manqué{chatsManques > 1 ? "s" : ""}
        {faussesAlertes > 0 && (
          <>
            {" · "}
            <span className="text-ocre-300">{faussesAlertes}</span> fausse{faussesAlertes > 1 ? "s" : ""} alerte{faussesAlertes > 1 ? "s" : ""}
          </>
        )}
        {" · "}
        {faune}/{fauneMax} bête{fauneMax > 1 ? "s" : ""}
      </p>
    </div>
  );
}

function CelluleMini({ c }: { c: { contenu: string; chatsVoisins: number; revelee: boolean; marquee: boolean } }) {
  // Mini-grille de bilan : on rend lisible d'un coup d'œil les chats bien marqués
  // (vert), les chats manqués (rouge), les bêtes recensées (or) et les fausses alertes.
  let bg = "rgba(0,0,0,0.35)";
  let glyph: React.ReactNode = null;
  let border = "1px solid rgba(255,255,255,0.05)";
  const estFaune = c.contenu === "herisson" || c.contenu === "micromammifere" || c.contenu === "fouine";

  if (c.contenu === "chat") {
    if (c.marquee) {
      bg = "rgba(46,160,67,0.35)"; // vert = bien déduit
      border = "1px solid rgba(46,160,67,0.6)";
      glyph = "🐈";
    } else {
      bg = "rgba(180,60,60,0.4)"; // rouge = manqué
      border = "1px solid rgba(180,60,60,0.6)";
      glyph = "🐈";
    }
  } else if (estFaune) {
    bg = "rgba(201,162,39,0.22)";
    border = "1px solid rgba(201,162,39,0.4)";
    glyph = c.marquee ? "🚩" : FAUNE[c.contenu as keyof typeof FAUNE].embleme;
  } else {
    // case vide ; on n'affiche rien sauf si l'utilisateur y a planté un drapeau (fausse alerte)
    if (c.marquee) {
      bg = "rgba(150,120,30,0.22)";
      glyph = "🚩";
    }
  }

  return (
    <div
      className="flex aspect-square items-center justify-center rounded-[2px]"
      style={{ background: bg, border, fontSize: "0.65rem", lineHeight: 1 }}
    >
      {glyph}
    </div>
  );
}

function CelluleBtn({
  c,
  fige,
  onClick,
  onFlag,
}: {
  c: { contenu: string; chatsVoisins: number; revelee: boolean; marquee: boolean };
  fige: boolean;
  onClick: () => void;
  onFlag: () => void;
}) {
  // Appui long (~420 ms) = marquer, sans changer de mode. Le clic qui suit un
  // appui long est avalé. Clic droit = marquer aussi (desktop).
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);

  const startPress = () => {
    if (fige || c.revelee) return;
    longPressed.current = false;
    pressTimer.current = setTimeout(() => {
      longPressed.current = true;
      onFlag();
    }, 420);
  };
  const cancelPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };
  const handleClick = () => {
    if (longPressed.current) {
      longPressed.current = false;
      return;
    }
    onClick();
  };

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
        <span
          style={{
            color: NUM_COLOR[c.chatsVoisins] ?? "#cfc8b0",
            fontWeight: 700,
            // les grands chiffres pèsent plus lourd à l'œil (info ≠ couleur seule)
            fontSize: c.chatsVoisins >= 4 ? "1.06em" : "1em",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          {c.chatsVoisins}
        </span>
      );
    }
  }

  return (
    <button
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        if (!fige && !c.revelee) onFlag();
      }}
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
      disabled={fige}
      aria-label={c.revelee ? "case révélée" : c.marquee ? "case marquée" : "case à sonder"}
      className="flex aspect-square select-none items-center justify-center rounded-[3px] font-serif transition"
      style={{
        background: bg,
        border,
        fontSize: "min(4.2vw, 1.05rem)",
        cursor: fige ? "default" : "pointer",
        touchAction: "manipulation",
        WebkitTouchCallout: "none",
      }}
    >
      {contenu}
    </button>
  );
}
