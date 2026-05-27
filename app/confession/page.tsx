"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { peches, Peche } from "@/data/peches";
import { useStore } from "@/lib/store";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { Skull, RefreshCw } from "lucide-react";

export default function ConfessionPage() {
  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Le Confessionnal Mycélien
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Confesse, expie, repars en pèlerinage
        </h1>
        <Ornement />
        <p className="font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Le repentir mycélien est joyeux. Il ne pleure pas, il composte. »
        </p>
      </header>
      <Hydrated>
        <ConfessionContent />
      </Hydrated>
    </div>
  );
}

function ConfessionContent() {
  const [selected, setSelected] = useState<Peche | null>(null);
  const [penitenceIndex, setPenitenceIndex] = useState(0);
  const [confessed, setConfessed] = useState(false);
  const retirerGraines = useStore((s) => s.retirerGraines);
  const ajouterConfession = useStore((s) => s.ajouterConfession);
  const ajouterGraines = useStore((s) => s.ajouterGraines);
  const confessions = useStore((s) => s.confessions);

  const reset = () => {
    setSelected(null);
    setPenitenceIndex(0);
    setConfessed(false);
  };

  const choisirAleatoire = () => {
    setPenitenceIndex(Math.floor(Math.random() * (selected?.penitences.length ?? 1)));
  };

  const confesser = () => {
    if (!selected) return;
    retirerGraines(selected.graines);
    ajouterConfession({
      id: crypto.randomUUID(),
      pecheId: selected.id,
      date: new Date().toISOString(),
      penitenceChoisie: selected.penitences[penitenceIndex],
      grainesPerdues: selected.graines,
    });
    ajouterGraines(Math.ceil(selected.graines / 3)); // rachat partiel
    setConfessed(true);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!selected && (
          <motion.div
            key="liste"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardSubtitle>Quel péché viens-tu confesser ?</CardSubtitle>
              <p className="mt-2 font-serif text-mousse-800 dark:text-parchemin-100">
                Sélectionne l'écart commis. La pénitence te sera révélée. Tu auras le choix entre trois pénitences possibles, ou tu pourras laisser le hasard mycélien décider.
              </p>
            </Card>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {peches.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="parchemin-card scroll-corner text-left transition hover:border-ocre-500/60 hover:bg-mousse-100/60 dark:hover:bg-mousse-800/40"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <CardTitle>{p.nom}</CardTitle>
                    <Badge variant="outline">
                      {"☘".repeat(p.gravite)}
                    </Badge>
                  </div>
                  <p className="mt-2 font-serif text-sm text-mousse-800 dark:text-parchemin-100">
                    {p.description}
                  </p>
                  <p className="mt-2 font-serif text-xs uppercase tracking-widest text-ocre-600 dark:text-ocre-400">
                    Coût : {p.graines} graines · Rachat partiel : {Math.ceil(p.graines / 3)}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {selected && !confessed && (
          <motion.div
            key="penitence"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardSubtitle>Tu confesses</CardSubtitle>
              <CardTitle>{selected.nom}</CardTitle>
              <p className="mt-2 font-serif text-mousse-800 dark:text-parchemin-100">
                {selected.description}
              </p>
              <Ornement />
              <div className="space-y-2">
                <p className="font-serif text-sm uppercase tracking-widest text-ocre-600 dark:text-ocre-400">
                  Choisis ta pénitence
                </p>
                {selected.penitences.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setPenitenceIndex(i)}
                    className={`block w-full rounded-md border p-3 text-left font-serif transition ${
                      i === penitenceIndex
                        ? "border-ocre-500/70 bg-ocre-500/10 text-mousse-900 dark:text-parchemin-100"
                        : "border-mousse-500/20 hover:border-ocre-500/40"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <Button variant="ghost" onClick={choisirAleatoire} className="mt-2">
                  <RefreshCw size={14} /> Laisse le Mycélium choisir
                </Button>
              </div>
              <Ornement />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge variant="grace">−{selected.graines} graines · +{Math.ceil(selected.graines / 3)} de rachat</Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={reset}>Reculer</Button>
                  <Button variant="or" onClick={confesser}>
                    <Skull size={14} aria-hidden /> Je confesse
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {selected && confessed && (
          <motion.div
            key="absolution"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-ocre-500/60 bg-ocre-500/5">
              <CardSubtitle>Absolution Mycélienne</CardSubtitle>
              <CardTitle>Tu es pardonné·e</CardTitle>
              <Ornement />
              <p className="font-serif italic text-mousse-900 dark:text-parchemin-100">
                « {selected.benediction} »
              </p>
              <p className="mt-4 font-serif text-mousse-800 dark:text-parchemin-100">
                Va, et observe ce qui pousse. Tu reviendras quand il le faudra.
              </p>
              <Ornement />
              <p className="font-serif text-sm uppercase tracking-widest text-ocre-600 dark:text-ocre-400">
                Pénitence inscrite à ton carnet
              </p>
              <p className="mt-1 font-serif text-mousse-800 dark:text-parchemin-100">
                {selected.penitences[penitenceIndex]}
              </p>
              <div className="mt-4 flex justify-end">
                <Button onClick={reset}>Retour au Confessionnal</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && (
        <section className="mt-8">
          <h2 className="titre-liturgique mb-2 text-xl text-mousse-800 dark:text-parchemin-100">
            Carnet de Pénitences
          </h2>
          {confessions.length === 0 ? (
            <Card>
              <p className="font-serif italic text-mousse-800 dark:text-parchemin-100">
                Pas encore de péché confessé. <span className="text-mousse-600 dark:text-parchemin-200/70">Ce qui, statistiquement, est suspect.</span>
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {confessions.slice(0, 5).map((c) => {
                const p = peches.find((x) => x.id === c.pecheId);
                return (
                  <Card key={c.id}>
                    <p className="font-serif text-xs uppercase tracking-widest text-ocre-600 dark:text-ocre-400">
                      {new Date(c.date).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="mt-1 font-serif text-mousse-800 dark:text-parchemin-100">
                      {p?.nom ?? "Péché oublié"}
                    </p>
                    <p className="mt-1 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
                      {c.penitenceChoisie}
                    </p>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
