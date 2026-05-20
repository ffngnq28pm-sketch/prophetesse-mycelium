"use client";

import { useMemo } from "react";
import { calendrier, getProchainFete } from "@/data/calendrier";
import { useStore } from "@/lib/store";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { HelpButton } from "@/components/liturgical/HelpButton";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MOIS = ["", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

export default function CalendrierPage() {
  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Calendrier Liturgique
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Les Douze Fêtes de l'Ordre
        </h1>
        <Ornement />
        <p className="font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Le calendrier liturgique n'est pas un emploi du temps. C'est une partition. »
        </p>
      </header>
      <Hydrated>
        <Contenu />
      </Hydrated>
    </div>
  );
}

function Contenu() {
  const prochaine = useMemo(() => getProchainFete(), []);
  const { fetesCelebrees, celebrerFete, ajouterGraines } = useStore();

  const handleCelebrer = (id: string) => {
    if (fetesCelebrees.includes(id)) return;
    celebrerFete(id);
    ajouterGraines(15);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant="grace">{fetesCelebrees.length} / 12 fêtes célébrées</Badge>
        <HelpButton titre="Calendrier — Que faire ici ?">
          <p>
            Douze fêtes liturgiques rythment l'année de l'Ordre. Pour <strong>célébrer</strong> une fête, lis sa fiche (clique sur le bouton « Célébrer ») : cela t'octroie 15 Graines de Grâce, et valide l'avancement vers les chapitres VI et VII de La Voie (qui demandent 2 puis 5 fêtes célébrées).
          </p>
          <p className="mt-2">
            Tu n'es pas obligé·e d'attendre la date exacte d'une fête pour la célébrer. La Sainte Mycélienne ne juge pas la régularité humaine.
          </p>
        </HelpButton>
      </div>

      {prochaine && (
        <Card className="border-ocre-500/60 bg-ocre-500/5">
          <CardSubtitle>À venir prochainement</CardSubtitle>
          <div className="flex flex-wrap items-baseline gap-3">
            <CardTitle>{prochaine.nom}</CardTitle>
            <Badge variant="grace">
              {prochaine.jour} {MOIS[prochaine.mois]}
              {prochaine.moisFin ? ` → ${prochaine.jourFin} ${MOIS[prochaine.moisFin]}` : ""}
            </Badge>
          </div>
          <p className="mt-2 font-serif text-mousse-900 dark:text-parchemin-100">{prochaine.description}</p>
          <p className="mt-2 font-serif italic text-mousse-700 dark:text-parchemin-200/80">
            Rituel : {prochaine.rituel}
          </p>
        </Card>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {calendrier.map((f) => {
          const celebree = fetesCelebrees.includes(f.id);
          return (
            <Card
              key={f.id}
              className={cn(
                f.type === "majeure" && "border-ocre-500/40",
                f.type === "pelerinage" && "border-mousse-700/50 bg-mousse-100/60 dark:bg-mousse-900/50",
                f.type === "jeune" && "border-terre-500/50",
                celebree && "border-mousse-600/60 bg-mousse-100/40 dark:bg-mousse-900/60"
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <CardTitle>{f.nom}</CardTitle>
                <Badge variant="outline">
                  {f.jour} {MOIS[f.mois]}
                  {f.moisFin ? ` — ${f.jourFin} ${MOIS[f.moisFin]}` : ""}
                </Badge>
              </div>
              <span className="font-serif text-xs uppercase tracking-widest text-ocre-600 dark:text-ocre-400">
                {f.type === "majeure" ? "✷ Fête majeure" : f.type === "pelerinage" ? "✦ Pèlerinage" : f.type === "jeune" ? "☉ Jeûne" : "· Fête mineure"}
              </span>
              <p className="mt-2 font-serif text-mousse-900 dark:text-parchemin-100">{f.description}</p>
              <Ornement />
              <p className="font-serif italic text-mousse-700 dark:text-parchemin-200/80">Rituel : {f.rituel}</p>
              <div className="mt-3">
                {celebree ? (
                  <Badge variant="grace">
                    <CheckCircle2 size={12} /> Célébrée
                  </Badge>
                ) : (
                  <Button onClick={() => handleCelebrer(f.id)} variant="ghost">
                    <Sparkles size={14} /> Célébrer (+15 graines)
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
