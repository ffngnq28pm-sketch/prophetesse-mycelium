"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { niveaux, getNiveauPour, getProchainNiveau } from "@/data/niveaux";
import { totems, getTotem } from "@/data/totems";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { cn } from "@/lib/utils";

export default function ProgressionPage() {
  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          L'Échelle du Mycélium
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Neuf paliers vers la Maturité Sacrée
        </h1>
        <Ornement />
        <p className="font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « De la Spore Égarée au Mycélium Incarné. Tu as toute une vie. »
        </p>
      </header>
      <Hydrated>
        <Contenu />
      </Hydrated>
    </div>
  );
}

function Contenu() {
  const graines = useStore((s) => s.graines);
  const totem = useStore((s) => s.totem);
  const niveauActuel = useMemo(() => getNiveauPour(graines), [graines]);
  const prochain = useMemo(() => getProchainNiveau(graines), [graines]);
  const totemData = getTotem(totem);

  const progression = prochain
    ? Math.min(100, ((graines - niveauActuel.seuil) / (prochain.seuil - niveauActuel.seuil)) * 100)
    : 100;

  return (
    <div className="space-y-5">
      <Card>
        <CardSubtitle>Tu es actuellement</CardSubtitle>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-3xl text-ocre-600 dark:text-ocre-400">{niveauActuel.embleme}</span>
          <CardTitle>{niveauActuel.titre}</CardTitle>
        </div>
        <p className="mt-3 font-serif text-mousse-800 dark:text-parchemin-100">
          {niveauActuel.description}
        </p>
        <p className="mt-2 font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          Privilège : {niveauActuel.privilege}
        </p>
        <Ornement />
        <div>
          <div className="mb-1 flex justify-between font-sans text-xs uppercase tracking-widest text-mousse-600 dark:text-ocre-400">
            <span>{graines} graines</span>
            <span>
              {prochain ? `${prochain.seuil} → ${prochain.titre}` : "Sommet atteint"}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-mousse-200/60 dark:bg-mousse-900/40">
            <motion.div
              className="h-full bg-gradient-to-r from-mousse-500 via-ocre-500 to-ocre-400"
              initial={{ width: 0 }}
              animate={{ width: `${progression}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>
        {totemData && (
          <p className="mt-4 font-serif text-sm text-mousse-700 dark:text-parchemin-200/80">
            Ton totem : <strong>{totemData.embleme} {totemData.nom}</strong> — {totemData.bonus}
          </p>
        )}
      </Card>

      <section>
        <h2 className="titre-liturgique mb-3 text-xl text-mousse-800 dark:text-parchemin-100">
          Les Neuf Paliers
        </h2>
        <ol className="space-y-3">
          {niveaux.map((n) => {
            const atteint = graines >= n.seuil;
            const actuel = n.id === niveauActuel.id;
            return (
              <li
                key={n.id}
                className={cn(
                  "rounded-lg border p-4 transition",
                  actuel
                    ? "border-ocre-500/60 bg-ocre-500/10 shadow-sm"
                    : atteint
                    ? "border-mousse-500/40 bg-mousse-100/60 dark:bg-mousse-900/30"
                    : "border-mousse-500/20 bg-parchemin-50/60 opacity-60 dark:bg-mousse-900/20"
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="titre-liturgique text-lg text-mousse-800 dark:text-parchemin-100">
                    <span className="mr-2 text-ocre-600 dark:text-ocre-400">{n.embleme}</span>
                    {n.id}. {n.titre}
                  </h3>
                  <Badge variant={atteint ? "grace" : "outline"}>
                    {n.seuil} graines
                  </Badge>
                </div>
                <p className="mt-2 font-serif text-sm text-mousse-800 dark:text-parchemin-100">
                  {n.description}
                </p>
                <p className="mt-1 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/80">
                  {n.privilege}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <h2 className="titre-liturgique mb-3 text-xl text-mousse-800 dark:text-parchemin-100">
          Tous les Totems
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {totems.map((t) => (
            <Card key={t.id} className={cn(t.id === totem && "border-ocre-500/60 bg-ocre-500/5")}>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl" aria-hidden>{t.embleme}</span>
                <CardTitle>{t.nom}</CardTitle>
              </div>
              <p className="mt-2 font-serif text-sm text-mousse-800 dark:text-parchemin-100">
                {t.description}
              </p>
              <p className="mt-2 font-serif text-xs uppercase tracking-widest text-ocre-600 dark:text-ocre-400">
                Vertu : {t.vertu} · {t.bonus}
              </p>
              <p className="mt-3 font-serif text-sm italic leading-relaxed text-mousse-700 dark:text-parchemin-200/80">
                {t.recit}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
