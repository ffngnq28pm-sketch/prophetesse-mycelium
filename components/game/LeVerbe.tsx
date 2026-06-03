"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useStore } from "@/lib/store";
import { LEXIQUE } from "@/data/verbe-lexique";
import {
  cleDuJour,
  construireGrillePartage,
  evaluer,
  formatCompteur,
  indexDuJour,
  normaliser,
  prochainMinuit,
  streakEncoreVivant,
  type Etat,
} from "@/lib/verbe-logic";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Delete, Flame } from "lucide-react";

const LONGUEUR = 6;
const NB_ESSAIS = 6;

// Le canon, normalisé une seule fois au chargement du module.
// Sert à TIRER la réponse du jour, pas à filtrer les tentatives : on accepte
// n'importe quel mot de 6 lettres comme essai (cf. soumettre).
const ENTREES = LEXIQUE.map((e) => ({ mot: normaliser(e.mot), revelation: e.revelation }));

// Disposition AZERTY : 3 rangées. Entrée et Effacer encadrent la dernière.
const RANGEES = [
  ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
  ["ENTREE", "W", "X", "C", "V", "B", "N", "EFFACER"],
];

// Palette terre à fort contraste, en STYLE INLINE (jamais une classe Tailwind
// interpolée : ces dernières sont purgées en prod et le retour de couleur
// disparaîtrait en ligne). Aucun ROUGE : il reste réservé à la casquette d'Olivia.
const STYLE_ETAT: Record<Etat | "vide", React.CSSProperties> = {
  vide: { backgroundColor: "#e6dec5", color: "#5a523c", border: "1px solid #c9bfa3" },
  juste: { backgroundColor: "#5a7d3c", color: "#f3efe2", border: "3px solid #3f5a28" },
  present: { backgroundColor: "#c9952f", color: "#2b2410", border: "3px dashed #8a6418" },
  absent: { backgroundColor: "#6f6857", color: "#ece5d3", border: "1px solid #5a5446" },
};

const LIBELLE_ETAT: Record<Etat, string> = {
  juste: "juste, bonne place",
  present: "bien présent, mal placé",
  absent: "absent",
};

// Une case de la grille. Hoistée au module + memoïsée : son identité de
// composant est stable, donc un re-render du parent (ex. autre state) ne la
// remonte pas et ne rejoue pas son flip. La couleur (style inline) est
// toujours l'état final ; seul le `rotateX` s'anime — une seule fois.
interface CaseProps {
  lettre: string;
  etat: Etat | "vide";
  col: number;
  anime: boolean; // true uniquement lors de la première révélation de la ligne
}

const Case = memo(function Case({ lettre, etat, col, anime }: CaseProps) {
  const ariaLettre = lettre ? `lettre ${lettre}, ` : "case vide, ";
  const ariaEtat = etat === "vide" ? "" : LIBELLE_ETAT[etat as Etat];
  return (
    <motion.div
      role="img"
      aria-label={`${ariaLettre}${ariaEtat}`.trim()}
      initial={false}
      animate={anime ? { rotateX: [90, 0] } : { rotateX: 0 }}
      transition={anime ? { duration: 0.5, ease: "easeInOut", delay: col * 0.12 } : { duration: 0 }}
      className="flex aspect-square min-h-[44px] w-full items-center justify-center rounded-md font-serif text-2xl font-bold uppercase sm:text-3xl"
      style={STYLE_ETAT[etat]}
    >
      {lettre}
    </motion.div>
  );
});

