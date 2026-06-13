"use client";

import { useMemo, useState } from "react";
import { useVeillee } from "@/lib/veillee-store";
import { getSceau, railleAuHasard } from "@/data/veillee";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChevronUp, ChevronDown } from "lucide-react";

// Sceau IV — La Stratigraphie du Compost.
// Écologie réelle : un compost se lit en strates. Le frais (épluchures
// reconnaissables) reste en surface ; plus on descend, plus c'est décomposé,
// jusqu'au terreau sombre et mûr au fond. Ordonner les couches du frais (haut)
// au mûr (bas). Une couche fraîche porte un indice de saison (randomisé) dont
// le rang dans l'année donne le nombre : Indice IV.

// rang = position correcte, 0 = surface (frais) … 3 = fond (mûr).
const COUCHES = [
  { id: "frais", rang: 0, nom: "Épluchures fraîches", desc: "encore reconnaissables, à peine entamées" },
  { id: "actif", rang: 1, nom: "Matières en décomposition", desc: "tièdes, grouillantes de vie" },
  { id: "grumeleux", rang: 2, nom: "Compost grumeleux", desc: "brun, structure encore visible" },
  { id: "terreau", rang: 3, nom: "Terreau sombre et mûr", desc: "noir, odeur de sous-bois — prêt" },
];

// Saison glissée dans la couche fraîche. Le nombre = rang de la saison.
const SAISONS = [
  { id: "printemps", nom: "Printemps", nombre: 1, marqueur: "premières tontes vertes et pétales fanés" },
  { id: "ete", nom: "Été", nombre: 2, marqueur: "herbes sèches et épluchures de tomate" },
  { id: "automne", nom: "Automne", nombre: 3, marqueur: "feuilles d'érable rousses tombées dessus" },
  { id: "hiver", nom: "Hiver", nombre: 4, marqueur: "marc et épluchures pris dans le givre" },
];

function melange<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Stratigraphie({ onResolu }: { onResolu: () => void }) {
  const sceau = getSceau("compost")!;
  const dejaResolu = useVeillee((s) => s.sceauxResolus.includes("compost"));
  const indiceStocke = useVeillee((s) => s.indices["compost"]);
  const resoudre = useVeillee((s) => s.resoudre);
  const rater = useVeillee((s) => s.rater);

  const saison = useMemo(() => SAISONS[Math.floor(Math.random() * SAISONS.length)], []);
  const [ordre, setOrdre] = useState<string[]>(() => melange(COUCHES).map((c) => c.id));
  const [choixSaison, setChoixSaison] = useState<string | null>(null);
  const [raille, setRaille] = useState<string | null>(null);
  const [reussi, setReussi] = useState(false);

  if (dejaResolu) {
    return (
      <div className="text-center">
        <Badge variant="grace">Sceau IV ouvert · {indiceStocke}</Badge>
        <p className="mx-auto mt-3 max-w-md font-serif italic text-parchemin-100">
          La stratigraphie révèle le nombre <span className="not-italic">{indiceStocke}</span> — au Carnet.
        </p>
      </div>
    );
  }

  const couche = (id: string) => COUCHES.find((c) => c.id === id)!;
  const deplacer = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= ordre.length) return;
    const next = [...ordre];
    [next[i], next[j]] = [next[j], next[i]];
    setOrdre(next);
    setRaille(null);
  };

  const valider = () => {
    if (!choixSaison) return;
    const ordreJuste = ordre.every((id, i) => couche(id).rang === i);
    const saisonJuste = choixSaison === saison.id;
    if (ordreJuste && saisonJuste) {
      setReussi(true);
      resoudre("compost", String(saison.nombre));
      setTimeout(onResolu, 1400);
    } else {
      rater();
      setRaille(railleAuHasard());
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-center font-serif italic leading-relaxed text-parchemin-100">{sceau.resume}</p>

      <p className="mt-4 text-center font-serif text-xs uppercase tracking-[0.25em] text-ocre-200">↑ frais · mûr ↓</p>
      <div className="mt-2 space-y-1.5">
        {ordre.map((id, i) => {
          const c = couche(id);
          return (
            <div
              key={id}
              className="flex items-center gap-2 rounded-md border border-parchemin-200/20 bg-mousse-950/45 px-3 py-2"
            >
              <div className="flex flex-col">
                <button
                  onClick={() => deplacer(i, -1)}
                  disabled={i === 0}
                  aria-label="Monter"
                  className="text-parchemin-200/70 disabled:opacity-25"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => deplacer(i, 1)}
                  disabled={i === ordre.length - 1}
                  aria-label="Descendre"
                  className="text-parchemin-200/70 disabled:opacity-25"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="flex-1">
                <p className="font-serif text-sm font-semibold text-parchemin-50">{c.nom}</p>
                <p className="font-serif text-xs italic text-parchemin-200/75">{c.desc}</p>
                {c.id === "frais" && (
                  <p className="mt-0.5 font-serif text-xs text-ocre-200">+ {saison.marqueur}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-center font-serif text-sm text-parchemin-200/90">
        À quelle saison cette couche fraîche a-t-elle été déposée ?
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {SAISONS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setChoixSaison(s.id);
              setRaille(null);
            }}
            className={`rounded-md border px-3 py-1.5 font-serif text-sm transition ${
              choixSaison === s.id
                ? "border-ocre-400 bg-ocre-500/15 text-parchemin-50"
                : "border-parchemin-200/20 text-parchemin-100 hover:border-ocre-400/50"
            }`}
          >
            {s.nom}
          </button>
        ))}
      </div>

      {raille && (
        <p className="mt-4 rounded-md border border-ocre-400/30 bg-mousse-950/55 px-3 py-2 text-center font-serif text-sm italic text-parchemin-200/90">
          {raille}
        </p>
      )}

      <div className="mt-5 text-center">
        <Button onClick={valider} disabled={!choixSaison || reussi}>
          Lire la stratigraphie
        </Button>
      </div>

      {reussi && (
        <p className="mt-4 text-center font-serif italic text-ocre-200">
          Couches en ordre, saison lue : {saison.nom}. Le nombre est {saison.nombre} — Indice IV, au Carnet.
        </p>
      )}
    </div>
  );
}
