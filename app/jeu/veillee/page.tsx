import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Ornement } from "@/components/liturgical/Ornement";
import { Veillee } from "@/components/game/veillee/Veillee";

export default function VeilleePage() {
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
          Jeu VI · L'Épreuve de la Veillée
        </p>
        <h1 className="titre-liturgique mt-2 text-4xl text-mousse-800 dark:text-parchemin-100">
          L'Épreuve de la Veillée
        </h1>
        <Ornement />
        <p className="mx-auto max-w-2xl font-serif italic text-mousse-700 dark:text-parchemin-200/80">
          « Resté·e dans le cimetière reverdi après la fermeture, tu accomplis la Veillée : ouvrir
          les sceaux que l'Ordre a cachés dans la friche, pour que le portail se rouvre à l'aube.
          Chaque sceau est une énigme dont la clé est une vraie loi du vivant. Pas de chrono. »
        </p>
      </header>
      <Veillee />
    </div>
  );
}
