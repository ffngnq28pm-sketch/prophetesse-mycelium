"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardSubtitle } from "@/components/ui/Card";
import { Ornement } from "@/components/liturgical/Ornement";
import { versets } from "@/data/versets";

// Le verset 76 — « Et la Marcheuse entra dans le Père-Lachaise » — s'affiche
// en pleine carte une seule fois par an, au solstice d'été.
const SOLSTICE_MOIS = 6;
const SOLSTICE_JOUR = 21;

function estSolstice(d: Date): boolean {
  return d.getMonth() + 1 === SOLSTICE_MOIS && d.getDate() === SOLSTICE_JOUR;
}

export function SolsticeVerset() {
  const [solstice, setSolstice] = useState(false);

  // Évite l'hydration mismatch : on évalue la date côté client après le mount.
  useEffect(() => {
    setSolstice(estSolstice(new Date()));
  }, []);

  if (!solstice) return null;

  const verset = versets.find((v) => v.id === 76);
  if (!verset) return null;

  const date = new Date();
  const dateAffichee = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      aria-label="Solstice du Verset 76"
    >
      <Card className="relative overflow-hidden border-ocre-500/60 bg-gradient-to-br from-ocre-500/10 via-parchemin-100/40 to-mousse-100/30 dark:from-ocre-500/15 dark:via-mousse-900/40 dark:to-mousse-950/60">
        <div className="text-center">
          <CardSubtitle>Solstice du Verset 76</CardSubtitle>
          <p className="mt-1 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
            {dateAffichee}
          </p>
          <Ornement />
          <p className="mx-auto max-w-2xl font-serif text-2xl italic leading-relaxed text-mousse-900 md:text-3xl dark:text-parchemin-100">
            « {verset.texte} »
          </p>
          <p className="mt-3 font-serif text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
            {verset.livre} · {verset.reference}
          </p>
          <Ornement />
          <p className="mx-auto max-w-md font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
            Aujourd'hui, l'Ordre lit le Verset 76 à voix haute. Sors un instant si tu le peux, et regarde un Lichen. C'est tout.
          </p>
        </div>
      </Card>
    </motion.section>
  );
}
