"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Ornement } from "@/components/liturgical/Ornement";
import { Card } from "@/components/ui/Card";
import { Sprout, Trees, Gamepad2, BookOpen } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Petit utilitaire d'apparition au scroll — fondu très sobre.         */
/* ------------------------------------------------------------------ */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* L'illustration de la Marcheuse.                                     */
/* Emplacement réservé : déposer le fichier dans public/marcheuse-hero.png
   et la mise en page se cale automatiquement dessus. En attendant, un
   placeholder sobre (aucune couleur vive — la coiffe rouge viendra avec
   l'illustration finale).                                              */
/* ------------------------------------------------------------------ */
function MarcheuseHero() {
  const [imgOk, setImgOk] = useState(true);
  const alt =
    "La Marcheuse, figure allégorique de l'Ordre Mycélien : une femme sereine coiffée de rouge, un filet à papillons à la main, dans un cimetière doucement reverdi de mousse et de lichen.";

  return (
    <figure className="relative mx-auto w-full max-w-sm md:max-w-none">
      <div className="scroll-corner overflow-hidden rounded-lg border border-ocre-500/30 bg-parchemin-100/60 shadow-sm backdrop-blur dark:bg-mousse-900/40">
        <div className="relative aspect-[3/4] w-full">
          {imgOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/marcheuse-hero.png"
              alt={alt}
              className="h-full w-full object-cover"
              onError={() => setImgOk(false)}
            />
          ) : (
            <PlaceholderMarcheuse />
          )}
        </div>
      </div>
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}

/* Placeholder en tons sourds, sans aucun rouge ni couleur saturée. */
function PlaceholderMarcheuse() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-parchemin-100/40 to-mousse-100/30 px-6 text-center dark:from-mousse-900/50 dark:to-mousse-950/40">
      <svg
        viewBox="0 0 120 160"
        className="h-28 w-28 text-mousse-500/50 dark:text-mousse-300/40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        {/* silhouette allégorique — port noble, filet à la main */}
        <circle cx="56" cy="34" r="14" />
        <path d="M56 48 C40 56 38 92 42 130 L70 130 C74 92 72 56 56 48 Z" />
        <line x1="70" y1="70" x2="98" y2="40" />
        <circle cx="100" cy="34" r="10" strokeDasharray="2 3" />
        {/* filaments de mycélium au sol */}
        <path d="M20 142 Q50 134 80 142 T118 140" strokeWidth="0.6" opacity="0.7" />
        <path d="M14 150 Q44 144 74 150 T112 148" strokeWidth="0.6" opacity="0.5" />
      </svg>
      <p className="font-serif text-sm italic text-mousse-600 dark:text-parchemin-200/60">
        Ici se tiendra la Marcheuse.
      </p>
      <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-ocre-600/70 dark:text-ocre-400/60">
        Illustration à venir
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const BEATITUDES = [
  "Bienheureux les lents, car ils héritent du compost.",
  "Bienheureux ceux qui laissent un coin de jardin en friche, car les Halictes leur rendront grâce.",
  "Bienheureux ceux qui éteignent leur jardin la nuit, car les Chiroptères danseront pour eux.",
];

const TUILES = [
  {
    icon: Sprout,
    titre: "La Voie",
    ligne: "Un pèlerinage en neuf chapitres, qu'on gravit à la vitesse d'une racine.",
  },
  {
    icon: Trees,
    titre: "Le Jardin",
    ligne: "Reverdir une parcelle de cimetière, sans jamais réveiller personne.",
  },
  {
    icon: Gamepad2,
    titre: "Les Jeux liturgiques",
    ligne: "Composter, recenser les pollinisateurs ; la sainteté se gagne aussi en jouant.",
  },
  {
    icon: BookOpen,
    titre: "Le Livre Sacré",
    ligne: "Les versets de l'Ordre, à lire lentement, idéalement assis dans l'herbe.",
  },
];

