import type { Metadata } from "next";
import { Ornement } from "@/components/liturgical/Ornement";
import { UniversiteAvancement } from "@/components/friches/UniversiteAvancement";

export const metadata: Metadata = {
  title: "L'Université des Friches",
  description:
    "Apprendre vraiment l'écologie et le respect du vivant : facultés, leçons, quiz, et un grade qui monte de la spore à la Marcheuse.",
};

export default function UniversitePage() {
  return (
    <div>
      <header className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Apprendre le vivant
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          L'Université des Friches
        </h1>
        <Ornement />
        <p className="mx-auto max-w-2xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « On y apprend vraiment l'écologie et le respect du vivant. Des facultés, des leçons, un
          quiz par leçon. Maîtriser des leçons fait monter ton grade — de la spore à la Marcheuse.
          On s'émerveille, mais on ne raconte pas d'histoires : quand un sujet est débattu, on le dit. »
        </p>
      </header>
      <UniversiteAvancement />
    </div>
  );
}
