"use client";

import { useStore } from "@/lib/store";
import { peches } from "@/data/peches";
import { PartieTetris, PartiePac } from "@/lib/store";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";

function dateCourte(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "2-digit" });
}

function Sparkline({ values, couleur }: { values: number[]; couleur: string }) {
  if (values.length < 2) return null;
  const w = 300;
  const h = 56;
  const pad = 4;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - 2 * pad);
      const y = h - pad - ((v - min) / range) * (h - 2 * pad);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full" style={{ height: 56 }}>
      <polyline
        points={pts}
        fill="none"
        stroke={couleur}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AnnalesPage() {
  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Les Annales de l'Ordre
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          La mémoire chiffrée du pèlerinage
        </h1>
        <Ornement />
        <p className="mx-auto max-w-xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « On garde une trace administrative de tout, non par méfiance, mais parce qu'un chiffre, parfois, console. »
        </p>
      </header>
      <Hydrated>
        <Contenu />
      </Hydrated>
    </div>
  );
}

function Contenu() {
  const histoTetris = useStore((s) => s.historiqueTetris);
  const histoPac = useStore((s) => s.historiquePac);
  const confessions = useStore((s) => s.confessions);
  const meilleurTetris = useStore((s) => s.meilleurScoreTetris);
  const meilleurPac = useStore((s) => s.meilleurScorePac);

  return (
    <div className="space-y-5">
      <section>
        <h2 className="mb-2 titre-liturgique text-xl text-mousse-800 dark:text-parchemin-100">
          Tetris du Compost
        </h2>
        <Card>
          {histoTetris.length === 0 ? (
            <p className="font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/70">
              Aucune partie enregistrée. Les Annales attendent ton premier compost.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardSubtitle>{histoTetris.length} partie{histoTetris.length > 1 ? "s" : ""} consignée{histoTetris.length > 1 ? "s" : ""}</CardSubtitle>
                <Badge variant="grace">Meilleur : {meilleurTetris}</Badge>
              </div>
              <div className="mt-2">
                <Sparkline values={histoTetris.map((p) => p.score)} couleur="#5f8a3e" />
              </div>
              <ul className="mt-2 divide-y divide-mousse-500/15">
                {[...histoTetris].reverse().slice(0, 12).map((p: PartieTetris, i) => (
                  <li key={i} className="flex items-center justify-between py-1.5 font-serif text-sm">
                    <span className="text-mousse-600 dark:text-parchemin-200/70">{dateCourte(p.date)}</span>
                    <span className="text-mousse-800 dark:text-parchemin-100">
                      <strong>{p.score}</strong> pts · {p.lignes} ligne{p.lignes > 1 ? "s" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </section>

      <section>
        <h2 className="mb-2 titre-liturgique text-xl text-mousse-800 dark:text-parchemin-100">
          La Chasse aux Pollinisateurs
        </h2>
        <Card>
          {histoPac.length === 0 ? (
            <p className="font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/70">
              Aucune chasse enregistrée. Sœur Halicte attend ton premier rapport.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardSubtitle>{histoPac.length} chasse{histoPac.length > 1 ? "s" : ""} consignée{histoPac.length > 1 ? "s" : ""}</CardSubtitle>
                <Badge variant="grace">Meilleur : {meilleurPac}</Badge>
              </div>
              <div className="mt-2">
                <Sparkline values={histoPac.map((p) => p.score)} couleur="#3f7a9c" />
              </div>
              <ul className="mt-2 divide-y divide-mousse-500/15">
                {[...histoPac].reverse().slice(0, 12).map((p: PartiePac, i) => (
                  <li key={i} className="flex items-center justify-between py-1.5 font-serif text-sm">
                    <span className="text-mousse-600 dark:text-parchemin-200/70">{dateCourte(p.date)}</span>
                    <span className="text-mousse-800 dark:text-parchemin-100">
                      <strong>{p.score}</strong> pts · niveau {p.niveau}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </section>

      <section>
        <h2 className="mb-2 titre-liturgique text-xl text-mousse-800 dark:text-parchemin-100">
          Journal du Confessionnal
        </h2>
        {confessions.length === 0 ? (
          <Card>
            <p className="font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/70">
              Aucune confession déposée. Cela ne signifie pas que tu es sans faute — seulement sans aveu.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {confessions.map((c) => {
              const peche = peches.find((p) => p.id === c.pecheId);
              return (
                <Card key={c.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <CardTitle className="text-base">{peche?.nom ?? "Faute oubliée des registres"}</CardTitle>
                    <span className="font-serif text-xs text-mousse-600 dark:text-parchemin-200/70">
                      {dateCourte(c.date)}
                    </span>
                  </div>
                  <p className="mt-1 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
                    Pénitence : « {c.penitenceChoisie} »
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline">−{c.grainesPerdues} graines expiées</Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
