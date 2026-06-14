// Le Sentier des Spores — couche DÉCORATIVE des quatre spectres qui suivent la
// Marcheuse de loin. ZÉRO interaction gameplay : ce module lit SEULEMENT la
// position monde de la Marcheuse + la caméra (fournies par le rendu) et dessine
// derrière les plateformes, devant le fond peint. Il ne touche jamais le moteur
// (lib/traversee-engine.ts) ni l'état de jeu.
//
// Sobriété (Boussole) : tons spectraux froids portés par les assets ; aucun
// rouge, aucun carré de repli (si une image manque, on ne dessine rien).

import type { Olivia } from "@/lib/traversee-engine";

// ============ RÉGLAGES GLOBAUX (dial-able) ============
const REGLAGES = {
  opacite: 1, // multiplicateur global d'opacité
  echelle: 0.82, // échelle des spectres vs la Marcheuse (réduite = plus loin)
  parallaxe: 0.65, // 0..1 — défilent à 0.65x du premier plan (sensation d'éloignement)
  lag: 1, // multiplicateur de la distance de traîne
  flottement: 1, // multiplicateur d'amplitude du flottement vertical
  vitesseFlottement: 1, // multiplicateur de vitesse du flottement
};

// ============ TEMPÉRAMENTS (lisibles mais discrets) ============
interface Temperament {
  id: string;
  actif: boolean; // on/off par spectre
  fichier: string; // public/banque/spectres/<fichier>.webp
  trail: number; // distance de traîne, en hauteurs de Marcheuse (plus = plus en retard)
  suivi: number; // coeff d'easing du lag (petit = lent, traîne loin)
  echelle: number; // multiplicateur d'échelle local
  opacite: number; // opacité de base
  flotteAmp: number; // amplitude du flottement vertical (en hauteurs de Marcheuse)
  flotteVit: number; // vitesse de flottement
  erratique?: boolean; // Marcel : s'arrête puis rattrape, regarde une fleur
  fonduDerive?: boolean; // L'Innommé : fondu lent + dérive latérale
  blur?: number; // flou (px) — L'Innommé surtout
}

const TEMPERAMENTS: Temperament[] = [
  // Cendrillon (gris-bleu) : le plus lent, le plus en retard, peu de flottement,
  // opacité basse et stable.
  { id: "cendrillon", actif: true, fichier: "cendrillon", trail: 4.6, suivi: 0.6, echelle: 0.92, opacite: 0.3, flotteAmp: 0.04, flotteVit: 0.5 },
  // Précieuse (violet) : glisse régulièrement, port altier, ne flotte presque
  // pas, suit d'un peu plus près.
  { id: "precieuse", actif: true, fichier: "precieuse", trail: 3.2, suivi: 1.5, echelle: 0.98, opacite: 0.34, flotteAmp: 0.015, flotteVit: 0.6 },
  // Marcel (vert) : erratique — pauses puis accélérations, « regarde une fleur ».
  { id: "marcel", actif: true, fichier: "marcel", trail: 3.9, suivi: 1.1, echelle: 0.9, opacite: 0.32, flotteAmp: 0.12, flotteVit: 1.3, erratique: true },
  // L'Innommé (gris sombre) : le plus loin, le plus flou, opacité la plus basse,
  // apparaît/disparaît en fondu lent et dérive latéralement.
  { id: "innomme", actif: true, fichier: "innomme", trail: 5.8, suivi: 0.5, echelle: 0.86, opacite: 0.2, flotteAmp: 0.08, flotteVit: 0.7, fonduDerive: true, blur: 2 },
];

const BASE = "/banque/spectres/";

// PRNG seedé (mulberry32) : phases stables au montage, jamais de Math.random par
// frame (qui scintillerait). Les cycles d'animation sont basés sur le temps.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

interface Etat {
  cfg: Temperament;
  img: HTMLImageElement | null;
  ok: boolean; // sonde résolue avec succès
  px: number; // position monde lissée (plan parallaxe)
  py: number;
  tilt: number; // léger penchement (Marcel qui regarde une fleur)
  init: boolean;
  phase: number;
  phase2: number;
}

export class Spectres {
  private etats: Etat[];

  constructor() {
    const rnd = mulberry32(0x5eed1);
    this.etats = TEMPERAMENTS.map((cfg) => ({
      cfg,
      img: null,
      ok: false,
      px: 0,
      py: 0,
      tilt: 0,
      init: false,
      phase: rnd() * Math.PI * 2,
      phase2: rnd() * Math.PI * 2,
    }));
  }

