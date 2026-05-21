"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { computeProgress } from "@/lib/voie-progress";
import { VEILLES, getVeilleDuJour } from "@/data/veilles";
import { todayKey } from "@/lib/utils";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { ChevronLeft, Moon } from "lucide-react";

export default function VeillesPage() {
  return (
    <div>
      <Link
        href="/voie"
        className="mb-4 inline-flex items-center gap-1 font-serif text-sm text-mousse-700 hover:text-ocre-600 dark:text-parchemin-200/80"
      >
        <ChevronLeft size={16} /> Retour à La Voie
      </Link>
      <Hydrated>
        <Contenu />
      </Hydrated>
    </div>
  );
}

function Contenu() {
  const state = useStore();
  const observerVeille = useStore((s) => s.observerVeille);
  const [justObserved, setJustObserved] = useState(false);

  const progress = useMemo(() => computeProgress(state), [state]);
  const ch9 = progress.find((p) => p.chapitre.id === 9);

  const veille = useMemo(() => getVeilleDuJour(), []);
  const key = todayKey();
  const observeeAujourdhui = state.veillesObservees.includes(key);
  const total = state.veillesObservees.length;

  if (!ch9 || !ch9.complete) {
    return (
      <Card>
        <CardSubtitle>Accès restreint</CardSubtitle>
        <CardTitle>Les Veilles s'ouvrent après la Voie</CardTitle>
        <p className="mt-3 font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          Les neuf chapitres d'abord. Les Veilles ne sont pas une récompense : elles sont ce qui reste
          quand il n'y a plus rien à débloquer. Le mycélium attendra — c'est, après 400 millions d'années,
          sa principale compétence.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Les Veilles du Mycélium
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          La Voie n'avait qu'un défaut : une fin
        </h1>
        <Ornement />
        <p className="mx-auto max-w-xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Le pèlerinage achevé, il ne reste plus d'objectifs. Il reste les jours. Une veille pour chacun, sans dernier chapitre, sans dernière page. »
        </p>
      </header>

      <Card className="border-ocre-500/50 bg-ocre-500/5">
        <div className="flex items-center justify-between gap-2">
          <CardSubtitle>Veille du jour</CardSubtitle>
          <Badge variant="outline">{total} veille{total > 1 ? "s" : ""} observée{total > 1 ? "s" : ""}</Badge>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <Moon size={20} className="text-ocre-600 dark:text-ocre-400" />
          <CardTitle>{veille.titre}</CardTitle>
        </div>
        <p className="mt-3 font-serif text-mousse-900 dark:text-parchemin-100">{veille.texte}</p>
        <Ornement />
        {observeeAujourdhui ? (
          <p className="font-serif italic text-ocre-700 dark:text-ocre-300">
            Veille observée. Le mycélium ne te félicite pas — il continue, simplement, comme toi.
          </p>
        ) : (
          <Button
            onClick={() => {
              if (observerVeille(key)) {
                setJustObserved(true);
                setTimeout(() => setJustObserved(false), 2600);
              }
            }}
          >
            J'ai observé cette veille
          </Button>
        )}
        <AnimatePresence>
          {justObserved && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 font-serif text-sm italic text-mousse-700 dark:text-ocre-300"
            >
              Une veille de plus. Demain, une autre. Ainsi se décompose le temps.
            </motion.p>
          )}
        </AnimatePresence>
      </Card>

      <section>
        <h2 className="mb-2 titre-liturgique text-xl text-mousse-800 dark:text-parchemin-100">
          Le cycle complet des Veilles
        </h2>
        <p className="mb-3 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/70">
          Vingt-et-une veilles tournent au fil de l'année. Aucune n'est plus importante qu'une autre.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {VEILLES.map((v) => (
            <Card key={v.id} className={v.id === veille.id ? "h-full border-ocre-500/40" : "h-full"}>
              <div className="flex items-baseline justify-between gap-2">
                <CardTitle className="text-base">{v.titre}</CardTitle>
                {v.id === veille.id && <Badge variant="grace">Aujourd'hui</Badge>}
              </div>
              <p className="mt-2 font-serif text-sm text-mousse-800 dark:text-parchemin-100">{v.texte}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
