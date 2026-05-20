# 📱 Déploiement iOS — Prophétesse-Mycélium

> Guide complet pour publier l'app sur l'App Store, avec étapes, pièges, et un draft de politique de confidentialité.

## ✅ Ce qui est déjà fait dans cette V2

- Next.js configuré en **static export** (`output: 'export'` dans `next.config.mjs`)
- Toutes les routes dynamiques ont leur `generateStaticParams` → 56 pages statiques générées (Livre + Chapitres inclus)
- **Capacitor 6** installé avec plateforme iOS scaffoldée (`ios/`)
- `capacitor.config.ts` configuré avec :
  - appId : `fr.ordremycelienne.app`
  - appName : `Prophétesse-Mycélium`
  - splash screen vert mousse 1500 ms
- **Manifest PWA** (`public/manifest.webmanifest`) — installable sur écran d'accueil iPhone
- **Icônes générées** par `npm run icons` (depuis `public/icon-source.svg`) :
  - 192, 512, 1024 (PWA)
  - 512 maskable
  - 180×180 apple-touch-icon
  - splash 1170×2532 (iPhone 14/15) + 1179×2556 (iPhone 15 Pro)
- **Meta iOS** ajoutées dans `app/layout.tsx` : `apple-mobile-web-app-capable`, `status-bar-style: black-translucent`, `viewport-fit: cover`
- **Safe-area CSS** : padding insets en mode standalone uniquement (pas de double-padding en navigateur)
- Audio Pac-Olivia derrière geste utilisateur (initialisé au premier `touchstart`/clic d'activation)
- localStorage utilisé partout (WKWebView OK)
- Scripts npm : `ios:add`, `ios:sync`, `ios:open`, `preview`, `icons`

---

## 🎯 Pré-requis utilisatrice

Pour publier sur l'App Store, il te faut :

1. **Un Mac** (impératif — Xcode n'existe que sur macOS).
2. **Xcode 15+** (gratuit sur Mac App Store).
3. **Un compte Apple Developer** payant : **99 USD/an** (https://developer.apple.com/programs/).
4. **Un identifiant iCloud** déjà configuré dans Xcode (Preferences → Accounts).
5. **Un iPhone** physique pour les tests réels (optionnel mais fortement conseillé — le simulateur ne capture pas tout, en particulier les gestes tactiles).

## 🏁 Étape 1 — Tester d'abord en PWA (5 minutes, sans Mac)

C'est l'étape gratuite et instantanée. Recommandé avant tout le reste.

1. Sur ton Mac (ou PC), lance le build statique :
   ```bash
   npm run build:static
   npm run preview   # sert /out via npx serve
   ```
2. Note l'URL locale (ex. `http://192.168.1.X:3000` — affichée par `serve`).
3. Sur ton iPhone, **assure-toi qu'il est sur le même Wi-Fi**.
4. Ouvre Safari (pas Chrome — uniquement Safari peut installer une PWA sur iOS).
5. Va sur l'URL.
6. Appuie sur le bouton **Partager** → **Sur l'écran d'accueil**.
7. L'app s'installe avec ton icône dorée. Tu peux la lancer depuis l'accueil de l'iPhone : elle ouvre en plein écran, avec safe-areas respectées, et sans barre Safari.

Cela suffit pour un usage personnel. La suite n'est utile que si tu veux publier sur l'App Store et la rendre accessible à d'autres.

## 🛠 Étape 2 — Build iOS natif via Capacitor

Sur un Mac avec Xcode installé :

```bash
# (Une seule fois) Installer les dépendances
npm install

# Régénérer les icônes si tu as modifié l'icône maîtresse
npm run icons

# Build statique + sync vers iOS
npm run ios:sync

# Ouvrir Xcode
npm run ios:open
```

> Si tu repars d'un clone propre sans dossier `ios/` :
> ```bash
> npm run ios:add    # crée le projet Xcode
> npm run ios:sync   # copie /out dans ios/App/App/public/
> ```

## 🖥 Étape 3 — Configuration Xcode

1. Sélectionne le **target App** dans le panneau de gauche.
2. Onglet **Signing & Capabilities** :
   - Coche **Automatically manage signing**
   - Choisis ton **Team** (ton compte Apple Developer)
   - Vérifie que le **Bundle Identifier** est `fr.ordremycelienne.app`
3. Onglet **General** :
   - **Display Name** : Prophétesse-Mycélium
   - **Minimum Deployments** : iOS 15.0 (ou plus récent — pas plus de 14, certains polyfills ne sont plus pris en charge)
   - **Device Orientation** : Portrait uniquement (recommandé pour les jeux)
4. Onglet **Info** :
   - `App Transport Security Settings` → vérifie que `Allow Arbitrary Loads` est sur `NO` (sécurité)
   - `Privacy - Camera Usage Description` etc. : pas besoin, l'app ne demande aucune permission native

## 📲 Étape 4 — Test sur simulateur, puis device

**Simulateur** :
- Dans la barre haute de Xcode, choisis un simulateur (ex. **iPhone 15 Pro**)
- Bouton ▶ ou `Cmd+R`
- L'app se lance, le splash screen vert mousse apparaît, puis le sanctuaire.

**Device réel** :
- Branche ton iPhone en USB
- Autorise « Faire confiance à cet ordinateur » sur ton iPhone
- Dans Xcode, choisis ton iPhone comme target
- Bouton ▶
- La première fois, sur l'iPhone : Réglages → Général → VPN et gestion appareils → fais confiance à ton certificat développeur

Vérifie en particulier :
- ✅ Sanctuaire affiche correctement le verset du jour
- ✅ Tu peux cocher un rituel et la graine est ajoutée
- ✅ Tu peux confesser un péché
- ✅ Le **Tetris du Compost** fonctionne en tactile (swipe + boutons)
- ✅ **Pac-Olivia** : swipes 4 directions, tap = pause, audio toggle réactif
- ✅ Pas de zone safe-area mangée (notch + home indicator visibles, contenu pas masqué)
- ✅ Rotation portrait verrouillée

## 🚀 Étape 5 — Archive et upload vers App Store Connect

1. Dans Xcode : **Product → Scheme → Edit Scheme** : choisis **Release** comme build configuration de l'Archive.
2. Choisis « Any iOS Device » dans la barre haute (pas un simulateur).
3. **Product → Archive** (cela peut prendre quelques minutes).
4. Quand l'Archive est prête, la fenêtre **Organizer** s'ouvre.
5. Clique **Distribute App** → **App Store Connect** → **Upload**.
6. Suit les wizards. La build s'upload vers App Store Connect.
7. Va sur https://appstoreconnect.apple.com → ton app apparaît dans **TestFlight** sous **iOS Builds** (statut « En cours de traitement » pendant 15-30 min).

## 📝 Étape 6 — Checklist App Store

### Avant la soumission, tu dois préparer :

| Élément | Contenu |
|---|---|
| **Nom App Store** | « Prophétesse-Mycélium » (30 caractères max) |
| **Sous-titre** | « Compagnon ludique d'écologie joyeuse » (30 caractères max) |
| **Catégorie principale** | **Lifestyle** (recommandé, évite Reference et Health & Fitness) |
| **Catégorie secondaire** | **Games** ou **Books** |
| **Mots-clés** (100 char) | écologie,jeu,liturgie,satire,nature,jardin,humour,compost,biodiversité |
| **Description** | Voir ci-dessous |
| **Politique de confidentialité (URL)** | Voir draft ci-dessous |
| **Captures d'écran** | Voir tailles requises ci-dessous |
| **URL marketing** (optionnel) | Si tu en as une |
| **Support URL** | Au pire, une mailto: ou page GitHub |
| **Tranche d'âge** | 4+ (aucun contenu sensible) |

### Description App Store (proposition)

```
Prophétesse-Mycélium est un compagnon ludique et satirique pour écologistes joyeux. 
Une application qui invite à observer les Lichens, à composter ses épluchures, à refuser 
les dosettes d'aluminium, à compter les Hérissons des cimetières — et à le faire avec 
sourire.

📖 Un livre sacré original (28 000 mots) avec notes de bas de page humoristiques
✅ Sept rituels écologiques quotidiens à cocher  
🔥 Confessionnal Mycélien avec 35 péchés écologiques et pénitences absurdes
🌱 Échelle de progression en 9 paliers
📅 Calendrier liturgique de 12 fêtes (Nuit des Chiroptères, Pèlerinage des Cimetières…)
🗺 Carte des cimetières-sanctuaires d'Île-de-France
🎮 Deux jeux liturgiques :
   • Tetris du Compost : trie tes déchets
   • Pac-Olivia : recense les insectes dans les cimetières en évitant les fantômes

Application 100% locale : aucune collecte de données, aucun compte, aucune publicité. 
Tes données restent dans ton téléphone.

⚠️ Cette application est une œuvre satirique et ludique. L'« Ordre Mycélien » est 
fictif. Les conseils écologiques cités s'inspirent des bonnes pratiques de la LPO, 
du Muséum national d'Histoire naturelle, et du protocole Vigie-Flore — mais l'humour 
prime sur la prescription.

Que la Sève soit avec toi. Amen-Compost.
```

### Captures d'écran requises (Apple 2025)

Les **tailles obligatoires** pour iPhone :
- **6.9″ (iPhone 16 Pro Max)** : 1320×2868 pixels — **OBLIGATOIRE**
- **6.5″ (iPhone 11 Pro Max)** : 1284×2778 — **OBLIGATOIRE**
- **5.5″ (iPhone 8 Plus)** : 1242×2208 — **OBLIGATOIRE**

Suggestion : 6 captures, dans cet ordre, pour bien vendre :
1. **Sanctuaire** (verset + citation du jour + état du pèlerinage)
2. **Livre d'Olivia** (chapitre avec lettrine et notes de bas de page visibles)
3. **Rituels** (Sept Offices Verts)
4. **Confessionnal** en cours (péché + pénitence)
5. **Tetris du Compost** en pleine partie
6. **Pac-Olivia** au cœur du Père-Lachaise, avec Sainte Colère active

Pour les capturer : utiliser **Cmd+S** dans le simulateur iOS de la bonne taille.

## 🚨 Pièges connus et tactiques de défense

### 1. **Refus App Store catégorie « religion »**

Apple est strict avec les apps qui pourraient se présenter comme religieuses, prosélytes, ou divisives. L'« Ordre Mycélien » sonne comme une secte aux yeux d'un reviewer fatigué un lundi matin.

**Tactique** :
- **Ne PAS** mettre « religion » dans le nom, le sous-titre, ou les mots-clés.
- **Préférer** « satirique », « ludique », « lifestyle » dans la description.
- Insister dès le premier paragraphe sur le caractère **fictif et humoristique**.
- Catégorie : **Lifestyle** (et pas **Reference**).
- En cas de refus initial, le **3.1.5** ou **4.0** sont les rejets typiques — répondre dans App Store Connect avec un argumentaire bref : « Cette application est une œuvre satirique francophone dans la lignée de la tradition humoristique française (Pierre Desproges, etc.), n'a aucune visée prosélyte, et propose des conseils écologiques inspirés de pratiques scientifiques. »

### 2. **Sans description claire de l'objet ludique → refus 4.0 "Design - Minimum Functionality"**

L'app a deux jeux + du contenu + des rituels, donc on est largement au-dessus de la barre. Mais :
- **Mentionne les jeux EN PREMIER** dans la première capture d'écran si tu vises catégorie Lifestyle/Games.

### 3. **Identifiant unique de l'utilisateur**

L'app utilise localStorage. **Pas de tracking, pas d'identifiant publicitaire, pas de cookie tiers.** Cocher « Données non collectées » dans App Privacy.

### 4. **Apple Sign-in obligatoire ?**

Non, l'app n'a aucun système de comptes. Pas concerné.

### 5. **Mise à jour Capacitor / iOS deployment target**

Si Apple change le minimum supporté (typiquement passé à iOS 16 puis 17 chaque automne), il faut :
- Ouvrir Xcode → General → Minimum Deployments → bump
- Refaire `npm run ios:sync` puis re-Archive

## 🛡 Draft de politique de confidentialité

À héberger sur une URL publique (un Gist GitHub fait l'affaire, ou un blog perso). Apple exige une URL.

---

### Politique de confidentialité — Prophétesse-Mycélium

**Date de mise à jour** : [date]

Cette application est éditée par Charif Hachichi (Charif.Hachichi@icloud.com).

**Aucune donnée personnelle n'est collectée, transmise, ni partagée.**

L'application Prophétesse-Mycélium stocke localement, sur votre appareil :
- vos préférences (nom de baptême choisi, animal totem, thème clair/sombre) ;
- l'avancement de votre pèlerinage (Graines de Grâce, niveau atteint, rituels cochés) ;
- l'historique de vos confessions (libellé du péché et pénitence choisie) ;
- les scores de vos parties de Tetris du Compost et de Pac-Olivia.

Ces données sont conservées uniquement dans le stockage local de votre appareil (technologie `localStorage`). Elles ne quittent jamais votre appareil. Elles sont effacées si vous désinstallez l'application, si vous videz les données du navigateur (en mode PWA), ou si vous utilisez la fonction « Réinitialiser » dans les paramètres de l'application.

**Aucun compte n'est créé.** Aucune adresse mail n'est requise.
**Aucune publicité n'est diffusée.** Aucun service publicitaire tiers n'est intégré.
**Aucun traceur tiers** (Google Analytics, Facebook Pixel, etc.) n'est intégré.
**Aucune permission native** (caméra, photo, micro, localisation, etc.) n'est demandée par l'application.

L'application ne se connecte à aucun serveur externe pour son fonctionnement normal. Elle peut, le cas échéant, télécharger des polices Google Fonts (Cormorant Garamond et Inter) au premier chargement ; aucune information d'identification n'est transmise.

**Droits** : étant donné qu'aucune donnée n'est collectée par l'éditeur, le droit d'accès, de rectification, d'effacement, à la portabilité et d'opposition n'a pas d'objet ici. Pour effacer vos données locales : ouvrez l'application, allez dans « Paramètres », et choisissez « Réinitialiser ».

**Contact** : pour toute question, écrivez à Charif.Hachichi@icloud.com.

---

Politique applicable au territoire de l'Union européenne, conforme au RGPD.

---

## 🌿 Mot de la fin

Que la Sève soit avec toi. Si l'App Store refuse, ne pleure pas : tu as déjà l'app installée en PWA sur ton iPhone, et 90% de tes pèlerins l'utiliseront comme ça. La publication sur l'App Store est un confort de distribution, pas une obligation spirituelle.

Amen-Compost. 🍄
