import { livreI } from "./genese";
import { livreII } from "./heresies-livre";
import { livreIII } from "./vertus-livre";
import { livreIV } from "./paraboles-livre";
import { livreV } from "./lamentations";
import { livreVI } from "./calendrier-livre";
import type { Livre } from "./types";

export const livres: Livre[] = [livreI, livreII, livreIII, livreIV, livreV, livreVI];

export function getLivre(id: string): Livre | undefined {
  return livres.find((l) => l.id === id);
}

export type { Livre, Chapitre } from "./types";
