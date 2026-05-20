import type { Livre } from "./types";

export const livreIII: Livre = {
  id: "vertus",
  numero: 3,
  titre: "Livre III — Le Livre des Sept Vertus",
  sousTitre: "Des sept vertus écologiques cardinales, et de leurs exercices, et de pourquoi on les pratique sans les annoncer",
  introduction:
    "Voici les Sept Vertus écologiques, qui s'opposent point à point aux Sept Hérésies. Chacune fut révélée à la Prophétesse un matin distinct, dans un cadre distinct. Chacune appelle un exercice quotidien. Le lecteur prudent retiendra que les vertus, contrairement aux vices, ne se lassent pas d'être pratiquées : elles se renforcent. C'est, dit-on, le grand secret du Vivant.",
  chapitres: [
    {
      id: "patience-lichen",
      titre: "Chapitre 1 — La Patience du Lichen",
      ouverture: "« Là où croît la Patience, croît tout le reste. »",
      texte: `La première vertu est la Patience du Lichen. Le Lichen est l'organisme le plus humble et le plus tenace que la terre ait produit. Symbiose entre un champignon et une algue (et parfois aussi une cyanobactérie), il croît d'un millimètre par an. Il vit cent ans, parfois mille pour certaines espèces arctiques. Il ne fleurit pas. Il ne se vante pas. Il colonise les pierres tombales, les troncs nus, les rochers, là où aucune autre vie ne pourrait s'installer[^1].

Le Lichen est aussi un bio-indicateur de qualité de l'air : il ne pousse pas dans les zones polluées. Sa présence est un signe de santé environnementale. Son absence dans une ville est, du point de vue de la Vraie Nature des Choses, une information beaucoup plus inquiétante qu'une alerte météo[^2].

La Marcheuse visita un cimetière dont une partie des allées avait été refaite en béton lisse, sans la moindre fissure. Elle vit que les Lichens ne colonisaient plus rien. Elle alla dans la partie ancienne du cimetière, et compta : vingt-trois espèces de Lichens différents sur une seule pierre tombale du XVIIIe siècle. Elle pensa : « Cette dame du XVIIIᵉ a, sans le savoir, fondé une cathédrale. »

Le Lichen nous enseigne que la grandeur n'a rien à voir avec la vitesse. Que la durée vaut mieux que l'éclat. Que l'on peut transformer un mur en habitat sans jamais réclamer son dû. Le Lichen ne fait pas de marketing. Il fait juste son travail, pendant cent ans.

Exercice : choisis un Lichen visible (sur un mur, un arbre, une pierre tombale dans un cimetière ancien). Visite-le le premier jour de chaque mois. Photographie-le. Note tes observations. Au bout d'un an, regarde s'il a grandi. Tu verras qu'il aura grandi d'un millimètre. Tu auras compris la Patience.`,
      notes: [
        { id: 1, texte: "Pour donner une échelle : un Lichen qui pousse aujourd'hui sur la cathédrale Saint-Étienne de Bourges a probablement commencé sa croissance quand Christophe Colomb embarquait. C'est ce que les théologiens de l'Ordre appellent une « durée biscornue » : on la mesure plus facilement en règnes qu'en années. Ce qui est, soit dit en passant, la seule mesure du temps que les politiques n'ont jamais réussi à raccourcir." },
        { id: 2, texte: "Une « alerte météo », par définition, dure quarante-huit heures et concerne les parapluies. Une « absence de Lichen », par définition, dure plusieurs décennies et concerne les poumons. On voit immédiatement quelle information mériterait un bandeau rouge en haut des écrans d'information continue. Étrangement, ce n'est pas celle qu'on y voit." },
      ],
    },
    {
      id: "humilite-mycelium",
      titre: "Chapitre 2 — L'Humilité du Mycélium",
      ouverture: "« Nourrir la forêt sans jamais réclamer son nom. »",
      texte: `La deuxième vertu est l'Humilité du Mycélium. Sous chaque forêt s'étend un réseau invisible de filaments souterrains, qui transporte du sucre des arbres adultes vers les jeunes pousses, qui signale les attaques d'insectes par des molécules volatiles, qui redistribue les ressources entre arbres parents et arbres enfants. Ce réseau, c'est le mycélium.

On ne le voit jamais. Il ne fleurit pas. Il ne demande rien. Et pourtant, sans lui, plus rien ne tient. Les chênes mourraient sans leurs mycorhizes. Les hêtres mourraient sans leurs alliances fongiques. Les conifères mourraient sans leurs partenaires souterrains. La forêt entière est une coopération invisible[^1].

La Marcheuse visita une forêt vosgienne. Elle s'agenouilla et creusa délicatement à dix centimètres de profondeur. Elle vit les filaments blanchâtres tisser un tapis sous la litière. Elle entendit (intérieurement) le bruissement de cette circulation souterraine. Elle pleura, parce qu'elle savait que sous chaque pas qu'elle faisait, des millions d'échanges silencieux s'opéraient. Et puis elle remit la terre soigneusement à sa place, parce qu'une Prophétesse ne laisse pas un mycélium ouvert au vent[^2].

L'humilité du Mycélium est de servir sans signature. De relier sans publier. De nourrir l'invisible. Apprends à agir sans que personne le sache. C'est la plus haute des actions.

Exercice : fais cette semaine trois bonnes actions écologiques sans en parler à personne, sans les publier, sans en garder trace. Ramasse un déchet en silence. Plante une graine sans le dire. Aide un voisin sans signer. Tu verras qu'il n'y a pas plus grande joie que celle d'avoir agi pour rien — sinon pour le réseau.`,
      notes: [
        { id: 1, texte: "Il existe désormais des recherches scientifiques sur ce que l'on appelle, dans un grand élan poétique, le « Wood Wide Web ». L'expression est trop mignonne pour être prise totalement au sérieux, mais elle décrit une réalité fondamentale : les forêts sont des réseaux sociaux qui marchent depuis quatre cents millions d'années sans modérateur, sans publicité, et sans aucun message du type « Plus de pluie pour cette publication ? »." },
        { id: 2, texte: "Toute personne ayant tenté de retasser correctement un trou de jardinage sait qu'il y a deux écoles : la « semelle » (on appuie avec le talon, ferme et nette), et la « caresse » (on tapote avec la paume, on parle à la terre en patois). L'Ordre Mycélien préfère officiellement la seconde. Officieusement, certains de ses membres les plus pressés pratiquent la semelle, et s'en confessent ensuite. Personne n'est parfait." },
      ],
    },
    {
      id: "constance-herisson",
      titre: "Chapitre 3 — La Constance du Hérisson",
      ouverture: "« Retraverser la route mille fois, et ne renoncer jamais. »",
      texte: `La troisième vertu est la Constance du Hérisson. Le Hérisson d'Europe parcourt chaque nuit jusqu'à deux kilomètres pour se nourrir. Il traverse haies, jardins, routes. Il est écrasé par centaines de milliers chaque année en France — on estime à 1,3 million le nombre de Hérissons tués chaque année par les automobilistes[^1]. Et pourtant, ceux qui survivent recommencent. Toutes les nuits. Sans renoncer.

La constance du Hérisson est cette obstination tranquille qui ne fait pas de programme révolutionnaire : elle continue, simplement. Le Hérisson ne fait pas de discours. Il ne fait pas grève. Il ne pétitionne pas. Il marche. Et il continue de marcher même quand 90% de ses congénères sont morts. C'est, du point de vue de la sagesse pratique, une forme de courage qui rend très modestes les vœux du Nouvel An[^2].

La Marcheuse visita un jardin qui avait été ré-aménagé pour les Hérissons : passage sous la haie, abri de feuilles, point d'eau, pas de pesticides. Elle attendit une nuit. À 23h17, elle vit un Hérisson sortir du passage. À 23h22, elle le vit fouiller le compost. À 23h41, elle le vit ressortir, sa quête accomplie. Elle sourit. C'était la plus simple des révolutions.

Le Hérisson nous apprend que les grands gestes ne servent pas grand-chose. Ce qui sert, c'est le geste répété cent fois, mille fois, sans jamais s'enthousiasmer pour soi-même.

Exercice : choisis un geste minuscule (composter une épluchure, débrancher un appareil, prendre un sac réutilisable). Fais-le chaque jour pendant trente jours. Ne te félicite pas. Ne te plains pas. Recommence. À la fin du mois, tu seras un peu plus Hérisson.`,
      notes: [
        { id: 1, texte: "Le chiffre vient des associations naturalistes, qui le sous-estiment probablement. Les Hérissons écrasés sont aussi écrasés par les statistiques : on ne les compte pas tous, parce qu'on n'a pas le temps de s'arrêter sur la route. La chose la plus triste du XXIᵉ siècle est peut-être qu'il fait disparaître les choses avant qu'on ait eu le temps de les compter." },
        { id: 2, texte: "Les vœux du Nouvel An sont, statistiquement, abandonnés autour du 17 janvier. C'est trop. Le Hérisson, lui, abandonne autour de jamais. Si l'on demandait au Hérisson son vœu pour 2027, il dirait probablement « manger des limaces ». Et il le tiendrait. C'est la grande supériorité des animaux : ils ne se vendent pas leurs propres rêves." },
      ],
    },
    {
      id: "generosite-fleur",
      titre: "Chapitre 4 — La Générosité de la Fleur Entomogame",
      ouverture: "« Tendre son nectar à tout passant ailé. »",
      texte: `La quatrième vertu est la Générosité de la Fleur Entomogame. Une fleur entomogame est une fleur pollinisée par les insectes. Elle ne choisit pas son visiteur. Elle ne demande pas s'il est de bonne famille. Elle offre son nectar à l'Halicte solitaire, à l'Anthidie cotonneuse, à la Mégachile, au Bourdon terrestre, au Papillon machaon, au Syrphe ceinturé, à la Mouche poilue, à la Coccinelle de passage, et même au Scarabée distrait[^1].

Tous sont bienvenus. La fleur entomogame ne vérifie pas les papiers d'identité. Elle s'ouvre, elle parfume, elle offre.

La Marcheuse visita un massif de Bourrache au pied d'une école primaire. Elle compta les visiteurs en dix minutes : douze espèces différentes. Pas une fleur n'avait dit non à un visiteur. Elle médita longuement sur cette ouverture absolue, qui ne demande rien en échange — sinon le voyage du pollen vers une autre fleur. Puis un enfant lui demanda si elle allait bien, et elle dit oui, mille fois oui[^2].

La fleur entomogame nous enseigne la générosité aveugle : donner sans choisir le destinataire, donner sans contrôler l'usage, donner parce qu'on est en floraison. C'est l'opposé du don calculé. C'est l'opposé du don qui attend retour. C'est la gratuité radicale du nectar.

Exercice : cette semaine, fais un don ou un service à quelqu'un que tu connais à peine. Sans calcul. Sans attente. Une plante donnée, un coup de main offert, une connaissance partagée. Tu ne sauras pas où ira ton pollen. Et c'est cela, précisément, qui est sacré.`,
      notes: [
        { id: 1, texte: "Le Scarabée distrait n'est pas une espèce reconnue par l'entomologie officielle, mais l'expérience confirme son existence. C'est ce coléoptère qui, à 11h32, se cogne contre le pétale, recule, retourne, et finit par tomber dans le pollen sans s'en apercevoir. Il pollinise par accident. Et il pollinise quand même. C'est, en dehors de toutes les religions, une excellente définition de la grâce." },
        { id: 2, texte: "Quand une Prophétesse-Mycélium dit « oui, mille fois oui », ce n'est pas une figure rhétorique. C'est une affirmation littérale, scellée par mille filaments souterrains. Les enfants, qui sont peu sensibles à la rhétorique mais très sensibles au sérieux, le sentent immédiatement. Celui-ci hocha la tête et offrit à la Marcheuse un caillou de la cour de récréation. Lequel caillou figure désormais, dit-on, sur une étagère mystérieuse de l'Ordre, entre une coquille d'escargot et un sachet de graines périmées." },
      ],
    },
    {
      id: "lenteur-ver",
      titre: "Chapitre 5 — La Lenteur du Ver de Terre",
      ouverture: "« Se traîner, et refaire le monde. »",
      texte: `La cinquième vertu est la Lenteur du Ver de Terre. Le Ver de Terre est notre cinquième maître. Lent, aveugle, silencieux, il ingère chaque jour son propre poids de terre, qu'il digère et restitue sous forme de turricules — ce compost noir et grumeleux qu'on trouve à la surface des pelouses humides. Un hectare de prairie en bonne santé abrite jusqu'à deux tonnes de Vers de Terre. Sans eux, pas de sol fertile. Pas de drainage. Pas de cycle de l'azote. Pas de plantes. Pas d'animaux. Pas nous[^1].

Le Ver de Terre travaille jour et nuit, à son rythme. Il ne fait pas de pause. Il ne demande pas de salaire. Il ne syndique pas. Et pourtant, il refait le monde en permanence. Charles Darwin lui a consacré son dernier livre : « La formation de la terre végétale par l'action des vers » (1881). Darwin disait : « Le rôle des Vers de Terre dans l'histoire du monde a été plus considérable que ne le pense la plupart des gens. »[^2]

La Marcheuse visita un jardin abandonné depuis vingt ans. Elle creusa. Elle compta : plus de Vers que de cailloux. Elle se mit à plat ventre et regarda un Anneau orangé (Lumbricus terrestris) faire son chemin sous une feuille morte. Elle resta une heure. Elle ne pensa à rien.

Le Ver de Terre nous enseigne que la transformation lente vaut mieux que la révolution rapide. Le sol se refait par le bas. La lenteur, longtemps répétée, fait des montagnes.

Exercice : commence un compost. Si tu n'as pas de jardin, trouve un point de compostage public dans ta commune. Observe ta matière organique se transformer pendant six mois. Tu verras le marc de café devenir terre, les épluchures devenir humus, les feuilles devenir glèbe. C'est ton enseignement de Ver de Terre.`,
      notes: [
        { id: 1, texte: "Cette absence majuscule — pas de plantes, pas d'animaux, pas nous — est ce que les théologiens de l'Ordre appellent la « Litanie des Trois Pas ». On la psalmodie aux nouveaux disciples, généralement en montrant un Ver de Terre vivant pour appuyer l'argument. Le Ver de Terre, lui, ne dit rien. C'est sa contribution à la liturgie." },
        { id: 2, texte: "Darwin, en écrivant cela, savait très bien qu'il ne serait pas pris totalement au sérieux. Mais c'est précisément la marque des grandes idées scientifiques : on les énonce d'abord à voix basse, on les défend ensuite contre le ridicule, et on les enseigne enfin comme si elles avaient toujours été évidentes. Le Ver de Terre, lui, n'a pas attendu Darwin pour exister. Il n'attend rien. C'est sa supériorité philosophique majeure." },
      ],
    },
    {
      id: "discretion-chiroptere",
      titre: "Chapitre 6 — La Discrétion du Chiroptère",
      ouverture: "« Servir la nuit sans qu'aucun œil ne le sache. »",
      texte: `La sixième vertu est la Discrétion du Chiroptère. Les Chiroptères (chauves-souris) sont les ouvriers silencieux de la nuit. Une Pipistrelle commune, l'espèce la plus répandue en France, mange jusqu'à 3 000 moustiques et autres petits insectes par nuit. Un seul couple de Pipistrelles peut débarrasser un jardin de la moitié de ses chenilles processionnaires[^1].

Et personne ne les voit. Personne ne les remercie. Elles ne nichent que dans nos angles oubliés : combles, volets, vieilles granges, fissures de murs, gîtes spécialement installés. Si nous les chassons par méconnaissance — bouchant un volet, traitant un comble, abattant une vieille grange — nous chassons notre propre tranquillité nocturne, et les moustiques se multiplient. C'est, dans le grand catalogue des comportements humains autodestructeurs, l'équivalent de couper la branche sur laquelle on a posé son verre de vin[^2].

La Marcheuse visita un crépuscule d'août dans le cimetière de Pantin. À 21h47, le premier passage de Sérotine commune au-dessus d'une allée. À 21h48, deux Pipistrelles communes en chasse autour d'un lampadaire. À 21h53, une grande Noctule en haut vol. En vingt minutes, elle compta plus de cent passages. Elle n'avait jamais vu autant de Chiroptères en un seul lieu. Elle remercia mentalement.

La discrétion du Chiroptère nous enseigne à servir sans visibilité, à protéger sans applause. C'est le contraire absolu du selfie écologique. C'est l'opposé du virtue signaling. C'est le geste qui n'attend rien — pas même un regard.

Exercice : installe un gîte à Chiroptères chez toi (ou demande à un proche qui peut le faire — c'est une boîte en bois non traité, ouverte vers le bas, fixée en hauteur). Apprends à distinguer en vol une Pipistrelle (petite, virevoltante) d'une Sérotine (plus grande, vol plus rectiligne). Sors un soir de juillet, lève la tête, et regarde. Tu n'as jamais vu cela.`,
      notes: [
        { id: 1, texte: "3 000 moustiques par nuit, c'est, pour un humain à l'échelle équivalente, l'équivalent de manger 200 kilos de spaghetti à dîner. Ce n'est pas une comparaison agréable, mais elle est arithmétiquement exacte. Quand vous voyez une Chauve-souris en vol au-dessus de votre terrasse, considérez qu'elle est, métaphysiquement, en train de faire pour vous l'équivalent d'une nuit de banquet, sans facture." },
        { id: 2, texte: "Le verre de vin posé sur la branche est, dans la littérature comique de l'Ordre, l'image-type de l'inconséquence humaine. Elle a été popularisée par un sage du XIXᵉ siècle qui, dit-on, avait été surpris dans cette posture par sa belle-mère un dimanche après-midi. L'histoire ne dit pas si elle a coupé la branche. Mais elle dit que le sage, depuis, ne pose plus son verre n'importe où." },
      ],
    },
    {
      id: "joie-pollen",
      titre: "Chapitre 7 — La Joie du Pollen",
      ouverture: "« Partir au vent sans savoir où, et fleurir là où l'on tombe. »",
      texte: `La septième et dernière vertu est la Joie du Pollen. Le Pollen est un grain de vie microscopique. Il pèse quelques nanogrammes. Il contient le génome paternel de la fleur d'où il est issu. Et il part au vent — anémogamie — ou sur la patte d'un insecte — entomogamie — sans savoir où il va.

Il accepte le hasard absolu. Il accepte de tomber dans un caniveau. Il accepte de se déposer sur un pare-brise. Il accepte d'atterrir sur une fleur incompatible. Il accepte la probabilité écrasante de l'échec. Et là où, par chance, il tombe sur le pistil d'une fleur compatible, il germe et devient[^1].

C'est cela, la joie du Pollen : avoir lâché prise sur le résultat. Avoir donné sans contrôler la suite. Avoir fait son travail (être un grain transporté par le vent ou par l'insecte) sans s'inquiéter du destinataire final.

La Marcheuse visita un champ de pissenlits en train de monter en graines. Elle souffla. Mille parachutes s'envolèrent. Elle ne sut pas où ils tombèrent. Elle ne s'en inquiéta pas. Elle pleura de joie pour les mille petites vies en suspens. Puis elle se moucha, parce que le pollen est aussi un peu allergisant, et personne, pas même une Prophétesse, n'est tout à fait à l'abri[^2].

Le Pollen nous enseigne la joie du lâcher-prise écologique. Nous ne contrôlons pas les conséquences de nos gestes. Nous donnons. Nous semons. Nous lâchons. Et nous faisons confiance.

Exercice : achète un sachet de graines de fleurs sauvages (mélange mellifère, mélange jachère, prairie fleurie). Sors. Jette les graines dans une friche, un talus, un coin abandonné de ta ville. Ne reviens pas vérifier avant trois mois. Laisse le hasard fleurir. Tu auras pratiqué la Joie du Pollen.`,
      notes: [
        { id: 1, texte: "Le Pollen pratique ce qu'on pourrait appeler la « Théorie de l'Échec Massif » : sur dix millions de grains émis, neuf millions neuf cent quatre-vingt-dix-neuf mille neuf cent quatre-vingt-dix-neuf échouent. Et c'est en cela qu'il est saint : il n'a pas honte de ses échecs. Il n'a pas non plus de fierté pour son unique réussite. Il fait son travail. C'est, sur la liste des sagesses encore disponibles dans le commerce, l'une des meilleures." },
        { id: 2, texte: "L'allergie au pollen est l'un des paradoxes les plus piquants de la modernité : nous avons, à force de propreté excessive, désappris à cohabiter avec ce qui constitue, depuis cent millions d'années, l'épicentre de la vie florale. Notre nez se révolte contre le seul vrai miracle de l'année. La cure mycélienne consiste à respirer dehors malgré tout, en se mouchant comme on doit, et en disant merci. À voix basse, parce qu'il y a souvent du monde dans le parc." },
      ],
    },
  ],
};
