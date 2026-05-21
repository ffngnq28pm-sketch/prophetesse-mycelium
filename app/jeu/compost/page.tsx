"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Tetris } from "@/components/game/Tetris";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { HelpButton } from "@/components/liturgical/HelpButton";
import { TutorialOverlay, Etape } from "@/components/game/TutorialOverlay";
import { ChevronLeft } from "lucide-react";

const TUTO_TETRIS: Etape[] = [
  {
    titre: "1 · Trois catégories de déchets",
    texte:
      "Chaque tétromino qui tombe est un déchet. Il est soit COMPOSTABLE (épluchure, marc de café, feuille morte, trognon, coquille d'œuf), soit RECYCLABLE (carton, verre, papier, conserve), soit MAUDIT (dosette d'aluminium, pile usagée, sac plastique).",
  },
  {
    titre: "2 · Empile, comme au Tetris classique",
    texte:
      "Flèches gauche/droite pour déplacer. Flèche haut pour rotation. Flèche bas pour descente douce. Espace pour chute rapide (hard drop). Sur mobile : swipe + tap.",
  },
  {
    titre: "3 · Ligne sainte = bénédiction",
    texte:
      "Quand tu remplis une ligne entière avec UNIQUEMENT des déchets compostables, c'est une ligne sainte. +80 points bonus. Sœur Compost danse. Mère Mycorhize sourit imperceptiblement.",
  },
  {
    titre: "4 · Maudit dans la ligne = malédiction",
    texte:
      "Si une ligne pleine contient un déchet maudit (dosette/pile/plastique), c'est ‐15 par case maudite et l'Ordre détourne le regard. Évite à tout prix de mélanger.",
  },
  {
    titre: "5 · Score → Graines de Grâce",
    texte:
      "À la fin de chaque partie, ton score est divisé par 50 pour obtenir des Graines de Grâce. Ces Graines servent à planter au Jardin. Joue, gagne, plante. C'est la boucle.",
  },
];

export default function TetrisPage() {
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
          Jeu I — Tetris
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Tetris du Compost
        </h1>
        <Ornement />
        <p className="mx-auto max-w-2xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Empile, trie, médite. Les déchets compostables nourrissent la terre. Les recyclables retournent dans le cycle industriel. Les maudits, eux, déclenchent une malédiction du Mycélium s'ils participent à une ligne. Joue lentement. Sois Hérisson. »
        </p>
      </header>

      <Hydrated>
        <JeuContent />
      </Hydrated>
    </div>
  );
}

function JeuContent() {
  const enregistrer = useStore((s) => s.enregistrerScoreTetris);
  const ajouterGraines = useStore((s) => s.ajouterGraines);
  const meilleur = useStore((s) => s.meilleurScoreTetris);
  const parties = useStore((s) => s.partiesTetris);
  const lignes = useStore((s) => s.lignesCompostees);
  const tutoFait = useStore((s) => s.tutoTetrisFait);
  const setTutoFait = useStore((s) => s.setTutoTetrisFait);
  const [showTuto, setShowTuto] = useState(!tutoFait);

  const onGameOver = (score: number, l: number) => {
    enregistrer(score, l);
    const recompense = Math.floor(score / 50);
    if (recompense > 0) ajouterGraines(recompense);
  };

  const kg = lignes * 2;

  return (
    <div className="space-y-4">
      {showTuto && (
        <TutorialOverlay
          titreOuverture="Tutoriel · Tetris du Compost"
          etapes={TUTO_TETRIS}
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
          <Badge variant="outline">Parties : {parties}</Badge>
          <Badge variant="outline">{kg} kg de matière compostée</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTuto(true)}
            className="rounded-full border border-mousse-500/30 px-3 py-1 font-serif text-xs hover:border-ocre-500/50"
          >
            Revoir le tutoriel
          </button>
          <HelpButton titre="Tetris du Compost — Règles">
            <p>Empile des déchets en tétrominoes. Trois catégories : compost, recyclable, maudit.</p>
            <p className="mt-2"><strong>Ligne sainte (100% compost) :</strong> +80 bonus</p>
            <p><strong>Compost ×30 / Recyclable ×12 :</strong> par case dans une ligne pleine</p>
            <p><strong>Maudit dans une ligne :</strong> ‐15 par case + malédiction</p>
            <p><strong>Hard drop :</strong> +2 par cellule</p>
            <p><strong>Combo :</strong> +25 par ligne supplémentaire</p>
            <p className="mt-3 text-xs italic">Score ÷ 50 = Graines de Grâce gagnées (à planter au Jardin).</p>
          </HelpButton>
        </div>
      </div>

      <Tetris onGameOver={onGameOver} meilleurScore={meilleur} />

      <Card>
        <CardSubtitle>Contribution à l'Ordre</CardSubtitle>
        <CardTitle>
          Tu as composté l'équivalent de <strong>{kg} kg de matière organique sacrée</strong>
        </CardTitle>
        <p className="mt-2 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
          {kg === 0
            ? "Aucune ligne pour l'instant. C'est le moment de commencer, statistiquement."
            : kg < 20
            ? "C'est le début. Frère Lichen a mis trois ans à composter son premier kilo, à titre de comparaison."
            : kg < 100
            ? "Honorable. Sœur Compost noterait probablement quelque chose dans son carnet."
            : "Considérable. Mère Mycorhize, dit-on, te remarque."}
        </p>
      </Card>
    </div>
  );
}
