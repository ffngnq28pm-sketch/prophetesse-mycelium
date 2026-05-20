"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { PacOlivia } from "@/components/game/PacOlivia";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { HelpButton } from "@/components/liturgical/HelpButton";
import { TutorialOverlay, Etape } from "@/components/game/TutorialOverlay";
import { ChevronLeft } from "lucide-react";

const TUTO_PAC: Etape[] = [
  {
    titre: "1 · Tu incarnes la Prophétesse",
    texte:
      "Tu incarnes la Prophétesse — Celle-qui-marche-entre-les-tombes. Port altier, mâchoire sûre, une chevelure blonde sous la casquette rouge ; mais ce qu'on retient, ce sont ses yeux : marron, perçants, où couvent une intelligence aiguisée et une volonté que rien ne courbe. Sous ce calme, un feu. Filet à la main, elle s'avance entre les sépultures d'Île-de-France non pour capturer les pollinisateurs, mais pour les recenser, les nommer, les honorer. Recenser plutôt que prendre : c'est là toute sa grâce.",
  },
  {
    titre: "2 · Déplace-toi",
    texte:
      "Clavier : flèches directionnelles, ou ZQSD/WASD. Mobile : swipe dans la direction voulue. Espace ou tap pour mettre en pause.",
  },
  {
    titre: "3 · Évite les fantômes",
    texte:
      "Quatre défunts marris patrouillent : Sieur Cendrillon (lent), Dame Précieuse (anticipe), Petit Marcel (erratique), L'Innommé (devient agressif tardivement). Si tu les touches, tu perds une vie. Tu as 3 vies.",
  },
  {
    titre: "4 · Sainte Colère",
    texte:
      "Bois une Gorgée de Café Filtre (les tasses fumantes dans les coins) : tu entres en Sainte Colère pendant 8 secondes. Pendant ce temps, les fantômes deviennent bleus tremblotants et tu peux les tabasser au filet (+200 points, combo bonus).",
  },
  {
    titre: "5 · Recense tous les insectes",
    texte:
      "Quand tous les insectes d'un cimetière sont recensés, tu passes au niveau suivant. Cinq cimetières au total : Père-Lachaise, Bagneux, Montparnasse, Pantin, Fontainebleau. Difficulté croissante. Score ÷ 80 = Graines de Grâce gagnées.",
  },
];

export default function PacOliviaPage() {
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
          Jeu II — La Chasse aux Pollinisateurs
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Recense les insectes, évite les fantômes
        </h1>
        <Ornement />
        <p className="mx-auto max-w-2xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Une disciple entre dans les cimetières d'Île-de-France pour recenser les pollinisateurs (et accessoirement éviter d'être attrapée par les défunts marris). Elle ne les tue jamais. Elle les recense, ce qui est une posture beaucoup plus saine, et accessoirement gratifiante au sens du score. »
        </p>
      </header>

      <Hydrated>
        <Contenu />
      </Hydrated>
    </div>
  );
}

function Contenu() {
  const enregistrer = useStore((s) => s.enregistrerScorePac);
  const ajouterGraines = useStore((s) => s.ajouterGraines);
  const meilleur = useStore((s) => s.meilleurScorePac);
  const niveauMax = useStore((s) => s.niveauMaxPac);
  const parties = useStore((s) => s.partiesPac);
  const fantomes = useStore((s) => s.fantomesTabasses);
  const pollinisateurs = useStore((s) => s.pollinisateursRecenses);
  const tutoFait = useStore((s) => s.tutoPacFait);
  const setTutoFait = useStore((s) => s.setTutoPacFait);
  const [showTuto, setShowTuto] = useState(!tutoFait);

  const onGameOver = (score: number, niveauAtteint: number, fantomesP: number) => {
    // Calculer pollinisateurs approximativement: score lié à insectes (~10 par insecte commun, ~50 rare)
    // On est imprécis mais ça compte. Le jeu actuel n'expose pas le compte direct,
    // on l'estime grossièrement: score sans hits = score / ~12 → mais on ne sait pas.
    // On utilise une approximation: score moyen par insecte ≈ 12.
    const pollinisateursEstime = Math.max(0, Math.floor((score - fantomesP * 200) / 12));
    enregistrer(score, niveauAtteint, fantomesP, pollinisateursEstime);
    const recompense = Math.floor(score / 80);
    if (recompense > 0) ajouterGraines(recompense);
  };

  return (
    <div className="space-y-4">
      {showTuto && (
        <TutorialOverlay
          titreOuverture="Tutoriel · La Chasse aux Pollinisateurs"
          etapes={TUTO_PAC}
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
          <Badge variant="grace">Meilleur : {meilleur}</Badge>
          <Badge variant="outline">Niveau atteint max : {niveauMax}/5</Badge>
          <Badge variant="outline">Parties : {parties}</Badge>
          <Badge variant="outline">{pollinisateurs} pollinisateurs recensés (total)</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTuto(true)}
            className="rounded-full border border-mousse-500/30 px-3 py-1 font-serif text-xs hover:border-ocre-500/50"
          >
            Revoir le tutoriel
          </button>
          <HelpButton titre="Chasse aux Pollinisateurs — Règles">
            <p><strong>Insecte commun</strong> (Halicte, papillon, mouche, cimbicide) : +10 points</p>
            <p><strong>Bourdon cotonneux (rare)</strong> : +50 points. Une vraie bénédiction.</p>
            <p><strong>Gorgée de Café Filtre</strong> : +50 + Sainte Colère 8s.</p>
            <p><strong>Tabasser un fantôme (en Sainte Colère)</strong> : +200, combo bonus.</p>
            <p className="mt-2"><strong>5 niveaux</strong> : Père-Lachaise (facile) → Bagneux → Montparnasse → Pantin → Fontainebleau (difficile).</p>
            <p><strong>3 vies.</strong> Sois prudent·e.</p>
            <p className="mt-3 text-xs italic">Score ÷ 80 = Graines de Grâce gagnées (à planter au Jardin).</p>
          </HelpButton>
        </div>
      </div>

      <PacOlivia onGameOver={onGameOver} />

      <Card>
        <CardSubtitle>Contribution à la biodiversité documentée</CardSubtitle>
        <CardTitle>
          {pollinisateurs} pollinisateur{pollinisateurs > 1 ? "s" : ""} recensé{pollinisateurs > 1 ? "s" : ""} cette saison
        </CardTitle>
        <p className="mt-2 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
          {pollinisateurs === 0
            ? "Aucun pour le moment. Frère Pollen attend ton rapport, sans pression."
            : pollinisateurs < 50
            ? "C'est un début. Sœur Halicte hoche la tête."
            : pollinisateurs < 200
            ? "On progresse. Tu pourrais figurer dans un protocole SPIPOLL informel."
            : "C'est sérieux. L'Ordre commence à se demander si tu n'es pas Mère Mycorhize en version jeune."}
        </p>
      </Card>
    </div>
  );
}
