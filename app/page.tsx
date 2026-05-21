"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";
import { getVersetDuJour } from "@/data/versets";
import { getCitationDuJour } from "@/data/citations";
import { getNiveauPour } from "@/data/niveaux";
import { getProchainFete } from "@/data/calendrier";
import { getTotem } from "@/data/totems";
import { computeProgress, currentChapitreIndex } from "@/lib/voie-progress";
import { computeStreak, streakJalon } from "@/lib/streak";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { HelpButton } from "@/components/liturgical/HelpButton";
import { Sprout, Flame, BookOpen, ScrollText, Gamepad2, Trees, Map, Users, Leaf, Award, LineChart, ChevronRight } from "lucide-react";
import { todayKey, formatDate } from "@/lib/utils";

export default function Sanctuaire() {
  return (
    <div>
      <Hydrated>
        <Decideur />
      </Hydrated>
    </div>
  );
}

function Decideur() {
  const router = useRouter();
  const onboardingFait = useStore((s) => s.onboardingFait);
  useEffect(() => {
    if (!onboardingFait) router.replace("/bienvenue");
  }, [onboardingFait, router]);
  if (!onboardingFait) {
    return (
      <p className="py-20 text-center font-serif italic text-mousse-700 dark:text-parchemin-200/70">
        Quelques instants…
      </p>
    );
  }
  return <HomeContent />;
}

