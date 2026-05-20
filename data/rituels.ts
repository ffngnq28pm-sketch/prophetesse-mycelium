export interface OfficeRituel {
  id: string;
  nom: string;
  heure: string;
  embleme: string;
  geste: string;
  benediction: string;
  graines: number;
}

export const offices: OfficeRituel[] = [
  {
    id: "matines",
    nom: "Matines",
    heure: "Avant 8h",
    embleme: "✷",
    geste: "Saluer le premier oiseau entendu — silencieusement, en s'arrêtant trois secondes.",
    benediction:
      "Que le chant matinal te lave de la nuit. Que tu retiennes une seule note, et qu'elle te suive tout le jour.",
    graines: 5,
  },
  {
    id: "laudes",
    nom: "Laudes",
    heure: "8h — 10h",
    embleme: "❂",
    geste:
      "Boire un verre d'eau du robinet en pleine conscience, en remerciant les nappes phréatiques.",
    benediction: "Que cette eau te rappelle ta dette envers le sol qui filtre.",
    graines: 3,
  },
  {
    id: "tierce",
    nom: "Tierce",
    heure: "10h — 12h",
    embleme: "✸",
    geste:
      "Ne pas céder à la tentation de la Dosette. Si tu veux du café, mouds-le, infuse-le, attends-le.",
    benediction:
      "Que ta lenteur sacrée fasse honte au métal sans âme. Que le moulin chante pour toi.",
    graines: 7,
  },
  {
    id: "sexte",
    nom: "Sexte",
    heure: "12h — 14h",
    embleme: "☀",
    geste:
      "Manger un repas végétal ou à dominante végétale. Compter les légumes dans l'assiette.",
    benediction:
      "Que ton ventre devienne un compost vivant, et que les pollinisateurs te reconnaissent à l'odeur.",
    graines: 6,
  },
  {
    id: "none",
    nom: "None",
    heure: "14h — 17h",
    embleme: "☼",
    geste:
      "Marcher dix minutes sans regarder l'écran. Observer un être vivant non-humain en chemin.",
    benediction:
      "Que tes pieds t'apprennent ce que tes pouces t'ont fait oublier. Que tu reconnaisses un Plantain.",
    graines: 5,
  },
  {
    id: "vepres",
    nom: "Vêpres",
    heure: "17h — 20h",
    embleme: "✺",
    geste:
      "Observer un être vivant non-humain pendant une minute pleine. Plante, insecte, oiseau, mousse — peu importe.",
    benediction:
      "Que ce vivant te le rende un jour. Tu ne sauras pas comment, mais il te le rendra.",
    graines: 7,
  },
  {
    id: "complies",
    nom: "Complies",
    heure: "Avant le coucher",
    embleme: "☾",
    geste:
      "Éteindre toutes les lumières inutiles. Préférer la pénombre. Dormir tôt si possible.",
    benediction:
      "Que la nuit te reprenne dans ses voiles. Que les Chiroptères passent en paix au-dessus de toi.",
    graines: 5,
  },
];
