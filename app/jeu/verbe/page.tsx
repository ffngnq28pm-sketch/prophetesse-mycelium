"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Card, CardSubtitle } from "@/components/ui/Card";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { HelpButton } from "@/components/liturgical/HelpButton";
import { ChevronLeft } from "lucide-react";

// Le jeu est purement client (saisie, localStorage, compte à rebours) :
// on le charge à la demande, sans SSR, pour ne peser que sur cette route.
const LeVerbe = dynamic(() => import("@/components/game/LeVerbe").then((m) => m.LeVerbe), {
  ssr: false,
  loading: () => (
    <div className="mx-auto flex min-h-[40vh] w-full max-w-md items-center justify-center font-serif italic text-mousse-700 dark:text-parchemin-200/70">
      « Le canon se rassemble… »
    </div>
  ),
});

export default function VerbePage() {
  return (
    <div>
      <Link
        href="/jeu"
        className="mb-4 inline-flex items-center gap-1 font-serif text-sm text-mousse-700 hover:text-ocre-600 dark:text-parchemin-200/80"
      >
        <ChevronLeft size={16} /> Retour aux Jeux
      </Link>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Jeu V — Le Verbe du Jour
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Le Verbe du Jour
        </h1>
        <Ornement />
        <p className="mx-auto max-w-2xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Un seul mot par jour, le même pour tout l'Ordre, qui change à minuit. Six lettres, six
          tentatives. Le Verbe à trouver est tiré du canon de l'Ordre — le trouver déverrouille sa révélation. »
        </p>
        <div className="mt-3 flex justify-center">
          <HelpButton titre="Le Verbe du Jour — Règles">
            <p><strong>But</strong> : deviner le Verbe du Jour (6 lettres) en 6 tentatives.</p>
            <p className="mt-1"><strong>Indice</strong> : la première lettre est révélée et pré-remplie.</p>
            <p className="mt-1"><strong>Tentatives</strong> : tu peux tenter n'importe quel mot de six lettres. Seul un essai trop court est refusé (et n'est pas consommé). La réponse, elle, est toujours un mot du canon de l'Ordre.</p>
            <p className="mt-1"><strong>Couleurs</strong> : vert mousse = bonne lettre bien placée ; ambre = bonne lettre mal placée ; taupe = absente. Les trois restent distinguables sans la couleur (bordure pleine épaisse, pointillée, ou aplat mat).</p>
            <p className="mt-1"><strong>Série</strong> : chaque jour gagné d'affilée allonge ta série. Une journée manquée la remet à zéro — sans drame.</p>
            <p className="mt-2 text-xs italic">Saisie au clavier tactile ou physique. Accents et casse sont ignorés.</p>
          </HelpButton>
        </div>
      </header>

      <Hydrated>
        <LeVerbe />
      </Hydrated>

      <Card className="mx-auto mt-6 max-w-md">
        <CardSubtitle>Pourquoi un seul mot par jour ?</CardSubtitle>
        <p className="mt-2 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
          Parce que l'Ordre se méfie de l'abondance. Un Verbe par jour suffit à enraciner une
          parole — le reste n'est qu'impatience, et l'impatience, dit-on, n'a jamais fait pousser
          une graine plus vite.
        </p>
      </Card>
    </div>
  );
}
