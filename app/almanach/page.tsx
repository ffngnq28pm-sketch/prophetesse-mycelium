import { FAUNE, Faune, RareteFaune } from "@/data/almanach";
import { ESPECES, Espece } from "@/data/jardin-especes";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { HelpButton } from "@/components/liturgical/HelpButton";

export const metadata = {
  title: "Almanach du Vivant",
  description:
    "Le petit peuple que tu recenses : pollinisateurs, auxiliaires, et les douze espèces sacrées du Jardin.",
};

const RARETE_FAUNE: Record<RareteFaune, string> = {
  commune: "Commune",
  frequente: "Fréquente",
  rare: "Rare",
};

const RARETE_FLORE: Record<Espece["rarete"], string> = {
  commune: "Commune",
  frequente: "Fréquente",
  rare: "Rare",
  "tres-rare": "Très rare",
};

export default function AlmanachPage() {
  const pollinisateurs = FAUNE.filter((f) => f.groupe === "pollinisateur");
  const auxiliaires = FAUNE.filter((f) => f.groupe === "auxiliaire");

  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Almanach du Vivant
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Le petit peuple que tu recenses
        </h1>
        <Ornement />
        <p className="mx-auto max-w-xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Compter les espèces n'est pas une comptabilité : c'est une forme de politesse envers ce qui vit sans demander la parole. »
        </p>
        <div className="mt-3 flex justify-center">
          <HelpButton titre="L'Almanach — Que faire ici ?">
            <p>Trois sections : les <strong>Pollinisateurs</strong> (ceux qu'on poursuit dans le jeu II), les <strong>Auxiliaires & Gardiens</strong> (Chiroptères, Coccinelles, Hérissons — ils ne pollinisent pas mais sans eux le jardin s'effondre), et la <strong>Flore</strong> (les douze espèces que tu peux semer dans ton Jardin).</p>
            <p className="mt-2">Chaque fiche donne le rôle écologique réel et une note de bas de page mycélienne (le <em>lore</em>). C'est une page à butiner, pas à dévorer.</p>
          </HelpButton>
        </div>
      </header>

      <section className="mb-7">
        <h2 className="titre-liturgique text-xl text-mousse-800 dark:text-parchemin-100">Les Pollinisateurs</h2>
        <p className="mb-3 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/70">
          Ceux qu'Olivia poursuit du filet dans la Chasse aux Pollinisateurs. Recense-les ici, en paix, sans fantôme aux trousses.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {pollinisateurs.map((f) => (
            <FauneCarte key={f.id} f={f} />
          ))}
        </div>
      </section>

      <section className="mb-7">
        <h2 className="titre-liturgique text-xl text-mousse-800 dark:text-parchemin-100">
          Les Auxiliaires & Gardiens
        </h2>
        <p className="mb-3 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/70">
          Ils ne pollinisent pas, ou peu — mais sans eux le jardin s'effondre. L'Ordre les tient en haute estime.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {auxiliaires.map((f) => (
            <FauneCarte key={f.id} f={f} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="titre-liturgique text-xl text-mousse-800 dark:text-parchemin-100">La Flore</h2>
        <p className="mb-3 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/70">
          Les douze espèces que tu peux semer dans ton Jardin. Chacune nourrit quelqu'un.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {ESPECES.map((e) => (
            <EspeceCarte key={e.id} e={e} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FauneCarte({ f }: { f: Faune }) {
  return (
    <Card className="h-full" style={{ borderLeft: `4px solid ${f.couleur}` }}>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl" aria-hidden>
          {f.embleme}
        </span>
        <div>
          <CardTitle>{f.nom}</CardTitle>
          <p className="mt-0.5 font-serif text-xs italic text-mousse-600 dark:text-parchemin-200/70">
            {f.nomLatin}
          </p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge variant="outline">{RARETE_FAUNE[f.rarete]}</Badge>
      </div>
      <p className="mt-3 font-serif text-sm text-mousse-800 dark:text-parchemin-100">{f.silhouette}</p>
      <div className="mt-2">
        <CardSubtitle>Rôle écologique</CardSubtitle>
        <p className="mt-1 font-serif text-sm text-mousse-800 dark:text-parchemin-100">{f.role}</p>
      </div>
      <Ornement />
      <p className="font-serif text-sm italic text-ocre-700 dark:text-ocre-300">{f.lore}</p>
    </Card>
  );
}

function EspeceCarte({ e }: { e: Espece }) {
  return (
    <Card className="h-full" style={{ borderLeft: `4px solid ${e.couleurDominante}` }}>
      <CardTitle>{e.nomCommun}</CardTitle>
      <p className="mt-0.5 font-serif text-xs italic text-mousse-600 dark:text-parchemin-200/70">{e.nomLatin}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge variant="outline">{RARETE_FLORE[e.rarete]}</Badge>
        <Badge variant="grace">{e.cout} graines</Badge>
      </div>
      <p className="mt-3 font-serif text-sm text-mousse-800 dark:text-parchemin-100">{e.description}</p>
      <div className="mt-2">
        <CardSubtitle>Écologie</CardSubtitle>
        <p className="mt-1 font-serif text-sm text-mousse-800 dark:text-parchemin-100">{e.ecologie}</p>
      </div>
    </Card>
  );
}
