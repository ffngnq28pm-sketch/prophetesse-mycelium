# 📱 Déploiement iOS — Prophétesse-Mycélium

> Guide pour publier l'app sur l'App Store. À jour pour la **V3** (trois jeux, navigation regroupée, Colophon, page de confidentialité).
> Demain, on suit ce guide ensemble — les étapes Xcode et App Store Connect demandent ta main sur le Mac.

---

## ✅ Ce qui est déjà en place

- **Next.js en static export** (`output: "export"`) → 83 pages statiques générées dans `out/`.
- **Capacitor 6** installé, plateforme iOS scaffoldée (`ios/`).
- `capacitor.config.ts` configuré :
  - `appId` : **`fr.ordremycelienne.app`**
  - `appName` : **Prophétesse-Mycélium**
  - splash screen vert mousse 1500 ms
- **Compte Apple Developer déjà actif** — Team ID `8BDCCST69F`, compte de build/submit `Charif_Hachichi@hotmail.fr`, Paid Apps Agreement signé. Rien à payer, rien à attendre côté compte.
- Icônes générées (`npm run icons` depuis `public/icon-source.svg`).
- Meta iOS dans `app/layout.tsx`, safe-areas CSS, zoom et `reduced-motion` respectés.
- 100 % local : `localStorage`, aucune permission native, polices embarquées dans le build (pas de requête réseau au lancement).
- **Page de confidentialité publique** : route `/confidentialite` dans l'app — son URL servira de « Politique de confidentialité » exigée par Apple.
- Scripts npm : `ios:add`, `ios:sync`, `ios:open`, `build:static`, `preview`, `icons`.

---

## 🎯 Pré-requis

