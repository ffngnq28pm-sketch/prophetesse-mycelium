"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Emplacement,
  MorphoId,
  TraitKey,
  ObjectifCarnet,
  MORPHOGROUPES,
  TRAIT_LABEL,
  IDENTIFIABLES,
  OBJECTIFS,
  TUNNELS_PAR_NUIT,
  NUITS_TOTAL,
  favorisHabitat,
  genererNuit,
  resoudreTunnel,
  traitsLisibles,
  jugerEmpreintes,
} from "@/lib/empreintes-engine";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type Phase = "intro" | "placement" | "reveal" | "bilan" | "verdict";

interface TunnelResultat {
  spotIndex: number;
  morpho: MorphoId;
  traits: TraitKey[]; // les deux traits lisibles
  reponse: MorphoId | null;
}

// ===== Empreinte réelle (révélée APRÈS l'identification) =====
function Patte({ morpho, size = 88, couleur = "#e8dfc8" }: { morpho: MorphoId; size?: number; couleur?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden>
      {morpho === "chat" && (
        <g fill={couleur}>
          <ellipse cx={22} cy={30} rx={10} ry={8} />
          <ellipse cx={10} cy={17} rx={4} ry={5} />
          <ellipse cx={17.5} cy={11} rx={4} ry={5} />
          <ellipse cx={26.5} cy={11} rx={4} ry={5} />
          <ellipse cx={34} cy={17} rx={4} ry={5} />
        </g>
      )}
      {morpho === "herisson" && (
        <g fill={couleur}>
          <ellipse cx={22} cy={31} rx={11} ry={7.5} />
          {[[8, 19], [15, 13], [22, 11], [29, 13], [36, 19]].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx={3.8} ry={4.4} />
          ))}
        </g>
      )}
      {morpho === "fouine" && (
        <g fill={couleur} stroke={couleur}>
          <ellipse cx={22} cy={32} rx={6.5} ry={6} stroke="none" />
          {[[11, 18], [17, 11], [23, 9], [29, 12], [34, 19]].map(([x, y], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y} rx={2.8} ry={5} stroke="none" />
              <line x1={x} y1={y - 5} x2={x} y2={y - 8.5} strokeWidth={1.4} strokeLinecap="round" />
            </g>
          ))}
        </g>
      )}
      {morpho === "micromammifere" && (
        <g fill={couleur}>
          <ellipse cx={22} cy={27} rx={3.4} ry={2.8} />
          {[[15, 19], [20, 15.5], [25, 15.5], [30, 20]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={2} />
          ))}
        </g>
      )}
      {morpho === "vide" && (
        <text x={22} y={30} textAnchor="middle" fontSize={22} fill={couleur}>·</text>
      )}
    </svg>
  );
}

// ===== Empreinte brouillée (montrée AVANT l'identification — aucune info d'espèce) =====
function Smudge({ size = 88 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden>
      <g fill="#473f2c">
        <ellipse cx={21} cy={25} rx={13} ry={9} />
        <ellipse cx={29} cy={15} rx={6.5} ry={5.5} />
        <ellipse cx={12} cy={31} rx={5.5} ry={4} />
        <ellipse cx={27} cy={32} rx={4.5} ry={3.5} />
      </g>
      <g fill="#2c2718">
        <circle cx={17} cy={23} r={2.4} />
        <circle cx={24} cy={20} r={1.8} />
        <circle cx={20} cy={28} r={1.6} />
        <circle cx={30} cy={26} r={1.4} />
      </g>
    </svg>
  );
}

const INDICE_LABEL: Record<string, { texte: string; classe: string }> = {
  chat: { texte: "🐈 Odeur de chat", classe: "text-terre-300 border-terre-400/50" },
  fraiche: { texte: "✦ Traces fraîches", classe: "text-mousse-200 border-mousse-400/50" },
  fauche: { texte: "✂ Fraîchement fauché", classe: "text-parchemin-200/60 border-parchemin-200/30" },
};

