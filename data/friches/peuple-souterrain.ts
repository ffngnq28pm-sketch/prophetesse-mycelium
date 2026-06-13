import type { Faculte } from "./index";

// Faculté 1 — Le Peuple Souterrain. Écologie réelle, vérifiable, habillée
// discrètement du langage de l'Ordre. Aucune surinterprétation présentée comme
// un fait (cf. leçon 1.3 sur le « Wood Wide Web »).
export const peupleSouterrain: Faculte = {
  id: "peuple-souterrain",
  titre: "Le Peuple Souterrain",
  resume:
    "Sous nos pieds vit un peuple immense et discret. Avant de marcher sur la friche, apprends qui la tient debout : mycélium, mycorhizes, et le vrai réseau racinaire.",
  lecons: [
    {
      id: "1-1",
      titre: "Le champignon n'est que la pointe",
      epigraphe: "Ce qui nourrit n'a pas besoin d'être vu.",
      corps: [
        "Quand tu vois un champignon pousser dans l'herbe, tu ne vois presque rien de lui. Le chapeau et le pied ne sont que l'organe de reproduction — l'équivalent d'un fruit. L'essentiel est sous terre : un réseau de filaments très fins, blancs, ramifiés, appelé le mycélium. Chacun de ces filaments est une hyphe. Réunies, les hyphes peuvent s'étendre sur des mètres, parfois des hectares, en une trame continue.",
        "Le rôle de ce réseau est capital : beaucoup de champignons sont des décomposeurs (saprotrophes). Ils digèrent la matière organique morte — feuilles tombées, bois, racines — et la transforment en éléments simples que le sol peut réutiliser. Sans eux, les forêts s'étoufferaient sous leurs propres déchets. Le champignon que tu cueilles est donc le sommet visible d'un vaste travail de recyclage invisible.",
        "À retenir : le champignon visible est l'organe reproducteur ; le véritable organisme est le mycélium, sous terre.",
      ],
      quiz: [
        {
          q: "Le mycélium, c'est :",
          options: [
            "le chapeau du champignon",
            "le réseau de filaments souterrains",
            "une variété de mousse",
          ],
          correct: 1,
          explication:
            "Le mycélium est l'appareil végétatif du champignon, fait d'hyphes ; le chapeau n'est que l'organe de reproduction.",
        },
        {
          q: "Un champignon « décomposeur » :",
          options: [
            "fabrique de l'oxygène par photosynthèse",
            "recycle la matière organique morte",
            "se nourrit uniquement de roche",
          ],
          correct: 1,
          explication:
            "Les saprotrophes digèrent la matière morte et la rendent au sol — un maillon clé du recyclage.",
        },
        {
          q: "Un filament de mycélium s'appelle :",
          options: ["une hyphe", "une spore", "un lichen"],
          correct: 0,
          explication:
            "Les hyphes sont les filaments ; assemblées, elles forment le mycélium ; la spore est l'unité de dispersion.",
        },
      ],
    },
    {
      id: "1-2",
      titre: "Les mycorhizes : l'alliance sous nos pieds",
      epigraphe: "Donner pour recevoir : la plus vieille économie du monde.",
      corps: [
        "Tous les champignons ne décomposent pas. Beaucoup vivent en symbiose avec les plantes, dans une association appelée mycorhize (du grec mukês, champignon, et rhiza, racine). Le mycélium s'unit aux racines : il prolonge leur portée comme un immense système de capteurs.",
        "L'échange est mutuel et mesurable. Le champignon explore le sol bien au-delà de ce que les racines atteignent et fournit à la plante de l'eau et des minéraux (notamment le phosphore, souvent difficile à capter). En retour, la plante, qui sait faire la photosynthèse, lui cède une part des sucres qu'elle produit grâce à la lumière. Chacun apporte ce que l'autre ne sait pas faire seul.",
        "Cette alliance n'est pas une curiosité de spécialiste : la grande majorité des plantes terrestres forment des mycorhizes. Elle est l'une des plus anciennes du vivant — elle a probablement aidé les premières plantes à coloniser la terre ferme, il y a des centaines de millions d'années.",
        "À retenir : la mycorhize est un échange gagnant-gagnant — minéraux et eau contre sucres — dont dépend l'immense majorité des plantes.",
      ],
      quiz: [
        {
          q: "Une mycorhize est :",
          options: [
            "une maladie des racines",
            "une symbiose entre un champignon et une racine",
            "un type de graine",
          ],
          correct: 1,
          explication:
            "Le mot unit « champignon » et « racine » ; c'est une association à bénéfice mutuel.",
        },
        {
          q: "Dans cet échange, la plante apporte surtout :",
          options: ["des sucres issus de la photosynthèse", "du phosphore", "de l'eau"],
          correct: 0,
          explication:
            "La plante fournit les sucres ; c'est le champignon qui apporte eau et minéraux comme le phosphore.",
        },
        {
          q: "Les mycorhizes concernent :",
          options: [
            "quelques plantes rares",
            "la grande majorité des plantes terrestres",
            "uniquement les arbres",
          ],
          correct: 1,
          explication: "C'est une association très répandue, des herbes aux arbres, et très ancienne.",
        },
      ],
    },
    {
      id: "1-3",
      titre: "Le « réseau », et ce qu'on en sait vraiment",
      epigraphe: "Voir un fil, ce n'est pas comprendre ce qui y circule.",
      corps: [
        "Un même mycélium peut relier les racines de plusieurs plantes voisines : on parle alors de réseau mycorhizien commun. Ces connexions existent, et l'on a observé en laboratoire que de petites quantités de carbone ou de signaux peuvent passer d'une plante à une autre par leur intermédiaire.",
        "À partir de là, une image populaire s'est répandue : le « Wood Wide Web », des forêts où les arbres « communiqueraient », où des arbres-mères « nourriraient » volontairement leurs jeunes. C'est une belle histoire — mais c'est là qu'il faut être honnête. Les connexions sont réelles ; en revanche, l'interprétation (échanges intentionnels, entraide, altruisme à l'échelle de la forêt) est aujourd'hui débattue parmi les scientifiques. Des chercheurs ont montré que beaucoup d'affirmations grand public dépassaient ce que les preuves permettent d'affirmer.",
        "La leçon de l'Ordre est ici une leçon de méthode : on peut s'émerveiller du réseau sans lui prêter des intentions humaines. Observer ce qui est, distinguer ce qu'on sait de ce qu'on suppose — c'est aussi cela, respecter le vivant.",
        "À retenir : les réseaux souterrains existent ; l'idée qu'ils relèvent d'une « communication » ou d'une entraide consciente reste, elle, contestée. Admirer sans surinterpréter.",
      ],
      quiz: [
        {
          q: "Un réseau mycorhizien commun :",
          options: [
            "relie plusieurs plantes par un même mycélium",
            "est un câble électrique naturel",
            "n'existe pas",
          ],
          correct: 0,
          explication:
            "Un même mycélium peut effectivement connecter les racines de plantes voisines.",
        },
        {
          q: "L'idée que les arbres « communiquent » et s'entraident via ce réseau est :",
          options: [
            "un fait scientifique pleinement établi",
            "une interprétation populaire mais débattue",
            "une invention sans aucune base",
          ],
          correct: 1,
          explication:
            "Les connexions sont réelles, mais l'interprétation en termes de communication/altruisme est contestée — la nuance est le cœur de la leçon.",
        },
        {
          q: "La bonne attitude proposée est :",
          options: [
            "croire toutes les belles histoires sur la nature",
            "rejeter tout ce qui n'est pas encore prouvé",
            "s'émerveiller tout en distinguant le su du supposé",
          ],
          correct: 2,
          explication: "Respecter le vivant, c'est aussi pratiquer une honnêteté de méthode.",
        },
      ],
    },
  ],
};
