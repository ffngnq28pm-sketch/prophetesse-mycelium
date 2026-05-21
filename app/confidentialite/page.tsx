import Link from "next/link";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Ornement } from "@/components/liturgical/Ornement";

export const metadata = {
  title: "Politique de confidentialité · Prophétesse-Mycélium",
  description:
    "Prophétesse-Mycélium ne collecte aucune donnée personnelle. Tout reste sur l'appareil.",
};

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Mentions
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Politique de confidentialité
        </h1>
        <Ornement />
        <p className="font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
          Mise à jour : mai 2026
        </p>
      </header>

      <div className="space-y-4">
        <Card className="border-ocre-500/40 bg-ocre-500/5">
          <CardTitle className="text-xl">Aucune donnée n'est collectée</CardTitle>
          <p className="mt-2 font-serif text-mousse-900 dark:text-parchemin-100">
            L'application Prophétesse-Mycélium ne collecte, ne transmet et ne partage{" "}
            <strong>aucune donnée personnelle</strong>. Elle ne crée aucun compte, ne demande aucune
            adresse e-mail, ne diffuse aucune publicité et n'intègre aucun traceur tiers.
          </p>
        </Card>

        <Card>
          <CardSubtitle>Ce qui est stocké, et où</CardSubtitle>
          <p className="mt-2 font-serif text-sm text-mousse-800 dark:text-parchemin-100">
            L'application conserve, uniquement dans le stockage local de votre appareil (technologie{" "}
            <code>localStorage</code>) :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 font-serif text-sm text-mousse-800 dark:text-parchemin-100">
            <li>vos préférences (nom de baptême, animal totem, thème clair/sombre) ;</li>
            <li>l'avancement de votre pèlerinage (Graines de Grâce, paliers, rituels, chapitres, veilles) ;</li>
            <li>l'historique de vos confessions (péché et pénitence choisie) ;</li>
            <li>les scores de vos parties aux trois jeux liturgiques.</li>
          </ul>
          <p className="mt-3 font-serif text-sm text-mousse-800 dark:text-parchemin-100">
            Ces données ne quittent jamais votre appareil. Elles sont effacées si vous désinstallez
            l'application, ou via la fonction « Réinitialiser » dans les Paramètres. Vous pouvez aussi
            les exporter et les restaurer vous-même depuis les Paramètres — ces fichiers de sauvegarde
            restent sous votre seul contrôle.
          </p>
        </Card>

        <Card>
          <CardSubtitle>Permissions et connexions</CardSubtitle>
          <p className="mt-2 font-serif text-sm text-mousse-800 dark:text-parchemin-100">
            L'application ne demande <strong>aucune permission native</strong> (caméra, photo,
            microphone, localisation, contacts). Elle fonctionne intégralement hors ligne : son contenu,
            ses polices et ses jeux sont embarqués dans l'application. Elle ne se connecte à aucun
            serveur externe pour son fonctionnement.
          </p>
        </Card>

        <Card>
          <CardSubtitle>Vos droits</CardSubtitle>
          <p className="mt-2 font-serif text-sm text-mousse-800 dark:text-parchemin-100">
            Aucune donnée n'étant collectée par l'éditeur, les droits d'accès, de rectification,
            d'effacement, de portabilité et d'opposition sont sans objet du côté de l'éditeur. Pour
            effacer l'ensemble de vos données locales : ouvrez les Paramètres, puis « Réinitialiser ».
            La présente politique est conforme au RGPD.
          </p>
        </Card>

        <Card>
          <CardSubtitle>Éditeur & contact</CardSubtitle>
          <p className="mt-2 font-serif text-sm text-mousse-800 dark:text-parchemin-100">
            Application éditée par Charif Hachichi. Pour toute question :{" "}
            <a
              href="mailto:Charif.Hachichi@icloud.com"
              className="text-ocre-700 hover:underline dark:text-ocre-400"
            >
              Charif.Hachichi@icloud.com
            </a>
            .
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