function HomeContent() {
  // Abonnement ciblé : seulement les champs réellement lus par le tableau de bord.
  const state = useStore(
    useShallow((s) => ({
      nomBaptismale: s.nomBaptismale,
      totem: s.totem,
      onboardingFait: s.onboardingFait,
      graines: s.graines,
      dateEntreeOrdre: s.dateEntreeOrdre,
      rituelsParJour: s.rituelsParJour,
      livresChapitresLus: s.livresChapitresLus,
      confessions: s.confessions,
      partiesTetris: s.partiesTetris,
      lignesCompostees: s.lignesCompostees,
      niveauMaxPac: s.niveauMaxPac,
      pollinisateursRecenses: s.pollinisateursRecenses,
      sanctuairesVisites: s.sanctuairesVisites,
      jardin: s.jardin,
      fetesCelebrees: s.fetesCelebrees,
      chapitres: s.chapitres,
      visitesInsectesObservees: s.visitesInsectesObservees,
    }))
  );
  const progress = useMemo(() => computeProgress(state), [state]);
  const currentIdx = currentChapitreIndex(progress);
  const currentChap = progress[currentIdx];
  const verset = useMemo(() => getVersetDuJour(), []);
  const citation = useMemo(() => getCitationDuJour(), []);
  const prochaineF = useMemo(() => getProchainFete(), []);
  const totem = getTotem(state.totem);
  const niveau = getNiveauPour(state.graines);
  const [days, setDays] = useState(0);
  useEffect(() => {
    const d0 = new Date(state.dateEntreeOrdre);
    setDays(Math.max(1, Math.floor((Date.now() - d0.getTime()) / 86400000) + 1));
  }, [state.dateEntreeOrdre]);

  const key = todayKey();
  const ritualsTodayDone = Object.values(state.rituelsParJour[key] ?? {}).filter(Boolean).length;
  const streak = useMemo(() => computeStreak(state.rituelsParJour), [state.rituelsParJour]);
  const jalonStreak = streakJalon(streak.actuel);

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
            {formatDate(new Date())}
          </p>
          <h1 className="titre-liturgique mt-1 text-balance text-3xl text-mousse-800 md:text-4xl dark:text-parchemin-100">
            Que la Sève soit avec toi, {state.nomBaptismale || "Disciple"}
          </h1>
        </div>
      </motion.section>

      {/* État du pèlerin */}
      <Card>
        <CardSubtitle>État du pèlerinage</CardSubtitle>
        <div className="mt-2 grid gap-3 sm:grid-cols-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-ocre-600 dark:text-ocre-400">Palier</p>
            <p className="font-serif text-lg text-mousse-800 dark:text-parchemin-100">
              {niveau.embleme} {niveau.titre}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-ocre-600 dark:text-ocre-400">Graines</p>
            <p className="font-serif text-2xl text-mousse-800 dark:text-parchemin-100">{state.graines}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-ocre-600 dark:text-ocre-400">Jours dans l'Ordre</p>
            <p className="font-serif text-2xl text-mousse-800 dark:text-parchemin-100">{days}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-ocre-600 dark:text-ocre-400">Totem</p>
            <p className="font-serif text-lg text-mousse-800 dark:text-parchemin-100">
              {totem?.embleme} {totem?.nom}
            </p>
          </div>
        </div>
      </Card>

      {/* Chapitre en cours */}
      {currentChap && (
        <Link href="/voie">
          <Card className="border-ocre-500/60 bg-ocre-500/5 transition hover:border-ocre-500/80">
            <div className="flex items-center justify-between gap-2">
              <CardSubtitle>Chapitre en cours</CardSubtitle>
              <span className="font-serif text-xs text-mousse-600 dark:text-parchemin-200/70">
                {progress.filter((p) => p.complete).length}/{progress.length}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <CardTitle>{currentChap.chapitre.titre}</CardTitle>
              <ChevronRight size={20} className="text-ocre-600" />
            </div>
            <p className="mt-1 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
              {currentChap.chapitre.sousTitre}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-mousse-200/40 dark:bg-mousse-900/40">
              <div
                className="h-full bg-gradient-to-r from-mousse-500 via-ocre-500 to-ocre-400"
                style={{ width: `${currentChap.ratio * 100}%` }}
              />
            </div>
          </Card>
        </Link>
      )}

      {/* État du jour */}
      <div className="grid gap-3 md:grid-cols-3">
        <Link href="/rituels">
          <Card className="h-full transition hover:border-ocre-500/40">
            <CardSubtitle>Aujourd'hui</CardSubtitle>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl">✷</span>
              <p className="font-serif text-2xl text-mousse-800 dark:text-parchemin-100">
                {ritualsTodayDone}/7
              </p>
            </div>
            <p className="font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
              {ritualsTodayDone === 0
                ? "Aucun office. Le mycélium attend."
                : ritualsTodayDone === 7
                ? "Sept offices. Sœur Compost danse."
                : "En cours, sans précipitation."}
            </p>
            {streak.actuel > 0 && (
              <p className="mt-1 flex items-center gap-1 font-serif text-xs text-ocre-700 dark:text-ocre-400">
                <Flame size={12} /> {streak.actuel} jour{streak.actuel > 1 ? "s" : ""} d'affilée
                {jalonStreak ? ` · ${jalonStreak}` : ""}
              </p>
            )}
          </Card>
        </Link>
        {prochaineF && (
          <Link href="/calendrier">
            <Card className="h-full transition hover:border-ocre-500/40">
              <CardSubtitle>Prochaine fête</CardSubtitle>
              <CardTitle className="text-lg">{prochaineF.nom}</CardTitle>
              <p className="font-serif text-xs text-mousse-700 dark:text-parchemin-200/70">
                {prochaineF.jour}/{String(prochaineF.mois).padStart(2, "0")}
              </p>
            </Card>
          </Link>
        )}
        <Link href="/jardin">
          <Card className="h-full transition hover:border-ocre-500/40">
            <CardSubtitle>Ton Jardin</CardSubtitle>
            <div className="mt-1 flex items-baseline gap-2">
              <Trees size={20} className="text-mousse-700" />
              <p className="font-serif text-2xl text-mousse-800 dark:text-parchemin-100">
                {new Set(state.jardin.map((p) => p.especeId)).size}
              </p>
            </div>
            <p className="font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
              espèce(s) plantée(s). {state.visitesInsectesObservees} visites observées.
            </p>
          </Card>
        </Link>
      </div>

      {/* Citation et verset en widget */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardSubtitle>Verset du jour</CardSubtitle>
          <p className="mt-1 font-serif text-xs italic text-ocre-700 dark:text-ocre-400">
            {verset.livre} · {verset.reference}
          </p>
          <p className="mt-2 versicle text-mousse-900 dark:text-parchemin-100">« {verset.texte} »</p>
        </Card>
        <Card>
          <CardSubtitle>Parole de l'Ordre</CardSubtitle>
          <p className="mt-2 versicle text-mousse-900 dark:text-parchemin-100">« {citation.texte} »</p>
          {citation.contexte && (
            <p className="mt-2 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
              — {citation.contexte}
            </p>
          )}
        </Card>
      </div>

      {/* Accès rapides */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="titre-liturgique text-xl text-mousse-800 dark:text-parchemin-100">Accès rapides</h2>
          <HelpButton titre="Que faire ici ?">
            <p>
              Le Sanctuaire est ton tableau de bord. Il affiche ton chapitre en cours, l'état de tes rituels du
              jour, ton Jardin, et la prochaine fête liturgique. Clique sur n'importe quelle carte pour t'y rendre.
            </p>
            <p className="mt-3">
              Le parcours principal se trouve dans <strong>La Voie</strong> : neuf chapitres déblocables, qui te
              guideront pendant les semaines à venir. Si tu te demandes quoi faire, va sur La Voie : ton
              prochain objectif y est toujours indiqué.
            </p>
          </HelpButton>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <QuickLink href="/voie" icon={<Sprout size={20} />} label="La Voie" />
          <QuickLink href="/jardin" icon={<Trees size={20} />} label="Le Jardin" />
          <QuickLink href="/rituels" icon={<Flame size={20} />} label="Rituels" />
          <QuickLink href="/livre" icon={<BookOpen size={20} />} label="Livre Sacré" />
          <QuickLink href="/confession" icon={<ScrollText size={20} />} label="Confessionnal" />
          <QuickLink href="/jeu" icon={<Gamepad2 size={20} />} label="Jeux liturgiques" />
          <QuickLink href="/sanctuaires" icon={<Map size={20} />} label="Sanctuaires" />
          <QuickLink href="/hagiographie" icon={<Users size={20} />} label="Hagiographie" />
          <QuickLink href="/almanach" icon={<Leaf size={20} />} label="Almanach" />
          <QuickLink href="/reliques" icon={<Award size={20} />} label="Reliques" />
          <QuickLink href="/annales" icon={<LineChart size={20} />} label="Annales" />
          <QuickLink href="/glossaire" icon={<BookOpen size={20} />} label="Glossaire" />
        </div>
      </section>
    </div>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md border border-ocre-500/20 bg-parchemin-50/70 px-3 py-3 transition hover:border-ocre-500/50 hover:bg-mousse-100/70 dark:bg-mousse-900/40 dark:hover:bg-mousse-800/40"
    >
      <span className="text-ocre-600 dark:text-ocre-400">{icon}</span>
      <span className="font-serif text-sm text-mousse-800 dark:text-parchemin-100">{label}</span>
    </Link>
  );
}
