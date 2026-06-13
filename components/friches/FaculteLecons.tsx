"use client";

import Link from "next/link";
import type { Lecon } from "@/data/friches";
import { useFriches } from "@/lib/friches-store";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Check, BookOpen, Sprout } from "lucide-react";
import { PANNEAU_LISIBLE } from "./styles";

// Liste des leçons d'une faculté avec leur statut (à lire / lue / maîtrisée).
export function FaculteLecons({ faculteId, lecons }: { faculteId: string; lecons: Lecon[] }) {
  const hasHydrated = useFriches((s) => s.hasHydrated);
  const maitrisees = useFriches((s) => s.leconsMaitrisees);
  const scores = useFriches((s) => s.scores);

  return (
    <div className="space-y-3">
      {lecons.map((l, idx) => {
        const maitrisee = hasHydrated && maitrisees.includes(l.id);
        const tentee = hasHydrated && !maitrisee && scores[l.id] != null;
        return (
          <Link key={l.id} href={`/universite/${faculteId}/${l.id}`} className="group block">
            <Card className={`${PANNEAU_LISIBLE} transition hover:border-ocre-500/60`}>
              <div className="flex items-start gap-4">
                <span className="mt-1 font-serif text-lg font-light text-ocre-500">{idx + 1}</span>
                <div className="flex-1">
                  <CardTitle className="text-lg">{l.titre}</CardTitle>
                  {l.epigraphe && (
                    <p className="mt-1 font-serif text-sm italic text-mousse-700 dark:text-parchemin-200/80">
                      « {l.epigraphe} »
                    </p>
                  )}
                </div>
                <span className="mt-1 shrink-0">
                  {maitrisee ? (
                    <Badge variant="grace">
                      <Check size={13} /> Maîtrisée
                    </Badge>
                  ) : tentee ? (
                    <Badge variant="outline">
                      <Sprout size={13} /> Lue
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <BookOpen size={13} /> À lire
                    </Badge>
                  )}
                </span>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
