import { GLOSSAIRE } from "@/data/glossaire";
import { Ornement } from "@/components/liturgical/Ornement";
import { GlossaireClient } from "@/components/liturgical/GlossaireClient";

export const metadata = {
  title: "Glossaire de l'Ordre",
  description:
    "Le mycélium s'explique. Définitions, noms latins, et tournures liturgiques pour disciples curieux.",
};

export default function GlossairePage() {
  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Glossaire de l'Ordre
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Le mycélium s'explique
        </h1>
        <Ornement />
        <p className="mx-auto max-w-xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « On ne juge pas un disciple qui demande la définition d'un mot. On juge un disciple qui prétend les connaître tous. »
        </p>
      </header>
      <GlossaireClient entries={GLOSSAIRE} />
    </div>
  );
}
