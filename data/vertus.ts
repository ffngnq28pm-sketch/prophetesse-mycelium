export interface Vertu {
  id: string;
  numero: number;
  nom: string;
  embleme: string;
  resume: string;
  description: string;
  exercice: string;
}

export const vertus: Vertu[] = [
  {
    id: "patience-lichen",
    numero: 1,
    nom: "La Patience du Lichen",
    embleme: "✺",
    resume: "Croître un millimètre par an, et chanter quand même.",
    description:
      "Le Lichen est notre maître premier. Symbiose entre un champignon et une algue, il croît d'un millimètre par an et vit cent ans. Il ne fleurit pas, il ne se vante pas, il ne fait pas de bruit. Il colonise les pierres tombales, les troncs nus, les rochers, là où aucune autre vie ne pourrait s'installer. Le Lichen enseigne que la grandeur n'a rien à voir avec la vitesse. Que la durée vaut mieux que l'éclat. Que l'on peut transformer un mur en habitat sans jamais réclamer son dû. Sois Lichen.",
    exercice:
      "Choisis un Lichen visible (sur un mur, un arbre, une pierre tombale). Visite-le tous les premiers du mois. Photographie-le. À la fin de l'année, regarde s'il a grandi. Note ce que tu as ressenti.",
  },
  {
    id: "humilite-mycelium",
    numero: 2,
    nom: "L'Humilité du Mycélium",
    embleme: "❋",
    resume: "Nourrir la forêt sans jamais réclamer son nom.",
    description:
      "Sous chaque forêt, un réseau invisible de filaments souterrains transporte du sucre des arbres adultes vers les jeunes pousses, signale les attaques d'insectes, redistribue les ressources. Ce réseau, c'est le mycélium. On ne le voit jamais. Il ne fleurit pas. Il ne demande rien. Et pourtant, sans lui, plus rien ne tient. L'humilité du Mycélium est de servir sans signature. De relier sans publier. De nourrir l'invisible. Apprends à agir sans que personne le sache. C'est la plus haute des actions.",
    exercice:
      "Fais cette semaine trois bonnes actions écologiques sans en parler à personne, sans les publier, sans en garder trace. Ramasse un déchet en silence. Plante une graine sans le dire. Aide quelqu'un sans signer.",
  },
  {
    id: "constance-herisson",
    numero: 3,
    nom: "La Constance du Hérisson",
    embleme: "✦",
    resume: "Retraverser la route mille fois, et ne renoncer jamais.",
    description:
      "Le Hérisson parcourt chaque nuit jusqu'à deux kilomètres pour se nourrir. Il traverse haies, jardins, et — trop souvent — routes. Il est écrasé par centaines de milliers chaque année en France. Et pourtant, ceux qui survivent recommencent. Toutes les nuits. Sans renoncer. Sans bruit. La constance du Hérisson est cette obstination tranquille qui ne fait pas de programme révolutionnaire : elle continue, simplement. Sois Hérisson : chaque nuit, retraverse ta route, fais ton mètre carré, refuse de t'arrêter.",
    exercice:
      "Choisis un geste minuscule (composter une épluchure, débrancher un appareil, prendre un sac réutilisable) et fais-le chaque jour pendant trente jours. Ne te félicite pas. Recommence.",
  },
  {
    id: "generosite-fleur",
    numero: 4,
    nom: "La Générosité de la Fleur Entomogame",
    embleme: "❀",
    resume: "Tendre son nectar à tout passant ailé.",
    description:
      "Une fleur entomogame est une fleur pollinisée par les insectes. Elle ne choisit pas son visiteur. Elle ne demande pas s'il est de bonne famille. Elle offre son nectar à l'Halicte, à l'Anthidie, à la Mégachile, au Bourdon, au Papillon, au Syrphe, à la Mouche poilue. Tous sont bienvenus. La fleur entomogame nous enseigne la générosité aveugle : donner sans choisir le destinataire, donner sans contrôler l'usage, donner parce qu'on est en floraison. Sois fleur.",
    exercice:
      "Cette semaine, fais un don ou un service à quelqu'un que tu connais à peine. Sans calcul. Sans attente. Une plante donnée, un coup de main offert, une connaissance partagée.",
  },
  {
    id: "lenteur-ver",
    numero: 5,
    nom: "La Lenteur du Ver de Terre",
    embleme: "〰",
    resume: "Se traîner, et refaire le monde.",
    description:
      "Le Ver de Terre est notre quatrième maître. Lent, aveugle, silencieux, il ingère chaque jour son propre poids de terre, qu'il digère et restitue sous forme de compost. Un hectare de prairie en abrite jusqu'à deux tonnes. Sans lui, pas de sol fertile, pas de drainage, pas de cycle de l'azote. Le Ver de Terre nous enseigne que la transformation lente vaut mieux que la révolution. Que le sol se refait par le bas. Que la lenteur, longtemps répétée, fait des montagnes.",
    exercice:
      "Compose un compost. Si tu n'as pas de jardin, trouve un point de compostage public. Observe ta matière organique se transformer pendant six mois. C'est ton enseignement.",
  },
  {
    id: "discretion-chiroptere",
    numero: 6,
    nom: "La Discrétion du Chiroptère",
    embleme: "ᘛ",
    resume: "Servir la nuit sans qu'aucun œil ne le sache.",
    description:
      "Les Chiroptères (chauves-souris) sont les ouvriers silencieux de la nuit. Une Pipistrelle commune mange jusqu'à 3 000 moustiques par nuit. Un seul couple peut débarrasser un jardin de ses chenilles processionnaires. Et personne ne les voit. Personne ne les remercie. Elles ne nichent que dans nos angles oubliés : combles, volets, vieilles granges. Si nous les chassons, nous chassons notre propre tranquillité nocturne. La discrétion du Chiroptère nous enseigne à servir sans visibilité, à protéger sans applause.",
    exercice:
      "Installe un gîte à Chiroptères chez toi (ou demande à un proche qui peut le faire). Apprends à les distinguer en vol. Sors un soir de juillet et regarde le ciel à la tombée de la nuit.",
  },
  {
    id: "joie-pollen",
    numero: 7,
    nom: "La Joie du Pollen",
    embleme: "✶",
    resume: "Partir au vent sans savoir où, et fleurir là où l'on tombe.",
    description:
      "Septième vertu, la plus aérienne. Le Pollen est un grain de vie microscopique qui part au vent ou sur la patte d'un insecte sans savoir où il va. Il accepte le hasard absolu. Et là où il tombe — sur le pistil d'une fleur lointaine, sur un sol propice — il s'enracine et devient. Le Pollen nous enseigne la joie du lâcher-prise écologique : nous ne contrôlons pas les conséquences de nos gestes. Nous donnons. Nous semons. Nous lâchons. Et nous faisons confiance.",
    exercice:
      "Jette des graines de fleurs sauvages dans une friche, un talus, un coin abandonné de ta ville. Ne reviens pas vérifier avant trois mois. Laisse le hasard fleurir.",
  },
];

export function getVertu(id: string): Vertu | undefined {
  return vertus.find((v) => v.id === id);
}
