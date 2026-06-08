"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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
/* L'illustration de la Marcheuse.                                     */
/* Décor complet (cimetière reverdi, stèles, fleurs, filaments de      */
/* mycélium, corps, filet à papillons, coiffe ROUGE) — mais SANS aucun */
/* trait de visage : figure allégorique lisse, intemporelle.           */
/* Emplacement réservé : déposer public/marcheuse-hero.png recouvre    */
/* automatiquement ce placeholder (calque background-image, aucun      */
/* icône « image cassée » si le fichier est absent).                    */
/* ------------------------------------------------------------------ */
function MarcheuseHero() {
  const alt =
    "La Marcheuse, figure tutélaire de l'Ordre Vert : une femme sereine coiffée de rouge, un filet à papillons à la main, dans un cimetière doucement reverdi de mousse, de lichen et de fleurs pâles.";
  return (
    <figure
      role="img"
      aria-label={alt}
      className="relative mx-auto w-full max-w-[300px]"
    >
      <svg
        viewBox="0 0 320 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        aria-hidden="true"
      >
        {/* Fond parchemin + bordures herbier */}
        <rect width="320" height="480" rx="4" fill="#f4ecd2" />
        <rect x="10" y="10" width="300" height="460" rx="2" stroke="#bf8d2c" strokeWidth="0.8" opacity="0.4" />
        <rect x="14" y="14" width="292" height="452" rx="2" stroke="#bf8d2c" strokeWidth="0.4" opacity="0.2" />

        {/* Sol & végétation */}
        <ellipse cx="160" cy="430" rx="110" ry="18" fill="#304527" opacity="0.08" />
        <path d="M60 435 Q80 420 100 430 Q120 440 140 428 Q160 416 180 430 Q200 444 220 430 Q240 416 260 428" stroke="#496c39" strokeWidth="1.2" fill="none" opacity="0.35" />
        <path d="M75 440 Q85 428 95 435 Q105 442 115 435" stroke="#5f874c" strokeWidth="0.8" fill="none" opacity="0.3" />
        <path d="M195 438 Q210 426 225 433 Q240 440 255 432" stroke="#5f874c" strokeWidth="0.8" fill="none" opacity="0.3" />

        {/* Filaments mycélium */}
        <path d="M50 445 Q90 430 120 440 Q150 450 180 438 Q210 426 250 442" stroke="#bf8d2c" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.22" />
        <path d="M80 450 Q110 436 140 445" stroke="#bf8d2c" strokeWidth="0.5" fill="none" strokeLinecap="round" opacity="0.18" />
        <path d="M170 448 Q200 438 230 448" stroke="#bf8d2c" strokeWidth="0.5" fill="none" strokeLinecap="round" opacity="0.18" />
        <circle cx="120" cy="440" r="2" fill="#bf8d2c" opacity="0.2" />
        <circle cx="180" cy="438" r="1.5" fill="#bf8d2c" opacity="0.18" />
        <circle cx="220" cy="444" r="1.8" fill="#bf8d2c" opacity="0.2" />

        {/* Fleurs pâles */}
        <g transform="translate(100,420)" opacity="0.5">
          <ellipse cx="5" cy="0" rx="3" ry="1.5" fill="#f4ecd2" stroke="#bf8d2c" strokeWidth="0.5" />
          <ellipse cx="-5" cy="0" rx="3" ry="1.5" fill="#f4ecd2" stroke="#bf8d2c" strokeWidth="0.5" />
          <ellipse cx="2.5" cy="4.3" rx="3" ry="1.5" transform="rotate(60 2.5 4.3)" fill="#f4ecd2" stroke="#bf8d2c" strokeWidth="0.5" />
          <ellipse cx="-2.5" cy="4.3" rx="3" ry="1.5" transform="rotate(-60 -2.5 4.3)" fill="#f4ecd2" stroke="#bf8d2c" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="2" fill="#d4a747" opacity="0.7" />
        </g>
        <g transform="translate(160,418)" opacity="0.5">
          <ellipse cx="5" cy="0" rx="3" ry="1.5" fill="#f4ecd2" stroke="#bf8d2c" strokeWidth="0.5" />
          <ellipse cx="-5" cy="0" rx="3" ry="1.5" fill="#f4ecd2" stroke="#bf8d2c" strokeWidth="0.5" />
          <ellipse cx="2.5" cy="4.3" rx="3" ry="1.5" transform="rotate(60 2.5 4.3)" fill="#f4ecd2" stroke="#bf8d2c" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="2" fill="#d4a747" opacity="0.7" />
        </g>
        <g transform="translate(222,421)" opacity="0.45">
          <ellipse cx="5" cy="0" rx="3" ry="1.5" fill="#f4ecd2" stroke="#bf8d2c" strokeWidth="0.5" />
          <ellipse cx="-5" cy="0" rx="3" ry="1.5" fill="#f4ecd2" stroke="#bf8d2c" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="2" fill="#d4a747" opacity="0.7" />
        </g>

        {/* Stèles */}
        <rect x="55" y="330" width="22" height="70" rx="2" fill="#e8dfc8" stroke="#653b28" strokeWidth="0.7" opacity="0.45" />
        <rect x="55" y="324" width="22" height="10" rx="11" fill="#e8dfc8" stroke="#653b28" strokeWidth="0.7" opacity="0.45" />
        <rect x="245" y="340" width="20" height="60" rx="2" fill="#e8dfc8" stroke="#653b28" strokeWidth="0.7" opacity="0.45" />
        <rect x="245" y="334" width="20" height="10" rx="10" fill="#e8dfc8" stroke="#653b28" strokeWidth="0.7" opacity="0.45" />

        {/* Corps — robe longue */}
        <path d="M160 140 C152 160 144 200 140 240 C136 280 134 320 136 380 C138 400 142 415 160 415 C178 415 182 400 184 380 C186 320 184 280 180 240 C176 200 168 160 160 140 Z" fill="#304527" opacity="0.72" />
        <path d="M135 190 C128 195 122 210 120 230 C126 228 132 220 140 215" fill="#304527" opacity="0.6" />
        <path d="M185 190 C192 195 198 210 200 230 C194 228 188 220 180 215" fill="#304527" opacity="0.6" />

        {/* Bras gauche + filet à papillons */}
        <path d="M135 195 Q118 220 108 250 Q100 275 105 285" stroke="#304527" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.65" />
        <circle cx="105" cy="287" r="6" fill="#304527" opacity="0.6" />
        <line x1="105" y1="287" x2="92" y2="340" stroke="#653b28" strokeWidth="1.2" opacity="0.55" />
        <ellipse cx="92" cy="355" rx="14" ry="18" stroke="#653b28" strokeWidth="1" fill="none" opacity="0.45" />
        <path d="M78 348 Q92 365 106 348" stroke="#653b28" strokeWidth="0.8" fill="none" opacity="0.3" />
        <path d="M80 350 L104 350 M82 356 L102 356 M84 362 L100 362" stroke="#653b28" strokeWidth="0.5" opacity="0.25" />

        {/* Bras droit */}
        <path d="M185 195 Q200 225 202 265" stroke="#304527" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.55" />

        {/* Cou */}
        <path d="M152 126 L150 148 Q155 151 160 151 Q165 148 163 126 Q158 123 152 126 Z" fill="#dab890" opacity="0.88" />

        {/* Cheveux — masse gauche */}
        <path d="M126 86 Q118 105 115 132 Q111 160 116 185 Q120 205 130 220 L140 212 Q140 188 140 165 Q140 142 144 120 Q148 102 155 92 Q147 82 138 76 Q131 72 126 86 Z" fill="#b87c38" opacity="0.78" />
        <path d="M130 84 Q124 104 122 130 Q120 155 124 178" stroke="#d4a850" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.42" />
        <path d="M135 78 Q129 98 128 124 Q127 145 130 165" stroke="#e2be68" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.32" />

        {/* Cheveux — masse droite */}
        <path d="M194 84 Q202 100 204 124 Q206 152 200 176 Q194 198 185 214 L176 206 Q179 182 179 160 Q178 138 175 118 Q171 100 168 88 Q175 78 185 76 Q190 76 194 84 Z" fill="#c48a40" opacity="0.72" />
        <path d="M190 86 Q196 106 196 132 Q195 158 190 180" stroke="#deb858" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.38" />

        {/* Visage — forme 3/4 LISSE, sans aucun trait (allégorie intemporelle) */}
        <path d="M128 92 Q126 106 127 120 Q130 134 138 142 Q147 150 159 150 Q172 150 179 141 Q187 131 187 116 Q188 100 184 87 Q178 68 166 62 Q155 56 143 59 Q132 63 128 78 Q126 85 128 92 Z" fill="#e0bc96" />
        <path d="M128 92 Q126 106 127 120 Q130 134 138 142 Q143 147 150 149" stroke="#c4906a" strokeWidth="5" fill="none" opacity="0.18" strokeLinecap="round" />

        {/* Mèches qui s'envolent sur le visage */}
        <path d="M170 68 Q174 84 168 100 Q163 115 161 128 Q160 134 161 140" stroke="#c49848" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.58" />
        <path d="M173 66 Q178 84 173 102 Q169 118 167 132" stroke="#b88838" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.44" />
        <path d="M167 64 Q170 80 166 96 Q163 110 164 124" stroke="#d4b058" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.38" />

        {/* COIFFE ROUGE — bonnet phrygien (seul accent vif de la page) */}
        <path d="M132 90 Q135 62 152 47 Q159 40 165 42 Q178 46 180 64 Q182 78 176 88 Q170 96 161 98 L145 101 Q136 99 132 90 Z" fill="#b5331f" opacity="0.93" />
        <path d="M134 92 Q137 70 150 54 Q157 46 164 48 Q173 52 174 67" stroke="#8a2515" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M132 90 Q130 96 134 102 Q140 106 147 104 Q154 102 159 98" fill="#8a2515" opacity="0.3" />
      </svg>

      {/* Vraie illustration en calque : recouvre le placeholder si présente. */}
      <div
        aria-hidden
        className="absolute inset-0 rounded bg-cover bg-center"
        style={{ backgroundImage: "url('/marcheuse-hero.png')" }}
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

export default function Porche() {
  return (
    // Breakout pleine largeur hors du <main> contraint (preview).
    <div className="mx-[calc(50%-50vw)] w-screen overflow-x-clip bg-parchemin-50 font-sans text-mousse-950">
      {/* ══ HÉRO ══════════════════════════════════════════════ */}
      <header className="relative overflow-hidden px-6 pt-20 md:px-12">
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
  );
}
