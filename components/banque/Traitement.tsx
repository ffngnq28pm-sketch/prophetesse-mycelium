// Calques partagés de la banque : le traitement « monde Mycélium » et le repli
// parchemin. Tous deux décoratifs (aria-hidden, pointer-events-none).

import { banqueTokens, GRAIN_URL } from "./tokens";

// Traitement commun posé PAR-DESSUS l'image : calque ocre soft-light + grain
// subtil + vignette douce optionnelle. Centralisé pour la cohérence.
export function TraitementMycelien({ vignette = false }: { vignette?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: banqueTokens.ocreOverlay, mixBlendMode: "soft-light" }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRAIN_URL,
          backgroundRepeat: "repeat",
          opacity: banqueTokens.grainOpacity,
          mixBlendMode: "overlay",
        }}
      />
      {vignette && (
        <div
          className="absolute inset-0"
          style={{ boxShadow: `inset 0 0 140px rgba(20,28,14,${banqueTokens.vignette})` }}
        />
      )}
    </div>
  );
}

// Repli parchemin texturé : s'affiche quand l'image est absente (onError) —
// jamais d'icône « image cassée ». `subtle` = quasi invisible sur fond
// parchemin (utile pour un héros encore sans image : pas de bouleversement).
export function RepliParchemin({
  embleme,
  subtle = false,
}: {
  embleme?: string;
  subtle?: boolean;
}) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: subtle
          ? "radial-gradient(circle at 30% 22%, rgba(239,230,203,0.55), rgba(214,204,169,0.18))"
          : "radial-gradient(circle at 30% 20%, #efe6cb 0%, #e6dec5 45%, #d6cca9 100%)",
      }}
    >
      <svg viewBox="0 0 300 200" className="absolute inset-0 h-full w-full opacity-20" aria-hidden>
        <path
          d="M10 170 Q70 142 120 162 Q170 182 220 158 Q260 140 295 162"
          stroke="#bf8d2c"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M30 186 Q90 166 150 180 Q210 192 280 174"
          stroke="#bf8d2c"
          strokeWidth="0.7"
          fill="none"
        />
        <circle cx="120" cy="162" r="2.4" fill="#bf8d2c" />
        <circle cx="220" cy="158" r="2" fill="#bf8d2c" />
      </svg>
      {embleme && !subtle && (
        <span className="text-5xl opacity-70" aria-hidden>
          {embleme}
        </span>
      )}
    </div>
  );
}
