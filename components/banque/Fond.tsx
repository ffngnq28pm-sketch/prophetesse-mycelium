"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { banqueTokens } from "./tokens";
import { TraitementMycelien, RepliParchemin } from "./Traitement";

type Variante = "hero" | "section" | "voile" | "texture";

interface FondProps {
  /** Chemin sous /banque/ (ex. "heros/hero-accueil.webp", "fonds/fond-x.webp")
   *  ou chemin absolu commençant par "/". */
  src: string;
  variante: Variante;
  children: React.ReactNode;
  /** object-position de l'image de fond. Défaut "center 30%". */
  position?: string;
  className?: string;
}

// Réglages par variante : chargement, filtre, voile de lisibilité, traitement.
// Les voiles sont des scrims PARCHEMIN (le site est à dominante claire, texte
// sombre) : point de départ à ajuster par surface si besoin.
const VARIANTES: Record<
  Variante,
  {
    eager: boolean;
    filter: string;
    voile: string | null; // classes du calque de lisibilité
    treatment: boolean;
    blend?: string;
    opacity?: number;
    vignette?: boolean;
  }
> = {
  hero: {
    eager: true,
    filter: banqueTokens.gradeFilter,
    voile: "bg-gradient-to-t from-mousse-950/55 via-mousse-950/5 to-transparent",
    treatment: true,
    vignette: true,
  },
  section: {
    eager: false,
    filter: banqueTokens.gradeFilter,
    voile: "bg-parchemin-50/72 dark:bg-mousse-950/55",
    treatment: true,
    vignette: false,
  },
  voile: {
    eager: false,
    filter: banqueTokens.gradeFilterVoile,
    voile: "bg-parchemin-50/85 dark:bg-mousse-950/72",
    treatment: false,
  },
  texture: {
    eager: false,
    filter: "none",
    voile: null,
    treatment: false,
    blend: "soft-light",
    opacity: 0.15,
  },
};

// Calque d'ambiance décoratif derrière du contenu. L'image est posée en
// background-image CSS (JAMAIS d'icône « image cassée », même un instant) et
// n'est rendue qu'une fois sa présence confirmée par une sonde — sinon repli
// parchemin. Au premier paint, c'est toujours le repli, jamais une <img>.
export function Fond({ src, variante, children, position = "center 30%", className }: FondProps) {
  const cfg = VARIANTES[variante];
  const url = src.startsWith("/") ? src : `/banque/${src}`;

  // "loading" → repli ; "ok" → image en background-image ; "absent" → repli.
  const [statut, setStatut] = useState<"loading" | "ok" | "absent">("loading");
  useEffect(() => {
    let vivant = true;
    setStatut("loading");
    const img = new Image(); // sonde : ne rend jamais d'icône cassée visible
    img.onload = () => vivant && setStatut("ok");
    img.onerror = () => vivant && setStatut("absent");
    img.src = url;
    return () => {
      vivant = false;
    };
  }, [url]);

  const present = statut === "ok";

  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      {/* —— Repli parchemin (chargement + image absente) —— */}
      {!present && <RepliParchemin subtle={variante === "hero" || variante === "texture"} />}

      {/* —— Image en background-image (aucune icône cassée possible) —— */}
      {present && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url('${url}')`,
            backgroundSize: "cover",
            backgroundPosition: position,
            filter: cfg.filter === "none" ? undefined : cfg.filter,
            mixBlendMode: (cfg.blend as React.CSSProperties["mixBlendMode"]) ?? "normal",
            opacity: cfg.opacity ?? 1,
          }}
        />
      )}

      {/* —— Voile de lisibilité (seulement quand une image est présente) —— */}
      {present && cfg.voile && (
        <div aria-hidden className={cn("pointer-events-none absolute inset-0", cfg.voile)} />
      )}

      {/* —— Traitement commun (cohérence d'univers) —— */}
      {present && cfg.treatment && <TraitementMycelien vignette={cfg.vignette} />}

      {/* —— Contenu —— */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
