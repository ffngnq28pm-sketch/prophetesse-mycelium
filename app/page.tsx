"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";
import { Fond } from "@/components/banque/Fond";
import { FondPeint } from "@/components/banque/FondPeint";

/* ------------------------------------------------------------------ */
/* Racine du site = le Porche (vitrine publique de l'Ordre Vert).      */
/* Un membre déjà entré (onboardingFait) est renvoyé vers son tableau  */
/* de bord (/tableau) ; les nouveaux venus et les robots voient le     */
/* porche (HTML statique, indexable).                                  */
/* ------------------------------------------------------------------ */
export default function Home() {
  const router = useRouter();
  const { hasHydrated, onboardingFait } = useStore(
    useShallow((s) => ({
      hasHydrated: s.hasHydrated,
      onboardingFait: s.onboardingFait,
    }))
  );

  useEffect(() => {
    if (hasHydrated && onboardingFait) router.replace("/tableau");
  }, [hasHydrated, onboardingFait, router]);

  // Membre identifié : on évite de peindre la vitrine, redirection imminente.
  if (hasHydrated && onboardingFait) return null;

  return <Porche />;
}

/* ------------------------------------------------------------------ */
/* Apparition au scroll — fondu très sobre.                            */
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
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.95, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* Filaments décoratifs réutilisés (héro + clôture). */
function Filaments({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="120"
      height="60"
      viewBox="0 0 120 60"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 50 Q20 30 15 20 Q10 10 20 8 Q30 6 25 18 Q20 30 30 35 Q40 40 50 30 Q60 20 70 28 Q80 36 90 25 Q100 14 110 20"
        stroke="#496c39"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M5 55 Q15 40 12 28 Q9 16 18 12"
        stroke="#bf8d2c"
        strokeWidth="0.6"
        fill="none"
        strokeLinecap="round"
        opacity="0.35"
      />
      <circle cx="15" cy="20" r="1.2" fill="#496c39" opacity="0.4" />
      <circle cx="50" cy="30" r="1.5" fill="#496c39" opacity="0.4" />
      <circle cx="90" cy="25" r="1" fill="#496c39" opacity="0.4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* L'illustration de la Marcheuse — boucle vidéo en fond du héros.      */
/* Le titre « LA MARCHEUSE » est déjà incrusté dans la vidéo et le      */
/* poster ; aucun titre HTML n'est ajouté par-dessus.                   */
/* Poster/repli : version .jpg compressée (< 500 Ko) ; le .mp4 sert de  */
/* boucle ; le .png original (~7 Mo) reste en réserve dans public/.     */
/* ------------------------------------------------------------------ */
function MarcheuseHero() {
  const alt =
    "La Marcheuse, figure tutélaire de l'Ordre Vert : une femme sereine coiffée de rouge, un filet à papillons à la main, dans un cimetière doucement reverdi de mousse, de lichen et de fleurs pâles.";
  return (
    <figure
      role="img"
      aria-label={alt}
      className="relative mx-auto aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/marcheuse-hero-poster.jpg"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/marcheuse-hero.mp4" type="video/mp4" />
        {/* Repli si la vidéo n'est pas lisible : image compressée. */}
        <img
          src="/marcheuse-hero-poster.jpg"
          alt="La Marcheuse, naturaliste au filet à papillons dans un cimetière reverdi"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </video>

      {/* Voile dégradé sombre discret par-dessus, pour la lisibilité. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mousse-950/40 via-transparent to-transparent"
      />
    </figure>
  );
}

/* ------------------------------------------------------------------ */

const BEATITUDES = [
  { num: "I", texte: "Bienheureux les lents,", suite: "car ils héritent du compost." },
  {
    num: "II",
    texte: "Bienheureux ceux qui laissent un coin de jardin en friche,",
    suite: "car les Halictes leur rendront grâce.",
  },
  {
    num: "III",
    texte: "Bienheureux ceux qui éteignent leur jardin la nuit,",
    suite: "car les Chiroptères danseront pour eux.",
  },
];

const TUILES = [
  {
    num: "— I",
    titre: "La Voie",
    desc: "Un pèlerinage en neuf chapitres. Lent, forcément. On ne garantit aucune illumination ; on promet des mousses.",
  },
  {
    num: "— II",
    titre: "Le Jardin",
    desc: "Reverdir une parcelle de cimetière. Une pratique liturgique qui plaît autant aux abeilles qu'aux défunts.",
  },
  {
    num: "— III",
    titre: "Les Jeux liturgiques",
    desc: "Des épreuves d'une solennité parfaitement absurde, récompensant la patience plutôt que la vitesse.",
  },
  {
    num: "— IV",
    titre: "Le Livre Sacré",
    desc: "Versets, proverbes et paraboles. Certains sont profonds. D'autres concernent les limaces.",
  },
];

/* Styles partagés (DA reprise du mockup, palette du projet). */
const SURTITRE = "block font-serif text-[0.7rem] uppercase tracking-[0.3em] text-ocre-500";
const SECTION_TITRE =
  "font-serif font-light text-[clamp(1.9rem,4.5vw,3rem)] leading-tight text-mousse-950";
const CTA_FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre-500 focus-visible:ring-offset-2 focus-visible:ring-offset-parchemin-50";

function Porche() {
  return (
    <>
      {/* Fond peint en sibling (hors du breakout overflow-x-clip qui rognerait
          un enfant fixed). bg du porche en /80 → lavis sobre par-dessus. */}
      <FondPeint seed="accueil" />
      {/* Breakout pleine largeur + neutralisation du padding du <main> global. */}
      <div className="-mb-24 -mt-6 mx-[calc(50%-50vw)] w-screen overflow-x-clip bg-parchemin-50/80 font-sans text-mousse-950">
      {/* ══ HÉRO ══════════════════════════════════════════════ */}
      {/* Surface témoin de la banque visuelle : fond d'ambiance « hero ».
          Tant que public/banque/heros/hero-accueil.webp est absent, le repli
          parchemin discret s'affiche → aucun bouleversement. Dépose l'image
          pour voir le pattern s'activer (voile bas + traitement chaud). */}
      <header className="relative overflow-hidden">
        <Fond variante="hero" src="heros/hero-accueil.webp" className="px-6 pt-20 md:px-12">
        <Filaments className="pointer-events-none absolute left-4 top-8 hidden opacity-25 md:block" />
        <Filaments className="pointer-events-none absolute right-8 top-12 hidden -scale-x-100 opacity-25 md:block" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className={`${SURTITRE} mb-3 tracking-[0.35em] text-ocre-500`}>
            ✦ Entrez dans l'Ordre ✦
          </span>
          <h1 className="font-serif font-light text-[clamp(2.6rem,7vw,5.5rem)] leading-none tracking-tight text-mousse-950">
            Prophétesse-Mycélium
          </h1>
          <p className="mt-1 font-serif text-[clamp(1.3rem,3.5vw,2.2rem)] font-light italic tracking-wider text-mousse-600">
            L'Ordre Vert
          </p>
        </motion.div>

        <div className="mt-14 flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
            className="w-full max-w-[300px]"
          >
            <MarcheuseHero />
          </motion.div>

          <div className="max-w-[520px] px-4 text-center">
            <p className="font-serif text-[clamp(1.15rem,2.8vw,1.6rem)] italic leading-relaxed text-mousse-900">
              «&nbsp;Un ordre pour les lents, les patients,
              <br />
              et ceux qui laissent un coin de jardin en friche.&nbsp;»
            </p>
            <Link
              href="/bienvenue"
              className={`mt-8 inline-block border border-mousse-900 px-8 py-3 font-serif text-sm font-medium uppercase tracking-[0.22em] text-mousse-900 transition-colors hover:bg-mousse-900 hover:text-parchemin-50 ${CTA_FOCUS}`}
            >
              Entrer dans l'Ordre
            </Link>
          </div>
        </div>

        <hr className="mx-auto mt-20 max-w-3xl border-0 border-t border-ocre-500/30" />
        </Fond>
      </header>

      {/* ══ QU'EST-CE QUE L'ORDRE ════════════════════════════ */}
      <section className="bg-parchemin-50 px-6 py-24 md:px-12">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className={`${SURTITRE} mb-6`}>La doctrine, brièvement</span>
          <h2 className={`${SECTION_TITRE} mb-8`}>Qu'est-ce que l'Ordre Mycélien ?</h2>
          <p className="text-[1.0625rem] leading-[1.85] text-mousse-900">
            Sous nos pieds court un réseau invisible, patient et silencieux. Il
            ne revendique rien, ne publie rien, ne se plaint pas des hivers. Il
            relie les racines, nourrit les arbres, recycle les défunts avec une
            discrétion admirable. L'Ordre Mycélien s'en inspire : une fraternité
            de gens raisonnablement joyeux, déraisonnablement attentifs aux
            petites choses, et convaincus qu'un tallus de lichen vaut bien une
            révélation. Aucun dogme. Quelques versets. Beaucoup de compost.
            <sup className="text-ocre-500">*</sup>
          </p>
          <p className="mt-6 text-sm italic leading-relaxed text-ocre-500">
            <sup>*</sup> Le compost est métaphorique, mais les jardins, eux, sont
            réels.
          </p>
        </Reveal>
      </section>

      {/* ══ BÉATITUDES ═══════════════════════════════════════ */}
      <section className="bg-parchemin-100 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <span className={`${SURTITRE} mb-6`}>Livre I · Verset 1–3</span>
            <h2 className={SECTION_TITRE}>Les Béatitudes Mycéliennes</h2>
          </Reveal>

          <div className="mt-16 flex flex-col gap-16">
            {BEATITUDES.map((b, i) => (
              <Reveal key={b.num} delay={i * 0.12}>
                <div className="flex items-start gap-6 md:gap-10">
                  <span
                    className="mt-1 min-w-6 flex-shrink-0 font-serif text-xl font-light text-ocre-500"
                    aria-hidden="true"
                  >
                    {b.num}
                  </span>
                  <div>
                    <p className="font-serif text-[clamp(1.25rem,3vw,1.75rem)] italic leading-snug text-mousse-900">
                      {b.texte}
                    </p>
                    <p className="mt-1 font-serif text-[clamp(1.1rem,2.5vw,1.5rem)] font-light leading-snug text-mousse-950">
                      {b.suite}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Divider mycélium */}
          <div className="mt-20 flex items-center justify-center gap-4 opacity-40">
            <div className="h-px w-24 flex-shrink-0 bg-gradient-to-r from-transparent to-ocre-500" />
            <svg width="48" height="20" viewBox="0 0 48 20" fill="none" aria-hidden="true">
              <path d="M4 10 Q8 4 12 10 Q16 16 20 10 Q24 4 28 10 Q32 16 36 10 Q40 4 44 10" stroke="#bf8d2c" strokeWidth="1" fill="none" strokeLinecap="round" />
              <circle cx="4" cy="10" r="1.5" fill="#bf8d2c" />
              <circle cx="24" cy="10" r="1.5" fill="#bf8d2c" />
              <circle cx="44" cy="10" r="1.5" fill="#bf8d2c" />
              <path d="M12 10 L12 5 M28 10 L30 4 M36 10 L34 5" stroke="#bf8d2c" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            </svg>
            <div className="h-px w-24 flex-shrink-0 bg-gradient-to-l from-transparent to-ocre-500" />
          </div>
        </div>
      </section>

      {/* ══ CE QUI T'ATTEND ══════════════════════════════════ */}
      <section className="bg-parchemin-50 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl">
          <Reveal className="mb-14 text-center">
            <span className={`${SURTITRE} mb-6`}>À l'intérieur</span>
            <h2 className={SECTION_TITRE}>Ce qui t'attend derrière le porche</h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {TUILES.map((t, i) => (
              <Reveal key={t.titre} delay={i * 0.08}>
                <div className="flex h-full flex-col gap-2 border border-ocre-500/25 p-6 transition-colors hover:border-ocre-500/50 hover:bg-parchemin-100">
                  <span className="font-serif text-[0.7rem] uppercase tracking-[0.2em] text-ocre-500">
                    {t.num}
                  </span>
                  <h3 className="font-serif text-xl font-medium text-mousse-950">{t.titre}</h3>
                  <p className="text-sm leading-relaxed text-mousse-600">{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VERSET DE CLÔTURE ════════════════════════════════ */}
      <section className="bg-parchemin-200 px-6 py-32 text-center md:px-12">
        <Reveal className="mx-auto max-w-3xl">
          <Filaments className="mx-auto mb-8 block opacity-30" />
          <blockquote>
            <p className="font-serif text-[clamp(1.4rem,4vw,2.5rem)] font-light italic leading-relaxed text-mousse-950">
              «&nbsp;Que le Lichen soit.
              <br />
              Et le Lichen fut.
              <br />
              Et elle vit que cela était lent,
              <br />
              et cela était bon.&nbsp;»
            </p>
          </blockquote>
        </Reveal>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <footer className="bg-mousse-900 px-6 py-14 text-center" role="contentinfo">
        <p className="font-serif text-2xl font-light tracking-wide text-parchemin-200">
          Prophétesse-Mycélium
        </p>
        <p className="mt-3 text-[0.7rem] uppercase tracking-[0.18em] text-mousse-400">
          Œuvre satirique et joyeuse.
        </p>
        <div className="mx-auto my-6 h-px w-12 bg-mousse-600" />
        <a
          href="mailto:shadowstepsociety@gmail.com"
          className={`mb-7 block text-sm text-ocre-500 underline-offset-4 transition hover:underline ${CTA_FOCUS} focus-visible:ring-offset-mousse-900`}
        >
          shadowstepsociety@gmail.com
        </a>
        <Link
          href="/bienvenue"
          className={`mb-6 inline-block border border-mousse-600 px-7 py-2.5 font-serif text-sm font-medium uppercase tracking-[0.2em] text-parchemin-200 transition-colors hover:bg-mousse-600 ${CTA_FOCUS} focus-visible:ring-offset-mousse-900`}
        >
          Entrer dans l'Ordre
        </Link>
        <span className="block text-xs text-mousse-600">
          mycelium.shadowstepsociety.com
        </span>
      </footer>
      </div>
    </>
  );
}
