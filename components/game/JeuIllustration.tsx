"use client";

import { useState } from "react";

// En-tête illustré d'une carte du hub des jeux.
// L'image vit dans public/jeux/<segment>.png (source 2:3, cadrée 3:2 sur le
// tiers supérieur). Tant que le fichier est absent, onError bascule sur un
// repli parchemin texturé — jamais d'icône d'image cassée. La détection à la
// compilation est impossible en static export, d'où le repli côté client.
export function JeuIllustration({
  segment,
  embleme,
  alt,
}: {
  segment: string;
  embleme: string;
  alt: string;
}) {
  const [absente, setAbsente] = useState(false);

  return (
    <div className="relative -mx-6 -mt-6 mb-4 aspect-[3/2] overflow-hidden rounded-t-lg">
      {absente ? (
        <div
          aria-hidden
          className="flex h-full w-full items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, #efe6cb 0%, #e6dec5 45%, #d6cca9 100%)",
          }}
        >
          {/* filaments discrets du placeholder */}
          <svg
            viewBox="0 0 300 200"
            className="absolute inset-0 h-full w-full opacity-25"
            aria-hidden
          >
            <path
              d="M10 180 Q70 150 120 168 Q170 186 220 162 Q260 144 295 165"
              stroke="#bf8d2c"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M30 192 Q90 170 150 184 Q210 196 280 178"
              stroke="#bf8d2c"
              strokeWidth="0.7"
              fill="none"
            />
            <circle cx="120" cy="168" r="2.5" fill="#bf8d2c" />
            <circle cx="220" cy="162" r="2" fill="#bf8d2c" />
          </svg>
          <span className="text-5xl" aria-hidden>
            {embleme}
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/jeux/${segment}.png`}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ objectPosition: "center 25%" }}
          onError={() => setAbsente(true)}
        />
      )}
      {/* voile dégradé sombre en bas : assoit le titre de la carte */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mousse-950/45 via-transparent to-transparent"
      />
    </div>
  );
}
