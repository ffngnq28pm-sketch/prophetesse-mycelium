"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

interface Props {
  livreId: string;
  chapitreId: string;
  paraboleId?: number;
}

export function LectureMarker({ livreId, chapitreId, paraboleId }: Props) {
  const lire = useStore((s) => s.lireChapitreLivre);
  const lireParabole = useStore((s) => s.lireParabole);
  useEffect(() => {
    const t = setTimeout(() => {
      lire(livreId, chapitreId);
      if (typeof paraboleId === "number" && !Number.isNaN(paraboleId)) lireParabole(paraboleId);
    }, 1500);
    return () => clearTimeout(t);
  }, [livreId, chapitreId, paraboleId, lire, lireParabole]);
  return null;
}
