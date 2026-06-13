"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { banqueTokens } from "./tokens";
import { TraitementMycelien, RepliParchemin } from "./Traitement";

const RATIO_CLASS: Record<string, string> = {
  "3/2": "aspect-[3/2]",
  "2/3": "aspect-[2/3]",
  "1/1": "aspect-square",
};

interface IllustrationProps {
  /** Nom de fichier sous /banque/illustrations/ (ex. "illu-marcheuse-filet.webp")
   *  ou chemin absolu commençant par "/". */
  src: string;
  /** Texte alternatif descriptif, OBLIGATOIRE. Sans nom propre ni terme interdit. */
  alt: string;
  /** Légende sobre affichée sous l'image. */
  legende?: string;
  /** Cadrage. Le conteneur réserve la place (anti-CLS). Défaut "3/2". */
  ratio?: "3/2" | "2/3" | "1/1";
  /** true = chargement eager (image au-dessus de la ligne de flottaison). */
  priorite?: boolean;
  /** Emblème affiché dans le repli parchemin si l'image manque (optionnel). */
  embleme?: string;
  className?: string;
}

// Image de contenu encadrée : traitement chaud commun, coins arrondis cohérents
// avec les Card, repli parchemin via onError. Le conteneur en aspect-ratio
// réserve la hauteur → pas de saut de mise en page (anti-CLS).
export function Illustration({
  src,
  alt,
  legende,
  ratio = "3/2",
  priorite = false,
  embleme,
  className,
}: IllustrationProps) {
  const [absente, setAbsente] = useState(false);
  const url = src.startsWith("/") ? src : `/banque/illustrations/${src}`;

  return (
    <figure className={cn("overflow-hidden", banqueTokens.radius, "shadow-sm", className)}>
      <div className={cn("relative overflow-hidden", banqueTokens.radius, RATIO_CLASS[ratio])}>
        {absente ? (
          <RepliParchemin embleme={embleme} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={alt}
            loading={priorite ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover"
            style={{ filter: banqueTokens.gradeFilter }}
            onError={() => setAbsente(true)}
          />
        )}
        <TraitementMycelien />
      </div>
      {legende && (
        <figcaption className="mt-2 px-1 font-serif text-xs italic text-mousse-700 dark:text-parchemin-200/70">
          {legende}
        </figcaption>
      )}
    </figure>
  );
}
