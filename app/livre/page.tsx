import Link from "next/link";
import { livres } from "@/data/livre-sacre";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Ornement } from "@/components/liturgical/Ornement";
import { Badge } from "@/components/ui/Badge";

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