export function NuitDesEmpreintes({
  onGameOver,
}: {
  onGameOver: (score: number, mammiferes: number) => void;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [nuit, setNuit] = useState(1);
  const [emplacements, setEmplacements] = useState<Emplacement[]>([]);
  const [objectif, setObjectif] = useState<ObjectifCarnet>(OBJECTIFS[0]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [results, setResults] = useState<TunnelResultat[]>([]);
  const [revealIndex, setRevealIndex] = useState(0);
  const [objectifAtteint, setObjectifAtteint] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [mammiferes, setMammiferes] = useState(0);

  const commencer = () => {
    const n = genererNuit();
    setNuit(1);
    setScore(0);
    setMammiferes(0);
    setEmplacements(n.emplacements);
    setObjectif(n.objectif);
    setPlaced([]);
    setResults([]);
    setRevealIndex(0);
    setObjectifAtteint(null);
    setPhase("placement");
  };

  const togglePlace = (i: number) => {
    setPlaced((p) =>
      p.includes(i)
        ? p.filter((x) => x !== i)
        : p.length < TUNNELS_PAR_NUIT
        ? [...p, i]
        : p
    );
  };

  const passerLaNuit = () => {
    const res: TunnelResultat[] = placed.map((spotIndex) => ({
      spotIndex,
      morpho: resoudreTunnel(emplacements[spotIndex]),
      traits: traitsLisibles(),
      reponse: null,
    }));
    setResults(res);
    setRevealIndex(0);
    setPhase("reveal");
  };

  const repondre = (choix: MorphoId) => {
    const cur = results[revealIndex];
    if (!cur || cur.reponse) return;
    setResults((rs) => rs.map((r, i) => (i === revealIndex ? { ...r, reponse: choix } : r)));
    if (choix === cur.morpho) {
      const m = MORPHOGROUPES[cur.morpho];
      setScore((s) => s + m.points);
      if (m.recense) setMammiferes((x) => x + 1);
    }
  };

  const continuer = () => {
    if (revealIndex < results.length - 1) {
      setRevealIndex((i) => i + 1);
      return;
    }
    const atteint = objectif.verifier(results.map((r) => r.morpho));
    if (atteint) setScore((s) => s + objectif.bonus);
    setObjectifAtteint(atteint);
    setPhase("bilan");
  };

  const nuitSuivante = () => {
    if (nuit < NUITS_TOTAL) {
      const n = genererNuit();
      setNuit((x) => x + 1);
      setEmplacements(n.emplacements);
      setObjectif(n.objectif);
      setPlaced([]);
      setResults([]);
      setRevealIndex(0);
      setObjectifAtteint(null);
      setPhase("placement");
    } else {
      setPhase("verdict");
      onGameOver(score, mammiferes);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border-2 border-ocre-500/40 bg-gradient-to-br from-mousse-950 via-black to-mousse-900 p-4 text-parchemin-100 shadow-xl md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 font-serif text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="grace">Score : {score}</Badge>
          {phase !== "intro" && phase !== "verdict" && (
            <Badge variant="outline">Nuit {nuit} / {NUITS_TOTAL}</Badge>
          )}
          <Badge variant="outline">{mammiferes} relevé{mammiferes > 1 ? "s" : ""}</Badge>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-ocre-400">La Nuit des Empreintes</p>
              <h2 className="titre-liturgique mt-2 text-2xl">Place, attends, déduis</h2>
              <div className="ornement" />
              <p className="mx-auto max-w-md font-serif italic text-parchemin-200/85">
                Chaque nuit, le carnet de l'Ordre réclame une bête précise. À toi de poser tes trois
                tunnels là où elle passe. Au matin, l'empreinte est brouillée : tu ne la reconnais pas,
                tu la <em>déduis</em> — deux indices sur trois, et ton flair.
              </p>
              <Button onClick={commencer} className="mt-4">
                Commencer la première nuit
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "placement" && (
          <motion.div key="placement" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CarnetBanner objectif={objectif} />
            <p className="mb-3 text-center font-serif text-sm text-parchemin-200/80">
              Pose <strong>{TUNNELS_PAR_NUIT}</strong> tunnels — {placed.length}/{TUNNELS_PAR_NUIT} placé
              {placed.length > 1 ? "s" : ""}.
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {emplacements.map((emp, i) => {
                const pose = placed.includes(i);
                const ind = emp.indice ? INDICE_LABEL[emp.indice] : null;
                const favoris = favorisHabitat(emp.habitat);
                return (
                  <button
                    key={i}
                    onClick={() => togglePlace(i)}
                    className={`rounded-md border p-3 text-left font-serif transition ${
                      pose
                        ? "border-ocre-400 bg-ocre-500/20"
                        : "border-parchemin-200/15 bg-mousse-950/40 hover:border-ocre-400/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-parchemin-100">{emp.habitat.nom}</span>
                      {pose && <span className="text-xs text-ocre-300">● tunnel</span>}
                    </div>
                    <p className="mt-1 text-xs italic text-parchemin-200/55">{emp.habitat.ambiance}</p>
                    <p className="mt-1.5 text-xs text-parchemin-200/75">
                      Plutôt fréquenté par : {favoris.map((f) => MORPHOGROUPES[f].embleme).join(" ")}
                    </p>
                    {ind && (
                      <span
                        className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] ${ind.classe}`}
                      >
                        {ind.texte}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex justify-center">
              <Button onClick={passerLaNuit} disabled={placed.length !== TUNNELS_PAR_NUIT}>
                Passer la nuit
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "reveal" && results[revealIndex] && (
          <RevealPanel
            key={`reveal-${nuit}-${revealIndex}`}
            resultat={results[revealIndex]}
            spot={emplacements[results[revealIndex].spotIndex]}
            index={revealIndex}
            total={results.length}
            objectif={objectif}
            onRepondre={repondre}
            onContinuer={continuer}
          />
        )}

        {phase === "bilan" && (
          <motion.div key="bilan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mx-auto max-w-md text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-ocre-400">Fin de la nuit {nuit}</p>
              <div
                className={`mt-3 rounded-md border p-4 ${
                  objectifAtteint
                    ? "border-ocre-400/60 bg-ocre-500/15"
                    : "border-terre-400/40 bg-terre-500/10"
                }`}
              >
                <p className="font-serif text-sm text-parchemin-200/80">
                  Le carnet réclamait : <em>{objectif.demande}</em>
                </p>
                <p className="mt-1 font-serif text-lg">
                  {objectifAtteint ? (
                    <span className="text-ocre-300">Objectif atteint · +{objectif.bonus}</span>
                  ) : (
                    <span className="text-terre-300">Objectif manqué</span>
                  )}
                </p>
              </div>
              <p className="mt-3 font-serif">
                Score : <strong>{score}</strong> · Mammifères recensés : <strong>{mammiferes}</strong>
              </p>
              <Button onClick={nuitSuivante} className="mt-4">
                {nuit < NUITS_TOTAL ? "Nuit suivante" : "Refermer le carnet"}
              </Button>
            </div>
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

function CarnetBanner({ objectif }: { objectif: ObjectifCarnet }) {
  return (
    <div className="mb-3 rounded-md border border-ocre-400/40 bg-ocre-500/10 px-3 py-2 text-center">
      <p className="font-serif text-sm text-parchemin-100">
        Le carnet réclame cette nuit : <strong className="text-ocre-300">{objectif.demande}</strong>
      </p>
      <p className="font-serif text-xs italic text-parchemin-200/65">{objectif.detail}</p>
    </div>
  );
}

function RevealPanel({
  resultat,
  spot,
  index,
  total,
  objectif,
  onRepondre,
  onContinuer,
}: {
  resultat: TunnelResultat;
  spot: Emplacement;
  index: number;
  total: number;
  objectif: ObjectifCarnet;
  onRepondre: (m: MorphoId) => void;
  onContinuer: () => void;
}) {
  const morpho = MORPHOGROUPES[resultat.morpho];
  const repondu = resultat.reponse !== null;
  const correct = resultat.reponse === resultat.morpho;
  const vide = resultat.morpho === "vide";
  const traitsKeys: TraitKey[] = ["doigts", "griffes", "taille"];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <p className="mb-2 text-center font-serif text-xs text-parchemin-200/65">
        Carnet : {objectif.demande} — Tunnel {index + 1} / {total}, {spot.habitat.nom}
      </p>

      <div className="mx-auto flex max-w-sm flex-col items-center rounded-md border border-parchemin-200/15 bg-black/50 p-5">
        <p className="text-[10px] uppercase tracking-widest text-ocre-400">
          {repondu ? "Empreinte confirmée" : "Empreinte relevée"}
        </p>
        <div className="my-2">
          {repondu || vide ? <Patte morpho={resultat.morpho} /> : <Smudge />}
        </div>

        {vide && (
          <p className="text-center font-serif text-sm italic text-parchemin-200/70">
            Tunnel vide. La nuit fut discrète.
          </p>
        )}

        {!vide && (
          <div className="w-full">
            <p className="mb-1 text-center font-serif text-xs italic text-parchemin-200/60">
              {repondu ? "Relevé complet" : "Relevé partiel — deux indices sur trois"}
            </p>
            <ul className="space-y-0.5 font-serif text-sm">
              {traitsKeys.map((k) => {
                const lisible = repondu || resultat.traits.includes(k);
                return (
                  <li key={k} className="flex justify-between gap-3">
                    <span className="text-parchemin-200/60">{TRAIT_LABEL[k]}</span>
                    <span className={lisible ? "text-parchemin-100" : "text-parchemin-200/35"}>
                      {lisible ? morpho.traits[k] : "— brouillé —"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Identification — noms seuls, aucune image-réponse */}
      {!vide && !repondu && (
        <div className="mx-auto mt-3 grid max-w-sm grid-cols-2 gap-2">
          {IDENTIFIABLES.map((id) => (
            <button
              key={id}
              onClick={() => onRepondre(id)}
              className="rounded-md border border-parchemin-200/15 bg-mousse-950/40 px-3 py-3 font-serif text-sm transition hover:border-ocre-400/60"
            >
              {MORPHOGROUPES[id].nom}
            </button>
          ))}
        </div>
      )}

      {(repondu || vide) && (
        <div className="mx-auto mt-3 max-w-sm text-center font-serif">
          {!vide && (
            <p className={correct ? "text-ocre-300" : "text-terre-300"}>
              {correct
                ? `Bien déduit : ${morpho.nom}. +${morpho.points}`
                : `C'était : ${morpho.nom}. Empreinte mal lue.`}
            </p>
          )}
          <p className="mt-1 text-xs italic text-parchemin-200/65">{morpho.indice}</p>
          <Button onClick={onContinuer} className="mt-3">
            {index < total - 1 ? "Tunnel suivant" : "Refermer la nuit"}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
