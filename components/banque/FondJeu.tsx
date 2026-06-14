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

// Calque AMBIANT plein écran (fixe, -z-10) : l'image en filigrane dans les
// grandes marges autour de la colonne de contenu. Masquée au CENTRE (où vit le
// contenu → texte parfaitement lisible), visible seulement vers les bords. Très
// atténuée (voile couleur de page) pour murmurer, jamais distraire. Anti-flash
// par sonde + repli couleur. Thème détecté au montage (crème clair / nuit).
export function FondJeuAmbiance({
  slug,
  voile = 0.12,
}: {
  slug: string;
  voile?: number;
}) {
  const url = `/banque/jeux/${slug}.webp`;
  const [ok, setOk] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    let vivant = true;
    const img = new Image();
    img.onload = () => vivant && setOk(true);
    img.onerror = () => vivant && setOk(false);
    img.src = url;
    return () => {
      vivant = false;
    };
  }, [url]);

  const pageColor = dark ? "#13200f" : "#f4f0e6";
  // L'image vit aux bords, s'efface au centre (sous le contenu).
  const mask = "radial-gradient(74% 84% at 50% 44%, transparent 30%, #000 78%)";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ background: pageColor }}>
      {ok && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${url}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(1) grayscale(0.06) saturate(1) blur(0.5px)",
            transform: "scale(1.06)",
            WebkitMaskImage: mask,
            maskImage: mask,
          }}
        />
      )}
      {/* voile couleur de page : l'image reste présente mais en filigrane */}
      <div className="absolute inset-0" style={{ background: pageColor, opacity: voile }} />
    </div>
  );
}
