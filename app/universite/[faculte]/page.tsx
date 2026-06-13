import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FACULTES, getFaculte } from "@/data/friches";
import { Ornement } from "@/components/liturgical/Ornement";
import { FaculteLecons } from "@/components/friches/FaculteLecons";

export function generateStaticParams() {
  return FACULTES.map((f) => ({ faculte: f.id }));
}

export function generateMetadata({ params }: { params: { faculte: string } }): Metadata {
  const f = getFaculte(params.faculte);
  return { title: f ? `${f.titre} — Université des Friches` : "Faculté" };
}

export default function FacultePage({ params }: { params: { faculte: string } }) {
  const f = getFaculte(params.faculte);
  if (!f) return notFound();

  return (
    <div>
      <Link
        href="/universite"
        className="mb-4 inline-flex items-center gap-1 font-serif text-sm text-mousse-700 hover:text-ocre-600 dark:text-parchemin-200/80"
      >
        <ChevronLeft size={16} /> Retour à l'Université
      </Link>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">Faculté</p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          {f.titre}
        </h1>
        <Ornement />
        <p className="mx-auto max-w-2xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          {f.resume}
        </p>
      </header>
      <div className="mx-auto max-w-2xl">
        <FaculteLecons faculteId={f.id} lecons={f.lecons} />
      </div>
    </div>
  );
}
