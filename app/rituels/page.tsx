"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { offices } from "@/data/rituels";
import { useStore } from "@/lib/store";
import { todayKey, formatDate } from "@/lib/utils";
import { computeStreak, streakJalon } from "@/lib/streak";
import { Card, CardSubtitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { Sun, Sparkles, Flame } from "lucide-react";

export default function RituelsPage() {
  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Les Sept Offices Verts
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Liturgie des Heures
        </h1>
        <Ornement />
        <p className="font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Sept fois le jour, le mycélium te touche. Sept fois, dis oui. »
        </p>
      </header>
      <Hydrated>
        <RituelsContent />
      </Hydrated>
    </div>
  );
}

function RituelsContent() {
  const key = useMemo(() => todayKey(), []);
  const ajouterGraines = useStore((s) => s.ajouterGraines);
  const cocher = useStore((s) => s.cocherRituel);
  const decocher = useStore((s) => s.decocherRituel);
  const retirerGraines = useStore((s) => s.retirerGraines);
  const jour = useStore((s) => s.rituelsParJour[key] ?? {});
  const rituelsParJour = useStore((s) => s.rituelsParJour);
  const totalGraines = useStore((s) => s.graines);
  const [recentReward, setRecentReward] = useState<number | null>(null);

  const streak = useMemo(() => computeStreak(rituelsParJour), [rituelsParJour]);
  const jalon = streakJalon(streak.actuel);
  const accomplis = Object.values(jour).filter(Boolean).length;
  const totalDuJour = offices.reduce(
    (acc, o) => acc + (jour[o.id] ? o.graines : 0),
    0
  );

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardSubtitle>{formatDate(new Date())}</CardSubtitle>
            <p className="mt-1 font-serif text-mousse-800 dark:text-parchemin-100">
              Offices accomplis aujourd'hui : <strong>{accomplis}</strong> / 7
            </p>
            {accomplis === 0 && (
              <p className="mt-1 font-serif text-xs italic text-mousse-600 dark:text-parchemin-200/70">
                Aucun office accompli. C'est, statistiquement, le bon moment pour en accomplir un.
              </p>
            )}
            {accomplis === 7 && (
              <p className="mt-1 font-serif text-xs italic text-ocre-700 dark:text-ocre-400">
                Sept offices, sept bénédictions. Sœur Compost hoche la tête. Mère Mycorhize aussi, depuis quelque part dans le mycélium.
              </p>
            )}
            <p className="mt-2 font-serif text-sm text-mousse-800 dark:text-parchemin-100">
              <Flame size={14} className="mr-1 inline text-ocre-600 dark:text-ocre-400" />
              Série en cours : <strong>{streak.actuel}</strong> jour{streak.actuel > 1 ? "s" : ""} d'affilée
              {jalon && (
                <>
                  {" · "}
                  <span className="text-ocre-700 dark:text-ocre-400">{jalon}</span>
                </>
              )}
              {streak.record > streak.actuel && (
                <span className="text-mousse-600 dark:text-parchemin-200/70"> · record : {streak.record}</span>
              )}
            </p>
            {streak.actuel > 0 && !streak.aujourdhuiFait && (
              <p className="mt-1 font-serif text-xs italic text-ocre-700 dark:text-ocre-400">
                Accomplis au moins un office aujourd'hui pour ne pas rompre la série.
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="grace">
              <Sparkles size={14} /> {totalDuJour} graines aujourd'hui
            </Badge>
            <Badge variant="outline">Total : {totalGraines}</Badge>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {recentReward !== null && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-md border border-ocre-500/40 bg-ocre-500/10 p-3 text-center font-serif text-ocre-700 dark:text-ocre-400"
          >
            + {recentReward} Graines de Grâce. Bénie sois-tu.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-3">
        {offices.map((o) => {
          const accompli = !!jour[o.id];
          return (
            <Card
              key={o.id}
              className={accompli ? "border-ocre-500/60 bg-ocre-500/5 dark:bg-ocre-500/10" : ""}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-2xl text-ocre-600 dark:text-ocre-400">
                    {o.embleme}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <h3 className="titre-liturgique text-xl text-mousse-800 dark:text-parchemin-100">
                        {o.nom}
                      </h3>
                      <span className="font-serif text-xs uppercase tracking-widest text-ocre-600 dark:text-ocre-400">
                        <Sun size={12} className="inline" /> {o.heure}
                      </span>
                    </div>
                    <p className="mt-2 font-serif text-mousse-800 dark:text-parchemin-100">
                      {o.geste}
                    </p>
                    {accompli && (
                      <p className="mt-2 font-serif italic text-mousse-700 dark:text-parchemin-200/80">
                        « {o.benediction} »
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="grace">+{o.graines}</Badge>
                  {accompli ? (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        decocher(key, o.id);
                        retirerGraines(o.graines);
                      }}
                    >
                      Annuler
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (cocher(key, o.id)) {
                          ajouterGraines(o.graines);
                          setRecentReward(o.graines);
                          setTimeout(() => setRecentReward(null), 2200);
                        }
                      }}
                    >
                      Accomplir
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardSubtitle>Bénédiction de fin de journée</CardSubtitle>
        <p className="mt-3 font-serif italic text-mousse-800 dark:text-parchemin-100">
          « Que les sept offices accomplis t'enracinent davantage. Et si tu n'en
          as accompli qu'un, qu'il soit ce ferment qui lèvera demain. Que la
          Sève soit avec toi. »
        </p>
      </Card>
    </div>
  );
}
