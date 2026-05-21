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
    titre: "1 · Le relevé nocturne",
    texte:
      "Inspiré d'un vrai protocole de sciences participatives : on pose des tunnels à empreintes dans le cimetière, on passe la nuit, et au matin on lit les traces. Cinq nuits t'attendent.",
  },
  {
    titre: "2 · Le carnet réclame une bête",
    texte:
      "Chaque nuit, le carnet de l'Ordre exige une espèce précise — un hérisson, une fouine, deux micromammifères… Six emplacements te sont proposés, tu n'as que trois tunnels : place-les dans les habitats qui favorisent la cible. Chaque carte indique les espèces qu'elle attire.",
  },
  {
    titre: "3 · Lis les indices du terrain",
    texte:
      "Certains emplacements portent un indice. « Traces fraîches » : bon signe. « Odeur de chat » : méfie-toi, le chat fait fuir les autres bêtes. « Fraîchement fauché » : tu ne trouveras presque rien.",
  },
  {
    titre: "4 · Déduis l'espèce",
    texte:
      "Au matin, l'empreinte est brouillée : impossible de la reconnaître à l'œil. Le relevé ne livre que deux indices sur trois — doigts, griffes, taille. À toi de déduire la bête. Le chat et le micromammifère se trahissent vite ; hérisson et fouine se ressemblent — c'est là que ça se joue.",
  },
  {
    titre: "5 · Score → Graines de Grâce",
    texte:
      "À la fin des cinq nuits, ton score est divisé par 50 pour obtenir des Graines de Grâce, à planter au Jardin. Recense la faune, gagne des graines. C'est la boucle.",
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
          « La nuit, le cimetière appartient aux bêtes discrètes. On ne les voit pas — on lit leurs traces. Poser un tunnel, attendre, déchiffrer : c'est une forme de prière patiente. »
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
            <p>Cinq nuits. Chaque nuit, pose 3 tunnels parmi 6 emplacements.</p>
            <p className="mt-2"><strong>Hérisson :</strong> +120 · <strong>Micromammifère :</strong> +60</p>
            <p><strong>Fouine (rare) :</strong> +170 · <strong>Chat :</strong> +25</p>
            <p className="mt-2">L'habitat et les indices de terrain orientent ce qui viendra. Le chat fait fuir le reste.</p>
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
