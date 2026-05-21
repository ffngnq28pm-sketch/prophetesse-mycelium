"use client";

import { useStore } from "@/lib/store";
import { RELIQUES, Relique, CategorieRelique } from "@/data/reliques";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";

const CATEGORIES: CategorieRelique[] = ["Jardin", "Jeux", "Liturgie", "Parcours", "Exploration"];

export default function ReliquesPage() {
  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Le Reliquaire de l'Ordre
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Les Reliques du Pèlerinage
        </h1>
        <Ornement />
        <p className="mx-auto max-w-xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Une relique ne récompense rien : elle se contente de se souvenir. Ce qui, à bien y réfléchir, est déjà beaucoup. »
        </p>
      </header>
      <Hydrated>
        <Contenu />
      </Hydrated>
    </div>
  );
}

function Contenu() {
  // Le Reliquaire dépend de presque tout l'état : une souscription large est ici justifiée.
  const state = useStore();
  const obtenues = RELIQUES.filter((r) => r.estObtenue(state));
  const obtenuesIds = new Set(obtenues.map((r) => r.id));

  return (
    <div className="space-y-5">
      <Card className="border-ocre-500/40 bg-ocre-500/5">
        <CardSubtitle>Avancement</CardSubtitle>
        <p className="mt-1 font-serif text-2xl text-mousse-800 dark:text-parchemin-100">
          {obtenues.length} / {RELIQUES.length} reliques recueillies
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-mousse-200/40 dark:bg-mousse-900/40">
          <div
            className="h-full bg-gradient-to-r from-mousse-500 via-ocre-500 to-ocre-400 transition-all"
            style={{ width: `${(obtenues.length / RELIQUES.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
          {obtenues.length === 0
            ? "Le reliquaire est vide. Joue, prie, plante : il se remplira tout seul."
            : obtenues.length === RELIQUES.length
            ? "Reliquaire complet. Mère Mycorhize, dit-on, en a esquissé un sourire."
            : "Chaque relique marque un seuil franchi sans que tu y aies forcément prêté attention."}
        </p>
      </Card>

      {CATEGORIES.map((cat) => {
        const reliquesCat = RELIQUES.filter((r) => r.categorie === cat);
        if (reliquesCat.length === 0) return null;
        const obtCat = reliquesCat.filter((r) => obtenuesIds.has(r.id)).length;
        return (
          <section key={cat}>
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="titre-liturgique text-xl text-mousse-800 dark:text-parchemin-100">{cat}</h2>
              <span className="font-serif text-xs text-mousse-600 dark:text-parchemin-200/70">
                {obtCat}/{reliquesCat.length}
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {reliquesCat.map((r) => (
                <ReliqueCarte key={r.id} r={r} obtenue={obtenuesIds.has(r.id)} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ReliqueCarte({ r, obtenue }: { r: Relique; obtenue: boolean }) {
  return (
    <Card className={obtenue ? "h-full border-ocre-500/50 bg-ocre-500/5" : "h-full"}>
      <div className="flex items-start gap-3">
        <span
          className={`text-3xl ${obtenue ? "" : "opacity-30 grayscale"}`}
          aria-hidden
        >
          {obtenue ? r.embleme : "🔒"}
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <CardTitle className="text-lg">{r.nom}</CardTitle>
            {obtenue ? (
              <Badge variant="grace">Recueillie</Badge>
            ) : (
              <Badge variant="outline">À débloquer</Badge>
            )}
          </div>
          <p className="mt-1 font-serif text-sm text-mousse-800 dark:text-parchemin-100">
            {obtenue ? r.description : r.condition}
          </p>
        </div>
      </div>
    </Card>
  );
}
