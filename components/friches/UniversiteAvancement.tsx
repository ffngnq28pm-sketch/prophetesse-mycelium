"use client";

import Link from "next/link";
import { FACULTES, TOTAL_LECONS, calculerGrade } from "@/data/friches";
import { useFriches } from "@/lib/friches-store";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { ChevronRight } from "lucide-react";

export function UniversiteAvancement() {
  const hasHydrated = useFriches((s) => s.hasHydrated);
  const maitrisees = useFriches((s) => s.leconsMaitrisees);
  const reset = useFriches((s) => s.reset);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center font-serif italic text-mousse-700 dark:text-parchemin-200/70">
        « Le mycélium s'éveille… »
      </div>
    );
  }

  const nbMaitrisees = maitrisees.length;
  const fraction = TOTAL_LECONS > 0 ? nbMaitrisees / TOTAL_LECONS : 0;
  const { actuel, suivant, vers } = calculerGrade(fraction);

  return (
    <div className="space-y-5">
      {/* —— Grade actuel + barre vers le suivant —— */}
      <Card>
        <CardSubtitle>Ton grade</CardSubtitle>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <CardTitle>{actuel.nom}</CardTitle>
          <Badge variant="grace">
            {nbMaitrisees}/{TOTAL_LECONS} leçon{nbMaitrisees > 1 ? "s" : ""} maîtrisée{nbMaitrisees > 1 ? "s" : ""}
          </Badge>
        </div>
        {suivant ? (
          <>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-mousse-500/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-mousse-500 to-ocre-500 transition-all"
                style={{ width: `${Math.round(vers * 100)}%` }}
              />
            </div>
            <p className="mt-2 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
              Prochain grade : <strong className="not-italic">{suivant.nom}</strong> ({Math.round(suivant.seuil * 100)} % du cursus publié).
            </p>
          </>
        ) : (
          <p className="mt-3 font-serif italic text-mousse-800 dark:text-parchemin-100">
            Tu as parcouru tout le cursus publié. De nouvelles friches t'attendront.
          </p>
        )}
      </Card>

      {/* —— Liste des facultés —— */}
      <div className="space-y-3">
        {FACULTES.map((f) => {
          const maitri = f.lecons.filter((l) => maitrisees.includes(l.id)).length;
          return (
            <Link key={f.id} href={`/universite/${f.id}`} className="group block">
              <Card className="transition hover:border-ocre-500/60 hover:bg-mousse-100/40 dark:hover:bg-mousse-900/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">{f.titre}</CardTitle>
                    <p className="mt-1 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
                      {f.resume}
                    </p>
                  </div>
                  <ChevronRight
                    size={20}
                    className="mt-1 shrink-0 text-ocre-600 transition group-hover:translate-x-0.5 dark:text-ocre-400"
                  />
                </div>
                <Ornement />
                <Badge variant="outline">
                  {maitri}/{f.lecons.length} leçon{f.lecons.length > 1 ? "s" : ""} maîtrisée{maitri > 1 ? "s" : ""}
                </Badge>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* —— Réinitialiser —— */}
      <div className="pt-2 text-center">
        <button
          onClick={() => {
            if (window.confirm("Réinitialiser toute ta progression à l'Université des Friches ?")) reset();
          }}
          className="font-serif text-xs italic text-mousse-600 underline-offset-2 hover:underline dark:text-parchemin-200/60"
        >
          Réinitialiser ma progression
        </button>
      </div>
    </div>
  );
}
