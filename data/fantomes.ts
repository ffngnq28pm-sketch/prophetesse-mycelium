export type FantomeAI = "lent" | "anticipateur" | "erratique" | "patrouille";

export interface Fantome {
  id: string;
  nom: string;
  couleur: string;
  couleurSecondaire: string;
  ai: FantomeAI;
  backstory: string[];
  defaitPhrase: string[];
}

export const FANTOMES: Fantome[] = [
  {
    id: "cendrillon",
    nom: "Sieur Cendrillon",
    couleur: "#8aa0b8",
    couleurSecondaire: "#5e7591",
    ai: "lent",
    backstory: [
      "Ancien jardinier-chef du cimetière du Père-Lachaise, mort en 1923 en glissant sur une feuille d'érable mouillée du carré 12.",
      "Continue, depuis, de balayer mentalement les allées qu'il connaissait, et de murmurer aux Tilleuls les bonjours qu'il ne dit plus à personne.",
      "Poursuit la Marcheuse avec un mélange de tendresse et de regret, parce qu'elle lui rappelle sa fille — laquelle, dans son souvenir, avait neuf ans pour toujours.",
      "Trait de caractère : ne se presse jamais. La précipitation, dit-il, est le meilleur moyen de glisser sur une feuille d'érable.",
    ],
    defaitPhrase: [
      "Pardon, pardon, je voulais juste vous saluer.",
      "Excusez-moi, c'est l'habitude.",
      "Je retourne balayer mes allées, alors.",
    ],
  },
  {
    id: "precieuse",
    nom: "Dame Précieuse",
    couleur: "#c8a0e0",
    couleurSecondaire: "#9070b0",
    ai: "anticipateur",
    backstory: [
      "Dame de la haute société parisienne, morte en 1890 d'une indigestion de pâté de foie pendant un bal qu'elle organisait à Versailles — ou du moins, le croyait-elle.",
      "Reste convaincue d'être au XIXᵉ siècle, et que les vivants devraient lui céder le passage par respect du protocole.",
      "Sa tactique consiste à anticiper la trajectoire de la Marcheuse comme on anticipe celle d'un commensal mal élevé : par en dessous.",
      "Anticipe trop, ce qui — comme toute personne qui anticipe trop — lui fait souvent rater sa cible. Le snobisme, en mouvement, est une stratégie médiocre.",
    ],
    defaitPhrase: [
      "Mes hommages, je vous laisse !",
      "C'est inadmissible, mais c'est ainsi.",
      "Je note votre nom, mademoiselle.",
    ],
  },
  {
    id: "marcel",
    nom: "Petit Marcel",
    couleur: "#a0d0a0",
    couleurSecondaire: "#70a070",
    ai: "erratique",
    backstory: [
      "Mort à neuf ans en 1957 d'un chagrin de hamster perdu, et accessoirement d'une bronchite que personne n'avait soignée.",
      "Suit la Marcheuse parce qu'il aimerait vraiment, vraiment être son ami, mais il ne sait pas comment s'y prendre.",
      "S'arrête parfois pour regarder une fleur, ou pour compter les fissures dans un mur, ou simplement pour rêver.",
      "Reprend toujours sa course après quelques secondes, parce qu'il n'aime pas être seul.",
    ],
    defaitPhrase: [
      "On joue encore tout à l'heure ?",
      "Hihi, j'ai même pas eu mal !",
      "Je vais voir si y a des fleurs.",
    ],
  },
  {
    id: "innomme",
    nom: "L'Innommé",
    couleur: "#404040",
    couleurSecondaire: "#1a1a1a",
    ai: "patrouille",
    backstory: [
      "Personne ne se souvient de son nom. Lui non plus.",
      "On suppose qu'il fut quelqu'un d'important, ou peut-être pas. Les rumeurs varient selon les soirs.",
      "Patrouille sans but apparent, jusqu'à ce que la Marcheuse approche de la victoire — et là, il devient brutal, sans qu'on sache pourquoi.",
      "Quelques disciples murmurent qu'il fut un PDG du XXᵉ siècle. Personne ne le confirme. Lui non plus, parce qu'il ne sait pas.",
    ],
    defaitPhrase: [
      "Qui ? Moi ? Qui ?",
      "…",
      "On verra bien.",
    ],
  },
];

export function getFantome(id: string): Fantome | undefined {
  return FANTOMES.find((f) => f.id === id);
}
