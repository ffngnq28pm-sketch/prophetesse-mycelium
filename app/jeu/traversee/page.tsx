"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useStore } from "@/lib/store";
import type { TraverseeResult } from "@/components/game/LaTraversee";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { HelpButton } from "@/components/liturgical/HelpButton";
import { TutorialOverlay, Etape } from "@/components/game/TutorialOverlay";
import { ChevronLeft } from "lucide-react";

// Le moteur du platformer est lourd : on le charge à la demande, côté client
// uniquement, pour ne peser que sur cette route (pas sur le First Load des autres).
const LaTraversee = dynamic(
  () => import("@/components/game/LaTraversee").then((m) => m.LaTraversee),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto flex aspect-[16/10] w-full max-w-3xl items-center justify-center rounded-xl border-2 border-ocre-500/40 bg-mousse-950/80 font-serif italic text-parchemin-200/70">
        « Le sentier s'ouvre sous la brume… »
      </div>
    ),
  }
);

const TUTO: Etape[] = [
  {
    titre: "1 · La Marcheuse, casquette rouge",
    texte:
      "Tu guides la Marcheuse, filet à la main, à travers un cimetière que le mycélium a patiemment reverdi. Sa casquette rouge est le seul éclat vif sur la brume. Mène-la jusqu'au Sanctuaire, au bout du sentier.",
  },
  {
    titre: "2 · Avancer et bondir",
    texte:
      "Clavier : flèches ou ZQSD pour avancer, Espace (ou ↑) pour sauter. Mobile : les boutons à l'écran (gauche/droite à gauche, saut et filet à droite). Maintiens le saut pour bondir plus haut.",
  },
  {
    titre: "3 · Le filet convertit",
    texte:
      "Touche « filet » (K au clavier, 🥅 sur mobile) pour balayer devant toi : tu attrapes les pollinisateurs (Halictes dorés, papillons) et tu neutralises en douceur les pièges — une dosette devient compost, une flaque de pesticide reverdit. On convertit, on ne détruit pas.",
  },
  {
    titre: "4 · Évite la modernité",
    texte:
      "Dosettes qui roulent, flaques de pesticide, tondeuses en patrouille : saute par-dessus ou neutralise-les au filet. Si tu trébuches ou tombes, pas de game over : le mycélium te redonne pied au dernier point sûr.",
  },
  {
    titre: "5 · Le Sanctuaire",
    texte:
      "Au bout du sentier t'attend le grand If sacré. L'atteindre clôt la traversée. On retient ton temps et le nombre de pollinisateurs sauvés. Chaque pollinisateur et chaque graine ramassée nourrissent ton Jardin.",
  },
];

export default function TraverseePage() {
  return (
    <div>
      <Link
        href="/jeu"
        className="mb-4 inline-flex items-center gap-1 font-serif text-sm text-mousse-700 hover:text-ocre-600 dark:text-parchemin-200/80"
      >
        <ChevronLeft size={16} /> Retour aux Jeux
      </Link>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Jeu IV — Le Sentier des Spores
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          La traversée de la Marcheuse
        </h1>
        <Ornement />
        <p className="mx-auto max-w-2xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Casquette rouge sur la brume, filet à la main, elle saute de tombe reverdie en tronc couché, composte les
          dosettes qui roulent et rejoint, au bout du sentier, le grand If sacré. Ce n'est pas une course : c'est un
          pèlerinage qui bondit. »
        </p>
      </header>

      <Hydrated>
        <Contenu />
      </Hydrated>
    </div>
  );
}

function Contenu() {
  const enregistrer = useStore((s) => s.enregistrerScoreTraversee);
  const ajouterGraines = useStore((s) => s.ajouterGraines);
  const meilleurTemps = useStore((s) => s.meilleurTempsTraversee);
  const meilleursPoll = useStore((s) => s.meilleursPollinisateursTraversee);
  const parties = useStore((s) => s.partiesTraversee);
  const sansDosette = useStore((s) => s.traverseeSansDosette);
  const tutoFait = useStore((s) => s.tutoTraverseeFait);
  const setTutoFait = useStore((s) => s.setTutoTraverseeFait);
  const [showTuto, setShowTuto] = useState(!tutoFait);

  const onWin = (r: TraverseeResult) => {
    enregistrer(r.tempsMs, r.pollinisateurs, r.sansDosette);
    if (r.graines > 0) ajouterGraines(r.graines);
  };

  const tempsLabel =
    meilleurTemps > 0
      ? `${Math.floor(meilleurTemps / 60000)}:${Math.floor((meilleurTemps % 60000) / 1000)
          .toString()
          .padStart(2, "0")}`
      : "—";

  return (
    <div className="space-y-4">
      {showTuto && (
        <TutorialOverlay
          titreOuverture="Tutoriel · Le Sentier des Spores"
          etapes={TUTO}
          onFini={() => {
            setTutoFait(true);
            setShowTuto(false);
          }}
          onSkip={() => {
            setTutoFait(true);
            setShowTuto(false);
          }}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="grace">Meilleur temps : {tempsLabel}</Badge>
          <Badge variant="outline">Record pollinisateurs : {meilleursPoll}/10</Badge>
          <Badge variant="outline">Traversées : {parties}</Badge>
          {sansDosette && <Badge variant="grace">Déjà réussi sans dosette ☕</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTuto(true)}
            className="rounded-full border border-mousse-500/30 px-3 py-1 font-serif text-xs hover:border-ocre-500/50"
          >
            Revoir le tutoriel
          </button>
          <HelpButton titre="Le Sentier des Spores — Règles">
            <p><strong>But</strong> : rejoindre le Sanctuaire (le grand If sacré) au bout du sentier.</p>
            <p className="mt-1"><strong>Filet</strong> : attrape les pollinisateurs (+ recensement), composte les dosettes, fait reverdir le pesticide.</p>
            <p className="mt-1"><strong>Pièges</strong> : dosettes qui roulent, pesticide, tondeuses. On les évite ou on les neutralise — jamais de violence.</p>
            <p className="mt-1"><strong>Pas de game over</strong> : tomber ou trébucher te ramène au dernier point sûr.</p>
            <p className="mt-1"><strong>Contrôles</strong> : flèches/ZQSD + Espace (saut) + K (filet) au clavier ; boutons tactiles sur mobile.</p>
            <p className="mt-2 text-xs italic">Chaque pollinisateur sauvé et chaque graine ramassée s'ajoutent à tes Graines de Grâce.</p>
          </HelpButton>
        </div>
      </div>

      <LaTraversee onWin={onWin} />

      <Card>
        <CardSubtitle>Le pèlerinage qui bondit</CardSubtitle>
        <CardTitle>
          {parties === 0
            ? "Le sentier t'attend"
            : meilleursPoll >= 10
            ? "Tous les pollinisateurs sauvés"
            : `${meilleursPoll}/10 pollinisateurs au mieux`}
        </CardTitle>
        <p className="mt-2 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
          {parties === 0
            ? "Frère Lichen a balisé le chemin de fleurs invisibles. Elles n'apparaissent que sous tes pas."
            : meilleursPoll >= 10
            ? "Sœur Halicte a posé ton nom sur un nid, là où personne ne le verra. C'est la plus haute distinction de l'Ordre."
            : "Le sentier se rejoue. Chaque traversée, quelques pollinisateurs de plus, quelques secondes de moins."}
        </p>
      </Card>
    </div>
  );
}
