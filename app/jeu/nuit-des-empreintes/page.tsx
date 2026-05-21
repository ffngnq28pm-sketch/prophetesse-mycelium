"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { NuitDesEmpreintes } from "@/components/game/NuitDesEmpreintes";
import { recompenseGraines } from "@/lib/empreintes-engine";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { HelpButton } from "@/components/liturgical/HelpButton";
import { TutorialOverlay, Etape } from "@/components/game/TutorialOverlay";
import { ChevronLeft } from "lucide-react";

const TUTO_EMPREINTES: Etape[] = [
  {
    titre: "1 · Un puzzle de déduction",
    texte:
      "Le cimetière, la nuit, cache des chats et de la faune. Ton but : recenser les bêtes sans déranger un seul chat. Trois cimetières t'attendent, de plus en plus vastes.",
  },
  {
    titre: "2 · Sonde une case",
    texte:
      "Clique une case pour la sonder. Si elle est sûre, un chiffre apparaît : le nombre de chats dans les huit cases voisines. Une case sans aucun chat voisin ouvre toute la zone autour d'elle.",
  },
  {
    titre: "3 · Déduis où dorment les chats",
    texte:
      "Croise les chiffres : si un « 1 » ne touche plus qu'une seule case cachée, le chat est forcément là. Passe en mode Marquer pour y planter un drapeau — une case marquée ne peut plus être sondée par erreur.",
  },
  {
    titre: "4 · Recense la faune",
    texte:
      "Chaque case sûre que tu dégages peut révéler une bête — hérisson, micromammifère, ou la rare fouine. Dégage tout le terrain sûr pour relever le cimetière entier. Sonder un chat effraie la colonie : la nuit s'arrête.",
  },
  {
    titre: "5 · Score → Graines de Grâce",
    texte:
      "Chaque bête recensée rapporte des points — la fouine le plus. Relever un cimetière entier sans faute donne un bonus. À la fin, ton score divisé par 50 devient des Graines de Grâce, à planter au Jardin.",
  },
];

export default function NuitDesEmpreintesPage() {
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
          Jeu III — La Nuit des Empreintes
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Lis ce que la nuit a laissé
        </h1>
        <Ornement />
        <p className="mx-auto max-w-2xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « La nuit, le cimetière appartient aux bêtes discrètes. On ne les voit pas — on les déduit. Un chiffre, puis un autre, et la carte de l'invisible se dessine. »
        </p>
      </header>

      <Hydrated>
        <Contenu />
      </Hydrated>
    </div>
  );
}

function Contenu() {
  const enregistrer = useStore((s) => s.enregistrerScoreEmpreintes);
  const ajouterGraines = useStore((s) => s.ajouterGraines);
  const meilleur = useStore((s) => s.meilleurScoreEmpreintes);
  const parties = useStore((s) => s.partiesEmpreintes);
  const mammiferes = useStore((s) => s.mammiferesRecenses);
  const tutoFait = useStore((s) => s.tutoEmpreintesFait);
  const setTutoFait = useStore((s) => s.setTutoEmpreintesFait);
  const [showTuto, setShowTuto] = useState(!tutoFait);

  const onGameOver = (score: number, m: number) => {
    enregistrer(score, m);
    const recompense = recompenseGraines(score);
    if (recompense > 0) ajouterGraines(recompense);
  };

  return (
    <div className="space-y-4">
      {showTuto && (
        <TutorialOverlay
          titreOuverture="Tutoriel · La Nuit des Empreintes"
          etapes={TUTO_EMPREINTES}
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
          <Badge variant="outline">{mammiferes} mammifères recensés (total)</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTuto(true)}
            className="rounded-full border border-mousse-500/30 px-3 py-1 font-serif text-xs hover:border-ocre-500/50"
          >
            Revoir le tutoriel
          </button>
          <HelpButton titre="La Nuit des Empreintes — Règles">
            <p>Trois cimetières. Sonde les cases : un chiffre = le nombre de chats voisins. Déduis, marque les chats, dégage le terrain sûr.</p>
            <p className="mt-2"><strong>Hérisson :</strong> +80 · <strong>Micromammifère :</strong> +50 · <strong>Fouine (rare) :</strong> +150</p>
            <p><strong>Cimetière relevé en entier :</strong> +250 de bonus.</p>
            <p className="mt-2">Sonder un chat effraie la colonie et interrompt la nuit. Tu peux « Refermer la nuit » pour garder tes acquis.</p>
            <p className="mt-3 text-xs italic">Score ÷ 50 = Graines de Grâce gagnées (à planter au Jardin).</p>
          </HelpButton>
        </div>
      </div>

      <NuitDesEmpreintes onGameOver={onGameOver} />

      <Card>
        <CardSubtitle>Contribution au recensement de la faune nocturne</CardSubtitle>
        <CardTitle>
          {mammiferes} mammifère{mammiferes > 1 ? "s" : ""} recensé{mammiferes > 1 ? "s" : ""} au fil des nuits
        </CardTitle>
        <p className="mt-2 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
          {mammiferes === 0
            ? "Aucun relevé pour l'instant. La nuit attend ton premier tunnel."
            : mammiferes < 20
            ? "Un début honnête. Frère Hérisson, dit-on, garde un œil bienveillant sur tes relevés."
            : mammiferes < 80
            ? "Tu lis les empreintes avec une aisance grandissante. Sœur Compost l'a noté."
            : "Un veilleur accompli. Mère Mycorhize, paraît-il, te confierait volontiers un carnet."}
        </p>
      </Card>
    </div>
  );
}