export default function Porche() {
  return (
    <div className="mx-auto max-w-3xl">
      {/* ---------------------------------------------------------------- */}
      {/* HÉRO                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="grid items-center gap-10 py-8 md:grid-cols-2 md:gap-12 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="order-2 text-center md:order-1 md:text-left"
        >
          <p className="font-sans text-xs uppercase tracking-[0.4em] text-ocre-600 dark:text-ocre-400">
            L'Ordre Mycélien
          </p>
          <h1 className="titre-liturgique mt-3 text-balance text-4xl leading-tight text-mousse-800 sm:text-5xl dark:text-parchemin-100">
            Prophétesse-Mycélium
          </h1>
          <p className="titre-liturgique mt-1 text-xl text-ocre-700 sm:text-2xl dark:text-ocre-400">
            L'Ordre Vert
          </p>
          <p className="mx-auto mt-6 max-w-md text-balance font-serif text-lg italic leading-relaxed text-mousse-700 md:mx-0 dark:text-parchemin-200/80">
            Un ordre pour les lents, les patients, et ceux qui laissent un coin
            de jardin en friche.
          </p>
          <div className="mt-8">
            <Link
              href="/bienvenue"
              className="btn-sacre text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-parchemin-50 dark:focus-visible:ring-offset-mousse-950"
            >
              Entrer dans l'Ordre
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
          className="order-1 md:order-2"
        >
          <MarcheuseHero />
        </motion.div>
      </section>

      <Ornement />

      {/* ---------------------------------------------------------------- */}
      {/* QU'EST-CE QUE L'ORDRE MYCÉLIEN ?                                 */}
      {/* ---------------------------------------------------------------- */}
      <Reveal>
        <section className="py-10 text-center">
          <h2 className="titre-liturgique text-2xl text-mousse-800 sm:text-3xl dark:text-parchemin-100">
            Qu'est-ce que l'Ordre Mycélien ?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-balance font-serif text-lg leading-relaxed text-mousse-700 dark:text-parchemin-200/80">
            Comme le mycélium sous nos pas : invisible, lent, indispensable. Il
            ne demande rien&nbsp;
            <sup className="text-ocre-600 dark:text-ocre-400">*</sup>, ne juge
            personne, et relie en silence tout ce qui vit. Nous le suivons avec
            joie — sans hâte, sans culpabilité, en laissant pousser ce qui veut
            pousser.
          </p>
          <p className="mx-auto mt-6 max-w-xl font-sans text-xs italic leading-relaxed text-mousse-600 dark:text-parchemin-200/60">
            <sup className="text-ocre-600 dark:text-ocre-400">*</sup> Sauf,
            peut-être, qu'on ne le piétine pas trop. Et encore : il s'en remet.
          </p>
        </section>
      </Reveal>

      <Ornement />

      {/* ---------------------------------------------------------------- */}
      {/* LES BÉATITUDES MYCÉLIENNES                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-10 text-center">
        <Reveal>
          <h2 className="titre-liturgique text-2xl text-mousse-800 sm:text-3xl dark:text-parchemin-100">
            Les Béatitudes Mycéliennes
          </h2>
        </Reveal>
        <div className="mt-10 space-y-10">
          {BEATITUDES.map((b, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <p className="mx-auto max-w-xl text-balance font-serif text-xl italic leading-relaxed text-mousse-800 sm:text-2xl dark:text-parchemin-100">
                «&nbsp;{b}&nbsp;»
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <Ornement />

      {/* ---------------------------------------------------------------- */}
      {/* CE QUI T'ATTEND DERRIÈRE LE PORCHE                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-10">
        <Reveal>
          <h2 className="titre-liturgique text-center text-2xl text-mousse-800 sm:text-3xl dark:text-parchemin-100">
            Ce qui t'attend derrière le porche
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {TUILES.map(({ icon: Icon, titre, ligne }, i) => (
            <Reveal key={titre} delay={i * 0.08}>
              <Card className="h-full">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-mousse-600 dark:text-ocre-400" aria-hidden>
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="titre-liturgique text-xl text-mousse-800 dark:text-parchemin-100">
                      {titre}
                    </h3>
                    <p className="mt-1 font-serif text-sm italic leading-relaxed text-mousse-700 dark:text-parchemin-200/75">
                      {ligne}
                    </p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <Ornement />

      {/* ---------------------------------------------------------------- */}
      {/* RESPIRATION / SIGNATURE                                          */}
      {/* ---------------------------------------------------------------- */}
      <Reveal>
        <section className="py-16 text-center sm:py-20">
          <p className="mx-auto max-w-2xl text-balance font-serif text-2xl italic leading-relaxed text-mousse-800 sm:text-3xl sm:leading-relaxed dark:text-parchemin-100">
            Que le Lichen soit. Et le Lichen fut. Et elle vit que cela était
            lent, et cela était bon.
          </p>
        </section>
      </Reveal>

      {/* ---------------------------------------------------------------- */}
      {/* FOOTER DE PORCHE (discret)                                       */}
      {/* ---------------------------------------------------------------- */}
      <footer className="border-t border-ocre-500/20 py-10 text-center">
        <p className="titre-liturgique text-lg text-mousse-800 dark:text-parchemin-100">
          Prophétesse-Mycélium
        </p>
        <p className="mt-1 font-serif text-sm italic text-mousse-600 dark:text-parchemin-200/70">
          Œuvre satirique et joyeuse.
        </p>
        <p className="mt-3 font-sans text-xs text-mousse-600 dark:text-parchemin-200/60">
          <a
            href="mailto:shadowstepsociety@gmail.com"
            className="underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre-500/70"
          >
            shadowstepsociety@gmail.com
          </a>
        </p>
        <div className="mt-6">
          <Link
            href="/bienvenue"
            className="btn-ghost text-mousse-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-parchemin-50 dark:text-parchemin-100 dark:focus-visible:ring-offset-mousse-950"
          >
            Entrer dans l'Ordre
          </Link>
        </div>
      </footer>
    </div>
  );
}