// Compte à rebours isolé : il détient son propre setInterval/state, si bien
// que son tic chaque seconde ne re-rend QUE lui — jamais la grille animée.
function CompteARebours() {
  const [restant, setRestant] = useState(() => prochainMinuit(new Date()).getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => {
      setRestant(prochainMinuit(new Date()).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="font-serif text-sm text-mousse-700 dark:text-parchemin-200/80">
      Prochain Verbe dans <span className="tabular-nums font-semibold">{formatCompteur(restant)}</span>
    </p>
  );
}

export function LeVerbe() {
  const reduceMotion = useReducedMotion();

  // Date figée au montage : détermine le mot du jour et la clé localStorage.
  const [aujourdhui] = useState(() => new Date());
  const idx = useMemo(() => indexDuJour(aujourdhui, ENTREES.length), [aujourdhui]);
  const entree = ENTREES[idx];
  const cible = entree.mot;
  const premiere = cible[0];
  const cle = useMemo(() => cleDuJour(aujourdhui), [aujourdhui]);

  // État persistant de la partie du jour.
  const partie = useStore((s) => s.verbeParties[cle]);
  const ajouterEssai = useStore((s) => s.verbeAjouterEssai);
  const terminer = useStore((s) => s.verbeTerminer);
  const verbeStreak = useStore((s) => s.verbeStreak);
  const meilleurStreak = useStore((s) => s.verbeMeilleurStreak);
  const derniereDateGagnee = useStore((s) => s.verbeDerniereDateGagnee);

  const essais = useMemo(() => partie?.essais ?? [], [partie]);
  const statut = partie?.statut ?? "en_cours";

  // Saisie en cours : commence par la première lettre révélée (style Sutom).
  const [saisie, setSaisie] = useState(premiere);
  const [message, setMessage] = useState<string | null>(null);
  const shakeControls = useAnimationControls();

  // Secousse douce de la ligne courante (respecte prefers-reduced-motion).
  const secouer = useCallback(() => {
    if (reduceMotion) return;
    shakeControls.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } });
  }, [reduceMotion, shakeControls]);

  // Si on rouvre une partie déjà terminée, on n'écrit rien dans la saisie.
  const enCours = statut === "en_cours";

  // Série « vivante » pour l'affichage (gagné aujourd'hui ou hier).
  const streakAffiche = streakEncoreVivant(derniereDateGagnee, aujourdhui) ? verbeStreak : 0;

  const soumettre = useCallback(() => {
    if (!enCours) return;
    const mot = normaliser(saisie);
    if (mot.length < LONGUEUR) {
      setMessage("Il manque des lettres : le Verbe en compte six.");
      secouer();
      return;
    }
    // On accepte tout mot de six lettres : le canon sert à tirer la réponse,
    // pas à censurer les tentatives. Le joueur n'a pas à connaître les ~50 mots.
    setMessage(null);
    ajouterEssai(cle, mot);
    const total = essais.length + 1;
    if (mot === cible) {
      terminer(cle, "gagne");
    } else if (total >= NB_ESSAIS) {
      terminer(cle, "perdu");
    }
    setSaisie(premiere);
  }, [enCours, saisie, ajouterEssai, cle, essais.length, cible, terminer, premiere, secouer]);

  const taper = useCallback(
    (lettre: string) => {
      if (!enCours) return;
      setMessage(null);
      setSaisie((s) => (s.length < LONGUEUR ? s + lettre : s));
    },
    [enCours]
  );

  const effacer = useCallback(() => {
    if (!enCours) return;
    setMessage(null);
    // On ne supprime jamais la première lettre, qui reste l'indice.
    setSaisie((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, [enCours]);

  // Clavier physique (desktop).
  useEffect(() => {
    if (!enCours) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        soumettre();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        effacer();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        taper(e.key.toUpperCase());
      } else {
        const n = normaliser(e.key);
        if (n.length === 1) taper(n);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enCours, soumettre, effacer, taper]);

  // Meilleur état connu de chaque lettre, pour colorer le clavier.
  const etatsClavier = useMemo(() => {
    const map: Record<string, Etat> = {};
    const rang: Record<Etat, number> = { absent: 0, present: 1, juste: 2 };
    for (const essai of essais) {
      const ev = evaluer(essai, cible);
      for (let i = 0; i < essai.length; i++) {
        const c = essai[i];
        const e = ev[i];
        if (!map[c] || rang[e] > rang[map[c]]) map[c] = e;
      }
    }
    return map;
  }, [essais, cible]);

  // Lignes déjà révélées : une ligne ne s'anime QU'À sa première révélation.
  // Au montage, on pré-marque toutes les lignes restaurées (partie déjà jouée /
  // refresh) pour qu'elles s'affichent instantanément, sans flip d'entrée.
  const dejaAnimees = useRef<Set<number> | null>(null);
  if (dejaAnimees.current === null) {
    dejaAnimees.current = new Set();
    for (let i = 0; i < essais.length; i++) dejaAnimees.current.add(i);
  }
  // Après chaque nouvel essai, on note la dernière ligne comme animée afin
  // qu'un re-render ultérieur ne rejoue pas son flip.
  useEffect(() => {
    if (essais.length > 0) dejaAnimees.current?.add(essais.length - 1);
  }, [essais.length]);

  // Partage sans spoiler.
  const [copie, setCopie] = useState(false);
  const partager = useCallback(async () => {
    const p = (n: number) => String(n).padStart(2, "0");
    const dateLisible = `${p(aujourdhui.getDate())}/${p(aujourdhui.getMonth() + 1)}/${aujourdhui.getFullYear()}`;
    const score = statut === "gagne" ? `${essais.length}/6` : `X/6`;
    const grille = construireGrillePartage(essais, cible);
    const texte = `Le Verbe du Jour — ${dateLisible}\n${score}\n${grille}\nmycelium.shadowstepsociety.com`;
    try {
      await navigator.clipboard.writeText(texte);
    } catch {
      // Fallback : zone de texte temporaire.
      const ta = document.createElement("textarea");
      ta.value = texte;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignoré : le presse-papier n'est pas disponible */
      }
      document.body.removeChild(ta);
    }
    setCopie(true);
    setTimeout(() => setCopie(false), 2200);
  }, [aujourdhui, statut, essais, cible]);

  // Lignes : passées (évaluées), courante (saisie), futures (vides).
  const lignes: { lettres: string[]; etats: (Etat | "vide")[]; anime: boolean; courante: boolean }[] = [];
  for (let r = 0; r < NB_ESSAIS; r++) {
    if (r < essais.length) {
      const essai = essais[r];
      lignes.push({
        lettres: essai.split(""),
        etats: evaluer(essai, cible),
        // flip une seule fois : dernière ligne, pas encore animée, motion autorisée
        anime: r === essais.length - 1 && !dejaAnimees.current.has(r) && !reduceMotion,
        courante: false,
      });
    } else if (r === essais.length && enCours) {
      const lettres = Array.from({ length: LONGUEUR }, (_, i) => saisie[i] ?? "");
      lignes.push({
        lettres,
        etats: lettres.map(() => "vide" as const),
        anime: false,
        courante: true,
      });
    } else {
      lignes.push({
        lettres: Array.from({ length: LONGUEUR }, () => ""),
        etats: Array.from({ length: LONGUEUR }, () => "vide" as const),
        anime: false,
        courante: false,
      });
    }
  }

  const blocSerie = (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge variant="grace">
        <Flame size={14} /> Série : {streakAffiche}
      </Badge>
      <Badge variant="outline">Meilleure série : {meilleurStreak}</Badge>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-md space-y-5">
      {/* Indice : première lettre révélée */}
      {enCours && (
        <p className="text-center font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
          Indice de l'Ordre : le Verbe commence par{" "}
          <span className="font-bold not-italic text-mousse-900 dark:text-parchemin-100">{premiere}</span>. Six lettres,
          six tentatives — tente n'importe quel mot de six lettres, l'Ordre l'accueille.
        </p>
      )}

      {/* Grille */}
      <div className="space-y-1.5" role="grid" aria-label="Grille du Verbe du Jour">
        {lignes.map((ligne, r) => (
          <motion.div
            key={r}
            role="row"
            className="grid grid-cols-6 gap-1.5"
            animate={ligne.courante ? shakeControls : undefined}
          >
            {ligne.lettres.map((l, c) => (
              <Case key={c} lettre={l} etat={ligne.etats[c]} col={c} anime={ligne.anime} />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Message de soumission (essai trop court) — visible, près de la grille */}
      <div aria-live="polite" role="status" className="min-h-[2.5rem]">
        {message && (
          <p
            className="rounded-md px-3 py-2 text-center font-serif text-sm font-medium"
            style={{ backgroundColor: "#c9952f", color: "#2b2410", border: "1px solid #8a6418" }}
          >
            {message}
          </p>
        )}
      </div>

      {enCours ? (
        <>
          {/* Clavier AZERTY tactile */}
          <div className="space-y-1.5 select-none">
            {RANGEES.map((rangee, i) => (
              <div key={i} className="flex justify-center gap-1.5">
                {rangee.map((touche) => {
                  if (touche === "ENTREE") {
                    return (
                      <button
                        key={touche}
                        onClick={soumettre}
                        aria-label="Valider l'essai"
                        className="flex min-h-[48px] flex-[1.6] items-center justify-center rounded-md font-serif text-xs font-semibold uppercase tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre-500"
                        style={STYLE_ETAT.vide}
                      >
                        Entrée
                      </button>
                    );
                  }
                  if (touche === "EFFACER") {
                    return (
                      <button
                        key={touche}
                        onClick={effacer}
                        aria-label="Effacer la dernière lettre"
                        className="flex min-h-[48px] flex-[1.6] items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre-500"
                        style={STYLE_ETAT.vide}
                      >
                        <Delete size={18} />
                      </button>
                    );
                  }
                  const etat = etatsClavier[touche];
                  const ariaEtat = etat ? ` (${LIBELLE_ETAT[etat]})` : "";
                  return (
                    <button
                      key={touche}
                      onClick={() => taper(touche)}
                      aria-label={`Lettre ${touche}${ariaEtat}`}
                      className="flex min-h-[48px] flex-1 items-center justify-center rounded-md font-serif text-lg font-bold uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre-500"
                      style={etat ? STYLE_ETAT[etat] : STYLE_ETAT.vide}
                    >
                      {touche}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          {blocSerie}
        </>
      ) : (
        <Card className="text-center">
          {statut === "gagne" ? (
            <>
              <div className="flex justify-center">
                <OliviaMascotte />
              </div>
              <CardSubtitle className="mt-2">Le Verbe est trouvé</CardSubtitle>
              <CardTitle className="mt-1 tracking-[0.3em]">{cible}</CardTitle>
              <p className="mt-3 font-serif italic text-mousse-800 dark:text-parchemin-100">
                « {entree.revelation} »
              </p>
              <Ornement />
              <p className="font-serif text-sm text-mousse-700 dark:text-parchemin-200/80">
                Trouvé en <strong>{essais.length}/6</strong>.
              </p>
              {blocSerie}
            </>
          ) : (
            <>
              <CardSubtitle>Le Verbe t'a échappé</CardSubtitle>
              <p className="mt-2 font-serif italic text-mousse-700 dark:text-parchemin-200/80">
                Il n'en sera pas tenu rigueur — reviens aux matines de demain.
              </p>
              <CardTitle className="mt-3 tracking-[0.3em]">{cible}</CardTitle>
              <p className="mt-3 font-serif italic text-mousse-800 dark:text-parchemin-100">
                « {entree.revelation} »
              </p>
              <Ornement />
              {blocSerie}
            </>
          )}

          <div className="mt-4 flex flex-col items-center gap-3">
            <button onClick={partager} className="btn-sacre">
              {copie ? "Copié ✓" : "Copier ma feuille de route"}
            </button>
            <CompteARebours />
          </div>
        </Card>
      )}
    </div>
  );
}

// Mascotte discrète : Olivia, dont la casquette rouge est le SEUL accent vif autorisé.
function OliviaMascotte() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="Olivia, casquette rouge">
      {/* visage */}
      <circle cx="32" cy="36" r="15" fill="#e6dec5" stroke="#5a523c" strokeWidth="2" />
      {/* yeux */}
      <circle cx="27" cy="35" r="1.6" fill="#5a523c" />
      <circle cx="37" cy="35" r="1.6" fill="#5a523c" />
      {/* sourire */}
      <path d="M27 41 Q32 45 37 41" fill="none" stroke="#5a523c" strokeWidth="2" strokeLinecap="round" />
      {/* casquette — le seul rouge */}
      <path d="M17 28 Q32 14 47 28 Z" fill="#c0392b" stroke="#7a2218" strokeWidth="1.5" />
      <path d="M17 28 Q10 29 9 32 L20 31 Z" fill="#c0392b" stroke="#7a2218" strokeWidth="1.5" />
    </svg>
  );
}
