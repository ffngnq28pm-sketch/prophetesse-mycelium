# 🍄 Portage V7 — rendu « parallaxe peinte » dans Le Sentier des Spores

Remplace le décor dessiné à la main de `components/game/LaTraversee.tsx` par le système de
couches peintes + lumière + spores + post validé dans `~/Documents/Claude/vitrine-sentier/`.
**Tout le gameplay V6 reste intact** (physique, plateformes, checkpoints, collectibles, score,
contrôles, données des 3 actes).

## État des lieux

- `lib/traversee-engine.ts` : moteur pur (pas fixe 1/120 s, 3 actes, `state.acte` 1|2|3,
  `state.cam {x,y}`). **Inchangé.**
- `data/traversee-niveau.ts` : niveau 3 actes (Porche / Allées / Ascension). **Inchangé.**
- `components/game/LaTraversee.tsx` : composant + `render()`. **C'est ici qu'on opère.**
  - À RETIRER : `buildDecor`, types `Decor/FarTree/Mausolee/MidProp/Grass/BackdropGrave`,
    `drawFarTree/drawMausolee/drawBackdropGrave/drawMidProp/drawGrass`, l'ancien ciel/soleil/
    brume/bandes et l'ancien `drawGodRays`.
  - À GARDER (intouché) : `drawPlatform`, `drawSanctuaire`, `drawCheckpoint`, `drawFlower`,
    `drawHazard`, `drawCollectible`, `drawParticles`, `drawButterflies`, `drawOlivia`,
    `drawHUD`, `roundRectPath`, la caméra, `viewW/viewH`, le culling.

## Source du look (prototype)

Les 12 PNG validés existent dans le prototype : `couche-{0,1,2}-{a,b,c,d}.png`.
Valeurs CONFIG réglées à reprendre : parallaxe **0.15 / 0.40 / 1.10**, bloom **0.35**,
god rays **0.07**, halo soleil adouci, **couture fondue ~10 % sans flip**, spores
proche/lointain. Bloom = buffer **demi-résolution** + `ctx.filter blur` (repli additif).

## Plan d'exécution

- **Phase A — assets & pipeline.** Sources hors build dans
  `assets-sources/jeux/traversee/<acte>/` (`porche|allees|ascension`), nommage
  `couche-<n>-<v>.png`. Copier les 12 PNG du prototype dans `porche/` (set par défaut +
  repli des autres actes). Étendre `scripts/optimiser-banque.mjs` pour optimiser aussi
  `assets-sources/jeux/traversee/<acte>/*` → `public/jeux/traversee/<acte>/*.webp`
  (≤ 1920, q72, sans upscale, idempotent). Commit `🍄 feat(traversee): assets parallaxe peinte`.

- **Phase B — portage du rendu.** Dans `LaTraversee` : chargement+bake des couches (top-fade
  couches 1/2 + couture fondue, **jamais de flip**), dessin parallaxe en répétition simple,
  god rays calmes, spores (dérive+montée), bloom (demi-rés), color-grade chaud, vignette, grain.
  Ordre : **couche 0 → couche 1 → couche 2 → [gameplay : plateformes, collectibles, dangers,
  Marcheuse, …] → post** (la couche 2 passe DERRIÈRE le gameplay pour ne jamais occulter la zone
  jouable). HUD dessiné crisp APRÈS le post. Marcheuse détaillée conservée + rim-light/ombre de
  contact renforcés. Bake une fois (re-bake débouncé au resize), zéro alloc/frame.
  Bloc `CONFIG` commenté en tête. Commit `🍄 feat(traversee): rendu parallaxe peinte`.

- **Phase C — ambiance par acte + perfs.** Charger la set de l'acte courant, **repli `porche`**
  si vide ; tirage d'une variante par couche par acte/session ; fondu doux à la transition
  d'acte. Échelle de qualité mobile (flou bloom / densité spores / coupe bloom sur petit écran),
  60 fps. `prefers-reduced-motion` → réduit spores+grain. Scrim léger derrière le HUD.
  Commit `🍄 feat(traversee): ambiance par acte + perfs mobile`, puis push `main`.

## Garde-fous

Lisibilité de jeu PRIORITAIRE : aucune couche ne masque Marcheuse/plateformes/collectibles/
dangers. Ne pas toucher moteur, données, autres jeux, hub, reste du site. Audit nominatif = 0
(noms de fichiers d'assets et `alt` compris).
