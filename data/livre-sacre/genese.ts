import type { Livre } from "./types";

export const livreI: Livre = {
  id: "genese",
  numero: 1,
  titre: "Livre I — La Genèse Mycélienne",
  sousTitre: "De l'éveil de la Prophétesse parmi les tombes vivantes, et de la grande Fissure qui changea tout",
  introduction:
    "Voici les paroles transmises par celles et ceux qui ont vu la Marcheuse, qu'on nomme aussi Celle-qui-marche-entre-les-tombes, et qu'une fois — une seule, dans un moment de bouleversement collectif — on a appelée par son prénom. Le Livre I raconte la genèse de l'Ordre Vert, depuis la Fissure originelle dans le bitume jusqu'à l'apparition d'Olivia-aux-mille-racines. Le lecteur attentif notera que la plupart des grands événements spirituels commencent par une chose trop petite pour être remarquée par les Grandes Personnes, et que les Grandes Personnes finissent généralement par s'en mordre les doigts.",
  chapitres: [
    {
      id: "fissure",
      titre: "Chapitre 1 — La Fissure",
      ouverture: "« Au commencement était la Spore, et la Spore reposait sur la face des cimetières. »",
      texte: `Au commencement, il n'y avait pas grand-chose[^1]. Il y avait du béton, du goudron, des dalles, des trottoirs, des parkings, des centres commerciaux, des sorties d'autoroute, et tout cela tenait sous un ciel d'asphalte tendu d'un horizon à l'autre. Les hommes traversaient ce monde en regardant leur téléphone. Personne ne savait plus le nom d'une plante.

Puis vint la Fissure.

Personne ne sait exactement où ni quand elle s'ouvrit. Certains disent que c'était au pied d'un mur du dix-neuvième arrondissement, après un hiver particulièrement froid. D'autres jurent qu'elle apparut entre deux dalles du parvis de la Défense, le 17 mars à 14h32, juste après l'heure du déjeuner d'un comptable qui s'appelait Roger[^2]. D'autres encore évoquent une bouche d'égout du quartier de la Salpêtrière, ou un caniveau de Pantin. Toutes les versions sont vraies. La Fissure est partout où le béton craque.

Dans cette Fissure, une Spore se posa. Elle venait de loin — peut-être d'une forêt picarde, peut-être d'un toit d'immeuble couvert de lichens, peut-être d'une cimaise du Père-Lachaise — et elle germa. Elle ne savait pas qu'elle germait. Elle ne savait rien. Et c'est précisément pour cela qu'elle réussit. Les choses qui ne savent pas ce qu'elles font ont, sur ce point, un avantage écrasant sur les comités d'experts[^3].

Du filament unique qu'elle déploya, le mycélium s'étendit. Le mycélium ne parle pas. Il s'infiltre. Il rejoint d'autres filaments, d'autres réseaux, sous les caves, sous les rails, sous les vestiges romains, sous les ossements anonymes. Il dessina une carte invisible de Paris, une carte d'avant Paris, une carte que les Romains avaient ignorée, que les rois avaient piétinée, et que les ingénieurs des Ponts et Chaussées n'avaient jamais voulu voir.

C'est dans cette carte invisible que Celle-qui-marche-entre-les-tombes s'éveilla.`,
      notes: [
        { id: 1, texte: "Cela dépend bien sûr de ce qu'on entend par « pas grand-chose ». Du point de vue d'un atome de carbone, par exemple, il y en avait déjà beaucoup trop. Du point de vue de la Vraie Nature des Choses, il y en avait presque assez. Du point de vue d'un urbaniste, il y en avait exactement le bon nombre, et c'est ce qui était inquiétant." },
        { id: 2, texte: "Roger n'a jamais su qu'il était passé au-dessus d'une fissure spirituelle. Il est probablement encore en train de penser à son entrecôte. La spiritualité, faut-il le rappeler, a cette élégance particulière de ne jamais déranger les gens qui mangent." },
        { id: 3, texte: "Toute personne ayant assisté à un comité d'experts sait qu'il s'y prend généralement les meilleures décisions trois mois trop tard, et que le pourcentage de spores germées y est statistiquement nul. Ce sont là des observations sans rancune mais documentées." },
      ],
    },
    {
      id: "eveil",
      titre: "Chapitre 2 — L'Éveil de la Prophétesse",
      ouverture: "« Et la Marcheuse ouvrit les yeux entre les racines du grand Tilleul. »",
      texte: `Personne ne sait quand naquit Celle-qui-marche. Certains disent qu'elle est née un matin de mai, sous les Tilleuls du Père-Lachaise, vers cinq heures, quand la rosée commence à s'évaporer. D'autres affirment qu'elle est née un soir d'octobre, à la Toussaint, dans le carré 28 du cimetière de Bagneux, à l'heure où les promeneurs ont quitté les allées et où les Hérissons commencent à sortir. D'autres encore disent qu'elle n'est pas née : qu'elle a toujours été là, et qu'un jour elle s'est simplement souvenue d'elle-même[^1].

Ce qui est sûr, c'est qu'elle s'éveilla. Elle ouvrit les yeux. Elle entendit le chant d'une Grive musicienne, et elle comprit que ce chant était une langue. Elle vit une Pâquerette, et elle comprit que la Pâquerette la regardait aussi[^2]. Elle posa la main sur l'écorce d'un Tilleul, et elle sentit la sève monter, l'eau circuler, le sucre descendre, le tout dans un silence vibrant.

Ce jour-là, la Prophétesse comprit qu'elle n'était pas seule. Elle comprit qu'elle ne l'avait jamais été. Elle comprit que la grande solitude moderne — celle des écrans, des cafés à emporter, des couloirs de bureau — était une illusion. Sous le bitume, il y avait un peuple. Sur les tombes, il y avait un peuple. Dans les murs, dans les fissures, dans les rebords de fenêtres, dans les caniveaux, dans les rebords sous les ponts : il y avait un peuple, et ce peuple l'attendait.

Alors elle se leva, et elle marcha. Elle marcha entre les tombes, en parlant à voix basse aux Lichens. Elle s'agenouilla devant les Plantains lancéolés qui perçaient les graviers. Elle compta les passages de Chiroptères au crépuscule. Et elle commença à enseigner.

Mais la Marcheuse n'enseignait pas comme les hommes. Elle n'écrivait pas[^3]. Elle ne haussait jamais le ton. Elle ne montait pas sur des estrades. Elle se contentait de marcher, et là où elle passait, les gens changeaient. Ils se mettaient à composter. Ils oubliaient leur tondeuse. Ils plantaient un Tilleul. Ils signalaient à la mairie qu'un Hérisson avait été écrasé. Ils achetaient un sac réutilisable. Ils refusaient une dosette. Ils écoutaient les oiseaux.

C'est ainsi que naquit l'Ordre Mycélien. Sans manifeste. Sans dogme. Sans bureau central. Juste par contagion. Comme le mycélium lui-même[^4].`,
      notes: [
        { id: 1, texte: "Cette dernière hypothèse est généralement préférée par les théologiens fatigués, parce qu'elle a l'élégance de ne nécessiter aucun calendrier. Or, faire de la théologie sans calendrier, c'est un peu comme faire du jardinage sans saisons : ça se peut, mais on s'expose à des floraisons étranges." },
        { id: 2, texte: "Ce qui, comme l'a fait observer un jardinier de l'Ordre, est l'expérience humaine la plus dérangeante après le déjeuner avec sa belle-mère. La différence étant que la Pâquerette ne demande pas des nouvelles des enfants." },
        { id: 3, texte: "L'écriture, disait-elle, est ce que les vivants font lorsqu'ils ont peur d'oublier. Or les choses vraiment importantes n'ont pas besoin d'être notées : elles reviennent toutes seules, comme les pissenlits." },
        { id: 4, texte: "Il y a là une analogie qui a fait tousser plusieurs membres de l'Académie locale d'horticulture. À leur décharge, ils n'avaient pas dormi suffisamment ce trimestre. Et puis, la comparaison reste exacte : tout ce qui mérite d'être vrai finit par s'étendre par en dessous." },
      ],
    },
    {
      id: "premiers-disciples",
      titre: "Chapitre 3 — Les Premiers Disciples",
      ouverture: "« Et la Marcheuse regarda autour d'elle, et elle vit des humains, et ils étaient fatigués. »",
      texte: `Les premiers disciples ne furent pas choisis. Ils s'auto-désignèrent en croisant son regard, ou en l'apercevant de loin, ou simplement en sentant, sans la voir, qu'une présence nouvelle marchait dans les cimetières d'Île-de-France. C'est, dit-on, la marque des Vrais Maîtres : ils n'ont pas de stratégie de recrutement. Les gens viennent, c'est tout. Comme les pollinisateurs, qu'on ne convoque pas mais qu'on accueille[^1].

Il y eut d'abord Sœur Compost, une bibliothécaire qui jeta sa cafetière à capsules un matin de novembre, sans préavis, et installa un composteur sur son balcon parisien. Le voisin du dessous se plaignit pendant deux mois, puis il y mit ses propres épluchures.

Il y eut Frère Lichen, un retraité des Postes qui passait ses journées à photographier les lichens sur les pierres tombales de Pantin, et qui un jour entendit la Prophétesse lui dire : « Tu fais œuvre sainte sans le savoir. » Il a répondu : « Ah bon ? » Ce qui, on en conviendra, est une réponse parfaitement raisonnable à une révélation surprise[^2].

Il y eut Sœur Halicte, une étudiante en biologie qui pleura devant une parcelle non fauchée du cimetière de Thiais et comprit que les insectes solitaires méritaient au moins autant d'attention que les abeilles domestiques. Elle écrivit sa thèse là-dessus, et personne ne la lut. Elle continua quand même.

Il y eut Frère Hérisson, un boulanger de banlieue qui aménagea un passage à Hérisson sous chaque haie de son quartier, en faisant signer une pétition aux voisins. Il y eut **Frère Théodule**, qui croyait dur comme fer que les Vers de Terre votaient lors d'élections souterraines biannuelles, et qui n'a jamais été contredit, parce qu'on ne contredit pas un homme qui distribue gratuitement du compost[^3].

Il y eut Sœur Mycélium, une informaticienne qui développa une application liturgique pour suivre les rituels écologiques. (Cette application, c'est celle que tu utilises en ce moment. Sœur Mycélium te salue.)

Il y eut Frère Ver de Terre, un jardinier municipal qui refusa publiquement de pulvériser du glyphosate sur les trottoirs de sa commune, et qui fut sanctionné, puis réintégré sous la pression de l'Ordre, puis sanctionné à nouveau, puis réintégré, dans une chorégraphie administrative que personne ne comprenait mais dont tout le monde finit par admirer la régularité[^4].

Il y eut Sœur Pollen, une jeune femme qui jetait des graines de fleurs sauvages depuis sa fenêtre du dixième étage et qui transforma trois friches en prairies sauvages en deux ans.

Il y eut, plus tard, **Mère Mycorhize**, qu'aucun disciple n'a jamais réussi à dater (certains disent 90 ans, d'autres 130, d'autres encore murmurent qu'elle a connu le règne de Napoléon III). Elle parle peu. Quand elle parle, elle a généralement raison. Quand elle ne parle pas, elle a aussi raison, ce qui est plus impressionnant encore.

Il y eut **le Vieux Marcel**, qui ne se souvient de rien sauf des espèces de mousses européennes, qu'il sait reconnaître au toucher.

Il y eut **Frère Pollen**, qui éternue à la vue d'une statistique et qu'il ne faut donc pas inviter à un colloque universitaire.

Tous ces disciples se reconnurent entre eux. Ils n'avaient pas de signe distinctif : pas de robe, pas de pendentif, pas de badge. Mais ils se reconnaissaient à la lenteur de leurs gestes, à la précision de leur vocabulaire botanique, à leur capacité à s'arrêter cinq minutes devant un Lichen. C'est ainsi que l'Ordre se constitua, en réseau, en mycélium.`,
      notes: [
        { id: 1, texte: "Toute personne ayant tenté de convoquer un bourdon sait que c'est une procédure vouée à l'échec. Les bourdons ne se convoquent pas. Ils s'invitent. Et accessoirement, ils ne signent pas la feuille de présence." },
        { id: 2, texte: "Frère Lichen a depuis fondé une école informelle de réplique aux révélations spontanées, dont les trois principes sont : 1) Toujours dire « Ah bon ? » d'abord. 2) Demander si la personne en face a soif. 3) Si tout cela échoue, proposer un café — moulu, évidemment." },
        { id: 3, texte: "Frère Théodule a également affirmé, lors d'une assemblée annuelle, que les Halictes femelles tenaient un syndicat. Personne n'a osé le contredire. Quelques mois plus tard, une étude de l'INRAE a montré que les Halictes communiquaient effectivement entre elles par des phéromones structurées. Frère Théodule a haussé les épaules. Il avait raison depuis le départ, et il le savait." },
        { id: 4, texte: "Il faut dire que le règlement intérieur de la commune en question avait été rédigé en 1962, à une époque où l'on désherbait à la mitraillette chimique sans état d'âme. Le règlement n'avait pas été mis à jour depuis, parce que personne n'avait jamais trouvé le tiroir où il était rangé. C'est, soit dit en passant, l'origine secrète de la plupart des aberrations administratives françaises : un tiroir perdu." },
      ],
    },
    {
      id: "premiere-reincarnation",
      titre: "Chapitre 4 — La Prophétesse n'est pas morte",
      ouverture: "« Et elle se diffusa. Et la diffusion est sa résurrection. »",
      texte: `Un jour vint où la Marcheuse sembla disparaître. On ne la vit plus dans les allées du Père-Lachaise. Les disciples cherchèrent. Ils interrogèrent les gardiens des cimetières. Personne ne l'avait vue partir, parce que personne ne l'avait jamais vraiment vue arriver[^1].

Mais Sœur Compost dit : « Elle n'est pas morte. Elle s'est diffusée. »

Et c'était vrai.

La Prophétesse est désormais dans chaque Plantain lancéolé qui perce le bitume. Elle est dans chaque Vers de Terre qui aère la terre. Elle est dans chaque Lichen qui s'accroche à une pierre tombale. Elle est dans chaque Chiroptère qui sort à la tombée de la nuit pour chasser les moustiques. Elle est dans le passage à Hérisson percé sous une haie. Elle est dans le café filtre bu lentement le matin. Elle est dans le sac en coton qui se déplie au caisse du marché. Elle est dans la veille de l'éclairage extérieur. Elle est même, on n'ose pas le dire trop fort, dans le Léger Embarras Métaphysique du Mardi[^2].

Olivia-aux-mille-racines est en réincarnation permanente. Elle ne meurt pas, parce qu'elle est devenue mycélium. Le mycélium ne meurt pas : il s'étend, il fragmente, il se reconstitue. Et chaque geste accompli en son nom est une floraison ponctuelle d'un fil souterrain.

C'est pourquoi, quand tu fais un geste — quand tu refuses une dosette, quand tu laisses pousser un carré de prairie, quand tu installes un grelot à ton chat, quand tu marches au lieu de prendre la voiture — elle y est. Elle ne te juge pas. Elle ne te félicite pas non plus[^3]. Elle est, simplement.

Et c'est cela, le grand mystère mycélien : ce qui est diffusé partout ne disparaît jamais. La Prophétesse est morte ? Non. Elle est l'air. Elle est le sol. Elle est toi, quand tu te penches pour regarder un Lichen[^4].`,
      notes: [
        { id: 1, texte: "Les gardiens de cimetière sont, en règle générale, les gens les plus discrètement initiés de France. Ils voient passer beaucoup plus de choses qu'ils ne le disent. Si vous voulez de la sagesse au pied levé, demandez à un gardien de cimetière entre 16h et 17h, c'est l'heure où ils prennent leur café — filtré." },
        { id: 2, texte: "Le Léger Embarras Métaphysique du Mardi est un phénomène bien connu des grands liturgistes de l'Ordre. Il consiste en ceci : le mardi, sans raison apparente, on a vaguement le sentiment qu'on aurait dû arroser quelque chose. On ne sait pas quoi. On l'a probablement oublié dimanche soir. Mère Mycorhize compatit, mais elle ne nous dira pas ce que c'était." },
        { id: 3, texte: "C'est, pour beaucoup de disciples, la part la plus difficile : ne pas être félicité. Le système moderne nous a habitués à recevoir un petit coup de pouce dopaminique pour chaque mètre carré non tondu. L'Ordre Mycélien, lui, considère que faire le Bien et attendre qu'on le sache est une forme subtile d'hypocrisie qui finit par moisir, comme du compost mal aéré." },
        { id: 4, texte: "Il existe, dit-on, un test rapide pour savoir si tu es Mycélium : penche-toi vers le sol et regarde un Lichen pendant trente secondes. Si tu as résisté à l'envie de sortir ton téléphone : c'est toi. Si tu as échoué : c'est toi aussi, mais une version qui doit recommencer demain. La Prophétesse est, parmi d'autres choses, patiente." },
      ],
    },
  ],
};
