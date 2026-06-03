"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Hydrated } from "@/components/liturgical/Hydrated";
import { HelpButton } from "@/components/liturgical/HelpButton";
import { Trees, Gamepad2 } from "lucide-react";

export default function HubJeux() {
  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Jeux Liturgiques de l'Ordre
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Cinq jeux pour s'enraciner
        </h1>
        <Ornement />
        <p className="mx-auto max-w-2xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Le jeu est une forme de méditation pratique, à condition qu'on n'en perde pas la mesure. Ce qui, faut-il le rappeler, est l'éternel risque de la méditation pratique. »
        </p>
      </header>
      <Hydrated>
        <Contenu />
      </Hydrated>
    </div>
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
  const meilleursPollTraversee = useStore((s) => s.meilleursPollinisateursTraversee);
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/jeu/compost" className="group">
          <Card className="h-full transition hover:border-ocre-500/60 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40">
            <CardSubtitle>Jeu I</CardSubtitle>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl">🧱</span>
              <CardTitle>La Chute du Compost</CardTitle>
            </div>
            <p className="mt-2 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
              Trie tes déchets en empilant des pièces. Une ligne 100% compost te vaut une bénédiction du Mycélium. Une dosette en ligne te vaut une malédiction — proportionnée mais sentie.
            </p>
            <Ornement />
            <div className="flex flex-wrap gap-2">
              <Badge variant="grace">Meilleur : {meilleurTetris}</Badge>
              <Badge variant="outline">Parties : {partiesTetris}</Badge>
              <Badge variant="outline">{lignesCompostees * 2} kg compostés</Badge>
            </div>
            <p className="mt-3 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
              Score ÷ 50 = Graines à planter.
            </p>
            <p className="mt-2 font-serif text-xs text-ocre-700 group-hover:underline dark:text-ocre-400">
              Entrer dans la Chute →
            </p>
          </Card>
        </Link>

        <Link href="/jeu/pac-olivia" className="group">
          <Card className="h-full transition hover:border-ocre-500/60 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40">
            <CardSubtitle>Jeu II</CardSubtitle>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl">🦔</span>
              <CardTitle>La Chasse aux Pollinisateurs</CardTitle>
            </div>
            <p className="mt-2 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
              Une disciple (blonde, casquette rouge, filet à insectes) court dans les cimetières d'Île-de-France pour recenser tous les pollinisateurs. Quatre fantômes la poursuivent. Une gorgée de café filtre lui donne la Sainte Colère.
            </p>
            <Ornement />
            <div className="flex flex-wrap gap-2">
              <Badge variant="grace">Meilleur : {meilleurPac}</Badge>
              <Badge variant="outline">Niveau max : {niveauMaxPac}/5</Badge>
              <Badge variant="outline">Parties : {partiesPac}</Badge>
              <Badge variant="outline">{pollinisateurs} recensés</Badge>
              <Badge variant="outline">{fantomesTabasses} fantômes tabassés</Badge>
            </div>
            <p className="mt-3 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
              Score ÷ 80 = Graines à planter.
            </p>
            <p className="mt-2 font-serif text-xs text-ocre-700 group-hover:underline dark:text-ocre-400">
              Entrer dans le cimetière →
            </p>
          </Card>
        </Link>

        <Link href="/jeu/nuit-des-empreintes" className="group">
          <Card className="h-full transition hover:border-ocre-500/60 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40">
            <CardSubtitle>Jeu III</CardSubtitle>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl">🐾</span>
              <CardTitle>La Nuit des Empreintes</CardTitle>
            </div>
            <p className="mt-2 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
              Une grille de cimetière, la nuit. Déduis où dorment les chats à partir des empreintes voisines, dégage le terrain sûr et recense la faune cachée — sans en déranger un seul. Un puzzle de logique.
            </p>
            <Ornement />
            <div className="flex flex-wrap gap-2">
              <Badge variant="grace">Meilleur : {meilleurEmpreintes}</Badge>
              <Badge variant="outline">Parties : {partiesEmpreintes}</Badge>
              <Badge variant="outline">{mammiferes} mammifères recensés</Badge>
            </div>
            <p className="mt-3 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
              Score ÷ 50 = Graines à planter.
            </p>
            <p className="mt-2 font-serif text-xs text-ocre-700 group-hover:underline dark:text-ocre-400">
              Entrer dans la nuit →
            </p>
          </Card>
        </Link>

        <Link href="/jeu/traversee" className="group">
          <Card className="h-full transition hover:border-ocre-500/60 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40">
            <CardSubtitle>Jeu IV</CardSubtitle>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl">🍄</span>
              <CardTitle>Le Sentier des Spores</CardTitle>
            </div>
            <p className="mt-2 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
              Un platformer. Olivia, casquette rouge et filet à la main, traverse un cimetière reverdi : elle saute par-dessus dosettes et tondeuses, attrape les pollinisateurs au filet, et rejoint le grand If sacré. Une fleur pousse sous chacun de ses pas.
            </p>
            <Ornement />
            <div className="flex flex-wrap gap-2">
              <Badge variant="grace">Meilleur temps : {tempsTraverseeLabel}</Badge>
              <Badge variant="outline">Pollinisateurs : {meilleursPollTraversee}/10</Badge>
              <Badge variant="outline">Traversées : {partiesTraversee}</Badge>
            </div>
            <p className="mt-3 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
              Pollinisateurs + graines = Graines à planter.
            </p>
            <p className="mt-2 font-serif text-xs text-ocre-700 group-hover:underline dark:text-ocre-400">
              Entrer sur le sentier →
            </p>
          </Card>
        </Link>

        <Link href="/jeu/verbe" className="group">
          <Card className="h-full transition hover:border-ocre-500/60 hover:bg-mousse-100/50 dark:hover:bg-mousse-900/40">
            <CardSubtitle>Jeu V</CardSubtitle>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl">📜</span>
              <CardTitle>Le Verbe du Jour</CardTitle>
            </div>
            <p className="mt-2 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
              Devine le Verbe du Jour. Un seul mot, six tentatives, une révélation à la clé. Le même pour tout l'Ordre, qui change à minuit — et l'on ne prononce que les paroles du canon.
            </p>
            <Ornement />
            <div className="flex flex-wrap gap-2">
              <Badge variant="grace">Meilleure série : {verbeMeilleurStreak}</Badge>
              <Badge variant="outline">{verbesTrouves} Verbe{verbesTrouves > 1 ? "s" : ""} trouvé{verbesTrouves > 1 ? "s" : ""}</Badge>
            </div>
            <p className="mt-3 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
              Un Verbe par jour. La série récompense l'assiduité.
            </p>
            <p className="mt-2 font-serif text-xs text-ocre-700 group-hover:underline dark:text-ocre-400">
              Prononcer le Verbe →
            </p>
          </Card>
        </Link>
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
