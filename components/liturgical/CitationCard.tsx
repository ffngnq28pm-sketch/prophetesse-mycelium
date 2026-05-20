"use client";

import { motion } from "framer-motion";
import { Citation } from "@/data/citations";
import { Card, CardSubtitle } from "@/components/ui/Card";

export function CitationCard({ citation }: { citation: Citation }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
    >
      <Card>
        <CardSubtitle>Parole de l'Ordre</CardSubtitle>
        <p className="versicle mt-3 text-base text-mousse-900 dark:text-parchemin-100">
          « {citation.texte} »
        </p>
        {citation.contexte && (
          <p className="mt-3 font-sans text-xs italic text-mousse-600 dark:text-parchemin-200/70">
            — {citation.contexte}
          </p>
        )}
      </Card>
    </motion.div>
  );
}
