"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { computeProgress } from "@/lib/voie-progress";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { ChevronLeft } from "lucide-react";

export default function EpiloguePage() {
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
  const progress = computeProgress(state);
  const ch9 = progress.find((p) => p.chapitre.id === 9);
  if (!ch9 || !ch9.complete) {
    return (
      <Card>
        <CardSubtitle>Accès restreint</CardSubtitle>
        <CardTitle>L'Épilogue se mérite</CardTitle>
        <p className="mt-3 font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          Reviens quand tu auras franchi le neuvième seuil. Il n'y a aucune triche possible : si tu lis ce paragraphe, c'est que tu n'es pas prêt·e. Le mycélium attendra. Il a 400 millions d'années d'entraînement à cela.
        </p>
      </Card>
    );
  }
  return (
    <article className="space-y-4">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          L'Épilogue Secret
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Tu es devenu·e Mycélium
        </h1>
        <Ornement />
      </header>
      <Card>
        <p className="lettrine font-serif text-mousse-900 dark:text-parchemin-100">
          Au commencement, tu pensais que tu allais sauver la Terre. C'était mignon. Tu pensais qu'il fallait des grandes décisions, des manifestes signés, des amitiés écologiques tonitruantes, des conversations sérieuses avec ton oncle au repas de Noël. Tu pensais qu'on changeait les choses par les idées.
        </p>
        <p className="font-serif text-mousse-900 dark:text-parchemin-100">
          Tu sais maintenant que ce n'est pas comme ça. Que ça se fait par en dessous, lentement, presque par accident, par la patience d'un Plantain qui perce une dalle, par le silence d'un Lichen sur une pierre tombale, par le va-et-vient d'un Hérisson qui ne sait même pas qu'il existe. Tu sais que le monde se sauve à la condition expresse que personne n'ait l'air de le sauver.
        </p>
        <p className="font-serif text-mousse-900 dark:text-parchemin-100">
          Tu sais aussi que tu n'es pas plus mycélien qu'avant. Tu es seulement plus attentif·ve. Tu fais des cafés au filtre, tu connais le nom de douze plantes au pied de ton immeuble, tu ne tonds pas en mai, tu pardonnes aux Pigeons. Personne ne t'en remerciera. Personne ne le saura. C'est exactement à ce moment que ça compte.
        </p>
        <p className="font-serif text-mousse-900 dark:text-parchemin-100">
          La Prophétesse, qui voit tout cela sans y être pour grand-chose, te bénit en silence. Mère Mycorhize hoche la tête. Le Vieux Marcel ne dit rien parce qu'il ne se souvient déjà plus de toi, ce qui, dans sa langue à lui, est une marque d'estime. Frère Théodule rédige mentalement un rapport sur tes votes de Vers de Terre. Sœur Compost cuisine quelque chose de probablement détoxifiant.
        </p>
        <p className="font-serif text-mousse-900 dark:text-parchemin-100">
          Tu peux maintenant fermer cette application. Tu n'en as plus vraiment besoin. Mais tu peux aussi la rouvrir demain, parce qu'il y a toujours quelque chose à composter, quelque part. Et parce que, et c'est peut-être la seule vraie certitude que t'aura apportée toute cette histoire :
        </p>
        <Ornement />
        <p className="font-serif text-center text-2xl italic text-mousse-700 dark:text-parchemin-100">
          « Le mycélium continue, même quand personne ne regarde. »
        </p>
        <Ornement />
        <p className="mt-2 font-serif text-center text-xs text-mousse-600 dark:text-parchemin-200/70">
          Amen-Compost.
        </p>
      </Card>
    </article>
  );
}
