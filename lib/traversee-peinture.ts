// Décor « parallaxe peinte » du Sentier des Spores — porté du prototype
// vitrine-sentier. Pur canvas (aucune dépendance React). Le composant pilote
// le cycle de vie via une instance détenue dans un ref.
//
// Pipeline : couche 0 (lointain) → god rays → couche 1 (plan moyen) →
// couche 2 (premier plan, DERRIÈRE le gameplay pour ne jamais occulter) →
// spores → [gameplay dessiné par le composant] → post (bloom + grade +
// vignette + grain). Lisibilité de jeu prioritaire sur l'esthétique.

/* ════════════ CONFIG — réglages repris du prototype ════════════ */
export const PEINTURE = {
  // Parallaxe (fraction du déplacement caméra). Repris du proto.
  PARALLAX: { c0: 0.15, c1: 0.4, c2: 1.1, sporesFar: 0.3, sporesNear: 0.95 },
  // Parallaxe verticale (douce) : le fond dérive un peu quand on grimpe.
  VPARALLAX: 0.12,
  // Post-traitement.
  BLOOM_STRENGTH: 0.35, // alpha de la passe additive (proto : 0.35)
  BLOOM_BLUR: 13, // flou px sur le buffer demi-résolution
  BLOOM_SEUIL: 0.72, // ne bloomer que les vraies hautes lumières (plus haut = plus sélectif)
  RAYS_INTENSITY: 0.05, // god rays — baissé pour ne plus cramer le centre clair
  RAYS_COUNT: 5,
  RAYS_LENGTH: 0.62, // fraction de hauteur où le rai s'éteint (avant le sol)
  RAYS_DRIFT: 22,
  WARMTH: 0.16, // color-grade chaud (soft-light)
  VIGNETTE: 0.3,
  GRAIN: 0.05,
  // Spores (densités à pleine qualité ; réduites par l'échelle de qualité).
  SPORES_NEAR: 70,
  SPORES_FAR: 46,
  SPORE_RISE: 15,
  SPORE_DRIFT: 11,
  // Couture fondue au bake (fraction de largeur de tuile), sans flip miroir.
  couture: 0.3,
  // Re-structuration de la couche lointaine au bake (anti voile blanc / bouillie) :
  // on lui rend du contraste/définition pour qu'elle appartienne à la même
  // peinture que le premier plan. Plein effet sur n===0, moitié sur n===1.
  FOND_LUM: 0.92,
  FOND_CONTRASTE: 1.12,
  FOND_SAT: 1.08,
} as const;

export type ActeNom = "porche" | "allees" | "ascension";
const ACTES: ActeNom[] = ["porche", "allees", "ascension"];

interface LayerSet {
  c0: HTMLCanvasElement | null;
  c1: HTMLCanvasElement | null;
  c2: HTMLCanvasElement | null;
}

interface Spore {
  x: number;
  y: number;
  size: number;
  rise: number;
  driftAmp: number;
  driftPhase: number;
  driftFreq: number;
  baseAlpha: number;
  twPhase: number;
  twSpeed: number;
  gold: boolean;
  parallax: number;
}

