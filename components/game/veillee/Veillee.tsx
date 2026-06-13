"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVeillee } from "@/lib/veillee-store";
import { SCEAUX, SCEAUX_ACTIFS, getSceau } from "@/data/veillee";
import { SceneFond } from "./SceneFond";
import { CadranLichen } from "./CadranLichen";
import { HorlogeFlorale } from "./HorlogeFlorale";
import { Pollinisateurs } from "./Pollinisateurs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, X, ChevronLeft, Lock, Check } from "lucide-react";

type SceneId = "portail" | string;

export function Veillee() {
  const hasHydrated = useVeillee((s) => s.hasHydrated);
  const sceauxResolus = useVeillee((s) => s.sceauxResolus);
  const indices = useVeillee((s) => s.indices);
  const essais = useVeillee((s) => s.essais);
  const reset = useVeillee((s) => s.reset);

  const [scene, setScene] = useState<SceneId>("portail");
  const [carnetOuvert, setCarnetOuvert] = useState(false);
  const [raille, setRaille] = useState<string | null>(null);
  const [gagne, setGagne] = useState(false);

  const tousActifsResolus = SCEAUX_ACTIFS.every((s) => sceauxResolus.includes(s.id));

  if (!hasHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center font-serif italic text-mousse-700 dark:text-parchemin-200/70">
        « La friche s'assombrit, la Veillée commence… »
      </div>
    );
  }

  const recommencer = () => {
    reset();
    setGagne(false);
    setScene("portail");
    setCarnetOuvert(false);
  };

  const ouvrirPortail = () => {
    if (tousActifsResolus) setGagne(true);
  };

  const sceauCourant = scene !== "portail" ? getSceau(scene) : null;

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* Barre haute : carnet + recommencer */}
      <div className="mb-2 flex items-center justify-between">
        <p className="font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/70">
          {scene === "portail" ? "Le portail refermé" : sceauCourant ? `Sceau ${sceauCourant.numero} · ${sceauCourant.titre}` : ""}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCarnetOuvert(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-ocre-500/40 bg-mousse-950/40 px-3 py-1.5 text-xs text-parchemin-100 backdrop-blur-sm"
          >
            <BookOpen size={14} /> Carnet ({SCEAUX_ACTIFS.filter((s) => sceauxResolus.includes(s.id)).length}/{SCEAUX_ACTIFS.length})
          </button>
        </div>
      </div>

      {/* ══ Scène ══ */}
      <SceneFond fond={scene === "portail" ? "portail" : sceauCourant?.fond ?? "portail"} className="aspect-[16/10]">
        <div className="flex h-full flex-col p-5 md:p-8">
          {scene === "portail" ? (
            <Accueil
              indices={indices}
              sceauxResolus={sceauxResolus}
              tousActifsResolus={tousActifsResolus}
              onVisiter={(id, actif) => {
                if (actif) setScene(id);
                else setRaille("Ce sceau dort encore — il s'éveillera à une prochaine veillée. (À venir.)");
              }}
              onOuvrir={ouvrirPortail}
            />
          ) : sceauCourant?.actif ? (
            <SceneSceau onRetour={() => setScene("portail")}>
              <InteractionSceau id={sceauCourant.id} onResolu={() => setScene("portail")} />
            </SceneSceau>
          ) : (
            <SceneSceau onRetour={() => setScene("portail")}>
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Badge variant="outline">À venir</Badge>
                <p className="mx-auto mt-3 max-w-md font-serif italic text-parchemin-100">
                  {sceauCourant?.resume}
                </p>
                <p className="mt-2 font-serif text-sm italic text-parchemin-200/70">{sceauCourant?.defunt}</p>
              </div>
            </SceneSceau>
          )}
        </div>
      </SceneFond>

      <p className="mt-3 text-center font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
        Pas de chrono. L'Ordre est celui des lents et des patients.{" "}
        <button onClick={recommencer} className="underline-offset-2 hover:underline">
          Recommencer la Veillée
        </button>
      </p>

      {/* ── Raillerie transitoire (clic sur sceau inactif, etc.) ── */}
      <AnimatePresence>
        {raille && (
          <motion.button
            key={raille}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={() => setRaille(null)}
            className="fixed bottom-6 left-1/2 z-40 max-w-[92%] -translate-x-1/2 rounded-full border border-ocre-400/40 bg-mousse-950/85 px-4 py-2 text-center font-serif text-sm italic text-parchemin-100 backdrop-blur"
          >
            {raille}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Carnet ── */}
      <AnimatePresence>
        {carnetOuvert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-mousse-950/70 p-4 backdrop-blur-sm"
            onClick={() => setCarnetOuvert(false)}
          >
            <div
              className="w-full max-w-md rounded-xl border-2 border-ocre-500/40 bg-parchemin-50/95 p-6 shadow-2xl dark:bg-mousse-900/90"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="titre-liturgique text-2xl text-mousse-800 dark:text-parchemin-100">
                  Le Carnet de la Veillée
                </h3>
                <button onClick={() => setCarnetOuvert(false)} aria-label="Fermer" className="text-mousse-600 dark:text-parchemin-200/70">
                  <X size={18} />
                </button>
              </div>
              <div className="ornement" />
              <ul className="mt-2 space-y-2">
                {SCEAUX_ACTIFS.map((s) => {
                  const ouvert = sceauxResolus.includes(s.id);
                  return (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-3 rounded-md border border-ocre-500/20 bg-parchemin-50/60 px-3 py-2 dark:bg-mousse-950/40"
                    >
                      <span className="font-serif text-sm text-mousse-900 dark:text-parchemin-100">
                        Sceau {s.numero} — {s.titre}
                      </span>
                      {ouvert ? (
                        <Badge variant="grace">
                          <Check size={13} /> {indices[s.id]}
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <Lock size={12} /> non résolu
                        </Badge>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
                Les indices des sceaux actifs, réunis, ouvrent le Portail. Les quatre autres sceaux
                s'éveilleront à une prochaine veillée.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Écran de fin ── */}
      <AnimatePresence>
        {gagne && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-mousse-950/85 p-4 backdrop-blur"
          >
            <div className="w-full max-w-lg rounded-xl border-2 border-ocre-500/50 bg-mousse-950/70 p-8 text-center text-parchemin-50 shadow-2xl">
              {/* mycélium qui s'illumine */}
              <div className="mx-auto mb-3 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-ocre-300 via-ocre-500 to-mousse-600 shadow-[0_0_40px_rgba(201,162,39,0.6)]" />
              <p className="text-xs uppercase tracking-[0.3em] text-ocre-300">La Veillée est accomplie</p>
              <h2 className="titre-liturgique mt-2 text-3xl">Le portail s'ouvre à l'aube</h2>
              <div className="ornement" />
              <p className="mx-auto max-w-md font-serif italic text-parchemin-100">
                Le portail s'ouvre, non parce que tu l'as forcé, mais parce que tu as <strong className="not-italic">regardé</strong>.
                L'Ordre te compte désormais parmi les patients. Les trois défunts applaudissent mollement —
                Sieur Cendrillon prétend qu'il aurait fait plus vite.
              </p>
              <p className="mt-3 font-serif text-sm text-parchemin-200/80">
                {essais === 0 ? "Veillée limpide — pas une fausse note." : `Veillée tâtonnante — ${essais} essai${essais > 1 ? "s" : ""} de trop, mais arrivée quand même.`}
              </p>
              <div className="mt-5 flex justify-center gap-2">
                <Button onClick={recommencer}>Recommencer la Veillée</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Aiguille les sceaux actifs vers leur interaction propre.
function InteractionSceau({ id, onResolu }: { id: string; onResolu: () => void }) {
  switch (id) {
    case "cadran":
      return <CadranLichen onResolu={onResolu} />;
    case "horloge":
      return <HorlogeFlorale onResolu={onResolu} />;
    case "pollinisateurs":
      return <Pollinisateurs onResolu={onResolu} />;
    default:
      return null;
  }
}

// Wrapper d'une scène de sceau : bouton retour + contenu.
function SceneSceau({ children, onRetour }: { children: React.ReactNode; onRetour: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <button
        onClick={onRetour}
        className="mb-2 inline-flex w-fit items-center gap-1 rounded-full border border-ocre-400/40 bg-mousse-950/40 px-3 py-1 text-xs text-parchemin-100 backdrop-blur-sm"
      >
        <ChevronLeft size={14} /> Au portail
      </button>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

// Scène d'accueil = le portail : règlement, médaillons des sceaux, serrure.
function Accueil({
  indices,
  sceauxResolus,
  tousActifsResolus,
  onVisiter,
  onOuvrir,
}: {
  indices: Record<string, string>;
  sceauxResolus: string[];
  tousActifsResolus: boolean;
  onVisiter: (id: string, actif: boolean) => void;
  onOuvrir: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="rounded-md border border-ocre-400/30 bg-mousse-950/50 p-3 text-center backdrop-blur-sm">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-ocre-300">Règlement de la Veillée</p>
        <p className="mt-1 font-serif text-sm italic leading-relaxed text-parchemin-100">
          Art. 1 : on ne court pas après les morts, c'est mal élevé et inefficace. Art. 2 : la nature
          ne triche pas. Toi non plus. Art. 3 : cinq sceaux. Une aube. Bon courage.
        </p>
      </div>

      {/* Médaillons des sceaux (serrure à crans : un cran par sceau actif). */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {SCEAUX.map((s) => {
          const ouvert = sceauxResolus.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => onVisiter(s.id, s.actif)}
              className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition ${
                s.actif
                  ? "border-ocre-400/50 bg-mousse-950/45 hover:border-ocre-300"
                  : "border-parchemin-200/15 bg-mousse-950/30 opacity-70"
              }`}
            >
              <span className="font-serif text-lg text-parchemin-100">{s.numero}</span>
              <span className="text-lg">
                {ouvert ? <span className="text-ocre-200">{indices[s.id]}</span> : s.actif ? "🔒" : "·"}
              </span>
              <span className="text-[9px] leading-tight text-parchemin-200/70">{s.actif ? "" : "à venir"}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-4 text-center">
        <Button onClick={onOuvrir} disabled={!tousActifsResolus}>
          {tousActifsResolus ? "Tenter l'ouverture du Portail" : "Le Portail attend les sceaux actifs"}
        </Button>
      </div>
    </div>
  );
}
