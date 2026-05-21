export type ObjectifId =
  | "choisir-nom"
  | "choisir-totem"
  | "rituels-3"
  | "rituels-7-jours"
  | "lire-genese"
  | "confessions-3"
  | "confessions-15"
  | "graines-100"
  | "graines-300"
  | "graines-1000"
  | "tetris-une-partie"
  | "tetris-50-lignes"
  | "pac-niveau-2"
  | "pac-niveau-5"
  | "pac-200-pollinisateurs"
  | "lire-heresies"
  | "lire-vertus"
  | "lire-7-paraboles"
  | "lire-lamentations"
  | "visiter-8-sanctuaires"
  | "planter-5-especes"
  | "planter-12-especes"
  | "fetes-2"
  | "fetes-5";

export interface Objectif {
  id: ObjectifId;
  label: string;
  description: string;
  cible: number;
}

export interface Chapitre {
  id: number; // 1..9
  titre: string;
  sousTitre: string;
  paragrapheOuverture: string;
  objectifs: Objectif[];
  niveauDebloque: number; // id du palier Échelle correspondant
  recompenseLabel: string;
  recompenseGraines: number;
}

export const CHAPITRES: Chapitre[] = [
  {
    id: 1,
    titre: "Chapitre I — Le Seuil",
    sousTitre: "Tu n'es encore personne. C'est exactement le bon début.",
    paragrapheOuverture:
      "Toute discipline mycélienne commence ainsi : par une décision sans grande conviction prise un mardi soir, généralement après avoir vu pour la troisième fois dans la semaine un sachet plastique voler dans la rue. Tu n'as pas besoin d'avoir tout compris. Le mycélium, qui n'a lui-même rien compris à grand-chose pendant 400 millions d'années, s'en sort très bien. Choisis un nom, choisis un totem, et marche.",
    objectifs: [
      { id: "choisir-nom", label: "Choisir un nom de baptême", description: "Va dans Paramètres et donne-toi un nom mycélien. Tu peux changer plus tard.", cible: 1 },
      { id: "choisir-totem", label: "Choisir un animal totem", description: "Sept totems proposés. Aucun n'est meilleur. Le tien sera le bon parce que c'est le tien.", cible: 1 },
      { id: "rituels-3", label: "Accomplir 3 rituels", description: "N'importe lesquels, n'importe quand. La discipline commence par l'arithmétique.", cible: 3 },
      { id: "lire-genese", label: "Lire le Livre I — Genèse Mycélienne", description: "Quatre chapitres. Le mythe fondateur. Au moins le premier paragraphe de chaque.", cible: 4 },
    ],
    niveauDebloque: 2,
    recompenseLabel: "Tu deviens Novice du Compost. Et 25 graines de bienvenue.",
    recompenseGraines: 25,
  },
  {
    id: 2,
    titre: "Chapitre II — La Première Pousse",
    sousTitre: "Quelque chose vient de germer. On ne saura jamais quoi exactement.",
    paragrapheOuverture:
      "À ce stade, le néo-disciple ressent généralement une légère contrariété en croisant une dosette d'aluminium. C'est le début d'une vie longue et fertile, qui consistera à osciller entre la contrariété écologique et la joie écologique sans jamais résoudre la tension. Sœur Compost dirait que c'est sain. Frère Lichen ne dirait rien parce qu'il met douze minutes à dire bonjour.",
    objectifs: [
      { id: "confessions-3", label: "Confesser 3 péchés écologiques", description: "Aucune honte. Olivia-aux-mille-racines en a personnellement confessé 87 cette semaine, prétend-elle.", cible: 3 },
      { id: "graines-100", label: "Accumuler 100 Graines de Grâce", description: "Par les rituels, les jeux, ou simplement la patience.", cible: 100 },
      { id: "tetris-une-partie", label: "Jouer une partie de La Chute du Compost", description: "Jusqu'au bout, même mal. Surtout mal, d'ailleurs : c'est plus formateur.", cible: 1 },
    ],
    niveauDebloque: 3,
    recompenseLabel: "Tu deviens Initié·e du Lichen. + 40 graines.",
    recompenseGraines: 40,
  },
  {
    id: 3,
    titre: "Chapitre III — L'Éveil du Mycélium",
    sousTitre: "On t'a vu hier matin parler à un Plantain lancéolé. Personne ne te jugera.",
    paragrapheOuverture:
      "L'éveil du mycélium chez le disciple se manifeste par trois symptômes : il se met à reconnaître trois plantes dans la rue, il oublie son téléphone une fois sur deux quand il sort le sac à courses, et il regarde les autres acheter des bouteilles d'eau plate avec une tristesse amusée. Aucun de ces symptômes n'est curable. Heureusement.",
    objectifs: [
      { id: "lire-heresies", label: "Lire les 7 Hérésies", description: "Sept chapitres du Livre II. Les piliers à éviter.", cible: 7 },
      { id: "rituels-7-jours", label: "Accomplir au moins un rituel pendant 7 jours", description: "Pas forcément consécutifs. La Sainte Mycélienne sait que la régularité humaine est un mythe.", cible: 7 },
      { id: "graines-300", label: "Accumuler 300 Graines de Grâce", description: "Tu vas en avoir besoin pour planter.", cible: 300 },
    ],
    niveauDebloque: 4,
    recompenseLabel: "Tu deviens Frère/Sœur du Mycélium. + 60 graines + ouverture du Jardin (si pas déjà).",
    recompenseGraines: 60,
  },
  {
    id: 4,
    titre: "Chapitre IV — Les Cimetières Vivants",
    sousTitre: "Tu n'as plus peur des Pigeons. C'est un signe.",
    paragrapheOuverture:
      "Le quatrième chapitre est celui du pèlerinage urbain. Le disciple commence à voir les cimetières non plus comme des lieux de tristesse, mais comme ce qu'ils sont vraiment : les dernières forêts primaires d'Île-de-France. Le Père-Lachaise abrite plus d'espèces que tous les parcs municipaux de la couronne réunis. Personne n'en parle, et c'est très bien. La discrétion est mycélienne.",
    objectifs: [
      { id: "visiter-8-sanctuaires", label: "Visiter les 8 Sanctuaires", description: "Clique sur chacun dans la Carte. Lis leur fiche. Émerveille-toi, ne serait-ce qu'un peu.", cible: 8 },
      { id: "pac-niveau-2", label: "Atteindre le niveau 2 de la Chasse aux Pollinisateurs", description: "Le cimetière de Bagneux. C'est tendu.", cible: 2 },
      { id: "graines-300", label: "Accumuler 300 Graines de Grâce (cumulatif)", description: "Ça compte aussi des graines que tu aurais déjà.", cible: 300 },
    ],
    niveauDebloque: 5,
    recompenseLabel: "Tu deviens Gardien·ne des Cimetières. + 80 graines.",
    recompenseGraines: 80,
  },
  {
    id: 5,
    titre: "Chapitre V — La Lente Patience",
    sousTitre: "Le Lichen, toujours le Lichen.",
    paragrapheOuverture:
      "À ce point du parcours, le disciple a compris une chose simple : tout ce qui compte vraiment pousse lentement. Les forêts. La biodiversité. La capacité de s'asseoir devant une fenêtre sans rien faire pendant dix minutes. Cette dernière capacité est, dit Mère Mycorhize, le plus haut signe de maturité spirituelle. Mère Mycorhize a 91 ans et passe ses journées à fixer un mur. On la respecte beaucoup.",
    objectifs: [
      { id: "lire-vertus", label: "Lire les 7 Vertus", description: "Sept chapitres du Livre III. À méditer lentement, comme tout.", cible: 7 },
      { id: "lire-7-paraboles", label: "Lire 7 paraboles", description: "Quatorze sont disponibles. Sept suffisent. La patience récompense la modération.", cible: 7 },
      { id: "planter-5-especes", label: "Planter 5 espèces différentes au Jardin", description: "Va sur la page Jardin. Choisis. Plante. Émerveille-toi.", cible: 5 },
    ],
    niveauDebloque: 6,
    recompenseLabel: "Tu deviens Hiérophante Pollinisateur. + 100 graines.",
    recompenseGraines: 100,
  },
  {
    id: 6,
    titre: "Chapitre VI — Le Grand Recensement",
    sousTitre: "On compte, parce que sinon on oublie. Et oublier, c'est le vrai péché.",
    paragrapheOuverture:
      "Le sixième chapitre exige un peu d'arithmétique. Les naturalistes savent que ce qu'on ne compte pas finit par disparaître, et que ce qu'on compte mal devient parfois ministre. Le disciple s'astreint donc, à ce stade, à mesurer son propre impact : combien de pollinisateurs recensés, combien de lignes compostées, combien de fêtes célébrées dans l'année. Frère Pollen, lui, recompte ses recensements trois fois par paranoïa statistique. C'est sain aussi.",
    objectifs: [
      { id: "pac-200-pollinisateurs", label: "Recenser 200 pollinisateurs (cumul)", description: "Toutes parties confondues de la Chasse. Le compteur monte.", cible: 200 },
      { id: "tetris-50-lignes", label: "Composter 50 lignes (cumul des parties)", description: "Tu progresses dans le compost cosmique.", cible: 50 },
      { id: "fetes-2", label: "Célébrer 2 fêtes du Calendrier", description: "Ouvre la fiche d'une fête, lis-la, marque-la célébrée.", cible: 2 },
    ],
    niveauDebloque: 7,
    recompenseLabel: "Tu deviens Apôtre. + 150 graines.",
    recompenseGraines: 150,
  },
  {
    id: 7,
    titre: "Chapitre VII — L'Hérésie Renoncée",
    sousTitre: "Tu n'as toujours pas re-acheté de capsules. C'est noté.",
    paragrapheOuverture:
      "L'apôtre est cette personne qui ne ramène plus de dosettes chez elle. C'est devenu un réflexe. Quand on lui en offre un café, elle accepte par politesse, le boit en silence, et reprend chez elle son moulin manuel et sa cafetière italienne. Elle n'en parle pas. C'est, du point de vue du mycélium, exactement le bon comportement. Faire le bien sans le crier.",
    objectifs: [
      { id: "confessions-15", label: "Confesser 15 péchés écologiques au total", description: "Aucune honte. C'est la trace de ton honnêteté.", cible: 15 },
      { id: "fetes-5", label: "Célébrer 5 fêtes du Calendrier", description: "L'année est rythmée par les fêtes liturgiques.", cible: 5 },
      { id: "planter-12-especes", label: "12 espèces différentes au Jardin", description: "Ton Jardin est presque complet. Les insectes commencent à le repérer.", cible: 12 },
    ],
    niveauDebloque: 8,
    recompenseLabel: "Tu deviens Saint·e Vivant·e. + 200 graines.",
    recompenseGraines: 200,
  },
  {
    id: 8,
    titre: "Chapitre VIII — La Voix Silencieuse",
    sousTitre: "On ne te voit plus. C'est exactement ce que l'on attend de toi.",
    paragrapheOuverture:
      "À ce stade, le disciple a atteint un degré de sobriété rare. Il fait son compost en silence, plante en silence, marche en silence, et n'écrit plus aucun mail commençant par « petit rappel ». Il regarde les autres disciples plus jeunes s'agiter et se rappelle, avec amusement, qu'il a été comme ça. Le Vieux Marcel, qui ne se souvient plus de son nom mais peut identifier 47 espèces de mousses européennes au toucher, hoche la tête en croisant ses pareils.",
    objectifs: [
      { id: "lire-lamentations", label: "Lire intégralement les Lamentations sur la Dosette", description: "Sept élégies. À lire le matin, à voix haute, devant un café filtre.", cible: 7 },
      { id: "pac-niveau-5", label: "Finir la Chasse aux Pollinisateurs niveau 5", description: "Fontainebleau. L'épreuve.", cible: 5 },
      { id: "graines-1000", label: "Atteindre 1000 Graines de Grâce (cumulatif)", description: "Marqueur arbitraire. Mais joli rond.", cible: 1000 },
    ],
    niveauDebloque: 9,
    recompenseLabel: "Tu deviens Mycélium Incarné. + 300 graines + l'Épilogue Secret.",
    recompenseGraines: 300,
  },
  {
    id: 9,
    titre: "Chapitre IX — L'Incarnation",
    sousTitre: "Tu n'es plus toi-même. Mais ce n'est pas un problème.",
    paragrapheOuverture:
      "Le neuvième chapitre n'a plus d'objectifs à atteindre. Tu n'es plus un disciple : tu es devenu·e une partie du réseau. Tu ne lis plus le Livre Sacré : tu es une note de bas de page dans le Livre Sacré. Mère Mycorhize, qui t'a vu·e arriver, hoche imperceptiblement la tête. C'est tout. Aucun feu d'artifice. Aucun diplôme. Juste le filament qui continue, doucement, à travers le sol.",
    objectifs: [],
    niveauDebloque: 9,
    recompenseLabel: "L'Épilogue Secret. Bienvenue.",
    recompenseGraines: 0,
  },
];

export function getChapitre(id: number): Chapitre | undefined {
  return CHAPITRES.find((c) => c.id === id);
}
