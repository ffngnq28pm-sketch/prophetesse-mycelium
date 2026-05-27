import Link from "next/link";
import { livres } from "@/data/livre-sacre";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Ornement } from "@/components/liturgical/Ornement";
import { HelpButton } from "@/components/liturgical/HelpButton";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Le Livre Sacré",
  description:
    "Évangiles Verts en six livres : Genèse Mycélienne, Hérésies, Vertus, Paraboles, Lamentations sur la Dosette, Calendrier liturgique.",
};

export default function LivrePage() {
  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Évangiles Verts
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Le Livre Sacré
        </h1>
        <Ornement />
        <p className="mx-auto max-w-xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Six livres pour ceux qui veulent comprendre. Lis-en un par lune, et tu auras achevé l'année. »
        </p>
        <div className="mt-3 flex justify-center">
          <HelpButton titre="Le Livre Sacré — Que faire ici ?">
            <p>Six livres, dans lesquels tu peux entrer sans ordre obligatoire. La <strong>Genèse Mycélienne</strong> (Livre I) raconte le mythe fondateur. Les <strong>Hérésies</strong> (II) et les <strong>Vertus</strong> (III) en sont les piliers. Les <strong>Paraboles</strong> (IV) et les <strong>Lamentations</strong> (V) sont les pièces littéraires les plus longues — à lire le matin, à voix haute si possible.</p>
            <p className="mt-2">Plusieurs chapitres déverrouillent des objectifs de La Voie (lire la Genèse, lire les Hérésies, lire les Vertus, lire 7 paraboles, lire les Lamentations). Pas de score : il suffit d'ouvrir le chapitre pour qu'il compte comme lu.</p>
            <p className="mt-2">Les notes de bas de page sont des digressions assumées. C'est de la liturgie qui se permet l'aparté.</p>
          </HelpButton>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {livres.map((l) => (
          <Link key={l.id} href={`/livre/${l.id}`}>
            <Card className="h-full transition hover:border-ocre-500/60 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40">
              <CardSubtitle>Livre {l.numero}</CardSubtitle>
              <CardTitle>{l.titre.replace(/^Livre [IVX]+ — /, "")}</CardTitle>
              <p className="mt-2 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
                {l.sousTitre}
              </p>
              <Ornement />
              <p className="font-serif text-sm text-mousse-800 dark:text-parchemin-100 line-clamp-4">
                {l.introduction}
              </p>
              <div className="mt-3">
                <Badge variant="grace">{l.chapitres.length} chapitres</Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
