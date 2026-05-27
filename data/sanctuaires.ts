export interface Sanctuaire {
  id: string;
  nom: string;
  commune: string;
  x: number;
  y: number;
  superficie: string;
  description: string;
  especes: string;
  pelerinage: string;
  anecdote: string;
}

export const sanctuaires: Sanctuaire[] = [
  {
    id: "pere-lachaise",
    nom: "Père-Lachaise",
    commune: "Paris XXe",
    x: 540,
    y: 280,
    superficie: "44 hectares",
    description:
      "Le grand cimetière fondateur de l'Ordre. Vaste forêt urbaine sur les hauteurs de Belleville, le Père-Lachaise abrite des centaines d'arbres centenaires, des Renards roux, des Pigeons ramiers, des Chouettes hulottes, et des dizaines d'espèces de Lichens. C'est ici que la Sainte Mycélienne tient ses dévotions du onze novembre.",
    especes:
      "Marronnier, Tilleul, Hêtre, Érable sycomore, Lierre grimpant, Renard roux, Pigeon ramier, Chouette hulotte, Lichens en abondance.",
    pelerinage:
      "Entrée principale boulevard de Ménilmontant. Marcher dans la division 76 où dorment les premiers compostiers oubliés. Ne pas se presser. S'arrêter à la tombe d'une inconnue.",
    anecdote:
      "On raconte qu'un gardien du Père-Lachaise, qui prend sa retraite dans dix-huit mois, sait par cœur le nom latin de chaque arbre du cimetière. Il ne l'a jamais dit à personne. Il les nomme à voix basse en passant devant eux, le matin, quand il fait sa tournée. C'est, selon les chroniqueurs de l'Ordre, la plus haute liturgie laïque qui se pratique dans Paris.",
  },
  {
    id: "montparnasse",
    nom: "Montparnasse",
    commune: "Paris XIVe",
    x: 440,
    y: 350,
    superficie: "19 hectares",
    description:
      "Cimetière plus minéral, mais riche en allées arborées et en stèles couvertes de Mousses sciaphiles. Le sol y est compacté, mais le sous-bois urbain abrite encore des Hérissons et des Grives musiciennes au matin.",
    especes:
      "Marronnier, Cèdre du Liban, Cyprès, Buis, Mousse Hypnum, Hérisson d'Europe, Grive musicienne.",
    pelerinage:
      "Entrer par la rue Émile-Richard. Saluer la tombe de Beckett. Marcher en silence pendant vingt minutes minimum. Repérer un Lichen jaune (Xanthoria) sur une dalle.",
    anecdote:
      "Beckett, qui repose au carré 12, n'a jamais écrit un mot sur les Lichens. C'est, observait Sœur Compost, à peu près la seule chose qu'il n'ait pas écrite. On peut s'asseoir sur le banc qui lui fait face et lui adresser silencieusement la liste des espèces qu'il a manquées. Il prendra cela, dit-on, avec la patience qui le caractérisait — laquelle ressemble assez à celle d'un Lichen.",
  },
  {
    id: "bagneux",
    nom: "Cimetière parisien de Bagneux",
    commune: "Bagneux (92)",
    x: 420,
    y: 480,
    superficie: "62 hectares",
    description:
      "L'un des plus vastes cimetières d'Île-de-France. La gestion différenciée y est avancée : carrés non fauchés en mai, fauche tardive, refuge de biodiversité reconnu par la LPO. Sanctuaire majeur de l'Ordre.",
    especes:
      "Prairies fauches tardives, Halictes femelles, Bourdon terrestre, Hérisson d'Europe, Orchidées du genre Ophrys signalées, Pic épeiche.",
    pelerinage:
      "Carré 28, samedi matin de juin. Apporter un carnet. Compter les espèces florales sur un mètre carré. Y rester une heure. La Marcheuse, dit-on, y passe parfois.",
    anecdote:
      "Au printemps 2017, le service municipal a interrompu la fauche du carré 28 pendant cinq semaines, à la demande discrète d'un naturaliste local. On a compté quarante-sept espèces de plantes à fleurs sur dix mètres carrés. Le service en a tiré une note interne. La note s'est perdue. La pratique, elle, a survécu — l'une des spécificités des bonnes pratiques étant qu'elles n'ont pas besoin de note pour exister.",
  },
  {
    id: "pantin",
    nom: "Cimetière parisien de Pantin",
    commune: "Pantin (93)",
    x: 600,
    y: 240,
    superficie: "107 hectares",
    description:
      "Le plus grand cimetière d'Île-de-France. Véritable réserve biologique en pleine ceinture périurbaine. Couloir de migration pour les passereaux. Compté par la SNHF parmi les hauts lieux floristiques.",
    especes:
      "Rouge-gorge, Mésange charbonnière, Renard roux, Hérisson, Plantain lancéolé, Cardamine hérissée, Pâquerette commune, Vipérine commune.",
    pelerinage:
      "Avenue Édouard-Vaillant. Marcher d'est en ouest, lentement, à 7h du matin. Écouter le concert matinal. Ne parler à personne.",
    anecdote:
      "Frère Lichen y vient depuis vingt-deux ans pour photographier les Lichens crustacés des stèles anciennes. Il a recensé cent quatre espèces, ce qui est, à sa connaissance, le record francilien — record qu'il n'a déclaré à aucune autorité botanique, par méfiance des autorités en général. Ses photographies sont rangées dans un carton sous son lit. Il a fait promettre à sa nièce de tout brûler quand il mourra. La nièce a promis. Elle ne tiendra pas parole.",
  },
  {
    id: "thiais",
    nom: "Cimetière parisien de Thiais",
    commune: "Thiais (94)",
    x: 540,
    y: 540,
    superficie: "103 hectares",
    description:
      "Vaste nécropole en bordure de l'Aéroport d'Orly. Paradoxe sacré : zone de calme face au tumulte aérien. Carrés végétalisés étendus. Abrite la stèle des anonymes.",
    especes:
      "Pelouses sèches, Lézard des murailles, Halicte cordée, Anthidie cotonneuse, Tilleul.",
    pelerinage:
      "Stèle des morts isolés. Y déposer mentalement une fleur de Tilleul. Réciter la Lamentation 4 sur la Dosette.",
    anecdote:
      "À chaque atterrissage à Orly, un Airbus passe à cent cinquante mètres au-dessus du carré des anonymes. Les Lézards des murailles, qu'on croirait dérangés, ne le sont pas : ils ont appris à ignorer le bruit comme un humain finit par ignorer le sien. C'est, prétend Mère Mycorhize, le miracle écologique le plus discret de la région — une zone qui devrait être un enfer sonore et qui n'est, en pratique, qu'une grande prairie qui n'écoute personne.",
  },
  {
    id: "gentilly",
    nom: "Cimetière de Gentilly",
    commune: "Gentilly (94)",
    x: 500,
    y: 410,
    superficie: "9 hectares",
    description:
      "Petit cimetière intramuros, fortement végétalisé par les associations locales. La gestion différenciée y est exemplaire. C'est un des hauts lieux d'enseignement de l'Ordre pour les nouveaux disciples.",
    especes:
      "Renoncule rampante, Pâquerette, Plantain, Trèfle blanc, Lierre, Hérisson, Mésange bleue.",
    pelerinage:
      "Entrée principale. Lire un Verset à voix basse devant le plus vieux Tilleul. Compter trois espèces d'oiseaux entendues.",
    anecdote:
      "Une association de quartier y a planté, en 2019, un Tilleul que personne n'avait commandé. Personne ne l'a non plus retiré. Six ans plus tard, le Tilleul fait trois mètres, et les enfants de l'école d'à côté viennent y déjeuner en juin. C'est, prétendent les chroniques de l'Ordre, l'unique exemple connu où l'inaction administrative a produit un bien public — ce qui mériterait une étude sociologique qu'aucun sociologue n'a entreprise.",
  },
  {
    id: "saint-ouen",
    nom: "Cimetière de Saint-Ouen",
    commune: "Saint-Ouen-sur-Seine (93)",
    x: 470,
    y: 200,
    superficie: "11 hectares",
    description:
      "Petit sanctuaire urbain riche en oiseaux migrateurs. Les vieux Marronniers attirent les Pics. Les murs anciens portent des Lichens crustacés rares en agglomération parisienne.",
    especes:
      "Pic vert, Pic épeiche, Sittelle torchepot, Lichens crustacés, Marronnier d'Inde.",
    pelerinage:
      "Aller en automne. Récolter mentalement une feuille de Marronnier. La méditer.",
    anecdote:
      "Un Pic vert y vit depuis au moins onze ans. C'est, à l'échelle des Pics, une vie longue. Il tambourine chaque matin sur le même Marronnier, à la même heure, sur le même rythme. Le gardien-chef, qui a soixante-deux ans, dit qu'il prendra sa retraite quand le Pic prendra la sienne. Le Pic n'a pas signalé d'intention en ce sens, et les deux continuent leur compagnonnage tacite.",
  },
  {
    id: "ivry",
    nom: "Cimetière parisien d'Ivry",
    commune: "Ivry-sur-Seine (94)",
    x: 540,
    y: 410,
    superficie: "28 hectares",
    description:
      "En bordure de Seine, ce cimetière abrite une faune semi-aquatique discrète. Les talus humides accueillent des grenouilles vertes au printemps. Les Hirondelles rustiques y nichent encore.",
    especes:
      "Grenouille verte, Hirondelle rustique, Roseau commun, Saule blanc, Aulne glutineux.",
    pelerinage:
      "Printemps. S'asseoir sur un banc et attendre vingt minutes. Compter les passages d'Hirondelles.",
    anecdote:
      "Les Hirondelles rustiques d'Ivry sont, statistiquement, les plus tenaces de la région — elles reviennent depuis l'Afrique du Sud chaque printemps pour nicher sous le même auvent de chapelle funéraire, depuis au moins quatorze générations. La chapelle a été repeinte une fois. Les Hirondelles ont attendu trois jours, puis reconsidéré, et adopté la nouvelle peinture. Une Hirondelle, observait Sœur Halicte, fait preuve d'un pragmatisme architectural que beaucoup d'urbanistes lui envieraient.",
  },
];
