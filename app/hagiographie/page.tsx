import { HAGIOGRAPHIE, Personnage } from "@/data/hagiographie";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";

export default function HagiographiePage() {
  const fondatrice = HAGIOGRAPHIE.find((p) => p.groupe === "fondatrice");
  const disciples = HAGIOGRAPHIE.filter((p) => p.groupe === "disciple");

  return (
    <div>
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
          Hagiographie de l'Ordre
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          Celles et ceux qui marchèrent avant toi
        </h1>
        <Ornement />
        <p className="mx-auto max-w-xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Un saint mycélien n'a rien accompli d'éclatant. Il a seulement fait, lentement, la même petite chose, jusqu'à ce qu'elle devienne une forêt. »
        </p>
      </header>

      {fondatrice && (
        <section className="mb-6">
          <h2 className="mb-2 titre-liturgique text-xl text-mousse-800 dark:text-parchemin-100">
            La Fondatrice
          </h2>
          <PersonnageCarte p={fondatrice} misEnAvant />
        </section>
      )}

      <section>
        <h2 className="mb-2 titre-liturgique text-xl text-mousse-800 dark:text-parchemin-100">
          Les Premiers Disciples
        </h2>
        <p className="mb-3 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/70">
          Ils ne furent pas choisis : ils s'auto-désignèrent en croisant son regard. C'est, dit-on, la marque
          des Vrais Maîtres — ils n'ont pas de stratégie de recrutement.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {disciples.map((p) => (
            <PersonnageCarte key={p.id} p={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PersonnageCarte({ p, misEnAvant = false }: { p: Personnage; misEnAvant?: boolean }) {
  return (
    <Card className={misEnAvant ? "border-ocre-500/50 bg-ocre-500/5" : "h-full"}>
      <div className="flex items-baseline gap-3">
        <span className={misEnAvant ? "text-4xl" : "text-3xl"} aria-hidden>
          {p.embleme}
        </span>
        <div>
          <CardTitle>{p.nom}</CardTitle>
          {p.titres.length > 0 && (
            <p className="mt-0.5 font-serif text-xs italic text-mousse-600 dark:text-parchemin-200/70">
              {p.titres.join(" · ")}
            </p>
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge variant="grace">{p.role}</Badge>
        <Badge variant="outline">Avant l'Ordre : {p.ancienneVie}</Badge>
      </div>
      <p className="mt-3 font-serif text-sm text-mousse-800 dark:text-parchemin-100">{p.bio}</p>
      <Ornement />
      <div>
        <CardSubtitle>À retenir</CardSubtitle>
        <p className="mt-1 versicle text-ocre-700 dark:text-ocre-300">{p.aRetenir}</p>
      </div>
    </Card>
  );
}
