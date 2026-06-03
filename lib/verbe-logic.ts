// Logique pure du jeu « Le Verbe du Jour » — aucun React ici.
// Dans l'esprit de lib/traversee-engine.ts : testable, déterministe, sans effet de bord.

export type Etat = "juste" | "present" | "absent";

/** Normalise une chaîne : retire les accents, met en majuscules, ne garde que A–Z. */
export function normaliser(s: string): string {
  return s
    .normalize("NFD") // sépare lettres et diacritiques
    .replace(/[\u0300-\u036f]/g, "") // retire les accents
    .toUpperCase()
    .replace(/[^A-Z]/g, ""); // ne garde que A–Z
}

// EPOCH = 1er janvier 2025, minuit LOCAL
const EPOCH = new Date(2025, 0, 1);

/** Index déterministe du mot du jour, en date locale (change à minuit local). */
export function indexDuJour(d: Date, taille: number): number {
  const aujourdHui = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const jours = Math.floor((aujourdHui.getTime() - EPOCH.getTime()) / 86_400_000);
  return ((jours % taille) + taille) % taille; // modulo positif
}

/** Clé "AAAA-MM-JJ" en date locale, pour indexer le localStorage. */
export function cleDuJour(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Évaluation d'un essai — algorithme Wordle à DEUX passes (gère les lettres doublées). */
export function evaluer(essai: string, cible: string): Etat[] {
  const n = cible.length;
  const res: Etat[] = new Array(n).fill("absent");
  const reste: Record<string, number> = {};

  // passe 1 : les "juste"
  for (let i = 0; i < n; i++) {
    if (essai[i] === cible[i]) res[i] = "juste";
    else reste[cible[i]] = (reste[cible[i]] ?? 0) + 1;
  }
  // passe 2 : les "present" (seulement s'il reste des occurrences non appariées)
  for (let i = 0; i < n; i++) {
    if (res[i] === "juste") continue;
    const c = essai[i];
    if ((reste[c] ?? 0) > 0) {
      res[i] = "present";
      reste[c]--;
    }
  }
  return res;
}

/** Un essai n'est valide que s'il fait 6 lettres ET appartient au canon. */
export function estMotValide(mot: string, ensemble: Set<string>): boolean {
  const m = normaliser(mot);
  return m.length === 6 && ensemble.has(m);
}

/** Date du prochain minuit local (sert au compte à rebours). */
export function prochainMinuit(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);
}

/** Formate une durée en ms vers "HH:MM:SS". */
export function formatCompteur(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}`;
}

/** La série est-elle encore vivante aujourd'hui ? (gagné aujourd'hui ou hier) */
export function streakEncoreVivant(derniereDateGagnee: string | null, d: Date): boolean {
  if (!derniereDateGagnee) return false;
  const cleAjd = cleDuJour(d);
  const cleHier = cleDuJour(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
  return derniereDateGagnee === cleAjd || derniereDateGagnee === cleHier;
}

const PASTILLE: Record<Etat, string> = {
  juste: "🟫",
  present: "🟨",
  absent: "⬛",
};

/** Construit la grille de partage en pastilles (aucune lettre révélée). */
export function construireGrillePartage(essais: string[], cible: string): string {
  return essais
    .map((essai) =>
      evaluer(essai, cible)
        .map((e) => PASTILLE[e])
        .join("")
    )
    .join("\n");
}
