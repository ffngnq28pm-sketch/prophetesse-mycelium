import Link from "next/link";
import { notFound } from "next/navigation";
import { getLivre, livres } from "@/data/livre-sacre";
import { Card, CardSubtitle } from "@/components/ui/Card";
import { Ornement } from "@/components/liturgical/Ornement";
import { TexteAvecNotes } from "@/components/liturgical/TexteAvecNotes";
import { LectureMarker } from "@/components/liturgical/LectureMarker";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function generateStaticParams() {
  const params: { livre: string; chapitre: string }[] = [];
  for (const l of livres) for (const c of l.chapitres) params.push({ livre: l.id, chapitre: c.id });
  return params;
}

export function generateMetadata({
  params,
}: {
  params: { livre: string; chapitre: string };
}) {
  const livre = getLivre(params.livre);
  if (!livre) return {};
  const chapitre = livre.chapitres.find((c) => c.id === params.chapitre);
  if (!chapitre) return {};
  return {
    title: chapitre.titre.replace(/^Chapitre \d+ — /, ""),
    description:
      chapitre.ouverture?.replace(/^«\s*/, "").replace(/\s*»$/, "") ??
      livre.sousTitre,
  };
}

export default function ChapitreDetail({
  params,
}: {
  params: { livre: string; chapitre: string };
}) {
  const livre = getLivre(params.livre);
  if (!livre) return notFound();
  const idx = livre.chapitres.findIndex((c) => c.id === params.chapitre);
  if (idx === -1) return notFound();
  const chapitre = livre.chapitres[idx];
  const prev = idx > 0 ? livre.chapitres[idx - 1] : null;
  const next = idx < livre.chapitres.length - 1 ? livre.chapitres[idx + 1] : null;
  const paraboleId = params.livre === "paraboles" ? parseInt(params.chapitre.replace("parabole-", ""), 10) : undefined;

  return (
    <article>
      <LectureMarker livreId={livre.id} chapitreId={chapitre.id} paraboleId={paraboleId} />
      <Link
        href={`/livre/${livre.id}`}
        className="mb-4 inline-flex items-center gap-1 font-serif text-sm text-mousse-700 hover:text-ocre-600 dark:text-parchemin-200/80"
      >
        <ChevronLeft size={16} /> {livre.titre.replace(/^Livre [IVX]+ — /, "")}
      </Link>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-ocre-600 dark:text-ocre-400">
          {livre.titre.replace(/^Livre [IVX]+ — /, "Livre " + livre.numero + " — ")}
        </p>
        <h1 className="titre-liturgique mt-2 text-3xl text-mousse-800 md:text-4xl dark:text-parchemin-100">
          {chapitre.titre}
        </h1>
        {chapitre.ouverture && (
          <p className="mt-3 font-serif text-lg italic text-mousse-700 dark:text-parchemin-200/80">
            {chapitre.ouverture}
          </p>
        )}
        <Ornement />
      </header>

      <Card>
        <CardSubtitle>Texte sacré</CardSubtitle>
        <TexteAvecNotes
          texte={chapitre.texte}
          notes={chapitre.notes}
          className="mt-4 max-w-none"
        />
      </Card>

      <nav className="mt-6 flex items-center justify-between gap-3">
        {prev ? (
          <Link
            href={`/livre/${livre.id}/${prev.id}`}
            className="flex items-center gap-1 rounded-md border border-ocre-500/30 px-3 py-2 font-serif text-sm transition hover:border-ocre-500/60 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40"
          >
            <ChevronLeft size={16} /> {prev.titre.replace(/^Chapitre \d+ — /, "")}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/livre/${livre.id}/${next.id}`}
            className="flex items-center gap-1 rounded-md border border-ocre-500/30 px-3 py-2 font-serif text-sm transition hover:border-ocre-500/60 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40"
          >
            {next.titre.replace(/^Chapitre \d+ — /, "")} <ChevronRight size={16} />
          </Link>
        ) : (
          <Link
            href={`/livre/${livre.id}`}
            className="flex items-center gap-1 rounded-md border border-ocre-500/30 px-3 py-2 font-serif text-sm transition hover:border-ocre-500/60 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40"
          >
            Fin du livre — Retour
          </Link>
        )}
      </nav>
    </article>
  );
}
