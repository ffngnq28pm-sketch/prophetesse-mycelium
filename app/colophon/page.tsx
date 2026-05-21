import Link from "next/link";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Ornement } from "@/components/liturgical/Ornement";

export const metadata = {
  title: "Colophon · Prophétesse-Mycélium",
};

export default function ColophonPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Colophon
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Note sur la fabrication de cet objet
        </h1>
        <Ornement />
        <p className="mx-auto max-w-xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Tout livre devrait dire, à la dernière page, comment il a été fait et par quelles mains. Une application le devrait aussi. »
        </p>
      </header>

      <div className="space-y-4">
        <Card>
          <CardSubtitle>Avertissement doux</CardSubtitle>
          <CardTitle>L'Ordre Mycélien n'existe pas</CardTitle>
          <p className="mt-2 font-serif text-mousse-900 dark:text-parchemin-100">
            Il n'y a ni Prophétesse, ni cimetières liturgiques, ni Mère Mycorhize âgée de cent trente
            ans. Cette application est une fiction — une religion inventée de toutes pièces autour d'une
            idée simple et, elle, parfaitement réelle : le vivant le plus important est le plus discret.
            Le mycélium, les abeilles solitaires, les vers de terre, les plantes qui percent le bitume.
            Tout ce qui travaille sans qu'on le remercie.
          </p>
        </Card>

        <Card>
          <CardSubtitle>Ce qui est vrai là-dedans</CardSubtitle>
          <p className="mt-1 font-serif text-mousse-900 dark:text-parchemin-100">
            La satire est inventée ; l'écologie ne l'est pas. Les douze espèces du Jardin existent et
            poussent réellement en Île-de-France. Les Halictes, les syrphes, les pipistrelles sont de
            vrais auxiliaires du vivant. Les cimetières franciliens sont effectivement parmi les
            derniers refuges de biodiversité de la région. Si une seule chose devait sortir de cette
            fiction pour entrer dans ta vie, que ce soit celle-ci : laisse, quelque part, un carré non
            fauché.
          </p>
        </Card>

        <Card>
          <CardSubtitle>Ce que contient l'Ordre</CardSubtitle>
          <p className="mt-1 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/70">
            Un petit plan, pour qui s'y perdrait.
          </p>
          <ul className="mt-3 space-y-2 font-serif text-sm text-mousse-900 dark:text-parchemin-100">
            <li>
              <strong>Le Pèlerinage</strong> — La Voie en neuf chapitres, les sept Offices Verts, le
              Confessionnal et le Calendrier liturgique.
            </li>
            <li>
              <strong>La Bibliothèque</strong> — le Livre Sacré, l'Hagiographie des premiers disciples,
              l'Almanach du vivant, le Glossaire et les Sanctuaires.
            </li>
            <li>
              <strong>Les Jeux</strong> — le Tetris du Compost et la Chasse aux Pollinisateurs.
            </li>
            <li>
              <strong>Les Progrès</strong> — le Jardin, le Reliquaire des hauts faits et les Annales.
            </li>
            <li>
              <strong>Les Veilles</strong> — pour qui a franchi les neuf chapitres : une pratique
              contemplative par jour, sans fin.
            </li>
          </ul>
        </Card>

        <Card className="border-ocre-500/40 bg-ocre-500/5">
          <CardSubtitle>La main derrière le mycélium</CardSubtitle>
          <CardTitle>Charif Hachichi</CardTitle>
          <p className="mt-2 font-serif text-mousse-900 dark:text-parchemin-100">
            Conçue, écrite et dessinée par Charif Hachichi. Le texte, la fiction, les jeux et les
            illustrations vectorielles sont de la même main — celle qui, comme Sœur Mycélium dans
            l'Hagiographie, a longtemps hésité sur la couleur des boutons avant de choisir le vert
            mousse.
          </p>
          <Ornement />
          <p className="font-serif text-sm text-mousse-700 dark:text-parchemin-200/80">
            <a
              href="mailto:Charif.Hachichi@icloud.com"
              className="text-ocre-700 hover:underline dark:text-ocre-400"
            >
              Charif.Hachichi@icloud.com
            </a>
          </p>
        </Card>

        <Card>
          <CardSubtitle>Dédicace</CardSubtitle>
          <CardTitle>À Olivia</CardTitle>
          <p className="mt-2 font-serif text-mousse-900 dark:text-parchemin-100">
            Si la Prophétesse porte, dans le registre cérémoniel, le nom d'Olivia-aux-mille-racines —
            et si la disciple du second jeu s'appelle, elle aussi, Olivia — ce n'est pas un hasard de
            plus. L'Ordre tout entier est né d'une personne bien réelle : une forte tête qui ne baisse
            jamais les yeux, et qui redonne foi — en l'humanité autant que dans le vivant. Cette
            application est, d'un bout à l'autre, une lettre qui lui est adressée.
          </p>
        </Card>

        <Card>
          <CardSubtitle>Remerciements</CardSubtitle>
          <p className="mt-1 font-serif text-mousse-900 dark:text-parchemin-100">
            Merci, enfin, à toutes les personnes qui, chaque fois qu'une idée ou une volonté se
            présente, répondent qu'elle est trop difficile ou impossible. Sans le savoir, elles
            fournissent le meilleur des carburants : l'envie de faire mieux, et plus vite encore. Le
            mycélium, lui aussi, pousse contre le béton — et précisément parce qu'il y a du béton.
          </p>
        </Card>

        <Card>
          <CardSubtitle>Fabrication</CardSubtitle>
          <p className="mt-1 font-serif text-sm text-mousse-900 dark:text-parchemin-100">
            Bâtie avec Next.js, React et Tailwind CSS ; portée sur iOS via Capacitor. Caractères de
            titre en <em>Cormorant Garamond</em>, texte courant en <em>Inter</em>. Les sprites des
            jeux et la faune de l'Almanach sont dessinés au trait, à la main, dans le code lui-même —
            aucune image n'a été employée là où une courbe suffisait.
          </p>
          <p className="mt-2 font-serif text-sm text-mousse-900 dark:text-parchemin-100">
            Achevée en mai 2026. Lieu de fabrication : la France — ou, plus exactement, une tête. Le
            code est publié sous licence MIT (© 2026 Charif Hachichi) : libre à qui le souhaite de le
            lire, de l'étudier et de le faire pousser ailleurs, à condition d'en citer la souche.
          </p>
          <Ornement />
          <p className="font-serif text-center text-xs italic text-mousse-600 dark:text-parchemin-200/70">
            Amen-Compost.
          </p>
        </Card>

        <div className="text-center">
          <Link
            href="/"
            className="font-serif text-sm italic text-ocre-700 hover:underline dark:text-ocre-400"
          >
            ← Retourner au Sanctuaire
          </Link>
        </div>
      </div>
    </div>
  );
}
