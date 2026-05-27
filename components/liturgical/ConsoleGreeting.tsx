"use client";

import { useEffect } from "react";

// Salut discret pour les pèlerins hexadécimaux. Une seule fois par session,
// indépendamment du nombre de remounts dûs à la navigation SPA.
declare global {
  interface Window {
    __mycelium_console_greeted?: boolean;
  }
}

const MESSAGE = `
            🍄

   Tu es venu inspecter le code.
Tu es donc, par définition, Mycélium.

  Bienvenue, Disciple Hexadécimal.
    Que la Sève soit avec toi.

         — L'Ordre Mycélien
`;

export function ConsoleGreeting() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__mycelium_console_greeted) return;
    window.__mycelium_console_greeted = true;

    // Couleur ocre liturgique, police serif. Le tout dans un seul console.log
    // pour ne pas polluer les logs des disciples qui n'ouvrent pas la console.
    // eslint-disable-next-line no-console
    console.log(
      "%c" + MESSAGE,
      "color: #c9a227; font-family: Georgia, 'Cormorant Garamond', serif; font-size: 13px; line-height: 1.6;"
    );
  }, []);

  return null;
}