  // Préchargement par sonde : jamais d'<img> nu, jamais d'icône cassée. Si une
  // image manque, ok reste false → elle n'est tout simplement pas dessinée.
  preload() {
    for (const e of this.etats) {
      if (!e.cfg.actif) continue;
      const img = new Image();
      img.onload = () => {
        e.ok = true;
      };
      img.onerror = () => {
        e.ok = false;
      };
      img.src = `${BASE}${e.cfg.fichier}.webp`;
      e.img = img;
    }
  }

  // Lecture SEULE de la Marcheuse + caméra. Met à jour les positions lissées.
  update(dt: number, time: number, o: Olivia, cam: { x: number; y: number }, reduce: boolean) {
    void reduce;
    const P = REGLAGES.parallaxe;
    const wcx = o.x + o.w / 2;
    const wcy = o.y + o.h / 2;

    for (const e of this.etats) {
      if (!e.cfg.actif) continue;
      const trail = e.cfg.trail * REGLAGES.lag * o.h;
      // Cible exprimée dans le plan-parallaxe P : derrière la Marcheuse (côté
      // opposé à la marche), sans dérive de scroll au fil de la progression.
      let targetX = wcx - (1 - P) * cam.x - o.facing * trail;
      const targetY = wcy - (1 - P) * cam.y - o.h * 0.15;
      if (e.cfg.fonduDerive) {
        targetX += Math.sin(time / 3400 + e.phase) * o.h * 1.1; // dérive latérale lente
      }
      if (!e.init) {
        e.px = targetX;
        e.py = targetY;
        e.init = true;
      }

      // Easing (lag) stable quel que soit le framerate.
      let suivi = e.cfg.suivi;
      let tiltCible = 0;
      if (e.cfg.erratique) {
        const w = (Math.sin(time / 900 + e.phase) + Math.sin(time / 430 + e.phase2 * 1.7)) * 0.5;
        const gate = smoothstep(-0.45, 0.1, w); // ~0 = pause, 1 = file pour rattraper
        suivi = e.cfg.suivi * (0.04 + 0.96 * gate);
        tiltCible = (1 - gate) * 0.14; // pause = « regarde une fleur » : léger penchement
      }
      const k = 1 - Math.exp(-suivi * dt * 2.2);
      e.px += (targetX - e.px) * k;
      e.py += (targetY - e.py) * k;
      e.tilt += (tiltCible - e.tilt) * (1 - Math.exp(-dt * 4));
    }
  }

  // Dessine en coords monde via une transform de parallaxe. À appeler APRÈS le
  // fond peint et AVANT les plateformes (le rendu repasse ensuite en layer(1,1)).
  draw(
    ctx: CanvasRenderingContext2D,
    cam: { x: number; y: number },
    scale: number,
    o: Olivia,
    time: number,
    reduce: boolean
  ) {
    const P = REGLAGES.parallaxe;
    for (const e of this.etats) {
      if (!e.cfg.actif || !e.ok || !e.img) continue;

      const amp = e.cfg.flotteAmp * REGLAGES.flottement * (reduce ? 0.25 : 1) * o.h;
      const fl = Math.sin((time / 700) * e.cfg.flotteVit * REGLAGES.vitesseFlottement + e.phase) * amp;

      let op = e.cfg.opacite * REGLAGES.opacite;
      if (e.cfg.fonduDerive) {
        op *= 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(time / 2600 + e.phase2)); // fondu lent
      }
      if (op <= 0.002) continue;

      const ih = e.img.naturalHeight || 1;
      const iw = e.img.naturalWidth || 1;
      const drawH = o.h * REGLAGES.echelle * e.cfg.echelle;
      const drawW = drawH * (iw / ih);

      ctx.save();
      ctx.setTransform(scale, 0, 0, scale, -cam.x * P * scale, -cam.y * P * scale);
      ctx.globalAlpha = Math.min(1, Math.max(0, op));
      if (e.cfg.blur) ctx.filter = `blur(${e.cfg.blur}px)`;
      ctx.translate(e.px, e.py + fl);
      if (o.facing === -1) ctx.scale(-1, 1); // flip selon le sens de marche
      if (e.tilt) ctx.rotate(e.tilt * (o.facing === -1 ? -1 : 1));
      ctx.drawImage(e.img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    }
  }
}
