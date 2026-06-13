import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FACULTES, getFaculte, getLecon } from "@/data/friches";
import { Ornement } from "@/components/liturgical/Ornement";
import { LeconQuiz } from "@/components/friches/LeconQuiz";

export function generateStaticParams() {
  return FACULTES.flatMap((f) => f.lecons.map((l) => ({ faculte: f.id, lecon: l.id })));
}

export function generateMetadata({
  params,
}: {
  params: { faculte: string; lecon: string };
}): Metadata {
  const l = getLecon(params.faculte, params.lecon);
  return { title: l ? `${l.titre} — Université des Friches` : "Leçon" };
}

export default function LeconPage({ params }: { params: { faculte: string; lecon: string } }) {
  const f = getFaculte(params.faculte);
  const l = getLecon(params.faculte, params.lecon);
  if (!f || !l) return notFound();

  return (
    <div>
      <Link
        href={`/universite/${f.id}`}
        className="mb-4 inline-flex items-center gap-1 font-serif text-sm text-mousse-700 hover:text-ocre-600 dark:text-parchemin-200/80"
      >
        <ChevronLeft size={16} /> {f.titre}
      </Link>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          {f.titre}
        </p>
        <h1 className="titre-liturgique mt-2 text-3xl text-mousse-800 dark:text-parchemin-100">
          {l.titre}
        </h1>
        {l.epigraphe && (
          <p className="mx-auto mt-2 max-w-xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
            « {l.epigraphe} »
          </p>
        )}
        <Ornement />
      </header>

      <article className="mx-auto max-w-2xl space-y-4">
        {l.corps.map((p, i) =>
          p.startsWith("À retenir") ? (
            <p
              key={i}
              className="rounded-md border-l-2 border-ocre-500/60 bg-ocre-500/5 py-2 pl-4 pr-3 font-serif text-[1.05rem] italic leading-relaxed text-mousse-900 dark:text-parchemin-100"
            >
              {p}
            </p>
          ) : (
            <p
              key={i}
              className="font-serif text-[1.0625rem] leading-[1.85] text-mousse-900 dark:text-parchemin-100"
            >
              {p}
            </p>
          )
        )}
      </article>

      <div className="mx-auto max-w-2xl">
        <LeconQuiz leconId={l.id} faculteId={f.id} questions={l.quiz} />
      </div>
    </div>
  );
}
