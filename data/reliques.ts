import type { ProphetesseData } from "@/lib/store";
import { computeStreak } from "@/lib/streak";

export type CategorieRelique = "Jardin" | "Jeux" | "Liturgie" | "Parcours" | "Exploration";

export interface Relique {
  id: string;
  nom: string;
  embleme: string;
  categorie: CategorieRelique;
  description: string; // ce que la relique célèbre
  condition: string; // condition de déblocage, lisible
  estObtenue: (d: ProphetesseData) => boolean;
}

function especesUniques(d: ProphetesseData): number {
  return new Set(d.jardin.map((p) => p.especeId)).size;
}

function chapitresAcheves(d: ProphetesseData): number {
  return Object.values(d.chapitres).filter((c) => c.completed).length;
}

function aFaitSeptOffices(d: ProphetesseData): boolean {
  return Object.values(d.rituelsParJour).some(
    (jour) => Object.values(jour).filter(Boolean).length >= 7
  );
}

export const RELIQUES: Relique[] = [
  // ——— Jardin ———
  {
    id: "premiere-graine",
    nom: "Première Graine",
    embleme: "🌱",
    categorie: "Jardin",
    description: "Tu as gagné ta toute première Graine de Grâce. Tout commence par une.",
    condition: "Posséder au moins 1 graine",
    estObtenue: (d) => d.graines >= 1,
  },
  {
    id: "main-dans-la-terre",
    nom: "La Main dans la Terre",
    embleme: "🪴",
    categorie: "Jardin",
    description: "Première espèce plantée au Jardin. Le mycélium a senti passer tes doigts.",
    condition: "Planter au moins 1 espèce",
    estObtenue: (d) => d.jardin.length >= 1,
  },
  {
    id: "jardin-foisonnant",
    nom: "Jardin Foisonnant",
    embleme: "🌿",
    categorie: "Jardin",
    description: "Six espèces différentes cohabitent dans ta parcelle. La biodiversité est une fête discrète.",
    condition: "Planter 6 espèces différentes",
    estObtenue: (d) => especesUniques(d) >= 6,
  },
  {
    id: "parcelle-comble",
    nom: "Parcelle Comble",
    embleme: "🌳",
    categorie: "Jardin",
    description: "Tous les emplacements du Jardin sont occupés. Frère Théodule passerait des heures à le contempler.",
    condition: "Remplir tous les emplacements du Jardin",
    estObtenue: (d) => d.jardin.length >= d.jardinSlots,
  },
  // ——— Jeux ———
  {
    id: "premier-compost",
    nom: "Premier Compost",
    embleme: "♻️",
    categorie: "Jeux",
    description: "Ta première ligne compostée à La Chute du Compost. Deux kilos de matière organique sacrée.",
    condition: "Composter au moins 1 ligne",
    estObtenue: (d) => d.lignesCompostees >= 1,
  },
  {
    id: "maitre-du-compost",
    nom: "Maître du Compost",
    embleme: "🧱",
    categorie: "Jeux",
    description: "Un score de 600 à La Chute du Compost. Sœur Compost note la performance, sobrement.",
    condition: "Atteindre 600 points à La Chute du Compost",
    estObtenue: (d) => d.meilleurScoreTetris >= 600,
  },
  {
    id: "premier-recensement",
    nom: "Premier Recensement",
    embleme: "🔎",
    categorie: "Jeux",
    description: "Premier pollinisateur recensé. Tu fais désormais mieux qu'un humain moyen — qui en recense zéro.",
    condition: "Recenser au moins 1 pollinisateur",
    estObtenue: (d) => d.pollinisateursRecenses >= 1,
  },
  {
    id: "recenseur-emerite",
    nom: "Recenseur Émérite",
    embleme: "📋",
    categorie: "Jeux",
    description: "Deux cents pollinisateurs recensés au fil du pèlerinage. Sœur Halicte pose un nid en ton honneur.",
    condition: "Recenser 200 pollinisateurs en tout",
    estObtenue: (d) => d.pollinisateursRecenses >= 200,
  },
  {
    id: "sainte-colere",
    nom: "Sainte Colère",
    embleme: "☕",
    categorie: "Jeux",
    description: "Premier fantôme tabassé au filet, sous l'effet d'une Gorgée de Café Filtre.",
    condition: "Tabasser au moins 1 fantôme",
    estObtenue: (d) => d.fantomesTabasses >= 1,
  },
  {
    id: "fleau-des-spectres",
    nom: "Fléau des Spectres",
    embleme: "👻",
    categorie: "Jeux",
    description: "Vingt-cinq fantômes tabassés. L'Annuaire des Défunts Marris a ouvert un dossier à ton nom.",
    condition: "Tabasser 25 fantômes en tout",
    estObtenue: (d) => d.fantomesTabasses >= 25,
  },
  {
    id: "cinq-cimetieres",
    nom: "Les Cinq Cimetières",
    embleme: "⚰️",
    categorie: "Jeux",
    description: "Tu as atteint le cinquième et dernier niveau de la Chasse aux Pollinisateurs.",
    condition: "Atteindre le niveau 5 du Pac",
    estObtenue: (d) => d.niveauMaxPac >= 5,
  },
  {
    id: "premier-releve",
    nom: "Premier Relevé",
    embleme: "🐾",
    categorie: "Jeux",
    description: "Premier mammifère recensé à La Nuit des Empreintes. Tu sais désormais lire une trace.",
    condition: "Recenser au moins 1 mammifère nocturne",
    estObtenue: (d) => d.mammiferesRecenses >= 1,
  },
  {
    id: "veilleur-accompli",
    nom: "Veilleur Accompli",
    embleme: "🌙",
    categorie: "Jeux",
    description: "Mille points en une seule veille des empreintes. Frère Hérisson te confierait son carnet.",
    condition: "Atteindre 1000 points à La Nuit des Empreintes",
    estObtenue: (d) => d.meilleurScoreEmpreintes >= 1000,
  },
  {
    id: "sentier-acheve",
    nom: "Le Sentier Achevé",
    embleme: "🌅",
    categorie: "Jeux",
    description: "La Marcheuse a traversé le cimetière reverdi et rejoint le grand If sacré du Sanctuaire.",
    condition: "Terminer Le Sentier des Spores au moins une fois",
    estObtenue: (d) => d.traverseeTerminee,
  },
  {
    id: "verbe-enracine",
    nom: "Le Verbe Enraciné",
    embleme: "📜",
    categorie: "Jeux",
    description: "Sept jours d'affilée à deviner le Verbe du Jour. Le canon t'habite désormais sans effort.",
    condition: "Atteindre 7 jours de série au Verbe du Jour",
    estObtenue: (d) => d.verbeMeilleurStreak >= 7,
  },
  {
    id: "ami-des-pollinisateurs",
    nom: "Ami des Pollinisateurs",
    embleme: "🦋",
    categorie: "Jeux",
    description: "Les seize pollinisateurs du sentier sauvés en une seule traversée. Aucun laissé derrière.",
    condition: "Sauver les 16 pollinisateurs en une traversée",
    estObtenue: (d) => d.meilleursPollinisateursTraversee >= 16,
  },
  // ——— Liturgie ———
  {
    id: "heure-par-heure",
    nom: "Heure par Heure",
    embleme: "🕖",
    categorie: "Liturgie",
    description: "Les sept offices verts accomplis en une seule journée. Sept fois oui.",
    condition: "Accomplir les 7 offices dans la même journée",
    estObtenue: (d) => aFaitSeptOffices(d),
  },
  {
    id: "semaine-enracinee",
    nom: "Semaine Enracinée",
    embleme: "🔥",
    categorie: "Liturgie",
    description: "Sept jours consécutifs de rituels. Une habitude vient de prendre racine.",
    condition: "Tenir une série de 7 jours",
    estObtenue: (d) => computeStreak(d.rituelsParJour).record >= 7,
  },
  {
    id: "racine-profonde",
    nom: "Racine Profonde",
    embleme: "🌲",
    categorie: "Liturgie",
    description: "Trente jours consécutifs de rituels. Ce n'est plus une habitude, c'est une nature.",
    condition: "Tenir une série de 30 jours",
    estObtenue: (d) => computeStreak(d.rituelsParJour).record >= 30,
  },
  {
    id: "premier-aveu",
    nom: "Premier Aveu",
    embleme: "📜",
    categorie: "Liturgie",
    description: "Première confession déposée au Confessionnal Mycélien. Le repentir mycélien est joyeux.",
    condition: "Déposer au moins 1 confession",
    estObtenue: (d) => d.confessions.length >= 1,
  },
  // ——— Parcours ———
  {
    id: "seuil-franchi",
    nom: "Le Seuil Franchi",
    embleme: "📖",
    categorie: "Parcours",
    description: "Premier chapitre de La Voie achevé. Le pèlerinage a vraiment commencé.",
    condition: "Achever le chapitre I de La Voie",
    estObtenue: (d) => chapitresAcheves(d) >= 1,
  },
  {
    id: "voie-accomplie",
    nom: "La Voie Accomplie",
    embleme: "🍄",
    categorie: "Parcours",
    description: "Les neuf chapitres de La Voie sont derrière toi. Tu n'es plus un disciple : tu es une part du réseau.",
    condition: "Achever les 9 chapitres de La Voie",
    estObtenue: (d) => chapitresAcheves(d) >= 9,
  },
  // ——— Exploration ———
  {
    id: "tour-des-sanctuaires",
    nom: "Le Tour des Sanctuaires",
    embleme: "🗺️",
    categorie: "Exploration",
    description: "Six sanctuaires visités — les dernières forêts primaires d'Île-de-France.",
    condition: "Visiter 6 sanctuaires",
    estObtenue: (d) => d.sanctuairesVisites.length >= 6,
  },
  {
    id: "oreille-a-paraboles",
    nom: "Oreille à Paraboles",
    embleme: "👂",
    categorie: "Exploration",
    description: "Dix paraboles mycéliennes lues et méditées. La sagesse entre par les oreilles patientes.",
    condition: "Lire 10 paraboles",
    estObtenue: (d) => d.parabolesLues.length >= 10,
  },
];
