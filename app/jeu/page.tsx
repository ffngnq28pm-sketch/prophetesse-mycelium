"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { HelpButton } from "@/components/liturgical/HelpButton";
import { JeuIllustration } from "@/components/game/JeuIllustration";
import { ContenuLisible } from "@/components/banque/FondPeint";
import { Trees } from "lucide-react";

export default function HubJeux() {
  return (
    <div>
      {/* Fond peint monté globalement par le layout (FondPeintAuto). */}
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Jeux Liturgiques de l'Ordre
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Cinq jeux pour s'enraciner
        </h1>
        <Ornement />
        <ContenuLisible className="mx-auto max-w-2xl px-4 py-2">
          <p className="font-serif italic text-mousse-700 dark:text-parchemin-200/80">
            « Le jeu est une forme de méditation pratique, à condition qu'on n'en perde pas la mesure. Ce qui, faut-il le rappeler, est l'éternel risque de la méditation pratique. »
          </p>
        </ContenuLisible>
      </header>
      <Hydrated>
        <Contenu />
      </Hydrated>
    </div>
  );
}

// Carte commune du hub : illustration en tête, contenu, badges, appel.
function CarteJeu({
  href,
  segment,
  embleme,
  numero,
  titre,
  desc,
  badges,
  note,
  appel,
}: {
  href: string;
  segment: string;
  embleme: string;
  numero: string;
  titre: string;
  desc: string;
  badges: { label: string; grace?: boolean }[];
  note: string;
  appel: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="h-full overflow-hidden transition hover:border-ocre-500/60 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40">
        <JeuIllustration segment={segment} embleme={embleme} alt={`Illustration — ${titre}`} />
        <CardSubtitle>{numero}</CardSubtitle>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl" aria-hidden>
            {embleme}
          </span>
          <CardTitle>{titre}</CardTitle>
        </div>
        <p className="mt-2 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">{desc}</p>
        <Ornement />
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <Badge key={b.label} variant={b.grace ? "grace" : "outline"}>
              {b.label}
            </Badge>
          ))}
        </div>
        <p className="mt-3 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">{note}</p>
        <p className="mt-2 font-serif text-xs text-ocre-700 group-hover:underline dark:text-ocre-400">{appel}</p>
      </Card>
    </Link>
  );
}

