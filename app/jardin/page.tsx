"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useStore, PlantationEntry } from "@/lib/store";
import { ESPECES, Espece } from "@/data/jardin-especes";
import { EspeceSprite } from "@/components/jardin/EspeceSprite";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { Sprout, Sparkles, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function JardinPage() {
  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Ton Jardin Sacré
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Une parcelle de cimetière reverdie
        </h1>
        <Ornement />
        <p className="mx-auto max-w-xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Plante. Attends. Émerveille-toi. Le sol fait le reste, mais il faut quand même planter. »
        </p>
      </header>
      <Hydrated>
        <Contenu />
      </Hydrated>
    </div>
  );
}

const SLOTS = 16;
const GRID_COLS = 4;

function Contenu() {
  const { graines, jardin, planter, retirerPlante, enregistrerVisiteInsecte, visitesInsectesObservees } = useStore();
  const [selectedEspece, setSelectedEspece] = useState<Espece | null>(null);
  const [growingSlot, setGrowingSlot] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [insectVisits, setInsectVisits] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);

  const especesUniques = useMemo(() => new Set(jardin.map((p) => p.especeId)).size, [jardin]);

  const slotsArray = useMemo(() => {
    const arr: (typeof jardin[number] | null)[] = Array(SLOTS).fill(null);
    for (const p of jardin) arr[p.slot] = p;
    return arr;
  }, [jardin]);

  // Animation insectes — un insecte traverse périodiquement si au moins 1 plante
  useEffect(() => {
    if (jardin.length === 0) return;
    const EMOJIS = ["🐝", "🦋", "🐞", "🪰"];
    const id = setInterval(() => {
      const insect = {
        id: Date.now(),
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      };
      setInsectVisits((v) => [...v, insect]);
      enregistrerVisiteInsecte();
      setTimeout(() => setInsectVisits((v) => v.filter((x) => x.id !== insect.id)), 3200);
    }, 6000);
    return () => clearInterval(id);
  }, [jardin.length, enregistrerVisiteInsecte]);

  const tryPlanter = (slot: number) => {
    if (!selectedEspece) return;
    if (graines < selectedEspece.cout) {
      setError(`Il te manque ${selectedEspece.cout - graines} graines. Joue, médite, rituelise.`);
      setTimeout(() => setError(null), 2400);
      return;
    }
    const ok = planter(selectedEspece.id, selectedEspece.cout);
    if (ok) {
      setGrowingSlot(slot);
      setTimeout(() => setGrowingSlot(null), 5000);
      setSelectedEspece(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardSubtitle>Graines de Grâce</CardSubtitle>
          <p className="mt-1 font-serif text-3xl text-mousse-800 dark:text-parchemin-100">{graines}</p>
          <p className="font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
            <Link href="/jeu" className="hover:underline">Joue pour en gagner →</Link>
          </p>
        </Card>
        <Card>
          <CardSubtitle>Biodiversité</CardSubtitle>
          <p className="mt-1 font-serif text-3xl text-mousse-800 dark:text-parchemin-100">{especesUniques}</p>
          <p className="font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
            espèces différentes (sur {ESPECES.length})
          </p>
        </Card>
        <Card>
          <CardSubtitle>Visites observées</CardSubtitle>
          <p className="mt-1 font-serif text-3xl text-mousse-800 dark:text-parchemin-100">{visitesInsectesObservees}</p>
          <p className="font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
            insectes passés depuis l'ouverture du Jardin
          </p>
        </Card>
      </div>

      {/* La parcelle */}
      <Card>
        <CardSubtitle>La parcelle</CardSubtitle>
        <CardTitle>Clique sur une case vide pour planter</CardTitle>
        <div
          className="relative mt-4 overflow-hidden rounded-md border-2 border-ocre-500/40 bg-gradient-to-br from-terre-100 via-terre-200 to-terre-300 p-3 shadow-inner dark:from-mousse-900 dark:via-mousse-950 dark:to-black"
          style={{ aspectRatio: "1 / 1" }}
        >
          {/* Texture de terre */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(101,59,40,0.3), transparent 30%), radial-gradient(circle at 70% 70%, rgba(74,108,57,0.3), transparent 30%)",
            }}
          />
          <div className="relative grid h-full gap-1.5" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}>
            {slotsArray.map((entry, i) => (
              <SlotCell
                key={i}
                slot={i}
                entry={entry}
                growing={growingSlot === i}
                selectedEspece={selectedEspece}
                onClick={() => entry == null && selectedEspece && tryPlanter(i)}
                onRetire={() => retirerPlante(i)}
              />
            ))}
          </div>
          <AnimatePresence>
            {insectVisits.map((v) => (
              <motion.span
                key={v.id}
                initial={{ opacity: 0, x: -20, y: v.y + "%" }}
                animate={{ opacity: 1, x: "0%" }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 3 }}
                className="pointer-events-none absolute text-2xl"
                style={{ left: `${v.x}%`, top: `${v.y}%` }}
                aria-hidden
              >
                {v.emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        {error && (
          <p className="mt-3 rounded-md border border-terre-500/40 bg-terre-500/10 px-3 py-2 font-serif text-sm italic text-terre-700 dark:text-terre-300">
            {error}
          </p>
        )}
      </Card>

      {/* Sélecteur d'espèce */}
      <Card>
        <CardSubtitle>Catalogue des espèces</CardSubtitle>
        <CardTitle>Choisis une plante, puis clique sur une case vide</CardTitle>
        {selectedEspece && (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-md border border-ocre-500/40 bg-ocre-500/10 px-3 py-2 text-sm">
            <Sparkles size={16} className="text-ocre-600" />
            <span className="font-serif">
              <strong>{selectedEspece.nomCommun}</strong> sélectionné·e. {selectedEspece.cout} graines.
              Clique sur une case vide ci-dessus.
            </span>
            <Button variant="ghost" onClick={() => setSelectedEspece(null)} className="ml-auto">
              Annuler
            </Button>
          </div>
        )}
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {ESPECES.map((e) => {
            const can = graines >= e.cout;
            const selected = selectedEspece?.id === e.id;
            return (
              <button
                key={e.id}
                onClick={() => can && setSelectedEspece(e)}
                disabled={!can}
                className={cn(
                  "flex items-center gap-3 rounded-md border p-3 text-left font-serif transition",
                  selected
                    ? "border-ocre-500/70 bg-ocre-500/10"
                    : can
                    ? "border-mousse-500/20 hover:border-ocre-500/40 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40"
                    : "border-mousse-500/10 opacity-50"
                )}
              >
                <div className="shrink-0">
                  <EspeceSprite especeId={e.id} size={40} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-mousse-800 dark:text-parchemin-100">{e.nomCommun}</p>
                  <p className="text-[10px] italic text-mousse-600 dark:text-parchemin-200/70">{e.nomLatin}</p>
                </div>
                <Badge variant={can ? "grace" : "outline"}>{e.cout} ☘</Badge>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function SlotCell({
  slot,
  entry,
  growing,
  selectedEspece,
  onClick,
  onRetire,
}: {
  slot: number;
  entry: PlantationEntry | null;
  growing: boolean;
  selectedEspece: Espece | null;
  onClick: () => void;
  onRetire: () => void;
}) {
  const isEmpty = !entry;
  const [hover, setHover] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <>
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={cn(
          "relative flex items-center justify-center rounded-md border transition",
          isEmpty
            ? selectedEspece
              ? "border-ocre-500/60 bg-terre-50/50 hover:bg-ocre-500/10 dark:bg-mousse-900/30 dark:hover:bg-mousse-800/40"
              : "border-terre-500/30 bg-terre-50/30 dark:bg-mousse-900/20"
            : "border-mousse-500/30 bg-terre-50/40 dark:bg-mousse-900/30"
        )}
        style={{ aspectRatio: "1 / 1" }}
        aria-label={isEmpty ? `Case ${slot + 1} vide` : `Case ${slot + 1} : ${entry?.especeId}`}
      >
        {isEmpty ? (
          selectedEspece && (
            <span className="text-mousse-600/60 dark:text-parchemin-200/40" aria-hidden>
              <Sprout size={20} />
            </span>
          )
        ) : (
          <>
            <EspeceSprite especeId={entry!.especeId} size={56} animate={growing} />
            {hover && (
              <span
                className="absolute right-1 top-1 rounded-full bg-terre-500/80 p-1 text-parchemin-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmOpen(true);
                }}
                role="button"
                aria-label="Arracher cette plante"
              >
                <Trash2 size={10} />
              </span>
            )}
          </>
        )}
      </button>
      <AnimatePresence>
        {confirmOpen && (
          <ConfirmArrachage
            onCancel={() => setConfirmOpen(false)}
            onConfirm={() => {
              setConfirmOpen(false);
              onRetire();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ConfirmArrachage({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="arracher-titre"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-mousse-950/70 p-4 backdrop-blur"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-md rounded-lg border-2 border-ocre-500/40 bg-parchemin-50 p-6 shadow-xl dark:bg-mousse-950"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-sans text-xs uppercase tracking-widest text-ocre-600 dark:text-ocre-400">
          Au Jardin
        </p>
        <h3 id="arracher-titre" className="titre-liturgique mt-1 text-2xl text-mousse-800 dark:text-parchemin-100">
          Arracher cette plante ?
        </h3>
        <p className="mt-3 font-serif text-mousse-800 dark:text-parchemin-100">
          Les graines investies sont perdues. Le sol, lui, retient quelque chose —
          mais ça ne se compte pas en graines.
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn-ghost"
            autoFocus
          >
            Garder la plante
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-sacre"
          >
            <Trash2 size={14} /> Arracher
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
