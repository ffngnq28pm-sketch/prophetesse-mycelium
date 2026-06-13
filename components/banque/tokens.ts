// Tokens du traitement visuel commun de la banque — un seul réglage central
// pour souder des images hétérogènes au « monde Mycélium » (grade chaud léger,
// légère désaturation, vignette douce, grain subtil). Aucune couleur néon.
//
// Modifie ICI pour réaccorder toute la banque d'un coup.

export const banqueTokens = {
  // Coins arrondis cohérents avec les <Card> du site.
  radius: "rounded-lg",

  // Filtre appliqué DIRECTEMENT sur l'image : désaturation légère + chaleur.
  gradeFilter: "saturate(0.92) sepia(0.06) contrast(1.02)",

  // Variante « fortement traitée » (rôle voile) : plus désaturée + assombrie.
  gradeFilterVoile: "saturate(0.7) sepia(0.08) brightness(0.82) contrast(1.03)",

  // Calque ocre en soft-light, très faible — l'atmosphère dorée commune.
  ocreOverlay: "rgba(191,141,44,0.10)",

  // Force max de la vignette radiale (sur hero / section).
  vignette: 0.3,

  // Grain statique très subtil (réutilisable). Pas d'animation (≠ la vitrine) :
  // sûr vis-à-vis de prefers-reduced-motion.
  grainOpacity: 0.05,
} as const;

// Bruit fractal en SVG inline (data-URI) : un grain doux, sans fichier ni
// lecture de pixels. Posé en mix-blend overlay à faible opacité.
export const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
