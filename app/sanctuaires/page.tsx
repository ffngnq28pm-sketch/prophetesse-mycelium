"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { sanctuaires, Sanctuaire } from "@/data/sanctuaires";
import { useStore } from "@/lib/store";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { HelpButton } from "@/components/liturgical/HelpButton";
import { CheckCircle2 } from "lucide-react";

export default function SanctuairesPage() {
  const [selected, setSelected] = useState<Sanctuaire>(sanctuaires[0]);
  const visiterSanctuaire = useStore((s) => s.visiterSanctuaire);
  const sanctuairesVisites = useStore((s) => s.sanctuairesVisites);
  useEffect(() => {
    visiterSanctuaire(selected.id);
  }, [selected.id, visiterSanctuaire]);

  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Carte des Sanctuaires
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Cimetières d'Île-de-France
        </h1>
        <Ornement />
        <p className="font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Le cimetière est la dernière forêt urbaine que personne ne défriche. »
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Badge variant="grace">{sanctuairesVisites.length} / {sanctuaires.length} sanctuaires visités</Badge>
          <HelpButton titre="Sanctuaires — Que faire ici ?">
            <p>Huit cimetières emblématiques d'Île-de-France, hauts lieux de biodiversité urbaine. Pour les <strong>visiter</strong> au sens de l'application, il suffit de cliquer sur leur nom dans la carte ou la liste. La fiche s'affiche, le sanctuaire est marqué visité. Visiter les 8 valide l'objectif du Chapitre IV de La Voie.</p>
            <p className="mt-2">Mais l'idéal, évidemment, est d'y aller pour de vrai un dimanche. Apporter un carnet. Compter les espèces.</p>
          </HelpButton>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="md:col-span-3">
          <Card>
            <CardSubtitle>Plan des hauts lieux mycéliens</CardSubtitle>
            <div className="mt-3 overflow-hidden rounded-lg border border-ocre-500/30 bg-gradient-to-br from-mousse-900 via-mousse-800 to-mousse-950 dark:from-mousse-950 dark:via-mousse-900 dark:to-black">
              <svg viewBox="0 0 800 700" className="h-auto w-full">
                <defs>
                  <radialGradient id="halo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#c9a227" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
                  </radialGradient>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(201,162,39,0.07)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="800" height="700" fill="url(#grid)" />
                {/* Seine stylisée */}
                <path
                  d="M 50 280 Q 150 260 250 310 T 450 320 Q 550 330 650 380 T 800 420"
                  fill="none"
                  stroke="rgba(124,170,255,0.3)"
                  strokeWidth="3"
                />
                <path
                  d="M 50 285 Q 150 265 250 315 T 450 325 Q 550 335 650 385 T 800 425"
                  fill="none"
                  stroke="rgba(124,170,255,0.18)"
                  strokeWidth="6"
                />
                {/* Périphérique stylisé */}
                <ellipse
                  cx="500"
                  cy="350"
                  rx="200"
                  ry="160"
                  fill="none"
                  stroke="rgba(201,162,39,0.18)"
                  strokeDasharray="3 6"
                />
                <text
                  x="500"
                  y="180"
                  textAnchor="middle"
                  fill="rgba(201,162,39,0.45)"
                  fontSize="10"
                  fontFamily="serif"
                  letterSpacing="6"
                >
                  PARIS
                </text>
                {/* Marqueurs */}
                {sanctuaires.map((s) => (
                  <g
                    key={s.id}
                    onClick={() => setSelected(s)}
                    style={{ cursor: "pointer" }}
                  >
                    {selected.id === s.id && (
                      <circle cx={s.x} cy={s.y} r="36" fill="url(#halo)" />
                    )}
                    <circle
                      cx={s.x}
                      cy={s.y}
                      r={selected.id === s.id ? 10 : 7}
                      fill="#c9a227"
                      stroke="#f4ecd2"
                      strokeWidth="1.5"
                    >
                      <animate
                        attributeName="r"
                        values={selected.id === s.id ? "10;13;10" : "7;7;7"}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <text
                      x={s.x}
                      y={s.y + 24}
                      textAnchor="middle"
                      fill="#f4ecd2"
                      fontSize="11"
                      fontFamily="serif"
                      opacity={selected.id === s.id ? 1 : 0.65}
                    >
                      {s.nom}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <p className="mt-3 text-center font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
              Carte stylisée — pour la navigation effective, sors avec un plan de ta commune et tes pieds.
            </p>
          </Card>
        </div>

        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2"
        >
          <Card>
            <CardSubtitle>{selected.commune}</CardSubtitle>
            <CardTitle>{selected.nom}</CardTitle>
            <Badge variant="grace" className="mt-2">
              {selected.superficie}
            </Badge>
            <Ornement />
            <p className="font-serif text-mousse-900 dark:text-parchemin-100">
              {selected.description}
            </p>
            <p className="mt-3 font-serif text-xs uppercase tracking-widest text-ocre-600 dark:text-ocre-400">
              Espèces emblématiques
            </p>
            <p className="mt-1 font-serif text-sm text-mousse-800 dark:text-parchemin-100">
              {selected.especes}
            </p>
            <p className="mt-3 font-serif text-xs uppercase tracking-widest text-ocre-600 dark:text-ocre-400">
              Mode de pèlerinage
            </p>
            <p className="mt-1 font-serif italic text-mousse-800 dark:text-parchemin-100">
              {selected.pelerinage}
            </p>
            <Ornement />
            <p className="font-serif text-xs uppercase tracking-widest text-ocre-600 dark:text-ocre-400">
              Anecdote mycélienne
            </p>
            <p className="mt-1 font-serif text-sm leading-relaxed text-mousse-800 dark:text-parchemin-100">
              {selected.anecdote}
            </p>
          </Card>
        </motion.div>
      </div>

      <Card className="mt-5">
        <CardSubtitle>Liste alphabétique</CardSubtitle>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          {[...sanctuaires]
            .sort((a, b) => a.nom.localeCompare(b.nom))
            .map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className="rounded-md border border-mousse-500/20 px-3 py-2 text-left font-serif text-sm transition hover:border-ocre-500/40 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40"
              >
                <span className="text-mousse-800 dark:text-parchemin-100">{s.nom}</span>
                <span className="ml-2 text-xs text-mousse-600 dark:text-parchemin-200/60">
                  {s.commune}
                </span>
              </button>
            ))}
        </div>
      </Card>
    </div>
  );
}
