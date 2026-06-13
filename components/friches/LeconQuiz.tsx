"use client";

import { useState } from "react";
import Link from "next/link";
import type { Question } from "@/data/friches";
import { useFriches, SEUIL_MAITRISE } from "@/lib/friches-store";
import { Button } from "@/components/ui/Button";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Ornement } from "@/components/liturgical/Ornement";
import { Check, Circle } from "lucide-react";

// Bloc interactif d'une leçon : statut de maîtrise + quiz QCM (une question à la
// fois, révélation de la bonne réponse + explication, score final). Réussir au
// seuil marque la leçon maîtrisée (le grade global se recalcule tout seul).
export function LeconQuiz({
  leconId,
  faculteId,
  questions,
}: {
  leconId: string;
  faculteId: string;
  questions: Question[];
}) {
  const hasHydrated = useFriches((s) => s.hasHydrated);
  const maitrisees = useFriches((s) => s.leconsMaitrisees);
  const meilleurScore = useFriches((s) => s.scores[leconId]);
  const enregistrer = useFriches((s) => s.enregistrerQuiz);

  const [enCours, setEnCours] = useState(false);
  const [i, setI] = useState(0);
  const [choix, setChoix] = useState<number | null>(null);
  const [revele, setRevele] = useState(false);
  const [score, setScore] = useState(0);
  const [fini, setFini] = useState(false);

  const total = questions.length;
  const maitrisee = maitrisees.includes(leconId);

  const demarrer = () => {
    setEnCours(true);
    setI(0);
    setChoix(null);
    setRevele(false);
    setScore(0);
    setFini(false);
  };

  const repondre = (idx: number) => {
    if (revele) return;
    setChoix(idx);
    setRevele(true);
    if (idx === questions[i].correct) setScore((s) => s + 1);
  };

  const suivante = () => {
    if (i + 1 < total) {
      setI(i + 1);
      setChoix(null);
      setRevele(false);
    } else {
      enregistrer(leconId, score, SEUIL_MAITRISE);
      setFini(true);
    }
  };

  // Avant hydratation : on évite tout décalage SSR/client.
  if (!hasHydrated) {
    return (
      <Card className="mt-8 text-center">
        <p className="font-serif italic text-mousse-700 dark:text-parchemin-200/70">
          « Le mycélium s'éveille… »
        </p>
      </Card>
    );
  }

  // —— Écran de résultat ——
  if (fini) {
    const reussi = score >= SEUIL_MAITRISE;
    return (
      <Card className="mt-8 text-center">
        <CardSubtitle>Quiz terminé</CardSubtitle>
        <CardTitle className="mt-1">
          {score}/{total}
        </CardTitle>
        <Ornement />
        <p className="font-serif italic text-mousse-800 dark:text-parchemin-100">
          {reussi
            ? "Leçon maîtrisée. Le savoir prend racine — ton grade a peut-être avancé."
            : "Presque : il faut " + SEUIL_MAITRISE + "/" + total + " pour maîtriser la leçon. Relis, puis retente sans hâte."}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button onClick={demarrer} variant="ghost">
            Repasser le quiz
          </Button>
          <Link href={`/universite/${faculteId}`} className="btn-sacre">
            Retour à la faculté
          </Link>
        </div>
      </Card>
    );
  }

  // —— Quiz en cours ——
  if (enCours) {
    const Q = questions[i];
    return (
      <Card className="mt-8">
        <div className="flex items-center justify-between">
          <CardSubtitle>
            Question {i + 1} / {total}
          </CardSubtitle>
          <Badge variant="outline">Score : {score}</Badge>
        </div>
        <p className="mt-2 font-serif text-lg text-mousse-900 dark:text-parchemin-100">{Q.q}</p>
        <ul className="mt-4 space-y-2">
          {Q.options.map((opt, idx) => {
            const estBonne = idx === Q.correct;
            const choisi = choix === idx;
            // Palette sobre : mousse pour la bonne réponse, terre sourde pour un
            // mauvais choix (jamais de rouge vif — Boussole).
            let style = "border-mousse-500/30 hover:border-ocre-500/50";
            if (revele && estBonne) style = "border-mousse-600 bg-mousse-500/15";
            else if (revele && choisi) style = "border-[#8a6a48]/60 bg-[#8a6a48]/10 opacity-80";
            else if (revele) style = "border-mousse-500/15 opacity-60";
            return (
              <li key={idx}>
                <button
                  onClick={() => repondre(idx)}
                  disabled={revele}
                  className={`flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left font-serif transition ${style}`}
                >
                  <span className="shrink-0 text-ocre-600 dark:text-ocre-400">
                    {revele && estBonne ? <Check size={16} /> : <Circle size={12} />}
                  </span>
                  <span className="text-mousse-900 dark:text-parchemin-100">{opt}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {revele && (
          <div className="mt-4 rounded-md border border-ocre-500/30 bg-ocre-500/5 p-3">
            <p className="font-serif text-sm italic text-mousse-800 dark:text-parchemin-100">
              {Q.explication}
            </p>
            <div className="mt-3 text-right">
              <Button onClick={suivante}>{i + 1 < total ? "Suivante" : "Voir mon score"}</Button>
            </div>
          </div>
        )}
      </Card>
    );
  }

  // —— Accueil du quiz (statut + bouton) ——
  return (
    <Card className="mt-8 text-center">
      {maitrisee ? (
        <Badge variant="grace">
          <Check size={14} /> Leçon maîtrisée{meilleurScore != null ? ` · ${meilleurScore}/${total}` : ""}
        </Badge>
      ) : meilleurScore != null ? (
        <Badge variant="outline">Déjà tentée : {meilleurScore}/{total}</Badge>
      ) : (
        <Badge variant="outline">Quiz non encore passé</Badge>
      )}
      <p className="mt-3 font-serif italic text-mousse-700 dark:text-parchemin-200/80">
        Trois questions. Il en faut {SEUIL_MAITRISE} sur {total} pour maîtriser la leçon.
      </p>
      <div className="mt-4">
        <Button onClick={demarrer}>{maitrisee ? "Repasser le quiz" : "Passer le quiz"}</Button>
      </div>
    </Card>
  );
}
