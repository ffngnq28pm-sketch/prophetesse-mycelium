export interface Espece {
  id: string;
  nomCommun: string;
  nomLatin: string;
  cout: number;
  rarete: "commune" | "frequente" | "rare" | "tres-rare";
  description: string;
  ecologie: string;
  couleurDominante: string;
}

export const ESPECES: Espece[] = [
  {
    id: "plantain-lanceole",
    nomCommun: "Plantain lancéolé",
    nomLatin: "Plantago lanceolata",
    cout: 10,
    rarete: "commune",
    description: "Le grand percur de bitumes. Pousse partout où le béton fatigue.",
    ecologie: "Indicateur de sols compactés. Apaise piqûres d'ortie et démangeaisons. Tisane sous-estimée.",
    couleurDominante: "#7ea36a",
  },
  {
    id: "trefle-blanc",
    nomCommun: "Trèfle blanc",
    nomLatin: "Trifolium repens",
    cout: 12,
    rarete: "commune",
    description: "Le plus modeste fixateur d'azote du gazon ordinaire. Et accessoirement le préféré des abeilles.",
    ecologie: "Symbiose racinaire avec Rhizobium : nourrit le sol gratuitement. Le contraire d'un engrais chimique.",
    couleurDominante: "#a3bf91",
  },
  {
    id: "luzerne-lupuline",
    nomCommun: "Luzerne lupuline",
    nomLatin: "Medicago lupulina",
    cout: 15,
    rarete: "commune",
    description: "Petites fleurs jaunes sphériques. Pousse dans les terrains vagues sans rien demander.",
    ecologie: "Fixe l'azote, attire les Halictes. Sœur Halicte l'aime, ce qui n'est pas rien.",
    couleurDominante: "#d4a747",
  },
  {
    id: "cardamine-herissee",
    nomCommun: "Cardamine hérissée",
    nomLatin: "Cardamine hirsuta",
    cout: 18,
    rarete: "frequente",
    description: "Minuscule croix blanche. Première à fleurir, dès février.",
    ecologie: "Goût piquant de cresson. Comestible en salade, vitamine C abondante. Discrète mais utile.",
    couleurDominante: "#dfead3",
  },
  {
    id: "pissenlit",
    nomCommun: "Pissenlit officinal",
    nomLatin: "Taraxacum officinale",
    cout: 20,
    rarete: "commune",
    description: "Le soleil jaune que tout le monde arrache, alors que c'est le pharmacien du jardin.",
    ecologie: "Feuilles dépuratives, fleurs vues par 100+ espèces de pollinisateurs. Racine consommable.",
    couleurDominante: "#f0c130",
  },
  {
    id: "bourrache",
    nomCommun: "Bourrache officinale",
    nomLatin: "Borago officinalis",
    cout: 30,
    rarete: "frequente",
    description: "Étoiles bleues, fleurs au goût d'huître. À glisser dans les salades d'été.",
    ecologie: "Mellifère exceptionnelle. Une seule plante peut être visitée 200 fois par jour par les abeilles.",
    couleurDominante: "#5d8fc7",
  },
  {
    id: "marguerite",
    nomCommun: "Marguerite commune",
    nomLatin: "Leucanthemum vulgare",
    cout: 40,
    rarete: "frequente",
    description: "La fleur de tous les Petits Princes. Robuste, joyeuse, sans prétention.",
    ecologie: "Plateforme d'atterrissage idéale pour les syrphes et les coléoptères floricoles.",
    couleurDominante: "#f4ecd2",
  },
  {
    id: "achillee",
    nomCommun: "Achillée millefeuille",
    nomLatin: "Achillea millefolium",
    cout: 50,
    rarete: "frequente",
    description: "Feuilles découpées en mille filaments. Connue depuis Achille pour soigner les plaies.",
    ecologie: "Hôte de nombreux insectes utiles : chrysopes, coccinelles, microhyménoptères.",
    couleurDominante: "#e8e5c8",
  },
  {
    id: "coquelicot",
    nomCommun: "Coquelicot des champs",
    nomLatin: "Papaver rhoeas",
    cout: 80,
    rarete: "rare",
    description: "Le rouge le plus pur du paysage français. Floraison d'un jour, intensité d'une vie.",
    ecologie: "Pollen abondant, peu de nectar : terrain de chasse pour les abeilles sauvages collectrices.",
    couleurDominante: "#d12d2d",
  },
  {
    id: "bleuet",
    nomCommun: "Bleuet des moissons",
    nomLatin: "Centaurea cyanus",
    cout: 100,
    rarete: "rare",
    description: "Bleu indigo absolu, devenu rare dans les cultures intensives. Quand il revient, c'est un signe.",
    ecologie: "Indicateur de pratiques agricoles douces. Nectar de qualité pour bourdons et papillons.",
    couleurDominante: "#3f5fa6",
  },
  {
    id: "mauve",
    nomCommun: "Mauve des bois",
    nomLatin: "Malva sylvestris",
    cout: 150,
    rarete: "rare",
    description: "Pétales striés violets, mucilage adoucissant. Les Romains la mangeaient en salade.",
    ecologie: "Hôte de la chenille du papillon Carcharodus alceae. Refuge pour micro-hyménoptères.",
    couleurDominante: "#9358a1",
  },
  {
    id: "veronique-acinus",
    nomCommun: "Véronique à feuilles d'acinus",
    nomLatin: "Veronica acinifolia",
    cout: 200,
    rarete: "tres-rare",
    description: "Espèce protégée nationalement. Quatre pétales bleus minuscules sur un sol nu.",
    ecologie: "Indicateur de pelouses sèches à protéger. Quand elle pousse chez toi, ne tonds plus.",
    couleurDominante: "#7eb2dc",
  },
];

export function getEspece(id: string): Espece | undefined {
  return ESPECES.find((e) => e.id === id);
}
