import Link from "next/link";
import { notFound } from "next/navigation";
import { getLivre, livres } from "@/data/livre-sacre";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Ornement } from "@/components/liturgical/Ornement";
import { ChevronLeft, BookOpen } from "lucide-react";

export function generateStaticParams() {
  return livres.map((l) => ({ livre: l.id }));
}

export default function LivreDetail({ params }: { params: { livre: string } }) {
  const livre = getLivre(params.livre);
  if (!livre) return notFound();

  return (
    <div>
      <Link
        href="/livre"
        className="mb-4 inline-flex items-center gap-1 font-serif text-sm text-mousse-700 hover:text-ocre-600 dark:text-parchemin-200/80"
      >
        <ChevronLeft size={16} /> Retour au Livre Sacré
      </Link>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Livre {livre.numero}
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          {livre.titre.replace(/^Livre [IVX]+ — /, "")}
        </h1>
        <p className="mt-2 font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          {livre.sousTitre}
        </p>
        <Ornement />
      </header>

      <Card className="mb-5">
        <CardSubtitle>Introduction</CardSubtitle>
        <p className="mt-3 font-serif text-mousse-900 dark:text-parchemin-100 lettrine">
          {livre.introduction}
        </p>
      </Card>

      <div className="grid gap-3">
        {livre.chapitres.map((c) => (
          <Link key={c.id} href={`/livre/${livre.id}/${c.id}`}>
            <Card className="transition hover:border-ocre-500/60 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40">
              <div className="flex items-baseline justify-between gap-2">
                <CardTitle>{c.titre}</CardTitle>
                <BookOpen size={16} className="text-ocre-600 dark:text-ocre-400" />
              </div>
              {c.ouverture && (
                <p className="mt-2 font-serif italic text-mousse-700 dark:text-parchemin-200/80">
                  {c.ouverture}
                </p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
