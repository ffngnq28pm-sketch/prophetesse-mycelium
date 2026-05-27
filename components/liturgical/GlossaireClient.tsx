"use client";

import { useMemo, useState } from "react";
import { EntreeGlossaire } from "@/data/glossaire";
import { Card, CardTitle } from "@/components/ui/Card";
import { Search, X } from "lucide-react";

// Normalisation pour la recherche : accents retirés, minuscules.
function normaliser(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Première lettre alphabétique du terme, accents ignorés et articles élidés.
// Ex. « Le Jardin » → "J", « L'Ordre » → "O", « Sœur Compost » → "S".
function lettreInitiale(terme: string): string {
  const sansArticle = terme
    .replace(/^(le |la |les |l'|un |une |des )/i, "")
    .trimStart();
  const normalise = normaliser(sansArticle);
  for (const c of normalise) {
    if (c >= "a" && c <= "z") return c.toUpperCase();
  }
  return "#";
}

export function GlossaireClient({ entries }: { entries: EntreeGlossaire[] }) {
  const [recherche, setRecherche] = useState("");
  const [lettreActive, setLettreActive] = useState<string | null>(null);

  // Trie par lettre initiale ; conserve l'ordre original au sein d'une lettre.
  const triees = useMemo(() => {
    return [...entries].sort((a, b) =>
      lettreInitiale(a.terme).localeCompare(lettreInitiale(b.terme))
    );
  }, [entries]);

  const lettresDisponibles = useMemo(() => {
    return new Set(triees.map((e) => lettreInitiale(e.terme)));
  }, [triees]);

  // Alphabet complet : on affiche toutes les lettres pour que l'utilisateur
  // voie d'un coup d'œil lesquelles ont des entrées.
  const ALPHABET = useMemo(
    () => Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
    []
  );

  const filtrees = useMemo(() => {
    const r = normaliser(recherche.trim());
    return triees.filter((e) => {
      if (lettreActive && lettreInitiale(e.terme) !== lettreActive) return false;
      if (!r) return true;
      return (
        normaliser(e.terme).includes(r) || normaliser(e.definition).includes(r)
      );
    });
  }, [triees, recherche, lettreActive]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3">
        {/* Champ de recherche */}
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mousse-600/60 dark:text-parchemin-200/40"
            aria-hidden
          />
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Chercher un terme, une définition…"
            aria-label="Rechercher dans le glossaire"
            className="w-full rounded-md border border-mousse-500/30 bg-parchemin-50/80 py-2 pl-9 pr-9 font-serif text-mousse-900 placeholder:text-mousse-600/60 focus:border-ocre-500 focus:outline-none dark:bg-mousse-900/40 dark:text-parchemin-100 dark:placeholder:text-parchemin-200/40"
          />
          {recherche && (
            <button
              type="button"
              onClick={() => setRecherche("")}
              aria-label="Effacer la recherche"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-mousse-600/70 hover:bg-mousse-500/10 dark:text-parchemin-200/60"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Index alphabétique complet. Les lettres sans entrée sont grisées. */}
        <nav aria-label="Filtrer par lettre" className="flex flex-wrap items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => setLettreActive(null)}
            aria-pressed={lettreActive === null}
            className={`rounded-full px-3 py-1 font-serif text-xs uppercase tracking-widest transition ${
              lettreActive === null
                ? "bg-mousse-700 text-parchemin-50"
                : "border border-mousse-500/30 text-mousse-700 hover:border-ocre-500/50 dark:text-parchemin-200"
            }`}
          >
            Tout
          </button>
          {ALPHABET.map((l) => {
            const disponible = lettresDisponibles.has(l);
            const active = lettreActive === l;
            return (
              <button
                key={l}
                type="button"
                disabled={!disponible}
                aria-pressed={active}
                aria-disabled={!disponible}
                onClick={() => {
                  if (!disponible) return;
                  setLettreActive((current) => (current === l ? null : l));
                }}
                className={`min-w-[2rem] rounded-full px-2 py-1 font-serif text-xs transition ${
                  !disponible
                    ? "cursor-not-allowed text-mousse-500/50 dark:text-parchemin-200/30"
                    : active
                    ? "bg-mousse-700 text-parchemin-50"
                    : "border border-mousse-500/30 text-mousse-700 hover:border-ocre-500/50 hover:text-ocre-600 dark:text-parchemin-200 dark:hover:text-ocre-400"
                }`}
              >
                {l}
              </button>
            );
          })}
        </nav>

        {/* Compteur */}
        <p
          className="text-center font-serif text-xs italic text-mousse-600 dark:text-parchemin-200/60"
          aria-live="polite"
        >
          {filtrees.length} entrée{filtrees.length > 1 ? "s" : ""}
          {(recherche || lettreActive) && ` sur ${triees.length}`}
        </p>
      </div>

      {filtrees.length === 0 ? (
        <Card>
          <p className="font-serif italic text-mousse-700 dark:text-parchemin-200/80">
            Rien trouvé. Le mycélium suggère d'élargir la recherche, ou de poser la question à un Lichen — il finira par répondre, dans environ huit décennies.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtrees.map((e) => (
            <Card key={e.terme}>
              <CardTitle>{e.terme}</CardTitle>
              <p className="mt-2 font-serif text-sm text-mousse-800 dark:text-parchemin-100">
                {e.definition}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
