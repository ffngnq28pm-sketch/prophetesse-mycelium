"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Fond de scène d'une Veillée : image peinte sous /banque/veillee/<fond>.webp,
// posée en background-image (sondée → JAMAIS d'icône cassée) + voile sombre pour
// la lisibilité de l'UI. Repli : couleur sombre unie si le webp est absent.
export function SceneFond({
  fond,
  children,
  className,
}: {
  fond: string;
  children: React.ReactNode;
  className?: string;
}) {
  const url = `/banque/veillee/${fond}.webp`;
  const [present, setPresent] = useState(false);
  useEffect(() => {
    let vivant = true;
    setPresent(false);
    const img = new Image();
    img.onload = () => vivant && setPresent(true);
    img.onerror = () => vivant && setPresent(false);
    img.src = url;
    return () => {
      vivant = false;
    };
  }, [url]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl border-2 border-ocre-500/40 shadow-2xl", className)}>
      <div aria-hidden className="absolute inset-0" style={{ background: "#0e140c" }} />
      {present && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundImage: `url('${url}')`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      )}
      {/* Voile sombre : l'UI sobre par-dessus reste lisible, nuit de veillée. */}
      <div aria-hidden className="absolute inset-0" style={{ background: "rgba(8,12,6,0.46)" }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
