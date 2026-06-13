"use client";

import { useMemo, useState } from "react";
import { useVeillee } from "@/lib/veillee-store";
import { getSceau, railleAuHasard } from "@/data/veillee";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// Sceau II — L'Horloge Florale.
// Écologie réelle : l'horloge de Flore de Linné — des fleurs ouvrent et ferment
// à des heures régulières. La nuit, les diurnes (liseron, souci) sont CLOSES ;
// les nocturnes ouvrent au crépuscule puis se referment l'une après l'autre à
// l'approche de l'aube. En lisant lesquelles sont encore ouvertes, on déduit
// l'heure. Heure secrète randomisée d'une partie à l'autre.

// Progression de la nuit (heures depuis 22 h).
const HEURES = [
  { label: "22 h", prog: 0 },
  { label: "minuit", prog: 2 },
  { label: "2 h", prog: 4 },
  { label: "4 h", prog: 6 },
];
// Nocturnes : se referment à une progression donnée (ouverte si prog < refermeProg).
const NOCTURNES = [
  { nom: "Onagre", refermeProg: 1, regle: "se referme peu après 23 h" },
  { nom: "Belle-de-nuit", refermeProg: 3, regle: "se referme vers 1 h" },
  { nom: "Cierge-de-nuit", refermeProg: 5, regle: "se referme vers 3 h" },
];
const DIURNES = [
  { nom: "Liseron", regle: "diurne — close toute la nuit" },
  { nom: "Souci", regle: "diurne — close toute la nuit" },
];

export function HorlogeFlorale({ onResolu }: { onResolu: () => void }) {
  const sceau = getSceau("horloge")!;
  const dejaResolu = useVeillee((s) => s.sceauxResolus.includes("horloge"));
  const indiceStocke = useVeillee((s) => s.indices["horloge"]);
  const resoudre = useVeillee((s) => s.resoudre);
  const rater = useVeillee((s) => s.rater);

  const secret = useMemo(() => Math.floor(Math.random() * HEURES.length), []);
  const [choix, setChoix] = useState<number | null>(null);
  const [raille, setRaille] = useState<string | null>(null);
  const [reussi, setReussi] = useState(false);

  if (dejaResolu) {
    return (
      <div className="text-center">
        <Badge variant="grace">Sceau II ouvert · {indiceStocke}</Badge>
        <p className="mx-auto mt-3 max-w-md font-serif italic text-parchemin-100">
          L'heure des fleurs, <span className="not-italic">{indiceStocke}</span>, est inscrite au Carnet.
        </p>
      </div>
    );
  }

  const secretProg = HEURES[secret].prog;
  const valider = () => {
    if (choix === null) return;
    if (choix === secret) {
      setReussi(true);
      resoudre("horloge", HEURES[secret].label);
      setTimeout(onResolu, 1400);
    } else {
      rater();
      setRaille(railleAuHasard());
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-center font-serif italic leading-relaxed text-parchemin-100">{sceau.resume}</p>

      {/* Le parterre : état de chaque fleur + sa règle horaire */}
      <div className="mt-5 space-y-2">
        {NOCTURNES.map((f) => {
          const ouverte = secretProg < f.refermeProg;
          return (
            <div
              key={f.nom}
              className="flex items-center justify-between gap-3 rounded-md border border-parchemin-200/20 bg-mousse-950/45 px-3 py-2"
            >
              <span className="text-lg" aria-hidden>
                {ouverte ? "🌼" : "🥀"}
              </span>
              <span className="flex-1 font-serif text-sm text-parchemin-100">
                {f.nom} — <span className="italic text-parchemin-200/80">{f.regle}</span>
              </span>
              <span className="font-serif text-xs text-ocre-200">{ouverte ? "ouverte" : "close"}</span>
            </div>
          );
        })}
        {DIURNES.map((f) => (
          <div
            key={f.nom}
            className="flex items-center justify-between gap-3 rounded-md border border-parchemin-200/10 bg-mousse-950/30 px-3 py-2 opacity-75"
          >
            <span className="text-lg" aria-hidden>
              🥀
            </span>
            <span className="flex-1 font-serif text-sm text-parchemin-100">
              {f.nom} — <span className="italic text-parchemin-200/80">{f.regle}</span>
            </span>
            <span className="font-serif text-xs text-parchemin-200/60">close</span>
          </div>
        ))}
      </div>

      <p className="mt-5 text-center font-serif text-sm text-parchemin-200/90">Quelle heure de la nuit est-il ?</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {HEURES.map((h, i) => (
          <button
            key={h.label}
            onClick={() => {
              setChoix(i);
              setRaille(null);
            }}
            className={`rounded-md border px-4 py-2 font-serif text-sm transition ${
              choix === i ? "border-ocre-400 bg-ocre-500/15 text-parchemin-50" : "border-parchemin-200/20 text-parchemin-100 hover:border-ocre-400/50"
            }`}
          >
            {h.label}
          </button>
        ))}
      </div>

      {raille && (
        <p className="mt-4 rounded-md border border-ocre-400/30 bg-mousse-950/55 px-3 py-2 text-center font-serif text-sm italic text-parchemin-200/90">
          {raille}
        </p>
      )}

      <div className="mt-5 text-center">
        <Button onClick={valider} disabled={choix === null || reussi}>
          Lire l'heure aux fleurs
        </Button>
      </div>

      {reussi && (
        <p className="mt-4 text-center font-serif italic text-ocre-200">
          Les fleurs s'accordent : il est {HEURES[secret].label}. Indice II, au Carnet.
        </p>
      )}
    </div>
  );
}
