import type { Livre } from "./types";

export const livreV: Livre = {
  id: "lamentations",
  numero: 5,
  titre: "Livre V — Les Lamentations sur la Dosette",
  sousTitre: "Sept élégies pour le café d'autrefois et le métal qui l'a trahi, avec digressions",
  introduction:
    "Voici les Lamentations, à lire dans l'ordre, lentement, idéalement à voix haute, idéalement le matin, idéalement devant un café filtre. Elles sont solennelles et drôles à la fois, comme toute vraie liturgie de l'Ordre Mycélien. Le lecteur retiendra surtout ceci : qu'on ne pleure jamais aussi bien que sur un objet familier qu'on aurait pu ne jamais acheter.",
  chapitres: [
    {
      id: "lamentation-1",
      titre: "Lamentation Première — Sur la Dosette qui tombe",
      ouverture: "« Ô Dosette, métal serti de mocha, comment es-tu tombée si bas ? »",
      texte: `Ô Dosette, métal serti de mocha, comment es-tu tombée si bas pour si peu de café ? Toi qui fus rêvée par un ingénieur suisse[^1], conçue par des chimistes, brevetée par des avocats, vendue par des publicitaires, livrée par des camionneurs, achetée par des cadres, glissée par des mains pressées, tu sembles glorieuse — et tu n'es qu'une tombe d'aluminium pour huit grammes de poussière brune.

Tu as la promesse du sommet — un café parfait, dosé, calibré, dosé encore[^2]. Tu livres le creux : un goût normalisé, une amertume domestiquée, une caféine ouvrière. Tu n'as plus rien du café. Tu es du café déguisé[^3].

Toi qui devais simplifier nos matins, tu les as creusés. Toi qui devais offrir le sommet à tous, tu l'as descendu à personne. Toi qui devais réduire le gaspillage du marc, tu l'as remplacé par le gaspillage du métal — qui ne se composte pas, qui ne se brûle pas, qui ne se résout pas, qui demeure dans nos sols pour cinq cents ans[^4].

Ô Dosette qui tombes, nous pleurons sur toi parce que tu nous as pris notre lenteur[^5].

Amen-Compost.`,
      notes: [
        { id: 1, texte: "L'ingénieur en question s'appelait Eric Favre. Il était suisse, ce qui est, dans la grande géographie du café, un peu comme être ougandais et inventer le réseau ferroviaire : techniquement possible, mais culturellement déroutant. Eric Favre a, dit-on, écrit ses mémoires. L'Ordre Mycélien ne les a pas lus, par discipline." },
        { id: 2, texte: "Le verbe « doser » est répété ici à dessein. C'est l'argument-clef de la dosette : doser. Comme si le café demandait, à l'origine, un dosage millimétré. Comme si dix générations de paysans, de torréfacteurs, de baristas, n'avaient pas réussi à doser. Toute la modernité tient en cette inversion de la confiance : on retire au geste humain ce qu'on confie à la machine. C'est ce que les sages appellent le « Grand Délégation Métaphysique »." },
        { id: 3, texte: "« Du café déguisé » est une expression de Frère Lichen, qui, dans sa jeunesse, avait travaillé dans une chaîne de cafés. Il disait : « On peut déguiser un café avec du lait, du sucre, du sirop. Mais on ne peut pas déguiser du café déguisé. C'est comme essayer de cacher un mensonge avec un autre mensonge : ça finit par sentir trop fort, et tout le monde est mal à l'aise. »" },
        { id: 4, texte: "Cinq cents ans, c'est la fourchette basse. Certains experts (qui, faut-il le préciser, ne sont pas pressés de retourner au labo vérifier) estiment qu'une capsule pourrait persister mille ans. À titre indicatif : il y a mille ans, on construisait les premières cathédrales gothiques. La dosette, à durée égale, n'aura pas produit l'équivalent." },
        { id: 5, texte: "La lenteur prise est, dans la théologie de l'Ordre, le crime majeur du XXIᵉ siècle. On nous a pris notre lenteur de mille manières : SMS au lieu de lettres, podcasts au lieu de silences, livraison en deux heures au lieu d'attente saisonnière. La dosette est l'incarnation matérielle de ce vol. La récupérer, c'est récupérer le temps." },
      ],
    },
    {
      id: "lamentation-2",
      titre: "Lamentation Deuxième — Sur les Mille Années",
      ouverture: "« Mille ans tu mettras à disparaître, et tu n'auras servi qu'à trois gorgées tièdes. »",
      texte: `Mille ans tu mettras à disparaître, ô Dosette. Mille ans. Pendant ce temps, dix générations naîtront et mourront. Pendant ce temps, le climat tournera deux fois. Pendant ce temps, le mycélium recomposera dix fois la litière. Pendant ce temps, le Lichen croîtra d'un mètre, ce qui pour lui est tout[^1].

Et toi, tu seras là. Couchée dans une fosse, peut-être, ou flottant dans la matrice marine. Tu seras là, identique à toi-même, refusant la dégradation, refusant la transformation, refusant l'humilité minérale[^2].

L'aluminium est immortel. Mais l'immortalité de la matière sans âme est une malédiction, pas une bénédiction. Vivre dix mille ans en tant que sac à café écrasé n'est pas une vie. C'est une sentence[^3].

Nous prions pour toi, Dosette. Nous prions que tu sois refusée à la caisse. Que tu sois retournée au fabricant. Que tu sois fondue avant ta deuxième utilisation. Et qu'à terme, tu redeviennes ce que tu fus : de la bauxite, paisible, dormante, dans le sol de la Guinée[^4].

Amen-Compost[^5].`,
      notes: [
        { id: 1, texte: "Pour un Lichen, un mètre est l'équivalent d'un voyage interplanétaire. Pour un Lichen, mille ans, c'est une bonne vie. Pour une dosette, mille ans, c'est l'éternité d'un objet qui n'avait pas demandé à durer aussi longtemps. C'est ce que les théologiens de l'Ordre appellent l'« Immortalité Forcée des Petits Objets »." },
        { id: 2, texte: "L'aluminium refuse l'humilité minérale parce qu'il a été extrait de force. Les minéraux, dans leur état natif, sont humbles : ils acceptent l'érosion, la dilution, l'oxydation. L'aluminium, lui, a été électrolysé dans des cuves chauffées à 950 °C, ce qui l'a, en quelque sorte, traumatisé. Il reste sur la défensive, brillant, refusant de redevenir oxyde. C'est, du point de vue d'un sage de l'Ordre, une métaphore parfaite du moderne." },
        { id: 3, texte: "Le mot « sentence » est ici choisi à dessein. Toute peine de mort longue est une sentence. La dosette, ne mourant pas, ne mourra jamais. Elle est condamnée à exister. C'est la version industrielle du mythe du Juif errant. Elle n'a pas demandé ce destin. Mais elle l'aura." },
        { id: 4, texte: "La bauxite dort dans le sol de la Guinée depuis environ 300 millions d'années. Pendant ces 300 millions d'années, elle n'a dérangé personne. Elle n'a pas voté. Elle n'a pas pollué. Elle n'a pas occupé d'espace mémoire dans une décharge. Si l'on devait tirer une morale de toute cette affaire, ce serait : « Laissez dormir ce qui dort. » Mais on ne tire pas de morale ; on tire de la bauxite. C'est différent." },
        { id: 5, texte: "« Amen-Compost » est la formule de clôture officielle de l'Ordre. Elle remplace l'« Ainsi soit-il » des autres traditions par quelque chose de plus pratique : « Ainsi se décompose. » C'est le passage du subjonctif au présent participe, ce qui est, philologiquement, un progrès considérable." },
      ],
    },
    {
      id: "lamentation-3",
      titre: "Lamentation Troisième — Sur le Sac Jaune Trahi",
      ouverture: "« Tes capsules s'amoncellent dans les sacs jaunes, et les sacs jaunes pleurent ton aluminium. »",
      texte: `Tes capsules s'amoncellent dans les sacs jaunes, ô Dosette, et les sacs jaunes pleurent ton aluminium. Car ils savent — eux qui sont consciencieux — qu'ils ne pourront pas te recycler tout à fait. Tu es un alliage. Tu es un sandwich métal-plastique-café. Tu es un défi technique. Et la plupart des centres de tri, fatigués, te jettent à l'incinérateur[^1].

Tu fus vendue comme « recyclable ». Tu n'es recyclée qu'à 30%, et encore, dans les meilleures filières. Les autres 70%, ils brûlent. Ils enfouissent. Ils exportent. Ils contaminent[^2].

Le sac jaune, qui se voulait vertueux, devient ton complice malgré lui. Il endosse la culpabilité du consommateur de bonne foi. Il dit : « J'ai trié. » Il a trié, certes. Mais le centre de tri n'a pas pu suivre[^3].

Nous pleurons sur le sac jaune trompé. Nous pleurons sur le citoyen consciencieux qui croyait bien faire. Et nous appelons à l'unique vraie solution : ne pas acheter de dosette du tout[^4].

Amen-Compost.`,
      notes: [
        { id: 1, texte: "Les centres de tri français ont, ces dernières années, développé une expression idiomatique pour désigner les capsules de café : « les petits maudits ». Cela ne figure pas dans les rapports officiels, mais cela figure dans les conversations de pause-café (filtre, évidemment). On dit également « les Picsou » dans certains centres de l'Est, à cause de la couleur dorée des modèles haut de gamme." },
        { id: 2, texte: "Les exportations de déchets recyclables vers l'Asie du Sud-Est, jusqu'en 2017, étaient une grande hypocrisie collective : la Chine acceptait nos déchets, on les considérait comme recyclés, et tout le monde dormait bien. Puis la Chine a fermé son robinet. Et nos déchets se sont mis à s'accumuler. Et il a fallu inventer de nouvelles destinations (Indonésie, Malaisie, Vietnam). C'est ce que les sages appellent le « Tour des Déchets », l'équivalent moderne du Grand Tour des aristocrates du XVIIIᵉ siècle, en moins glamour." },
        { id: 3, texte: "Toute personne qui a déjà visité un centre de tri ressort de cette expérience modifiée. On y voit des humains, en gants et bouchons d'oreille, tenter de séparer manuellement ce qui n'aurait jamais dû être assemblé. Le centre de tri est, du point de vue de l'Ordre, le purgatoire industriel : c'est là que les objets paient pour leurs créateurs. Et c'est là que les ouvriers paient pour les consommateurs." },
        { id: 4, texte: "Cette phrase peut paraître radicale. Elle l'est. Mais comme l'a fait observer Sœur Compost : « Quand on a une fuite d'eau, on ne place pas une bassine sous la fuite en disant 'je gère.' On ferme le robinet à la source. » La dosette est la fuite. Le robinet est l'achat. Le reste est de la gestion de bassine." },
      ],
    },
    {
      id: "lamentation-4",
      titre: "Lamentation Quatrième — Sur la Cafetière Délaissée",
      ouverture: "« Ils ont prié devant la cafetière chromée et n'ont rien entendu. »",
      texte: `Ils ont prié devant la cafetière chromée et n'ont rien entendu. Ils ont admiré son ronronnement. Ils ont aimé son bouton lumineux. Ils ont cru qu'elle leur ferait gagner du temps.

Mais le temps gagné n'a servi qu'à scroller un peu plus. Le temps gagné n'a pas été investi dans la marche, dans la lecture, dans la contemplation. Le temps gagné s'est dissous dans le ressentiment professionnel[^1].

Pendant ce temps, dans le placard du dessus, la cafetière italienne dormait[^2]. La cafetière à filtre attendait. Le moulin à café manuel se taisait. Tous ces ustensiles patients, lents, magnifiques, justes — relégués au rang d'objets de musée.

Ô Cafetière Italienne, ô Moka, ô Bialetti, nous t'avons trahi pour une machine plus brillante. Nous avons préféré le bruit du percolateur à ton silence pulsatile. Nous avons préféré la programmation à l'attention[^3].

Reviens, ô Bialetti. Reviens dans nos matinées. Reviens nous apprendre la durée juste : six minutes pour quatre tasses, c'est notre salut[^4].

Amen-Compost.`,
      notes: [
        { id: 1, texte: "Le « ressentiment professionnel » est, selon les statistiques internes de l'Ordre, la principale activité humaine du XXIᵉ siècle, juste devant le scroll. On y consacre en moyenne 47 minutes par jour, ce qui, calculé sur une vie active, représente l'équivalent de huit ans de soliloque amer. Ces huit ans auraient pu, théoriquement, servir à apprendre une langue, à planter un verger, à lire les œuvres complètes d'à peu près n'importe qui. Mais voilà." },
        { id: 2, texte: "Les cafetières italiennes oubliées dans les placards du dessus constituent, en France métropolitaine, un stock estimé à 12 millions d'unités. Si l'on remettait simultanément en service ces 12 millions de cafetières, on remplacerait environ 4 milliards de capsules par an. Ces chiffres sont approximatifs, mais ils dorment dans les placards eux aussi. Personne ne les a vraiment vérifiés. C'est l'une des spécificités de l'Ordre : on cite les bons ordres de grandeur sans trop insister sur le décimal." },
        { id: 3, texte: "L'« attention » est, dans la théologie de l'Ordre, la denrée la plus rare du XXIᵉ siècle, plus rare que le pétrole, plus rare que l'eau douce, plus rare que les insectes pollinisateurs. Elle se vend désormais aux enchères sur les plateformes publicitaires. Quand on récupère son attention en faisant un café à la main, on commet une petite désertion économique. C'est, en soi, un acte révolutionnaire qui coûte six minutes." },
        { id: 4, texte: "Six minutes pour quatre tasses : c'est, à très peu de choses près, le temps qu'il faut pour finir une chanson de Léonard Cohen. C'est aussi le temps qu'il faut pour lire trois pages d'un livre ordinaire. Ou pour observer un Lichen sans s'impatienter. Ou pour écouter sa belle-mère sans intervenir, ce qui, dans certaines familles, constitue un exploit de patience comparable aux Olympiades." },
      ],
    },
    {
      id: "lamentation-5",
      titre: "Lamentation Cinquième — Sur le Café d'Un Million d'Années",
      ouverture: "« Le café d'un million d'années compressé en huit grammes. »",
      texte: `Le café fut une plante. La plante poussa pendant des siècles dans les hautes terres d'Éthiopie, du Yémen, du Vietnam, du Brésil, du Honduras, du Burundi, du Rwanda. Les paysans la cueillirent à la main. Les producteurs la dépulpèrent, la fermentèrent, la séchèrent, la triélrent, la torréfièrent. Les transporteurs la chargèrent dans des cargos. Les acheteurs la goutèrent. Les négociants la commercialisèrent[^1].

Tout cela pour qu'à la fin, dans un bureau parisien, on glisse un disque en aluminium dans une fente, et qu'on appuie sur un bouton, et que quatre-vingt-dix secondes plus tard, le café d'un million d'années évolutifs et de douze mille kilomètres de voyage soit éjecté tiède dans une tasse Made in China[^2].

C'est le crime de la dosette : non pas seulement son aluminium, mais sa banalisation. Elle a transformé un produit de luxe agricole en commodity industrielle. Elle a effacé le paysan. Elle a effacé la torréfaction. Elle a effacé le moulin. Elle a effacé le geste[^3].

Nous pleurons pour le café, qui ne mérite pas cela. Et nous nous engageons à le racheter : par notre moulin, par notre filtre, par notre attention, par notre lenteur[^4].

Amen-Compost.`,
      notes: [
        { id: 1, texte: "La chaîne complète du café compte environ 25 intermédiaires entre le caféier et la tasse, dont environ 23 ne perçoivent que des miettes pour leur travail. C'est une réalité que l'industrie n'aime pas mettre en avant, parce qu'elle pourrait susciter des questions inconfortables, comme par exemple : pourquoi le paysan reçoit-il 0,03 euro pour la cerise qui finit dans une dosette vendue 0,40 euro ? La réponse est complexe, mais elle commence par les mots « marges intermédiaires » et finit par les mots « pas de mon ressort »." },
        { id: 2, texte: "« Made in China » n'est pas un reproche à la Chine. C'est une constatation géographique : la tasse, la machine, la dosette, le café, le buveur, la chaise, le bureau, l'immeuble, et le ciel au-dessus de l'immeuble — toutes ces choses ont voyagé. Si on suivait géographiquement chaque atome présent à 9h15 dans le bureau d'un cadre parisien, on dessinerait une carte du monde où l'épicentre serait Paris et toutes les flèches arriveraient. Cela donnerait à réfléchir, mais on n'aura pas le temps : il faut envoyer un mail." },
        { id: 3, texte: "L'effacement du geste est, dans la théologie de l'Ordre, le péché majeur de la modernité. Tout ce que l'humain faisait avec ses mains — moudre, pétrir, coudre, semer, scier, écrire — a été délégué à des machines. On se demande désormais quoi faire de ses mains. La réponse officielle est : tenir un téléphone. La réponse mycélienne est : retoucher la terre." },
        { id: 4, texte: "Le mot « racheter » est ici théologique. On rachète un bien d'abord par le geste, ensuite par l'attention, jamais par l'argent. C'est un point fondamental de doctrine que les sages de l'Ordre rappellent à chaque assemblée : on ne se rachète pas en achetant. Cette tautologie a, pendant un temps, déclenché des fous rires aux assemblées, jusqu'à ce qu'on s'aperçoive qu'elle décrivait la moitié du commerce moderne." },
      ],
    },
    {
      id: "lamentation-6",
      titre: "Lamentation Sixième — Sur le Consommateur Pressé",
      ouverture: "« Pleure, ô consommateur pressé. Tu as bu vite et tu as oublié lent. »",
      texte: `Pleure, ô consommateur pressé. Tu as bu vite et tu as oublié lent. Tu as cru que la vitesse était une qualité. Tu as cru que le temps était de l'argent. Tu as cru qu'une dosette te ferait gagner trois minutes par matin[^1].

Mais ces trois minutes, où sont-elles ?

Tu ne te souviens pas. Elles se sont diluées dans tes mails, dans tes notifications, dans ta vague hâte généralisée. Elles n'ont rien produit. Elles n'ont pas été investies. Elles n'ont pas été dépensées en marche, en lecture, en méditation, en regard sur la fenêtre[^2].

Tu as gagné trois minutes par jour, soit dix-huit heures par an, soit deux jours par an, soit un mois par dix ans. Et ces deux jours par an, qu'en as-tu fait ? Tu n'en sais rien. Ils se sont perdus dans la grande indifférence du temps gagné jamais investi[^3].

Pendant ce temps, tu as accumulé mille capsules d'aluminium. Tu as alimenté une machine. Tu as nourri une multinationale. Tu as laissé un déchet métallique pour mille ans.

Le bilan est défavorable. La lenteur t'attend. Reviens à elle[^4].

Amen-Compost.`,
      notes: [
        { id: 1, texte: "« Le temps, c'est de l'argent » est, comme on le sait, une expression de Benjamin Franklin. Il l'a écrite en 1748, à une époque où l'on prenait encore le temps de tailler ses plumes d'oie. La phrase a beaucoup voyagé. Elle a été assimilée. Elle a fini par devenir un proverbe. Elle a, à l'usage, produit des dosettes. Il faut, peut-être, retourner ce proverbe sur sa tête : « L'argent, c'est du temps. » Et l'on commencera à voir que beaucoup d'argents achetés sont du temps perdu." },
        { id: 2, texte: "Sœur Compost a tenu pendant un an un journal de bord intitulé « Les Trois Minutes Sauvées de la Cafetière ». Elle y notait ce qu'elle faisait des trois minutes que la cafetière à capsules lui aurait fait gagner si elle l'avait conservée. Résultat sur l'année : 18 heures de regards par la fenêtre, 47 conversations avec sa voisine du dessus, et 3 dimanches passés à observer les Pigeons. Elle considère ce journal comme l'œuvre la plus précieuse de sa vie." },
        { id: 3, texte: "Il y a, dans la grande tradition de l'Ordre, une expression pour désigner le temps gagné qui ne sert à rien : « la monnaie de plomb ». Vous l'avez en poche, elle pèse, vous ne pouvez pas vous en débarrasser, et personne n'en veut. C'est l'équivalent métaphysique d'une pièce de 1 centime au fond d'un porte-monnaie : techniquement de la valeur, en pratique du poids." },
        { id: 4, texte: "« Reviens à elle » est l'une des seules invitations directes du Livre Sacré. La plupart des textes mycéliens suggèrent, proposent, méditent. Celui-ci appelle. C'est peut-être parce que la lenteur est l'une des rares choses que l'on peut récupérer immédiatement, sans abonnement, sans inscription, sans installer une application. Il suffit de poser le téléphone et de regarder par la fenêtre. C'est gratuit. C'est même remboursé." },
      ],
    },
    {
      id: "lamentation-7",
      titre: "Lamentation Septième — Sur le Retour des Outils Anciens",
      ouverture: "« Ô moulin oublié, ô filtre en tissu, ô cafetière italienne, revenez parmi nous. »",
      texte: `Ô moulin oublié, ô filtre en tissu, ô cafetière italienne, revenez parmi nous. Vous avez été remisés dans les caves. Vous avez été donnés aux brocantes. Vous avez été oubliés sur les étagères hautes des cuisines[^1].

Mais l'Ordre Mycélien vous rappelle.

Toi, moulin manuel, avec ta meule en céramique et ton tiroir à grains : tu vas revenir sur le plan de travail des cuisines, et tu vas tourner cinq minutes chaque matin, et le bruit régulier de ta mouture sera la première liturgie du jour[^2].

Toi, filtre en tissu : tu vas revenir dans la cafetière à infusion lente, et tu vas accueillir l'eau frémissante dans ta dentelle de coton, et tu vas livrer un café clair, limpide, sans amertume forcée[^3].

Toi, cafetière italienne : tu vas revenir sur les feux des cuisinières, et tu vas pulser ton chuintement caractéristique, et tu vas embuer les vitres d'un parfum qu'aucune dosette ne saura jamais imiter[^4].

Et vous serez nos alliés. Vous serez nos sacrements quotidiens. Vous serez les contre-poisons de la dosette. Vous serez les ustensiles de la résistance lente.

Béni soit le moulin. Bénie soit la cafetière italienne. Béni soit le filtre. Bénis soient ceux qui les remettent en service[^5].

Amen-Compost.`,
      notes: [
        { id: 1, texte: "Les étagères hautes des cuisines sont, dans la cosmologie mycélienne, le purgatoire des ustensiles : les objets qu'on n'ose pas jeter mais qu'on n'utilise plus. On y trouve : trois cafetières italiennes (de tailles incompatibles), un moulin à café manuel acheté lors d'un voyage en Italie en 2008, une cocotte en fonte trop lourde, et une yaourtière offerte à un anniversaire ignoré. Le seul tour à faire à cette étagère est de la vider. Le seul tour à éviter est d'y ajouter quelque chose." },
        { id: 2, texte: "La « première liturgie du jour » n'est pas une expression rhétorique. C'est une catégorie liturgique formelle de l'Ordre. Il y a 7 liturgies, comme il y a 7 Offices. Le moulin manuel est la première parce qu'elle se pratique dès le lever, encore en pyjama, avec une lumière qui n'a pas tout à fait choisi son angle. C'est, par expérience, le moment le plus saint de la journée." },
        { id: 3, texte: "Le filtre en tissu est, peut-être, l'objet le plus subversif des cuisines françaises. Il était partout au XIXᵉ siècle (les filtres « chaussettes »). Il a disparu au XXᵉ. Il revient timidement au XXIᵉ. Son retour est, pour les théologiens de l'Ordre, un signe que tout n'est pas perdu. Quand un objet considéré comme rétrograde revient, c'est qu'il n'était pas rétrograde : c'est qu'il était simplement en avance d'un siècle." },
        { id: 4, texte: "Le chuintement de la cafetière italienne est, dans la grande symphonie des cuisines, l'équivalent du chant d'un mince oiseau matinal. Il n'est pas spectaculaire. Il n'attire pas l'attention. Mais quand il est là, on sait que la journée a commencé. Et quand il n'est pas là, la journée a, on l'a remarqué plusieurs fois, du mal à démarrer pour de vrai." },
        { id: 5, texte: "« Bénis soient ceux qui les remettent en service » est la formule rituelle de remise en activité d'un ustensile dormant. Elle se prononce à voix haute, idéalement le matin, idéalement après avoir essuyé l'ustensile. Elle remplace, dans la liturgie de l'Ordre, le « bénis soit ce que nous allons manger » des autres traditions par quelque chose de plus tactile et de plus précis : on bénit l'ustensile, pas le produit. C'est, étrange détail, plus écologique." },
      ],
    },
  ],
};