function rngFrom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Bake une image source en canvas prêt à tiler : fondu du sommet (couches 1/2)
// + couture cousue SANS flip. Deux passes :
//   1) cross-dissolve large : bord gauche rabattu sur le bord droit (le contenu
//      du raccord devient identique des deux côtés) ;
//   2) fondu des deux bords vers la couleur atmosphérique de la couche (en
//      source-atop pour préserver le sommet transparent) → continuité de valeur,
//      aucune ligne verticale même si la peinture est plus claire d'un côté.
function bakeLayer(source: HTMLImageElement, n: number): HTMLCanvasElement {
  const fadeTop = n > 0;
  const w = source.naturalWidth || 1920;
  const h = source.naturalHeight || 819;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const c = cv.getContext("2d")!;

  // Re-structuration de la couche lointaine (one-time, AUCUNE lecture de pixels) :
  // sur les fonds clairs/brumeux, la lointaine partait en voile blanc et mou ;
  // on lui rend brillance↓/contraste↑/saturation↑ pour qu'elle redevienne une
  // forêt distante définie. Plein effet n===0, demi n===1, rien n===2.
  const fStr = n === 0 ? 1 : n === 1 ? 0.5 : 0;
  if (fStr > 0) {
    const lum = 1 + (PEINTURE.FOND_LUM - 1) * fStr;
    const con = 1 + (PEINTURE.FOND_CONTRASTE - 1) * fStr;
    const sat = 1 + (PEINTURE.FOND_SAT - 1) * fStr;
    c.filter = `brightness(${lum}) contrast(${con}) saturate(${sat})`;
  }
  c.drawImage(source, 0, 0, w, h);
  c.filter = "none";

  if (fadeTop) {
    const g = c.createLinearGradient(0, 0, 0, h * 0.5);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.globalCompositeOperation = "destination-out";
    c.fillStyle = g;
    c.fillRect(0, 0, w, h * 0.5);
    c.globalCompositeOperation = "source-over";
  }

  const b = Math.max(2, Math.round(w * PEINTURE.couture));

  // 1) Cross-dissolve : bord gauche fondu sur le bord droit.
  const strip = document.createElement("canvas");
  strip.width = b;
  strip.height = h;
  const sc = strip.getContext("2d")!;
  sc.drawImage(cv, 0, 0, b, h, 0, 0, b, h);
  sc.globalCompositeOperation = "destination-in";
  const gg = sc.createLinearGradient(0, 0, b, 0);
  gg.addColorStop(0, "rgba(0,0,0,0)");
  gg.addColorStop(1, "rgba(0,0,0,1)");
  sc.fillStyle = gg;
  sc.fillRect(0, 0, b, h);
  sc.globalCompositeOperation = "source-over";
  c.drawImage(strip, w - b, 0);

  // NB : on garde uniquement le cross-dissolve de CONTENU. Le fondu des bords
  // vers la couleur atmosphérique (ancien essai) créait une bande verticale
  // périodique sombre à chaque jointure → retiré. La ligne dure résiduelle est
  // un joint sous-pixel, corrigé par le chevauchement de 1 px dans drawLayer.
  return cv;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth > 0 ? img : null);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export class PeintureDecor {
  private sets: Partial<Record<ActeNom, LayerSet>> = {};
  private loading = new Set<ActeNom>();
  private sporesNear: Spore[] = [];
  private sporesFar: Spore[] = [];
  private prevCamX = 0;
  private acteAffiche: ActeNom = "porche";
  private fade = 1; // opacité de la set courante (1 = pleine) pour les transitions
  private fadingFrom: LayerSet | null = null;

  // Buffers hors-écran (scène + bloom demi-résolution).
  private scene: HTMLCanvasElement | null = null;
  private sceneCtx: CanvasRenderingContext2D | null = null;
  private bloom: HTMLCanvasElement | null = null;
  private bloomCtx: CanvasRenderingContext2D | null = null;
  private hasFilter = true;

  // Échelle de qualité (1 = desktop ; < 1 = mobile / petit écran).
  quality = 1;
  // Caches de dégradés recréés au changement de taille seulement.
  private cw = 0;
  private ch = 0;
  private cacheVignette: CanvasGradient | null = null;
  private cacheGrade: CanvasGradient | null = null;
  private cacheRay: CanvasGradient | null = null;

  constructor() {
    if (typeof window === "undefined") return;
    this.makeSpores();
    // Détection ctx.filter (Safari ancien).
    try {
      const t = document.createElement("canvas").getContext("2d")!;
      t.filter = "blur(2px)";
      this.hasFilter = t.filter === "blur(2px)";
    } catch {
      this.hasFilter = false;
    }
    this.autoQuality();
  }

  private autoQuality() {
    const small = Math.min(window.innerWidth, window.innerHeight) < 540;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches;
    const lowCores = (navigator.hardwareConcurrency || 8) <= 4;
    this.quality = small || (coarse && lowCores) ? 0.6 : coarse ? 0.8 : 1;
  }

  private makeSpores() {
    const build = (count: number, parallax: number, near: boolean): Spore[] => {
      const r = rngFrom(near ? 4242 : 1717);
      const arr: Spore[] = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: r() * 2000,
          y: r() * 1200,
          size: (near ? 1.6 : 0.9) + r() * (near ? 3 : 1.5),
          rise: PEINTURE.SPORE_RISE * (0.6 + r() * 0.9),
          driftAmp: PEINTURE.SPORE_DRIFT * (0.4 + r() * 1.2),
          driftPhase: r() * Math.PI * 2,
          driftFreq: 0.4 + r() * 0.8,
          baseAlpha: (near ? 0.32 : 0.16) + r() * 0.38,
          twPhase: r() * Math.PI * 2,
          twSpeed: 1.5 + r() * 3,
          gold: r() > 0.35,
          parallax,
        });
      }
      return arr;
    };
    const n = Math.round(PEINTURE.SPORES_NEAR * this.quality);
    const f = Math.round(PEINTURE.SPORES_FAR * this.quality);
    this.sporesNear = build(n, PEINTURE.PARALLAX.sporesNear, true);
    this.sporesFar = build(f, PEINTURE.PARALLAX.sporesFar, false);
  }

  // Charge (et bake) la set d'un acte. Repli sur « porche » couche par couche
  // si une variante manque. Si l'acte n'a AUCUNE image propre, on aliase la set
  // « porche » telle quelle → aucun changement visible (pas de swap) tant que
  // seul le set par défaut existe.
  async loadActe(acte: ActeNom): Promise<void> {
    if (typeof window === "undefined" || this.sets[acte] || this.loading.has(acte)) return;
    this.loading.add(acte);

    // Garantit que « porche » (repli universel) est prêt avant tout autre acte.
    if (acte !== "porche" && !this.sets.porche && !this.loading.has("porche")) {
      this.loading.delete(acte);
      await this.loadActe("porche");
      this.loading.add(acte);
    }

    const set: LayerSet = { c0: null, c1: null, c2: null };
    const keys: (keyof LayerSet)[] = ["c0", "c1", "c2"];
    let own = 0;
    for (let n = 0; n < 3; n++) {
      const baked = await this.loadLayer(acte, n);
      if (baked) own++;
      const fb = baked ?? (acte !== "porche" ? await this.loadLayer("porche", n) : null);
      set[keys[n]] = fb;
    }

    // Acte sans aucune image propre → on réutilise l'instance porche (pas de swap).
    if (acte !== "porche" && own === 0 && this.sets.porche) {
      this.sets[acte] = this.sets.porche;
    } else {
      this.sets[acte] = set;
    }
    this.loading.delete(acte);
  }

  private async loadLayer(acte: ActeNom, n: number): Promise<HTMLCanvasElement | null> {
    // Sonde les variantes a..d, en garde une au hasard parmi celles présentes.
    const letters = ["a", "b", "c", "d"];
    const imgs = await Promise.all(
      letters.map((v) => loadImage(`/jeux/${"traversee"}/${acte}/couche-${n}-${v}.webp`))
    );
    const present = imgs.filter((x): x is HTMLImageElement => !!x);
    if (present.length === 0) return null;
    const chosen = present[Math.floor(Math.random() * present.length)];
    return bakeLayer(chosen, n);
  }

  // Précharge porche au démarrage (set par défaut + repli universel).
  preload(): void {
    void this.loadActe("porche");
  }

  // Indique l'acte courant ; déclenche un fondu si la set change.
  setActe(acteIndex: 1 | 2 | 3): void {
    const acte = ACTES[acteIndex - 1];
    if (acte === this.acteAffiche) return;
    void this.loadActe(acte);
    // Fondu seulement si la nouvelle set est prête et différente.
    const cur = this.sets[this.acteAffiche];
    const next = this.sets[acte];
    if (next && next !== cur) {
      this.fadingFrom = cur ?? null;
      this.fade = 0;
    }
    this.acteAffiche = acte;
  }

  private currentSet(): LayerSet | null {
    return this.sets[this.acteAffiche] ?? this.sets.porche ?? null;
  }

  // ——— Buffers ———
  private ensureBuffers(cw: number, ch: number) {
    if (!this.scene) {
      this.scene = document.createElement("canvas");
      this.sceneCtx = this.scene.getContext("2d", { alpha: false });
      this.bloom = document.createElement("canvas");
      this.bloomCtx = this.bloom.getContext("2d");
    }
    if (this.scene!.width !== cw || this.scene!.height !== ch) {
      this.scene!.width = cw;
      this.scene!.height = ch;
      const bw = Math.max(1, Math.round((cw / 2) * this.quality));
      const bh = Math.max(1, Math.round((ch / 2) * this.quality));
      this.bloom!.width = bw;
      this.bloom!.height = bh;
    }
    if (this.cw !== cw || this.ch !== ch) {
      this.cw = cw;
      this.ch = ch;
      this.buildCaches(cw, ch);
    }
  }

  private buildCaches(cw: number, ch: number) {
    const c = this.sceneCtx!;
    this.cacheVignette = c.createRadialGradient(cw / 2, ch * 0.5, ch * 0.36, cw / 2, ch * 0.5, ch * 0.82);
    this.cacheVignette.addColorStop(0, "rgba(8,12,6,0)");
    this.cacheVignette.addColorStop(1, `rgba(8,12,6,${PEINTURE.VIGNETTE})`);
    this.cacheGrade = c.createLinearGradient(0, 0, 0, ch);
    this.cacheGrade.addColorStop(0, `rgba(255,214,140,${PEINTURE.WARMTH})`);
    this.cacheGrade.addColorStop(0.5, "rgba(255,235,200,0)");
    this.cacheGrade.addColorStop(1, `rgba(40,90,60,${PEINTURE.WARMTH * 0.8})`);
    this.cacheRay = c.createLinearGradient(0, 0, 0, ch);
    this.cacheRay.addColorStop(0, "rgba(255,240,200,1)");
    this.cacheRay.addColorStop(PEINTURE.RAYS_LENGTH * 0.6, "rgba(255,238,190,0.5)");
    this.cacheRay.addColorStop(PEINTURE.RAYS_LENGTH, "rgba(255,238,190,0)");
    this.cacheRay.addColorStop(1, "rgba(255,238,190,0)");
  }

  // Démarre une frame : renvoie le contexte de la scène hors-écran (effacé).
  beginScene(cw: number, ch: number): CanvasRenderingContext2D {
    this.ensureBuffers(cw, ch);
    const c = this.sceneCtx!;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    c.globalCompositeOperation = "source-over";
    return c;
  }

  // Met à jour les spores (dérive + montée + parallaxe). camDX en px écran.
  update(dt: number, time: number, camX: number, scale: number, reduce: boolean): void {
    if (this.fade < 1) this.fade = Math.min(1, this.fade + dt * 1.2);
    const camDXpx = (camX - this.prevCamX) * scale;
    this.prevCamX = camX;
    const cw = this.cw || 800;
    const ch = this.ch || 460;
    const step = (field: Spore[]) => {
      for (let i = 0; i < field.length; i++) {
        const sp = field[i];
        sp.x -= camDXpx * sp.parallax;
        sp.y -= sp.rise * dt * scale;
        if (!reduce) sp.x += Math.sin(time * sp.driftFreq + sp.driftPhase) * sp.driftAmp * dt;
        const m = 120;
        if (sp.x < -m) sp.x += cw + m * 2;
        else if (sp.x > cw + m) sp.x -= cw + m * 2;
        if (sp.y < -m) sp.y = ch + m;
      }
    };
    step(this.sporesNear);
    step(this.sporesFar);
  }

  // Dessine tout le fond peint (couches + god rays + spores) dans la scène,
  // DERRIÈRE le gameplay. Tout en espace écran (parallaxe maison).
  drawBackdrop(
    c: CanvasRenderingContext2D,
    camX: number,
    camY: number,
    scale: number,
    cw: number,
    ch: number,
    time: number,
    reduce: boolean
  ): void {
    c.setTransform(1, 0, 0, 1, 0, 0);
    // Repli ciel chaud tant que les couches ne sont pas prêtes.
    const sky = c.createLinearGradient(0, 0, 0, ch);
    sky.addColorStop(0, "#f0d089");
    sky.addColorStop(0.55, "#bcae78");
    sky.addColorStop(1, "#85986a");
    c.fillStyle = sky;
    c.fillRect(0, 0, cw, ch);

    const set = this.currentSet();
    const from = this.fadingFrom;

    // Couche 0.
    this.drawLayer(c, from?.c0 ?? null, PEINTURE.PARALLAX.c0, camX, camY, scale, cw, ch, 1);
    this.drawLayer(c, set?.c0 ?? null, PEINTURE.PARALLAX.c0, camX, camY, scale, cw, ch, this.fade);

    // God rays.
    this.drawGodRays(c, cw, ch, time, reduce);

    // Couche 1.
    this.drawLayer(c, from?.c1 ?? null, PEINTURE.PARALLAX.c1, camX, camY, scale, cw, ch, 1);
    this.drawLayer(c, set?.c1 ?? null, PEINTURE.PARALLAX.c1, camX, camY, scale, cw, ch, this.fade);

    // Couche 2 (premier plan) — DERRIÈRE le gameplay : ne masque jamais la zone jouable.
    this.drawLayer(c, from?.c2 ?? null, PEINTURE.PARALLAX.c2, camX, camY, scale, cw, ch, 1);
    this.drawLayer(c, set?.c2 ?? null, PEINTURE.PARALLAX.c2, camX, camY, scale, cw, ch, this.fade);

    // Spores (additif) — dans l'air, derrière le gameplay.
    this.drawSpores(c, this.sporesFar, time, reduce);
    this.drawSpores(c, this.sporesNear, time, reduce);
  }

  private drawLayer(
    c: CanvasRenderingContext2D,
    img: HTMLCanvasElement | null,
    parallax: number,
    camX: number,
    camY: number,
    scale: number,
    cw: number,
    ch: number,
    alpha: number
  ) {
    if (!img || alpha <= 0) return;
    const drawH = ch * 1.12;
    const tileW = drawH * (img.width / img.height);
    let yOff = -camY * parallax * PEINTURE.VPARALLAX * scale;
    const yMin = ch - drawH;
    if (yOff > 0) yOff = 0;
    else if (yOff < yMin) yOff = yMin;
    const shiftX = -(camX * scale) * parallax;
    const iStart = Math.floor(-shiftX / tileW) - 1;
    const iEnd = Math.ceil((cw - shiftX) / tileW) + 1;
    if (alpha < 1) c.globalAlpha = alpha;
    // Joint sous-pixel : les positions fractionnaires font anti-créneler le bord
    // de chaque copie → fine ligne dure à chaque jointure. On fait CHEVAUCHER les
    // copies de 1 px (départ 1 px avant, 2 px plus large) : la copie suivante
    // recouvre le bord AA de la précédente. Pas d'arrondi → zéro jitter de parallaxe.
    const bleed = 1;
    for (let i = iStart; i <= iEnd; i++) {
      c.drawImage(img, shiftX + i * tileW - bleed, yOff, tileW + bleed * 2, drawH);
    }
    if (alpha < 1) c.globalAlpha = 1;
  }

  private drawGodRays(c: CanvasRenderingContext2D, cw: number, ch: number, time: number, reduce: boolean) {
    if (PEINTURE.RAYS_INTENSITY <= 0) return;
    c.save();
    c.globalCompositeOperation = "lighter";
    c.fillStyle = this.cacheRay!;
    const breath = reduce ? 1 : 0.82 + 0.18 * Math.sin(time * 0.0005);
    const base = PEINTURE.RAYS_INTENSITY * breath;
    const slant = cw * 0.16;
    const w = cw * 0.13;
    for (let i = 0; i < PEINTURE.RAYS_COUNT; i++) {
      const drift = reduce ? 0 : Math.sin(time * 0.00018 + i * 1.6) * PEINTURE.RAYS_DRIFT;
      const x = cw * (0.12 + (i * 0.76) / (PEINTURE.RAYS_COUNT - 1)) + drift;
      c.globalAlpha = base * (0.7 + 0.3 * Math.sin(i * 2.1));
      c.beginPath();
      c.moveTo(x, -10);
      c.lineTo(x + w, -10);
      c.lineTo(x + w + slant, ch);
      c.lineTo(x + slant, ch);
      c.closePath();
      c.fill();
    }
    c.globalAlpha = 1;
    c.restore();
  }

  private drawSpores(c: CanvasRenderingContext2D, field: Spore[], time: number, reduce: boolean) {
    c.globalCompositeOperation = "lighter";
    for (let i = 0; i < field.length; i++) {
      const sp = field[i];
      let a = sp.baseAlpha;
      if (!reduce) a *= 0.7 + 0.3 * (0.5 + 0.5 * Math.sin(time * 0.001 * sp.twSpeed + sp.twPhase));
      a = Math.min(1, a);
      const r = sp.size * 2.4;
      c.globalAlpha = a;
      c.fillStyle = sp.gold ? "rgba(255,226,150,0.9)" : "rgba(244,250,228,0.85)";
      c.beginPath();
      c.arc(sp.x, sp.y, r, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;
    c.globalCompositeOperation = "source-over";
  }

  // Composite la scène vers le canvas visible + post (bloom, grade, vignette, grain).
  present(visible: CanvasRenderingContext2D, cw: number, ch: number, time: number, reduce: boolean): void {
    visible.setTransform(1, 0, 0, 1, 0, 0);
    visible.globalAlpha = 1;
    visible.globalCompositeOperation = "source-over";
    visible.drawImage(this.scene!, 0, 0);

    // Bloom — qualité 0.6+ seulement (coupé sur les plus petites configs).
    if (this.quality >= 0.6 && PEINTURE.BLOOM_STRENGTH > 0) {
      const bw = this.bloom!.width;
      const bh = this.bloom!.height;
      const bc = this.bloomCtx!;
      if (this.hasFilter) {
        bc.setTransform(1, 0, 0, 1, 0, 0);
        bc.clearRect(0, 0, bw, bh);
        // Seuil de bloom : on isole les VRAIES hautes lumières AVANT le flou
        // (brightness↓ puis contrast↑ écrase les tons moyens/le fond pâle, garde
        // le haut) → plus de voile blanc sur les fonds clairs, l'« éblouissant »
        // des variantes sombres est conservé. Le seuil suit visuellement
        // ≈ BLOOM_SEUIL. Tout via ctx.filter (zéro lecture de pixels).
        const con = 3 + PEINTURE.BLOOM_SEUIL * 2;
        const br = Math.max(0.3, Math.min(1, (0.5 - 0.5 / con) / PEINTURE.BLOOM_SEUIL));
        bc.filter = `brightness(${br.toFixed(3)}) contrast(${con.toFixed(2)}) blur(${Math.round(
          PEINTURE.BLOOM_BLUR * this.quality
        )}px)`;
        bc.drawImage(this.scene!, 0, 0, bw, bh);
        bc.filter = "none";
        visible.globalCompositeOperation = "lighter";
        visible.globalAlpha = PEINTURE.BLOOM_STRENGTH;
        visible.drawImage(this.bloom!, 0, 0, bw, bh, 0, 0, cw, ch);
        visible.globalAlpha = 1;
        visible.globalCompositeOperation = "source-over";
      } else {
        // Repli sans ctx.filter : multi-passes additives décalées.
        visible.globalCompositeOperation = "lighter";
        visible.globalAlpha = PEINTURE.BLOOM_STRENGTH * 0.22;
        const o = 3;
        for (const [dx, dy] of [[-o, 0], [o, 0], [0, -o], [0, o]]) {
          visible.drawImage(this.scene!, 0, 0, cw, ch, dx, dy, cw, ch);
        }
        visible.globalAlpha = 1;
        visible.globalCompositeOperation = "source-over";
      }
    }

    // Color-grade chaud.
    visible.globalCompositeOperation = "soft-light";
    visible.fillStyle = this.cacheGrade!;
    visible.fillRect(0, 0, cw, ch);
    visible.globalCompositeOperation = "source-over";

    // Vignette.
    visible.fillStyle = this.cacheVignette!;
    visible.fillRect(0, 0, cw, ch);

    // Grain statique subtil (coupé si reduced-motion ou basse qualité).
    if (!reduce && this.quality >= 0.8) {
      visible.globalAlpha = PEINTURE.GRAIN;
      visible.globalCompositeOperation = "overlay";
      visible.fillStyle = this.grainPattern(visible);
      const ox = (time * 0.05) % 140;
      const oy = (time * 0.03) % 140;
      visible.translate(ox - 140, oy - 140);
      visible.fillRect(0, 0, cw + 280, ch + 280);
      visible.setTransform(1, 0, 0, 1, 0, 0);
      visible.globalAlpha = 1;
      visible.globalCompositeOperation = "source-over";
    }
  }

  private grainCanvas: HTMLCanvasElement | null = null;
  private grainPat: CanvasPattern | null = null;
  private grainPattern(c: CanvasRenderingContext2D): CanvasPattern {
    if (!this.grainCanvas) {
      const sz = 140;
      const cv = document.createElement("canvas");
      cv.width = cv.height = sz;
      const g = cv.getContext("2d")!;
      const r = rngFrom(99);
      for (let i = 0; i < 3200; i++) {
        const v = Math.floor(r() * 255);
        g.fillStyle = `rgba(${v},${v},${v},0.5)`;
        g.fillRect(r() * sz, r() * sz, 1, 1);
      }
      this.grainCanvas = cv;
    }
    if (!this.grainPat) this.grainPat = c.createPattern(this.grainCanvas, "repeat");
    return this.grainPat!;
  }

  // Recalcule l'échelle de qualité (orientation/resize) et refait les spores.
  refreshQuality(): void {
    if (typeof window === "undefined") return;
    const before = this.quality;
    this.autoQuality();
    if (this.quality !== before) {
      this.makeSpores();
      this.grainPat = null;
    }
  }
}
