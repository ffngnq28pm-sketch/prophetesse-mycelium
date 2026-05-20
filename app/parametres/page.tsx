"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { totems } from "@/data/totems";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { Sun, Moon, RefreshCcw } from "lucide-react";

const SUGGESTIONS = ["Sœur Compost", "Frère Lichen", "Sœur Halicte", "Frère Hérisson", "Sœur Mycélium", "Frère Ver", "Sœur Pollen", "Frère Pollen"];

export default function ParametresPage() {
  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Paramètres du Pèlerinage
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Identité et Discipline
        </h1>
        <Ornement />
      </header>
      <Hydrated>
        <Contenu />
      </Hydrated>
    </div>
  );
}

function Contenu() {
  const { nomBaptismale, setNomBaptismale, totem, setTotem, theme, toggleTheme, reset } = useStore();
  const [nom, setNom] = useState(nomBaptismale);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="space-y-4">
      <Card>
        <CardSubtitle>Nom de Baptême</CardSubtitle>
        <CardTitle>Comment l'Ordre t'appelle-t-il ?</CardTitle>
        <p className="mt-2 font-serif text-mousse-800 dark:text-parchemin-100">
          Choisis un nom qui te ressemble. Tu peux suivre la coutume mycélienne :
          « Sœur X » ou « Frère X », où X est un élément du vivant.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setNom(s);
                setNomBaptismale(s);
              }}
              className="rounded-full border border-mousse-500/30 px-3 py-1 font-serif text-xs transition hover:border-ocre-500/50 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Sœur Mycélium…"
          />
          <Button onClick={() => setNomBaptismale(nom)}>Valider</Button>
        </div>
      </Card>

      <Card>
        <CardSubtitle>Animal Totem</CardSubtitle>
        <CardTitle>Choisis ton guide spirituel</CardTitle>
        <p className="mt-2 font-serif text-mousse-800 dark:text-parchemin-100">
          Ton totem t'accompagne dans ta progression. Chacun confère un bonus liturgique distinct.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {totems.map((t) => (
            <button
              key={t.id}
              onClick={() => setTotem(t.id)}
              className={`flex items-start gap-3 rounded-md border p-3 text-left font-serif transition ${
                totem === t.id
                  ? "border-ocre-500/60 bg-ocre-500/10"
                  : "border-mousse-500/20 hover:border-ocre-500/40 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40"
              }`}
            >
              <span className="text-2xl">{t.embleme}</span>
              <div>
                <p className="text-mousse-800 dark:text-parchemin-100">{t.nom}</p>
                <p className="text-xs text-mousse-600 dark:text-parchemin-200/70">
                  {t.bonus}
                </p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardSubtitle>Lumière de l'Application</CardSubtitle>
        <CardTitle>Aurore ou Vigile ?</CardTitle>
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => theme !== "aurore" && toggleTheme()}
            className={`flex flex-1 items-center gap-2 rounded-md border p-3 font-serif transition ${
              theme === "aurore"
                ? "border-ocre-500/60 bg-ocre-500/10"
                : "border-mousse-500/20 hover:border-ocre-500/40"
            }`}
          >
            <Sun size={18} /> Aurore Mycélienne
          </button>
          <button
            onClick={() => theme !== "vigile" && toggleTheme()}
            className={`flex flex-1 items-center gap-2 rounded-md border p-3 font-serif transition ${
              theme === "vigile"
                ? "border-ocre-500/60 bg-ocre-500/10"
                : "border-mousse-500/20 hover:border-ocre-500/40"
            }`}
          >
            <Moon size={18} /> Vigile Nocturne
          </button>
        </div>
      </Card>

      <Card className="border-terre-500/40">
        <CardSubtitle>Zone de Reset</CardSubtitle>
        <CardTitle>Recommencer le Pèlerinage</CardTitle>
        <p className="mt-2 font-serif text-mousse-800 dark:text-parchemin-100">
          Cette action efface graines, rituels, confessions, scores. Elle ne peut être annulée. Le mycélium ne juge pas, mais on garde une trace administrative — laquelle disparaît avec le reste.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {!confirmReset ? (
            <Button variant="ghost" onClick={() => setConfirmReset(true)}>
              <RefreshCcw size={14} /> Réinitialiser
            </Button>
          ) : (
            <>
              <Badge variant="grace">As-tu bien réfléchi ?</Badge>
              <Button onClick={() => {
                reset();
                setConfirmReset(false);
              }}>
                Oui, je recommence ma vie spirituelle
              </Button>
              <Button variant="ghost" onClick={() => setConfirmReset(false)}>
                Non, je reste
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
