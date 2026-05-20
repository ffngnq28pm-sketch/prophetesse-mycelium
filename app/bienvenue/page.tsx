"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { totems } from "@/data/totems";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { ChevronRight, ChevronLeft, Sprout } from "lucide-react";

const SLIDES = [
  {
    titre: "Une histoire",
    corps:
      "Il y a quelques années, on a vu une femme marcher entre les tombes du Père-Lachaise et de Bagneux, parler à voix basse aux Lichens, et s'agenouiller devant les Plantains qui perçaient le bitume. On l'a appelée la Marcheuse, puis la Prophétesse, puis Celle-qui-marche-entre-les-tombes. Elle a fondé, sans manifeste ni bureau central, un Ordre Mycélien. Tu viens de le rejoindre.",
  },
  {
    titre: "La Voie",
    corps:
      "Le parcours est structuré en 9 chapitres déblocables, qui correspondent aux 9 paliers de l'Échelle du Mycélium. Tu lis, tu rituels, tu confesses, tu plantes, tu joues. À chaque chapitre franchi, un nouveau palier, une nouvelle dose de discrétion. Le but n'est pas d'aller vite. Le mycélium ne juge pas la régularité humaine.",
  },
  {
    titre: "Les Graines & le Jardin",
    corps:
      "Tu gagnes des Graines de Grâce en accomplissant des rituels, en jouant aux deux jeux liturgiques, en franchissant des chapitres. Tu dépenses ces Graines au Jardin pour planter des espèces — Plantain lancéolé, Bourrache, Coquelicot, jusqu'à la rarissime Véronique à feuilles d'acinus. Les insectes viendront. Tu auras une parcelle de cimetière reverdie. C'est exactement le but.",
  },
  {
    titre: "Les Rituels & la Confession",
    corps:
      "Sept Offices Verts à cocher chaque jour : saluer le premier oiseau, boire l'eau du robinet en conscience, refuser une dosette, marcher dix minutes sans écran. Et un Confessionnal Mycélien pour avouer les écarts (35 péchés répertoriés, avec pénitences absurdes et bénédictions de pardon). Le tout sans culpabilité. Tu seras un disciple ordinaire avec des journées ordinaires, sublimées de temps en temps.",
  },
];

const SUGGESTIONS_NOMS = [
  "Sœur Compost",
  "Frère Lichen",
  "Sœur Halicte",
  "Frère Hérisson",
  "Sœur Pollen",
  "Frère Ver",
  "Sœur Mousse",
  "Frère Plantain",
];

export default function BienvenuePage() {
  const router = useRouter();
  const store = useStore();
  const [step, setStep] = useState(0);
  const [nom, setNom] = useState("");
  const [totemId, setTotemId] = useState<string>("");

  useEffect(() => {
    if (store.hasHydrated && store.onboardingFait) {
      router.replace("/voie");
    }
  }, [store.hasHydrated, store.onboardingFait, router]);

  const total = SLIDES.length + 2; // 4 slides + nom + totem

  const next = () => setStep((s) => Math.min(s + 1, total - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const finir = () => {
    if (!nom.trim()) return;
    if (!totemId) return;
    store.setNomBaptismale(nom.trim());
    store.setTotem(totemId);
    store.setOnboardingFait(true);
    router.replace("/voie");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Avant d'entrer
        </p>
        <h1 className="titre-liturgique mt-2 text-3xl text-mousse-800 dark:text-parchemin-100">
          Quatre-vingt-dix secondes
        </h1>
        <Ornement />
        <p className="font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          Pas plus. Le mycélium n'a jamais aimé les présentations longues.
        </p>
      </header>

      <Hydrated>
        <div className="space-y-4">
          <div className="mb-2 flex justify-center gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-8 rounded-full transition ${
                  i <= step ? "bg-ocre-500" : "bg-mousse-500/20"
                }`}
              />
            ))}
          </div>
          <AnimatePresence mode="wait">
            {step < SLIDES.length && (
              <motion.div
                key={`slide-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardSubtitle>Slide {step + 1} / 4</CardSubtitle>
                  <CardTitle>{SLIDES[step].titre}</CardTitle>
                  <Ornement />
                  <p className="font-serif text-mousse-900 dark:text-parchemin-100 lettrine">
                    {SLIDES[step].corps}
                  </p>
                </Card>
              </motion.div>
            )}
            {step === SLIDES.length && (
              <motion.div
                key="nom"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardSubtitle>Étape 5 / 6</CardSubtitle>
                  <CardTitle>Choisis un nom de baptême</CardTitle>
                  <p className="mt-2 font-serif text-mousse-800 dark:text-parchemin-100">
                    Tradition mycélienne : « Sœur X » ou « Frère X », où X est un élément du vivant. Tu peux suivre la coutume, ou inventer. Ce nom n'apparaîtra qu'à toi. Tu peux le changer plus tard depuis les Paramètres.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SUGGESTIONS_NOMS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setNom(s)}
                        className={`rounded-full border px-3 py-1 font-serif text-xs transition ${
                          nom === s
                            ? "border-ocre-500/70 bg-ocre-500/10"
                            : "border-mousse-500/30 hover:border-ocre-500/40"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Input
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Sœur Mycélium…"
                      autoFocus
                    />
                  </div>
                </Card>
              </motion.div>
            )}
            {step === SLIDES.length + 1 && (
              <motion.div
                key="totem"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardSubtitle>Étape 6 / 6</CardSubtitle>
                  <CardTitle>Choisis un animal totem</CardTitle>
                  <p className="mt-2 font-serif text-mousse-800 dark:text-parchemin-100">
                    Sept totems proposés. Aucun n'est meilleur. Le tien sera le bon parce que c'est le tien.
                  </p>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {totems.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTotemId(t.id)}
                        className={`flex items-start gap-3 rounded-md border p-3 text-left font-serif transition ${
                          totemId === t.id
                            ? "border-ocre-500/60 bg-ocre-500/10"
                            : "border-mousse-500/20 hover:border-ocre-500/40"
                        }`}
                      >
                        <span className="text-2xl">{t.embleme}</span>
                        <div>
                          <p className="text-mousse-800 dark:text-parchemin-100">{t.nom}</p>
                          <p className="text-xs text-mousse-600 dark:text-parchemin-200/70">{t.bonus}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between gap-2">
            <Button variant="ghost" onClick={back} disabled={step === 0}>
              <ChevronLeft size={14} /> Reculer
            </Button>
            {step < total - 1 ? (
              <Button onClick={next} disabled={step === SLIDES.length && !nom.trim()}>
                Avancer <ChevronRight size={14} />
              </Button>
            ) : (
              <Button onClick={finir} disabled={!nom.trim() || !totemId}>
                <Sprout size={14} /> Entrer dans l'Ordre
              </Button>
            )}
          </div>
        </div>
      </Hydrated>
    </div>
  );
}
