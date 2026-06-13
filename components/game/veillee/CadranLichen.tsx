"use client";

import { useMemo, useState } from "react";
import { useVeillee } from "@/lib/veillee-store";
import { getSceau, railleAuHasard } from "@/data/veillee";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// Sceau I — Le Cadran de Lichen.
// Écologie réelle : dans l'hémisphère nord, mousses et lichens prospèrent
// davantage du côté NORD des pierres (plus frais, ombragé, humide) — tendance,
// pas boussole infaillible. Énigme : repérer la face la plus moussue (= nord),
// orienter l'aiguille vers elle → un symbole gravé se révèle → Indice I.
// Randomisé à chaque partie : quelle face est la plus moussue + le symbole.

const FACES = ["Face du levant", "Face du couchant", "Face de la croix", "Face du if"];
const SYMBOLES = ["✦", "❉", "✣", "⊛", "⸙"];

// 0..3 niveaux de mousse → libellé d'examen.
const MOUSSE_TXT = [
  "à peine un voile de mousse, la pierre est nue et tiède.",
  "un peu de lichen, mais la pierre reste sèche.",
  "bien verdie, fraîche au toucher.",
  "franchement mangée de mousse et de lichen, fraîche et ombreuse.",
];

export function CadranLichen({ onResolu }: { onResolu: () => void }) {
  const sceau = getSceau("cadran")!;
  const dejaResolu = useVeillee((s) => s.sceauxResolus.includes("cadran"));
  const indiceStocke = useVeillee((s) => s.indices["cadran"]);
  const resoudre = useVeillee((s) => s.resoudre);
  const rater = useVeillee((s) => s.rater);

  // Tirage de la partie (stable tant que le composant vit) : la face la plus
  // moussue = le nord ; un symbole gravé associé.
  const { mousse, nord, symbole } = useMemo(() => {
    const nord = Math.floor(Math.random() * 4);
    // niveaux : nord = 3 (max), les autres répartis plus bas, distincts.
    const autres = [0, 1, 2].sort(() => Math.random() - 0.5);
    const mousse = [0, 0, 0, 0];
    mousse[nord] = 3;
    let k = 0;
    for (let i = 0; i < 4; i++) if (i !== nord) mousse[i] = autres[k++];
    const symbole = SYMBOLES[Math.floor(Math.random() * SYMBOLES.length)];
    return { mousse, nord, symbole };
  }, []);

  const [examinee, setExaminee] = useState<number | null>(null);
  const [aiguille, setAiguille] = useState<number | null>(null);
  const [raille, setRaille] = useState<string | null>(null);
  const [revele, setRevele] = useState<string | null>(null);

  if (dejaResolu) {
    return (
      <div className="text-center">
        <Badge variant="grace">Sceau I ouvert · symbole {indiceStocke}</Badge>
        <p className="mx-auto mt-3 max-w-md font-serif italic text-parchemin-100">
          Le cadran a parlé. Son symbole, <span className="not-italic">{indiceStocke}</span>, est inscrit au Carnet.
        </p>
      </div>
    );
  }

  // Angle de l'aiguille : 0=haut, 1=droite, 2=bas, 3=gauche.
  const angles = [-90, 0, 90, 180];

  const lire = () => {
    if (aiguille === null) return;
    if (aiguille === nord) {
      setRevele(symbole);
      resoudre("cadran", symbole);
      setTimeout(onResolu, 1400);
    } else {
      rater();
      setRaille(railleAuHasard());
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-center font-serif italic leading-relaxed text-parchemin-100">{sceau.resume}</p>

      {/* Cadran : aiguille orientable + 4 faces moussues autour */}
      <div className="relative mx-auto mt-6 h-56 w-56">
        <div className="absolute inset-0 rounded-full border-2 border-ocre-400/50 bg-mousse-950/55 backdrop-blur-sm" />
        {/* graduations */}
        {angles.map((a, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ocre-400/60"
            style={{ transform: `rotate(${a}deg) translateY(-104px)` }}
          />
        ))}
        {/* aiguille */}
        <div
          className="absolute left-1/2 top-1/2 origin-bottom transition-transform duration-300"
          style={{
            height: 92,
            width: 4,
            marginLeft: -2,
            marginTop: -92,
            transform: `rotate(${aiguille === null ? 0 : angles[aiguille] + 90}deg)`,
            opacity: aiguille === null ? 0.35 : 1,
          }}
        >
          <div className="h-full w-full rounded-full bg-gradient-to-t from-ocre-700 to-ocre-300" />
        </div>
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ocre-300" />
        {/* symbole révélé */}
        {revele && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-ocre-200 drop-shadow">
            {revele}
          </span>
        )}
      </div>

      {/* Faces : examiner la mousse, puis pointer l'aiguille */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        {FACES.map((nom, i) => (
          <div
            key={i}
            className={`rounded-md border p-3 transition ${
              aiguille === i ? "border-ocre-400 bg-ocre-500/10" : "border-parchemin-200/20 bg-mousse-950/40"
            }`}
          >
            <p className="font-serif text-sm text-parchemin-100">{nom}</p>
            {/* indice de mousse visible (la déduction) */}
            <p className="mt-1 text-xs text-mousse-300" aria-hidden>
              {"🌿".repeat(mousse[i] + 1)}
            </p>
            {examinee === i && (
              <p className="mt-1 font-serif text-[11px] italic text-parchemin-200/80">{MOUSSE_TXT[mousse[i]]}</p>
            )}
            <div className="mt-2 flex gap-1">
              <button
                onClick={() => setExaminee(i)}
                className="rounded border border-parchemin-200/20 px-2 py-1 text-[11px] text-parchemin-200/80 hover:border-ocre-400/50"
              >
                Examiner
              </button>
              <button
                onClick={() => {
                  setAiguille(i);
                  setRaille(null);
                }}
                className="rounded border border-parchemin-200/20 px-2 py-1 text-[11px] text-parchemin-200/80 hover:border-ocre-400/50"
              >
                Aiguille ici
              </button>
            </div>
          </div>
        ))}
      </div>

      {raille && (
        <p className="mt-4 rounded-md border border-ocre-400/30 bg-mousse-950/55 px-3 py-2 text-center font-serif text-sm italic text-parchemin-200/90">
          {raille}
        </p>
      )}

      <div className="mt-5 text-center">
        <Button onClick={lire} disabled={aiguille === null || !!revele}>
          Lire le symbole sous l'aiguille
        </Button>
      </div>

      {revele && (
        <p className="mt-4 text-center font-serif italic text-ocre-200">
          Le nord trouvé, un symbole se révèle : <span className="not-italic">{revele}</span>. Indice I, au Carnet.
        </p>
      )}
    </div>
  );
}
