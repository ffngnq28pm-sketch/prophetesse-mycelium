"use client";

import { useMemo, useState } from "react";
import { useVeillee } from "@/lib/veillee-store";
import { getSceau, railleAuHasard } from "@/data/veillee";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// Sceau V — Les Empreintes.
// Écologie réelle : on identifie les mammifères nocturnes à leurs traces. Le
// renard laisse une empreinte ovale à 4 doigts avec marques de griffes, en
// foulées presque alignées ; le chat, ronde, 4 doigts, SANS griffes
// (rétractiles) ; la fouine, allongée, 5 doigts, déplacements par bonds en
// paires ; le hérisson, minuscules « mains » à 5 doigts, avec une traînée
// ventrale. Animal de passage randomisé : lire le relevé, déduire la bête.

const ANIMAUX = [
  {
    id: "renard",
    nom: "Renard",
    glyph: "🦊",
    diagnostic: "ovale · 4 doigts · griffes visibles · foulées alignées",
    releve: [
      "Empreinte ovale, plus longue que large.",
      "Quatre doigts, marques de griffes nettes en avant.",
      "Les pas se suivent presque sur une seule ligne.",
    ],
  },
  {
    id: "chat",
    nom: "Chat",
    glyph: "🐈",
    diagnostic: "ronde · 4 doigts · sans griffes · bord en trèfle",
    releve: [
      "Empreinte ronde, aussi large que longue.",
      "Quatre doigts, aucune marque de griffe (rétractiles).",
      "Coussinet en trèfle, foulées souples.",
    ],
  },
  {
    id: "fouine",
    nom: "Fouine",
    glyph: "🦡",
    diagnostic: "allongée · 5 doigts · bonds par paires",
    releve: [
      "Empreinte allongée, cinq doigts bien marqués.",
      "Petites griffes fines à l'avant.",
      "Traces groupées par deux : la bête bondit.",
    ],
  },
  {
    id: "herisson",
    nom: "Hérisson",
    glyph: "🦔",
    diagnostic: "minuscule · 5 doigts · traînée ventrale",
    releve: [
      "Empreintes minuscules, comme de petites mains à cinq doigts.",
      "Pas courts et serrés.",
      "Une traînée centrale : le ventre frôle le sol.",
    ],
  },
];

export function Empreintes({ onResolu }: { onResolu: () => void }) {
  const sceau = getSceau("empreintes")!;
  const dejaResolu = useVeillee((s) => s.sceauxResolus.includes("empreintes"));
  const indiceStocke = useVeillee((s) => s.indices["empreintes"]);
  const resoudre = useVeillee((s) => s.resoudre);
  const rater = useVeillee((s) => s.rater);

  const secret = useMemo(() => ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)], []);
  const [choix, setChoix] = useState<string | null>(null);
  const [raille, setRaille] = useState<string | null>(null);
  const [reussi, setReussi] = useState(false);

  if (dejaResolu) {
    return (
      <div className="text-center">
        <Badge variant="grace">Sceau V ouvert · {indiceStocke}</Badge>
        <p className="mx-auto mt-3 max-w-md font-serif italic text-parchemin-100">
          Le dernier symbole, <span className="not-italic">{indiceStocke}</span>, est inscrit au Carnet.
        </p>
      </div>
    );
  }

  const valider = () => {
    if (!choix) return;
    if (choix === secret.id) {
      setReussi(true);
      resoudre("empreintes", secret.glyph);
      setTimeout(onResolu, 1400);
    } else {
      rater();
      setRaille(railleAuHasard());
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-center font-serif italic leading-relaxed text-parchemin-100">{sceau.resume}</p>

      {/* Le relevé de la nuit (signature de l'animal secret) */}
      <div className="mt-4 rounded-md border border-ocre-400/30 bg-mousse-950/55 p-3">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-ocre-200">Relevé de cette nuit</p>
        <ul className="mt-2 space-y-1">
          {secret.releve.map((ligne, i) => (
            <li key={i} className="font-serif text-sm text-parchemin-100">
              — {ligne}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 text-center font-serif text-sm text-parchemin-200/90">Quel passant nocturne est venu ?</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {ANIMAUX.map((a) => (
          <button
            key={a.id}
            onClick={() => {
              setChoix(a.id);
              setRaille(null);
            }}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left font-serif text-sm transition ${
              choix === a.id
                ? "border-ocre-400 bg-ocre-500/15 text-parchemin-50"
                : "border-parchemin-200/20 text-parchemin-100 hover:border-ocre-400/50"
            }`}
          >
            <span className="text-lg" aria-hidden>
              {a.glyph}
            </span>
            <span>
              <span className="block font-semibold">{a.nom}</span>
              <span className="block text-xs italic text-parchemin-200/70">{a.diagnostic}</span>
            </span>
          </button>
        ))}
      </div>

      {raille && (
        <p className="mt-4 rounded-md border border-ocre-400/30 bg-mousse-950/55 px-3 py-2 text-center font-serif text-sm italic text-parchemin-200/90">
          {raille}
        </p>
      )}

      <div className="mt-5 text-center">
        <Button onClick={valider} disabled={!choix || reussi}>
          Nommer la bête
        </Button>
      </div>

      {reussi && (
        <p className="mt-4 text-center font-serif italic text-ocre-200">
          C'était {secret.nom.toLowerCase()} {secret.glyph}. Les trois spectres avaient parié autre chose — Indice V, au Carnet.
        </p>
      )}
    </div>
  );
}