function Contenu() {
  const meilleurTetris = useStore((s) => s.meilleurScoreTetris);
  const partiesTetris = useStore((s) => s.partiesTetris);
  const lignesCompostees = useStore((s) => s.lignesCompostees);
  const meilleurPac = useStore((s) => s.meilleurScorePac);
  const niveauMaxPac = useStore((s) => s.niveauMaxPac);
  const partiesPac = useStore((s) => s.partiesPac);
  const fantomesTabasses = useStore((s) => s.fantomesTabasses);
  const pollinisateurs = useStore((s) => s.pollinisateursRecenses);
  const meilleurEmpreintes = useStore((s) => s.meilleurScoreEmpreintes);
  const partiesEmpreintes = useStore((s) => s.partiesEmpreintes);
  const mammiferes = useStore((s) => s.mammiferesRecenses);
  const meilleurTempsTraversee = useStore((s) => s.meilleurTempsTraversee);
  const meilleurScoreTraversee = useStore((s) => s.meilleurScoreTraversee);
  const partiesTraversee = useStore((s) => s.partiesTraversee);
  const graines = useStore((s) => s.graines);
  const verbeParties = useStore((s) => s.verbeParties);
  const verbeMeilleurStreak = useStore((s) => s.verbeMeilleurStreak);
  const verbesTrouves = Object.values(verbeParties).filter((p) => p.statut === "gagne").length;

  const tempsTraverseeLabel =
    meilleurTempsTraversee > 0
      ? `${Math.floor(meilleurTempsTraversee / 60000)}:${Math.floor((meilleurTempsTraversee % 60000) / 1000)
          .toString()
          .padStart(2, "0")}`
      : "—";

  return (
    <div className="space-y-4">
      {/* Bandeau d'incitation */}
      <Card className="border-ocre-500/40 bg-ocre-500/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Trees size={24} className="text-mousse-700 dark:text-ocre-400" />
            <div>
              <CardSubtitle>Tes plantations attendent</CardSubtitle>
              <p className="font-serif text-mousse-800 dark:text-parchemin-100">
                Les jeux financent ton Jardin. Tu as <strong>{graines}</strong> graine{graines > 1 ? "s" : ""} en réserve.
              </p>
            </div>
          </div>
          <Link href="/jardin" className="btn-sacre">
            Aller au Jardin →
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CarteJeu
          href="/jeu/compost"
          segment="compost"
          embleme="🧱"
          numero="Jeu I"
          titre="La Chute du Compost"
          desc="Trie tes déchets en empilant des pièces. Une ligne 100% compost te vaut une bénédiction du Mycélium. Une dosette en ligne te vaut une malédiction — proportionnée mais sentie."
          badges={[
            { label: `Meilleur : ${meilleurTetris}`, grace: true },
            { label: `Parties : ${partiesTetris}` },
            { label: `${lignesCompostees * 2} kg compostés` },
          ]}
          note="Score ÷ 50 = Graines à planter."
          appel="Entrer dans la Chute →"
        />

        <CarteJeu
          href="/jeu/pac-marcheuse"
          segment="pac-marcheuse"
          embleme="🦔"
          numero="Jeu II"
          titre="La Chasse aux Pollinisateurs"
          desc="La Marcheuse (casquette rouge, filet à insectes) court dans les cimetières d'Île-de-France pour recenser tous les pollinisateurs. Quatre fantômes la poursuivent. Une gorgée de café filtre lui donne la Sainte Colère."
          badges={[
            { label: `Meilleur : ${meilleurPac}`, grace: true },
            { label: `Niveau max : ${niveauMaxPac}/5` },
            { label: `Parties : ${partiesPac}` },
            { label: `${pollinisateurs} recensés` },
            { label: `${fantomesTabasses} fantômes tabassés` },
          ]}
          note="Score ÷ 80 = Graines à planter."
          appel="Entrer dans le cimetière →"
        />

        <CarteJeu
          href="/jeu/nuit-des-empreintes"
          segment="nuit-des-empreintes"
          embleme="🐾"
          numero="Jeu III"
          titre="La Nuit des Empreintes"
          desc="Une grille de cimetière, la nuit. Déduis où dorment les chats à partir des empreintes voisines, dégage le terrain sûr et recense la faune cachée — sans en déranger un seul. Un puzzle de logique."
          badges={[
            { label: `Meilleur : ${meilleurEmpreintes}`, grace: true },
            { label: `Parties : ${partiesEmpreintes}` },
            { label: `${mammiferes} mammifères recensés` },
          ]}
          note="Score ÷ 50 = Graines à planter."
          appel="Entrer dans la nuit →"
        />

        <CarteJeu
          href="/jeu/traversee"
          segment="traversee"
          embleme="🍄"
          numero="Jeu IV"
          titre="Le Sentier des Spores"
          desc="Un platformer en trois actes. La Marcheuse traverse un cimetière reverdi : champignons-tremplins, plateformes friables, lanternes-refuges — jusqu'au grand If sacré. Une fleur pousse sous chacun de ses pas."
          badges={[
            { label: `Meilleur score : ${meilleurScoreTraversee || "—"}`, grace: true },
            { label: `Meilleur temps : ${tempsTraverseeLabel}` },
            { label: `Traversées : ${partiesTraversee}` },
          ]}
          note="Pollinisateurs + spores = Graines à planter."
          appel="Entrer sur le sentier →"
        />

        <CarteJeu
          href="/jeu/verbe"
          segment="verbe"
          embleme="📜"
          numero="Jeu V · Office quotidien"
          titre="Le Verbe du Jour"
          desc="Devine le Verbe du Jour. Un seul mot, six tentatives, une révélation à la clé. Le même pour tout l'Ordre, qui change à minuit — et l'on ne prononce que les paroles du canon."
          badges={[
            { label: `Meilleure série : ${verbeMeilleurStreak}`, grace: true },
            { label: `${verbesTrouves} Verbe${verbesTrouves > 1 ? "s" : ""} trouvé${verbesTrouves > 1 ? "s" : ""}` },
          ]}
          note="Un Verbe par jour. La série récompense l'assiduité."
          appel="Prononcer le Verbe →"
        />

        <CarteJeu
          href="/jeu/veillee"
          segment="veillee"
          embleme="🕯️"
          numero="Jeu VI · L'Épreuve de la Veillée"
          titre="L'Épreuve de la Veillée"
          desc="Un escape contemplatif. Resté·e dans le cimetière après la fermeture, ouvre les sceaux cachés dans la friche pour que le portail se rouvre à l'aube. Pas de chrono, des défunts railleurs, de vraies lois du vivant."
          badges={[{ label: "Escape · 5 sceaux", grace: true }, { label: "Sans chrono" }]}
          note="Ce que tu apprends à l'Université des Friches se pratique ici."
          appel="Entrer dans la Veillée →"
        />
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <CardSubtitle>Statistiques cumulées</CardSubtitle>
          <HelpButton titre="Pourquoi jouer ?">
            <p>Les jeux ne sont pas un bonus isolé. Ils alimentent ton Jardin via les Graines de Grâce. Ils valident aussi plusieurs objectifs de La Voie : chapitre II (une partie de La Chute du Compost jusqu'au bout), chapitre IV (niveau 2 de la Chasse), chapitre VI (200 pollinisateurs cumulés), chapitre VIII (niveau 5 atteint). Joue détendu·e : c'est ton mètre carré liturgique.</p>
          </HelpButton>
        </div>
        <p className="mt-2 font-serif text-mousse-800 dark:text-parchemin-100">
          {pollinisateurs > 0
            ? `Tu as recensé ${pollinisateurs} pollinisateur${pollinisateurs > 1 ? "s" : ""} depuis le début de ton pèlerinage. C'est, comparativement à un humain moyen qui n'en recense que zéro par défaut, un score considérable.`
            : "Aucun pollinisateur recensé pour l'instant. Sœur Halicte attend ton premier rapport sans impatience."}
        </p>
        <p className="mt-2 font-serif text-mousse-800 dark:text-parchemin-100">
          {lignesCompostees > 0
            ? `Tu as composté ${lignesCompostees} ligne${lignesCompostees > 1 ? "s" : ""}, soit ${lignesCompostees * 2} kg de matière organique sacrée. Sœur Compost pèserait ça à la balance, mais elle a perdu sa balance en 2019.`
            : "Aucune ligne compostée pour l'instant. Frère Lichen suggère de commencer, mais en prenant le temps."}
        </p>
      </Card>
    </div>
  );
}
