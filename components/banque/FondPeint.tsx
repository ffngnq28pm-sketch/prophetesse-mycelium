import { cn } from "@/lib/utils";

// Calque de FOND ambiant : un cimetière reverdi peint, traité pour murmurer
// (désaturé, assourdi, flou léger, bords fondus) derrière le contenu du site.
// Sobriété (Boussole) : aucune couleur vive — la casquette rouge reste le seul
// accent. Repli automatique sans JS : si le webp est absent, l'image ne se
// charge pas → seule la couleur de page (+ voile) reste, jamais d'icône cassée.
//
// Réglages validés par défaut, tous dial-ables.

type ThemeFond = "light" | "dark";

interface FondPeintProps {
  /** Slug (« fond-03 » ou « fond-03.webp ») ou index 1..16. À défaut, pick
   *  déterministe via `seed` (jamais aléatoire → zéro scintillement au render). */
  image?: string | number;
  /** Graine de sélection déterministe (ex. chemin de page) si `image` absent. */
  seed?: string;
  voile?: number; // opacité du scrim couleur de page (0.40)
  brightness?: number; // 0.90
  grayscale?: number; // 0.50
  saturate?: number; // 0.83
  blur?: number; // px (1)
  fade?: boolean; // fondu des bords (masque radial)
  theme?: ThemeFond;
}

const COULEUR_PAGE: Record<ThemeFond, string> = {
  light: "#f4f0e6",
  dark: "#13200f",
};

function resoudreSlug(image: string | number | undefined, seed: string | undefined): string {
  if (typeof image === "number") {
    const i = (((Math.trunc(image) - 1) % 16) + 16) % 16; // 1..16 → 0..15
    return `fond-${String(i + 1).padStart(2, "0")}`;
  }
  if (typeof image === "string") return image.replace(/\.webp$/i, "");
  if (seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return `fond-${String((h % 16) + 1).padStart(2, "0")}`;
  }
  return "fond-01";
}

export function FondPeint({
  image,
  seed,
  voile = 0.4,
  brightness = 0.9,
  grayscale = 0.5,
  saturate = 0.83,
  blur = 1,
  fade = true,
  theme = "light",
}: FondPeintProps) {
  const slug = resoudreSlug(image, seed);
  const url = `/banque/fonds/${slug}.webp`;
  const pageColor = COULEUR_PAGE[theme];
  const mask = fade
    ? "radial-gradient(125% 130% at 50% 38%, #000 52%, transparent 100%)"
    : undefined;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: pageColor }}
    >
      {/* Image traitée — fondue aux bords, légèrement agrandie pour couvrir le flou. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${url}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: `brightness(${brightness}) grayscale(${grayscale}) saturate(${saturate}) blur(${blur}px)`,
          transform: "scale(1.06)",
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      />
      {/* Voile couleur de page (scrim bas → l'image reste présente mais discrète). */}
      <div className="absolute inset-0" style={{ background: pageColor, opacity: voile }} />
    </div>
  );
}

interface ContenuLisibleProps {
  children: React.ReactNode;
  /** Opacité du fond local doux derrière le texte (0 = désactivé). */
  intensite?: number;
  theme?: ThemeFond;
  className?: string;
}

// Pose un fond translucide très doux + flou derrière les blocs de texte denses,
// pour garder le texte net sans remonter le voile global. Dosable (intensite)
// et désactivable (intensite = 0). L'image continue de vivre dans les marges.
export function ContenuLisible({ children, intensite = 0.6, theme = "light", className }: ContenuLisibleProps) {
  const base = theme === "dark" ? "19, 31, 15" : "244, 240, 230";
  return (
    <div
      className={cn("rounded-2xl", className)}
      style={
        intensite > 0
          ? {
              background: `rgba(${base}, ${intensite})`,
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
