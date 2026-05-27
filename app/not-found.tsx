import Link from "next/link";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Ornement } from "@/components/liturgical/Ornement";

export const metadata = {
  title: "Page compostée",
  description: "Cette page n'existe plus. Le mycélium s'en est nourri.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl">
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Erreur 404
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Cette page s'est compostée
        </h1>
        <Ornement />
      </header>

      <Card>
        <CardSubtitle>Avis du Mycélium</CardSubtitle>
        <CardTitle>Ce n'est pas une erreur</CardTitle>
        <p className="mt-3 font-serif text-mousse-900 dark:text-parchemin-100 lettrine">
          Quelque part dans le réseau souterrain, l'adresse que tu cherchais s'est
          décomposée. C'est exactement le rôle du mycélium : transformer ce qui était
          en humus pour ce qui sera. Tu n'as donc rien perdu — tu as simplement
          assisté à la moitié invisible d'un cycle.
        </p>
        <p className="mt-3 font-serif text-mousse-800 dark:text-parchemin-100">
          Frère Lichen suggère de revenir lentement sur tes pas. Sœur Compost te
          propose plutôt de recommencer depuis le Sanctuaire — c'est, d'expérience,
          plus rapide.
        </p>
        <Ornement />
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-sacre">
            Retour au Sanctuaire
          </Link>
          <Link href="/voie" className="btn-ghost">
            Reprendre la Voie
          </Link>
        </div>
      </Card>

      <p className="mt-6 text-center font-serif text-xs italic text-mousse-600 dark:text-parchemin-200/70">
        Amen-Compost.
      </p>
    </div>
  );
}
