"use client";

import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { CHAPITRES } from "@/data/voie";
import { computeProgress, currentChapitreIndex } from "@/lib/voie-progress";
import { niveaux } from "@/data/niveaux";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { CheckCircle2, Lock, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VoiePage() {
  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          La Voie Mycélienne
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Neuf chapitres pour une vie
        </h1>
        <Ornement />
        <p className="mx-auto max-w-xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Le mycélium ne juge pas la régularité humaine. Il décompose, ce qui revient au même mais en plus lent et plus utile. »
        </p>
      </header>
      <Hydrated>
        <Contenu />
      </Hydrated>
    </div>
  );
}

function Contenu() {
  const state = useStore();
  const progress = useMemo(() => computeProgress(state), [state]);
  const currentIdx = currentChapitreIndex(progress);
  const marquerComplete = useStore((s) => s.marquerChapitreComplete);
  const marquerClaimed = useStore((s) => s.marquerChapitreClaimed);
  const ajouterGraines = useStore((s) => s.ajouterGraines);

  // Auto-complétion + récompense
  useEffect(() => {
    for (const p of progress) {
      if (p.complete && !state.chapitres[p.chapitre.id]?.completed) {
        marquerComplete(p.chapitre.id);
      }
      if (p.complete && !p.claimed && p.chapitre.recompenseGraines > 0) {
        ajouterGraines(p.chapitre.recompenseGraines);
        marquerClaimed(p.chapitre.id);
      } else if (p.complete && !p.claimed && p.chapitre.recompenseGraines === 0) {
        marquerClaimed(p.chapitre.id);
      }
    }
  }, [progress, state.chapitres, marquerComplete, marquerClaimed, ajouterGraines]);

  return (
    <div className="relative space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardSubtitle>Palier actuel</CardSubtitle>
          <CardTitle>{niveaux[Math.min(niveaux.length - 1, currentIdx)]?.titre ?? niveaux[0].titre}</CardTitle>
          <p className="mt-2 font-serif text-xs text-mousse-700 dark:text-parchemin-200/70">
            {niveaux[Math.min(niveaux.length - 1, currentIdx)]?.embleme} {niveaux[Math.min(niveaux.length - 1, currentIdx)]?.privilege}
          </p>
        </Card>
        <Card>
          <CardSubtitle>Chapitres franchis</CardSubtitle>
          <p className="mt-1 font-serif text-3xl text-mousse-800 dark:text-parchemin-100">
            {progress.filter((p) => p.complete).length} / {CHAPITRES.length}
          </p>
        </Card>
        <Card>
          <CardSubtitle>Graines de Grâce</CardSubtitle>
          <p className="mt-1 font-serif text-3xl text-mousse-800 dark:text-parchemin-100">{state.graines}</p>
          <p className="font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">À planter au Jardin.</p>
        </Card>
      </div>

      <ol className="space-y-3">
        {progress.map((p, idx) => (
          <ChapitreCard
            key={p.chapitre.id}
            progress={p}
            current={idx === currentIdx}
          />
        ))}
      </ol>
    </div>
  );
}

function ChapitreCard({
  progress,
  current,
}: {
  progress: ReturnType<typeof computeProgress>[number];
  current: boolean;
}) {
  const { chapitre, objectifs, complete, unlocked } = progress;
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "transition",
          !unlocked && "opacity-50",
          complete && "border-mousse-600/60 bg-mousse-100/50 dark:bg-mousse-900/40",
          current && unlocked && !complete && "border-ocre-500/60 bg-ocre-500/5 shadow"
        )}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-center gap-2">
            {!unlocked ? (
              <Lock size={16} className="text-mousse-500" />
            ) : complete ? (
              <CheckCircle2 size={18} className="text-mousse-700 dark:text-ocre-400" />
            ) : (
              <Sprout size={18} className="text-ocre-600 dark:text-ocre-400" />
            )}
            <CardTitle>{chapitre.titre}</CardTitle>
          </div>
          <Badge variant={complete ? "grace" : "outline"}>
            {complete ? "Franchi" : current ? "En cours" : unlocked ? "Disponible" : "Verrouillé"}
          </Badge>
        </div>
        <p className="mt-1 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
          {chapitre.sousTitre}
        </p>
        {(current && unlocked) || complete ? (
          <>
            <Ornement />
            <p className="font-serif text-mousse-900 dark:text-parchemin-100 lettrine">
              {chapitre.paragrapheOuverture}
            </p>
            {chapitre.objectifs.length > 0 && (
              <ul className="mt-4 space-y-2">
                {objectifs.map((o) => (
                  <li
                    key={o.objectif.id}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-md border px-3 py-2 font-serif text-sm transition",
                      o.complete
                        ? "border-mousse-500/40 bg-mousse-100/60 dark:bg-mousse-900/40"
                        : "border-mousse-500/20"
                    )}
                  >
                    <div>
                      <p className="text-mousse-800 dark:text-parchemin-100">
                        {o.complete ? "✓ " : "○ "}
                        {o.objectif.label}
                      </p>
                      <p className="text-xs text-mousse-600 dark:text-parchemin-200/70">
                        {o.objectif.description}
                      </p>
                    </div>
                    <Badge variant={o.complete ? "grace" : "outline"}>
                      {Math.min(o.valeur, o.objectif.cible)} / {o.objectif.cible}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 font-serif text-sm text-mousse-700 dark:text-parchemin-200/80">
              <strong>Récompense :</strong> {chapitre.recompenseLabel}
            </p>
            {complete && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/voie" className="hidden" aria-hidden />
                {chapitre.id === 9 && (
                  <Link href="/voie/epilogue" className="btn-sacre">
                    Lire l'Épilogue Secret
                  </Link>
                )}
              </div>
            )}
          </>
        ) : null}
      </Card>
    </motion.li>
  );
}
