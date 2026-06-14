"use client";

import { useEffect, useState } from "react";

// Fond peint posé DERRIÈRE et AUTOUR du canvas d'un jeu (calque contenu, pas
// plein écran). Anti-flash par sonde new Image() → jamais d'icône cassée, repli
// couleur sombre si le webp manque. Deux voiles dosables : un voile uniforme
// (lisibilité globale) + une vignette qui assombrit le centre (sous le canvas),
// pour que le décor habille les marges sans distraire du jeu.
// Sobriété (Boussole) : aucune couleur vive ajoutée — seul l'accent du jeu vit.
export function FondJeu({
  slug,
  voile = 0.34,
  centreSombre = 0.5,
  couleurRepli = "#0b1208",
}: {
  slug: string;
  voile?: number; // opacité du voile couleur uniforme
  centreSombre?: number; // intensité du noircissement central (sous le canvas)
  couleurRepli?: string;
}) {
  const url = `/banque/jeux/${slug}.webp`;
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let vivant = true;
    const img = new Image(); // sonde : ne rend jamais d'icône cassée
    img.onload = () => vivant && setOk(true);
    img.onerror = () => vivant && setOk(false);
    img.src = url;
    return () => {
      vivant = false;
    };
  }, [url]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: couleurRepli }}>
      {ok && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${url}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(0.85) brightness(0.88)",
          }}
        />
      )}
      {/* voile uniforme : assoit la lisibilité de l'ensemble */}
      <div className="absolute inset-0" style={{ background: couleurRepli, opacity: voile }} />
      {/* vignette : assombrit vers le centre (sous le canvas), fond aux bords */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(58% 58% at 50% 48%, rgba(5,9,4,${centreSombre}) 0%, rgba(5,9,4,0) 72%)`,
        }}
      />
    </div>
  );
}
