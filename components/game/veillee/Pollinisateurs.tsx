"use client";

import { useMemo, useState } from "react";
import { useVeillee } from "@/lib/veillee-store";
import { getSceau, railleAuHasard } from "@/data/veillee";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// Sceau III — Chaque Fleur, son Pollinisateur.
// Écologie réelle : la syndrome de pollinisation. Chaque pollinisateur a ses
// affinités morphologiques — le sphinx (papillon de nuit à longue trompe) va
// aux fleurs blanches tubulaires nocturnes ; l'abeille au bleu mellifère ; le
// papillon de jour aux corolles parfumées ; le syrphe (mouche) aux ombelles
// plates et ouvertes. Relier chacun à sa fleur. L'ordre des bons couples donne
// la combinaison — symboles attribués au hasard à chaque partie.

const FLEURS = [
  { id: "nocturne", nom: "Fleur blanche tubulaire", trait: "parfumée la nuit, nectar au fond d'un long tube" },
  { id: "bleue", nom: "Fleur bleue mellifère", trait: "nectar accessible, riche en pollen" },
  { id: "coloree", nom: "Corolle vive parfumée", trait: "couleurs vives, butinée en plein jour" },
  { id: "ombelle", nom: "Ombelle plate", trait: "fleurs minuscules à plat, étamines à l'air" },
];

// Pollinisateurs dans un ordre FIXE (l'ordre de lecture de la combinaison).
const POLLINISATEURS = [
  { id: "sphinx", nom: "Sphinx (papillon de nuit)", indice: "très longue trompe, vole de nuit", bonneFleur: "nocturne" },
  { id: "abeille", nom: "Abeille", indice: "fidèle au bleu, récolte le pollen", bonneFleur: "bleue" },
  { id: "papillon", nom: "Papillon de jour", indice: "longue trompe, butine de jour", bonneFleur: "coloree" },
  { id: "syrphe", nom: "Syrphe (mouche)", indice: "pattes courtes, lui faut du plat", bonneFleur: "ombelle" },
];

const SYMBOLES = ["◆", "●", "▲", "■"];

function melange<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Pollinisateurs({ onResolu }: { onResolu: () => void }) {
  const sceau = getSceau("pollinisateurs")!;
  const dejaResolu = useVeillee((s) => s.sceauxResolus.includes("pollinisateurs"));
  const indiceStocke = useVeillee((s) => s.indices["pollinisateurs"]);
  const resoudre = useVeillee((s) => s.resoudre);
  const rater = useVeillee((s) => s.rater);

  // Symbole attribué à chaque fleur (randomisé) → la combinaison varie.
  const symboleParFleur = useMemo(() => {
    const sym = melange(SYMBOLES);
    const map: Record<string, string> = {};
    FLEURS.forEach((f, i) => (map[f.id] = sym[i]));
    return map;
  }, []);
  // Ordre d'affichage des fleurs dans le menu (mélangé pour ne pas souffler).
  const fleursAffichees = useMemo(() => melange(FLEURS), []);

  const [choix, setChoix] = useState<Record<string, string>>({});
  const [raille, setRaille] = useState<string | null>(null);
  const [reussi, setReussi] = useState(false);

  if (dejaResolu) {
    return (
      <div className="text-center">
        <Badge variant="grace">Sceau III ouvert · {indiceStocke}</Badge>
        <p className="mx-auto mt-3 max-w-md font-serif italic text-parchemin-100">
          La combinaison des couples, <span className="not-italic tracking-widest">{indiceStocke}</span>, est au Carnet.
        </p>
      </div>
    );
  }

  const combinaison = POLLINISATEURS.map((p) => symboleParFleur[p.bonneFleur]).join(" ");
  const complet = POLLINISATEURS.every((p) => choix[p.id]);

  const valider = () => {
    if (!complet) return;
    const tousJustes = POLLINISATEURS.every((p) => choix[p.id] === p.bonneFleur);
    if (tousJustes) {
      setReussi(true);
      resoudre("pollinisateurs", combinaison);
      setTimeout(onResolu, 1400);
    } else {
      rater();
      setRaille(railleAuHasard());
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-center font-serif italic leading-relaxed text-parchemin-100">{sceau.resume}</p>

      <div className="mt-5 space-y-3">
        {POLLINISATEURS.map((p) => (
          <div
            key={p.id}
            className="rounded-md border border-parchemin-200/20 bg-mousse-950/45 px-3 py-2.5"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-serif text-sm font-semibold text-parchemin-50">{p.nom}</span>
              <span className="font-serif text-xs italic text-parchemin-200/70">{p.indice}</span>
            </div>
            <label className="mt-2 flex items-center gap-2">
              <span className="font-serif text-xs text-parchemin-200/80">visite&nbsp;:</span>
              <select
                value={choix[p.id] ?? ""}
                onChange={(e) => {
                  setChoix((c) => ({ ...c, [p.id]: e.target.value }));
                  setRaille(null);
                }}
                className="flex-1 rounded border border-parchemin-200/25 bg-mousse-900/70 px-2 py-1.5 font-serif text-sm text-parchemin-50 focus:border-ocre-400 focus:outline-none"
              >
                <option value="">— choisir une fleur —</option>
                {fleursAffichees.map((f) => (
                  <option key={f.id} value={f.id}>
                    {symboleParFleur[f.id]} {f.nom} — {f.trait}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>

      {raille && (
        <p className="mt-4 rounded-md border border-ocre-400/30 bg-mousse-950/55 px-3 py-2 text-center font-serif text-sm italic text-parchemin-200/90">
          {raille}
        </p>
      )}

      <div className="mt-5 text-center">
        <Button onClick={valider} disabled={!complet || reussi}>
          Sceller les couples
        </Button>
      </div>

      {reussi && (
        <p className="mt-4 text-center font-serif italic text-ocre-200">
          Les affinités sont justes. Combinaison <span className="tracking-widest">{combinaison}</span> — Indice III, au Carnet.
        </p>
      )}
    </div>
  );
}