1. **Un Mac** (impératif — Xcode n'existe que sur macOS). ✔️ tu en as un.
2. **Xcode 15+** (gratuit sur le Mac App Store).
3. **Compte Apple Developer** payant. ✔️ déjà actif (Team `8BDCCST69F`).
4. Le compte Apple Developer ajouté dans Xcode → Réglages → Comptes.
5. Un **iPhone physique** pour les tests réels (fortement conseillé : le simulateur ne capture pas tout, surtout le tactile des jeux).

---

## 🛠 Étape 1 — Build iOS via Capacitor

Sur le Mac, à la racine du projet :

```bash
npm install            # une seule fois
npm run ios:sync       # build statique + copie de /out vers ios/App/App/public/
npm run ios:open       # ouvre le projet dans Xcode
```

> Toujours relancer `npm run ios:sync` après une modification du code web,
> juste avant d'archiver — sinon l'app embarque une version périmée.

---

## 🖥 Étape 2 — Configuration Xcode

1. Sélectionne le target **App** dans le panneau de gauche.
2. Onglet **Signing & Capabilities** :
   - coche **Automatically manage signing** ;
   - choisis le **Team** `8BDCCST69F` ;
   - vérifie le **Bundle Identifier** : `fr.ordremycelienne.app`.
3. Onglet **General** :
   - **Display Name** : Prophétesse-Mycélium ;
   - **Version** (CFBundleShortVersionString) : `1.0` pour la première soumission ;
   - **Build** : `1` — à **incrémenter à chaque upload** vers App Store Connect ;
   - **Minimum Deployments** : iOS 15.0 minimum ;
   - **Device Orientation** : **Portrait uniquement**.
4. Onglet **Info** :
   - `App Transport Security` : `Allow Arbitrary Loads` = **NO** ;
   - aucune clé de permission (`Camera`, `Location`…) n'est nécessaire — l'app n'en demande aucune.

---

## 📲 Étape 3 — Test simulateur, puis device

**Simulateur** : choisis un iPhone récent dans la barre haute, `Cmd+R`.

**Device réel** : branche l'iPhone en USB, « Faire confiance », sélectionne-le comme cible, `Cmd+R`. Première fois sur l'iPhone : Réglages → Général → VPN et gestion d'appareils → fais confiance au certificat.

À vérifier :
- ✅ Le Sanctuaire affiche le verset et la citation du jour, la série (streak).
- ✅ Cocher un rituel ajoute une Graine ; confesser un péché fonctionne.
- ✅ **La Chute du Compost** : tactile (pavé + swipe), ombre de chute visible.
- ✅ **La Chasse aux Pollinisateurs** : pavé directionnel, audio réactif, canvas net.
- ✅ **La Nuit des Empreintes** : grille de déduction, modes Sonder/Marquer.
- ✅ Paramètres → export/import de sauvegarde (le `.json` se télécharge).
- ✅ Safe-areas respectées (notch + indicateur home), rotation portrait verrouillée.

---

## 🚀 Étape 4 — Fiche App Store Connect, Archive, Upload

1. Sur [App Store Connect](https://appstoreconnect.apple.com) → **Apps** → **+** → **Nouvelle app**.
   - Plateforme : iOS ; Nom : **Prophétesse-Mycélium** ;
   - Bundle ID : `fr.ordremycelienne.app` (à enregistrer d'abord comme App ID dans le portail Developer si ce n'est pas fait) ;
   - SKU : un identifiant libre, ex. `prophetesse-mycelium-001`.
   - ⚠️ C'est une **app distincte** de ton app `Charif` — bundle différent, fiche différente.
2. Dans Xcode : **Product → Scheme → Edit Scheme** → Archive en **Release**.
3. Cible « **Any iOS Device** » (pas un simulateur).
4. **Product → Archive**.
5. Dans l'**Organizer** : **Distribute App → App Store Connect → Upload**.
6. La build apparaît dans App Store Connect → **TestFlight** (statut « En cours de traitement », 15–30 min).

---

## 📝 Étape 5 — Métadonnées App Store (prêtes à copier)

> 🚨 **Règle absolue : aucune marque déposée dans la fiche.** Ne jamais écrire « Tetris » ni « Pac » — ni dans le nom, le sous-titre, la description, les mots-clés, ou le texte d'une capture d'écran. Les jeux s'appellent **La Chute du Compost**, **La Chasse aux Pollinisateurs**, **La Nuit des Empreintes**. Apple rejette sous le guideline 5.2 (propriété intellectuelle), et les détenteurs de ces marques surveillent l'App Store.

| Élément | Contenu |
|---|---|
| **Nom** | Prophétesse-Mycélium |
| **Sous-titre** (≤ 30 car.) | Compagnon d'écologie joyeuse |
| **Catégorie principale** | Lifestyle |
| **Catégorie secondaire** | Jeux *(ou Divertissement)* |
| **Mots-clés** (≤ 100 car.) | écologie,jeu,nature,jardin,humour,satire,compost,biodiversité,puzzle,déduction |
| **Tranche d'âge** | 4+ |
| **URL de confidentialité** | `https://<ton-domaine-vercel>/confidentialite` |
| **URL de support** | un `mailto:Charif.Hachichi@icloud.com` ou une page simple |

### Description (proposition, sans marque)

```
Prophétesse-Mycélium est un compagnon ludique et satirique pour écologistes
joyeux. Une application qui invite à observer les lichens, à composter ses
épluchures, à refuser les dosettes d'aluminium, à compter les hérissons des
cimetières — et à le faire avec le sourire.

📖 Un livre sacré original avec notes de bas de page humoristiques
✅ Sept rituels écologiques quotidiens, et une série de jours à entretenir
🔥 Un confessionnal de 35 « péchés » écologiques aux pénitences absurdes
🌱 Un parcours en neuf chapitres, un Jardin à faire pousser, un reliquaire
📅 Un calendrier liturgique, une hagiographie, un almanach du vivant

🎮 Trois jeux liturgiques :
   • La Chute du Compost — empile et trie tes déchets
   • La Chasse aux Pollinisateurs — recense les insectes, esquive les fantômes
   • La Nuit des Empreintes — un puzzle de déduction nocturne au cimetière

Application 100 % locale : aucune collecte de données, aucun compte, aucune
publicité. Tes données restent dans ton téléphone.

⚠️ Cette application est une œuvre satirique et ludique. L'« Ordre Mycélien »
est fictif. Les conseils écologiques s'inspirent des bonnes pratiques de la
LPO et du Muséum national d'Histoire naturelle — mais l'humour prime sur la
prescription.

Que la Sève soit avec toi. Amen-Compost.
```

### Captures d'écran

Apple impose au moins la plus grande taille iPhone (**6,9″**, ex. 1320 × 2868 px) ; il décline les tailles inférieures automatiquement. App Store Connect affiche les tailles exactes attendues au moment du dépôt — elles évoluent, fie-toi à ce qu'il demande.

Six captures suggérées, dans cet ordre :
1. Le **Sanctuaire** (verset, citation, série en cours).
2. Le **Livre Sacré** (chapitre avec lettrine et notes).
3. Les **Rituels** (Sept Offices Verts).
4. **La Nuit des Empreintes** en pleine déduction.
5. **La Chasse aux Pollinisateurs** en partie.
6. Le **Jardin** reverdi.

Capture via `Cmd+S` dans le simulateur iOS à la bonne taille.

### App Privacy (questionnaire App Store Connect)

Coche **« Données non collectées »** — l'app ne collecte rien. Pas de tracking, pas d'identifiant publicitaire, pas de tiers.

---

## 🚨 Pièges connus

1. **Marque déposée (guideline 5.2)** — le piège n°1, déjà traité ci-dessus : aucun « Tetris », aucun « Pac » dans la fiche. Les noms internes du code et l'URL `/jeu/compost` sont sans risque ; seule la fiche publique compte.

2. **Catégorie « religion » (guideline 1.1)** — l'« Ordre Mycélien » peut faire tiquer un reviewer. Parade : ne jamais écrire « religion » ; insister dès la première phrase sur le caractère **fictif et satirique** ; rester en catégorie **Lifestyle**. En cas de refus, répondre dans App Store Connect : œuvre satirique francophone sans visée prosélyte, conseils écologiques inspirés de pratiques scientifiques réelles.

3. **Fonctionnalité minimale (guideline 4.2)** — Apple écarte les simples « sites web emballés ». Ici l'app a trois jeux, un livre, des rituels, un jardin, et fonctionne **entièrement hors ligne** — largement au-dessus de la barre. Si la question revient, le souligner.

4. **Cible iOS** — chaque automne Apple relève le minimum supporté. Si besoin : Xcode → General → Minimum Deployments → relever, puis `npm run ios:sync` et ré-archiver.

5. **Numéro de build** — chaque upload vers App Store Connect doit avoir un **numéro de build supérieur** au précédent. Incrémente-le dans Xcode → General.

---

## 🛡 Politique de confidentialité

Elle est désormais une **page de l'application** : `/confidentialite`. Une fois l'app déployée sur le web, son URL publique (`https://<ton-domaine>/confidentialite`) est celle à renseigner dans App Store Connect — pas besoin de Gist ni de blog tiers.

---

## 🌿 Mot de la fin

L'essentiel du chemin est balisé : le compte est prêt, le projet iOS est scaffoldé, la fiche est rédigée sans marque. Il reste les gestes Xcode et les clics App Store Connect — on les fait ensemble demain.

Amen-Compost. 🍄
