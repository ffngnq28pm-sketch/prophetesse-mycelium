// Textures de re-skin de la couche de jeu du Sentier des Spores (pierre / terre
// / mousse). Pur canvas, aucune dépendance React. On NE touche PAS aux boîtes de
// collision : ces textures ne changent que le DESSIN des plateformes, du sol et
// des franges. Repli gracieux : si une texture manque, le composant garde le
// style plat actuel.

// ════════════ Réglages dial-ables sur capture ════════════
export const SKIN = {
  // Correction de valeur de la pierre (source trop haute clé → marbre + glare
  // sous le bloom). Ramène à une dalle grise patinée, plus claire que la terre
  // mais qui ne crame pas et ne vole pas le focus à la Marcheuse.
  PIERRE_VALEUR: 0.7, // multiplicateur de luminosité (1 = inchangé)
  PIERRE_DESAT: 0.2, // 0 = inchangé, 1 = gris
  PIERRE_TIEDE: 0.08, // teinte chaude ajoutée (soft-light)
  // La terre est déjà sombre : pas de correction par défaut.
  TERRE_VALEUR: 1.0,
  // Tuilage : un carreau de texture couvre TILE unités monde.
  TILE: 96,
  // Frange de mousse sur l'arête haute (unités monde à l'échelle de base).
  FRANGE: 13,
} as const;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth > 0 ? img : null);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Correction de valeur via compositing (aucune lecture de pixels) :
// désaturation partielle → multiply (assombrit) → tiédeur en soft-light.
function corriger(
  img: HTMLImageElement,
  valeur: number,
  desat: number,
  tiede: number
): HTMLCanvasElement {
  const w = img.naturalWidth || 1024;
  const h = img.naturalHeight || 1024;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const c = cv.getContext("2d")!;
  c.drawImage(img, 0, 0, w, h);
  if (desat > 0) {
    c.globalCompositeOperation = "saturation";
    c.globalAlpha = desat;
    c.fillStyle = "#808080";
    c.fillRect(0, 0, w, h);
  }
  if (valeur < 1) {
    c.globalCompositeOperation = "multiply";
    c.globalAlpha = 1;
    const v = Math.round(valeur * 255);
    c.fillStyle = `rgb(${v},${v},${v})`;
    c.fillRect(0, 0, w, h);
  }
  if (tiede > 0) {
    c.globalCompositeOperation = "soft-light";
    c.globalAlpha = tiede;
    c.fillStyle = "#d9a45a";
    c.fillRect(0, 0, w, h);
  }
  c.globalCompositeOperation = "source-over";
  c.globalAlpha = 1;
  return cv;
}

type Tex = HTMLCanvasElement | HTMLImageElement;

export class Skin {
  pierre: Tex | null = null;
  pierreB: Tex | null = null; // variante optionnelle
  terre: Tex | null = null;
  mousse: Tex | null = null;
  private loading = false;

  async load(): Promise<void> {
    if (typeof window === "undefined" || this.loading) return;
    this.loading = true;
    const base = "/jeux/traversee/skin";
    const [pierre, pierreB, terre, mousse] = await Promise.all([
      loadImage(`${base}/pierre.webp`),
      loadImage(`${base}/pierre-b.webp`),
      loadImage(`${base}/terre.webp`),
      loadImage(`${base}/mousse.webp`),
    ]);
    if (pierre) this.pierre = corriger(pierre, SKIN.PIERRE_VALEUR, SKIN.PIERRE_DESAT, SKIN.PIERRE_TIEDE);
    if (pierreB) this.pierreB = corriger(pierreB, SKIN.PIERRE_VALEUR, SKIN.PIERRE_DESAT, SKIN.PIERRE_TIEDE);
    if (terre) this.terre = SKIN.TERRE_VALEUR < 1 ? corriger(terre, SKIN.TERRE_VALEUR, 0, 0) : terre;
    if (mousse) this.mousse = mousse;
  }

  // Pierre à utiliser pour une plateforme donnée (alterne avec la variante).
  pierrePour(index: number): Tex | null {
    if (this.pierreB && index % 2 === 1) return this.pierreB;
    return this.pierre;
  }
}

// Petit bruit déterministe 1D (pour le bord irrégulier de la frange).
export function noise1(x: number): number {
  const s = Math.sin(x * 12.9898) * 43758.5453;
  return s - Math.floor(s); // 0..1
}
