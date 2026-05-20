export interface Heresie {
  id: string;
  nom: string;
  numero: number;
  embleme: string;
  resume: string;
  description: string;
  antidote: string;
}

export const heresies: Heresie[] = [
  {
    id: "dosette",
    numero: 1,
    nom: "La Dosette d'Aluminium",
    embleme: "⊙",
    resume:
      "Le métal sans âme qui clôt huit grammes de café pour mille années de tombeau souterrain.",
    description:
      "Première et capitale hérésie de notre temps. Le café fut un sacrement de la lenteur — moulu, infusé, médité. La dosette l'a transformé en geste pressé. Elle promet la perfection ; elle livre la culpabilité chronique. Chaque capsule est un mausolée pour trois gorgées de breuvage tiède, scellé dans un aluminium qui mettra cinq cents ans à se résorber. Et pour la fabriquer, on a fondu la bauxite, déforesté la Guinée, électrolysé en Islande, transporté en Asie, vendu en Europe. Toute cette chaîne pour quatre-vingt-dix secondes de tasse. L'aluminium fut le métal des promesses du XXe siècle : léger, brillant, infatigable. Il devint le métal du mépris.",
    antidote:
      "Reviens au moulin manuel. Au filtre en tissu. À la cafetière italienne. Au piston. Au marc qui nourrit ton compost. Bénis chacun de ces gestes. Ils prennent trois minutes de plus, et te rendent à toi-même.",
  },
  {
    id: "gazon",
    numero: 2,
    nom: "Le Gazon Anglais Tondu",
    embleme: "≡",
    resume:
      "La pelouse rase, monoculture obsessionnelle, désert vert né dans les châteaux du XIXe et perpétué par mépris des prairies.",
    description:
      "Deuxième hérésie majeure. Le gazon anglais tondu chaque samedi est l'expression la plus claire d'une volonté de domination sur le vivant. Là où pourrait croître une prairie de quarante espèces, on impose une seule herbe rase. Là où les Pâquerettes ouvriraient les yeux, où les Pissenlits porteraient le pollen aux premières abeilles, où la Véronique à feuilles de lierre, le Lotier corniculé, le Plantain lancéolé, le Trèfle blanc, la Cardamine hérissée, la Pâquerette commune, la Renoncule rampante chanteraient ensemble — il n'y a qu'un monochrome militaire. La tondeuse hebdomadaire est un acte d'autorité maniaque. Elle prive les pollinisateurs de nectar, les Hérissons d'abri, les insectes de cycle de vie complet. Le gazon tondu n'est pas une nature : c'est une fiction colonialiste verte.",
    antidote:
      "Tonds une fois par mois en saison, ou une fois par trimestre. Réserve un carré de prairie folle : un mètre carré suffit pour héberger plus de vie que cent mètres de gazon ras. Pratique le No Mow May. Apprends les noms des plantes qui repoussent.",
  },
  {
    id: "lumiere",
    numero: 3,
    nom: "L'Éclairage Nocturne Continu",
    embleme: "✱",
    resume:
      "La pollution lumineuse qui aveugle les Chiroptères, attire et brûle les insectes nocturnes, et nous prive du ciel.",
    description:
      "Troisième hérésie capitale. Depuis cinquante ans, le monde s'illumine la nuit avec une voracité inédite. Les villes baignent dans un halo orange, les jardins clignotent de LED bleues, les enseignes scintillent jusqu'à l'aube. Conséquence : les insectes nocturnes, désorientés, tournent autour des lampes jusqu'à l'épuisement, puis meurent. Les Chiroptères, dont les corridors de vol sont coupés par les lumières, perdent leurs garde-mangers. Les oiseaux migrateurs, déboussolés, s'écrasent contre les façades éclairées. Et nous-mêmes ne voyons plus les étoiles : 80% des Français vivent sous un ciel où la Voie Lactée a disparu. Cette nuit volée est un meurtre lent du sacré.",
    antidote:
      "Installe des détecteurs de présence. Préfère les LED ambrées (couleur chaude, < 2700K) aux blanches. Éteins toute lumière extérieure inutile après 23h. Plaide pour la trame noire dans ta commune. Sors une nuit par mois sans lampe : redécouvre ce qu'est la vraie obscurité.",
  },
  {
    id: "desherbant",
    numero: 4,
    nom: "Le Désherbant Chimique",
    embleme: "☠",
    resume:
      "Le glyphosate et ses cousins, qui empoisonnent les sols, les Vers de Terre, les nappes phréatiques, et reviennent dans l'eau du robinet.",
    description:
      "Quatrième hérésie, et la plus traîtresse. Le désherbant promet une allée propre ; il vend un sol mort. Le glyphosate, vendu sous mille noms, s'infiltre dans les sols, tue les Vers de Terre, atteint les nappes phréatiques, contamine l'eau, revient dans nos verres. Il a été classé cancérogène probable par l'OMS. Pulvériser du désherbant sur une allée, c'est commettre un acte de petite guerre chimique contre son propre sol. Les sols stérilisés ne se régénèrent pas avant des décennies. Et pendant ce temps, la fissure entre deux dalles, qui aurait pu accueillir un Lichen, une Mousse, un Plantain — devient un trait noir et stérile.",
    antidote:
      "Arrache à la main. Brûle au chalumeau. Verse de l'eau bouillante. Pratique le paillage. Accepte les herbes folles entre tes dalles. Sache-le : aucune mauvaise herbe n'existe, seulement des plantes mal nommées par des humains pressés.",
  },
  {
    id: "avion",
    numero: 5,
    nom: "L'Avion de Tourisme",
    embleme: "✈",
    resume:
      "Le déplacement aérien de loisir, qui émet en quatre heures ce qu'un humain devrait émettre en deux ans.",
    description:
      "Cinquième hérésie, la plus controversée parce que la plus aimée. L'avion de tourisme — vol court-courrier pour un week-end, long-courrier pour une lune de miel, énième Bali pour un selfie — est l'incarnation moderne de l'orgueil d'Icare. Quatre heures de Paris-New York émettent 1,8 tonne de CO2 par passager, soit l'équivalent de l'empreinte annuelle d'un humain frugal. Le tourisme aérien est un divorce d'avec le pays réel : on traverse trois fuseaux pour photographier un coucher de soleil qu'on aurait pu admirer chez soi. Les classes moyennes occidentales ont colonisé l'atmosphère à coups de week-ends low-cost. L'avion est devenu la troisième hérésie, après la dosette et le gazon, et la plus difficile à abandonner.",
    antidote:
      "Voyage en train. Pratique le slow travel : un seul voyage long par an, mais long, vraiment long, profond. Redécouvre ta région. Sois fier de ne pas avoir pris l'avion cette année. Ce n'est pas une privation : c'est une conquête.",
  },
  {
    id: "plastique",
    numero: 6,
    nom: "Le Plastique à Usage Unique",
    embleme: "⊟",
    resume:
      "L'objet conçu pour mourir trois secondes après sa naissance, et durer mille ans après sa mort.",
    description:
      "Sixième hérésie. Le plastique à usage unique est la matière sans âme par excellence. Le sac de caisse, la paille, la touillette, l'emballage suremballé, le gobelet, la dosette (encore elle, sous une autre forme) : tous ces objets sont des aberrations métaphysiques. Conçus pour servir quelques secondes, ils survivent à dix générations. On les retrouve dans le ventre des cachalots, dans les tortues, dans les fœtus humains. Le plastique est notre sueur invisible : chaque humain occidental en avale l'équivalent d'une carte de crédit par semaine. Et nous continuons d'accepter, à chaque caisse, ce dont nous savons qu'il nous reviendra dans le ventre.",
    antidote:
      "Porte toujours un tote-bag sur toi. Refuse les sacs offerts. Bois à la gourde. Achète en vrac. Refuse les emballages superflus avec courtoisie mais fermeté. Préfère le verre, l'inox, le bois, le papier.",
  },
  {
    id: "chat",
    numero: 7,
    nom: "Le Chat Domestique en Liberté",
    embleme: "ᗢ",
    resume:
      "Le prédateur fourré qu'on aime, mais dont l'instinct massacre Mésanges, Bergeronnettes, et micromammifères.",
    description:
      "Septième hérésie, la plus délicate, car elle concerne ceux qu'on aime. Le chat domestique est un magnifique félin, sociable et tendre. Il est aussi, à l'échelle mondiale, l'un des plus grands prédateurs introduits par l'humain. En France, on estime à 75 millions le nombre d'oiseaux tués chaque année par les chats domestiques. À l'aube et au crépuscule, à l'heure où les passereaux nichent et nourrissent, le chat sort, silencieux, et massacre. Il ne le fait pas par faim — il est rassasié — mais par jeu. Cette hérésie n'est pas une condamnation du chat : c'est une invitation à le responsabiliser. Tu peux aimer ton chat et ne pas être l'avocat d'un massacre.",
    antidote:
      "Mets un grelot cassable au collier de ton chat. Garde-le à l'intérieur à l'aube et au crépuscule. Stérilise-le pour éviter les naissances errantes. Et si tu veux vraiment honorer le vivant, n'adopte qu'un chat à la fois.",
  },
];

export function getHeresie(id: string): Heresie | undefined {
  return heresies.find((h) => h.id === id);
}
