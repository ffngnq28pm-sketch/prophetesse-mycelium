"use client";

import { motion } from "framer-motion";
import { Verset } from "@/data/versets";
import { Card, CardSubtitle } from "@/components/ui/Card";
import { Ornement } from "./Ornement";

export function VersetCard({ verset, label = "Verset du Jour" }: { verset: Verset; label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card>
        <CardSubtitle>{label}</CardSubtitle>
        <p className="font-serif text-xs uppercase tracking-widest text-ocre-600 dark:text-ocre-400">
          {verset.livre} · {verset.reference}
        </p>
        <Ornement />
        <p className="versicle text-lg text-mousse-900 md:text-xl dark:text-parchemin-100">
          « {verset.texte} »
        </p>
      </Card>
    </motion.div>
  );
}
