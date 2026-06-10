# 🍄 Prophétesse-Mycélium

> Application liturgique de l'Ordre Mycélien.
> Rituels, confessions, Tetris du Compost, Chasse aux Pollinisateurs, Jardin sauvage,
> et la parole de la Prophétesse — Celle-qui-marche-entre-les-tombes.

🌐 **En ligne : [mycelium.shadowstepsociety.com](https://mycelium.shadowstepsociety.com)**

---

## Le projet

**Prophétesse-Mycélium** est une œuvre satirique et ludique : une fausse application
liturgique pour un Ordre écologique imaginaire, qui se prend juste assez au sérieux
pour faire sourire et planter de vraies fleurs.

On y trouve :

- **La Voie** — un parcours initiatique en 9 chapitres narratifs déblocables progressivement
- **Le Jardin** — une parcelle de cimetière à reverdir avec 12 espèces botaniques réelles
- **Deux jeux** — le Tetris du Compost (tri des déchets) et la Chasse aux Pollinisateurs
  (un Pac-Man dans les cimetières d'Île-de-France)
- **Le Livre Sacré** — Genèse Mycélienne, Sept Hérésies, Sept Vertus, Paraboles,
  Lamentations sur la Dosette, Calendrier liturgique (~28 000 mots de contenu original
  avec notes de bas de page dans l'esprit de Terry Pratchett)
- **Les Sept Offices Verts** — des rituels écologiques quotidiens à cocher
- **Le Confessionnal Mycélien** — 35 péchés écologiques avec pénitences absurdes

L'écologie y est traitée avec un fanatisme joyeux et bienveillant : moins de dosettes
d'aluminium, plus de Lichens. Le projet s'inspire librement des travaux sur la biodiversité
des cimetières urbains — ces îlots de nature oubliés au milieu du béton.

## Stack

- **Next.js 14** (App Router, static export)
- **TypeScript** strict
- **Tailwind CSS**
- **Zustand** (état global + persistance localStorage)
- **Framer Motion** (animations)
- **Web Audio API** (sons de jeu générés, sans fichier externe)
- **Capacitor** (build iOS)
- **lucide-react** (icônes)

## Lancer en local

```bash
npm install
npm run dev
```

Puis http://localhost:3000.

Aucune configuration, aucune clé API, aucune variable d'environnement.
Tout vit en local dans le navigateur.

## Build statique (pour Vercel)

```bash
npm run build
```

Génère le dossier `/out`, prêt pour un déploiement statique.
Voir [DEPLOIEMENT_WEB.md](./DEPLOIEMENT_WEB.md) pour le déploiement complet.

**En production** : hébergé sur **Vercel**, nom de domaine **OVH**
([mycelium.shadowstepsociety.com](https://mycelium.shadowstepsociety.com)).
Chaque push sur `main` redéploie automatiquement.

## Build iOS

```bash
npm run ios:sync
npm run ios:open
```

Voir [DEPLOIEMENT_IOS.md](./DEPLOIEMENT_IOS.md) pour le détail (Capacitor, Xcode, App Store).

## Structure

```
app/            Routes Next.js (App Router)
  voie/         La Voie — parcours en 9 chapitres
  jardin/       Le Jardin — plantation de 12 espèces
  jeu/          Hub des jeux + Tetris + Chasse aux Pollinisateurs
  livre/        Livre Sacré (6 livres, navigation chapitres)
  rituels/      Sept Offices Verts
  confession/   Confessionnal Mycélien
  calendrier/   12 fêtes liturgiques
  sanctuaires/  Carte des cimetières d'Île-de-France
  bienvenue/    Onboarding premier lancement
  glossaire/    Glossaire de l'Ordre
components/     UI, composants liturgiques, jeux, jardin
data/           Contenu (versets, citations, paraboles, espèces, voie…)
lib/            Store Zustand, moteurs de jeu, utilitaires
```

## Crédits

Charif Hachichi · 2026.

Œuvre satirique et ludique inspirée par la richesse écologique méconnue des
cimetières d'Île-de-France. Aucun lien officiel avec une quelconque institution.
Pour rire, méditer, et planter des fleurs.

## Licence

Le **code** est sous licence MIT (voir [LICENSE](./LICENSE)).
Le **contenu liturgique original** (textes, versets, paraboles, lamentations) est
diffusé sous licence Creative Commons BY-NC-SA 4.0.

*Que la Sève soit avec toi. Amen-Compost.* 🍄
