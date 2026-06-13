import { subDays, format } from 'date-fns'

export function generateMockLogs(days = 30) {
  return Array.from({ length: days }, (_, i) => {
    const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd')
    const progress = i / days
    return {
      id: i + 1,
      date,
      night_wakings: Math.max(0, Math.round(4 - progress * 3 + (Math.random() - 0.5))),
      sleep_quality: Math.min(5, Math.round(2 + progress * 2.5 + (Math.random() - 0.5))),
      urgency_level: Math.max(1, Math.round(4 - progress * 2.5 + (Math.random() - 0.5))),
      energy_level: Math.min(5, Math.round(2 + progress * 2.5 + (Math.random() - 0.5))),
      notes: '',
    }
  })
}

export const MOCK_USER = {
  id: 'demo',
  email: 'demo@prostatrack.app',
  user_metadata: { full_name: 'Jean-Michel' },
}

export const MOCK_LOGS = generateMockLogs(30)

export const MOCK_PROGRAM = [
  // ─── SEMAINE 1 : Comprendre et évaluer ───
  {
    week: 1,
    title: 'Comprendre votre prostate',
    description: 'Les bases anatomiques et physiologiques de la prostate. Pourquoi la nycturie (réveils nocturnes pour uriner) apparaît-elle après 50 ans ? Quels sont les facteurs de risque et comment les identifier dans votre quotidien.',
    duration: '14 min',
    type: 'video',
    done: false,
    youtubeUrl: '', // à remplir avec ton lien YouTube
    content: {
      objective: 'Comprendre le fonctionnement de votre prostate et identifier les causes de vos symptômes.',
      keyPoints: [
        'La prostate grossit naturellement avec l\'âge (hyperplasie bénigne)',
        'Elle entoure l\'urètre, ce qui explique les problèmes urinaires',
        'Les réveils nocturnes sont souvent le premier signe d\'alerte',
        'La nycturie touche 60% des hommes de plus de 60 ans',
        'Des changements simples de mode de vie peuvent réduire les symptômes de 30 à 50%',
      ],
      protocol: [
        'Tenez un journal de vos mictions pendant 48h (heure, volume approximatif)',
        'Notez à quelle heure vous buvez et quoi',
        'Identifiez vos 3 principaux symptômes parmi : urgence, fuite, jet faible, réveils nocturnes',
      ],
      dailyActions: [
        { id: 'w1_d1_1', text: 'Regarder la vidéo complète', done: false },
        { id: 'w1_d1_2', text: 'Faire le bilan de mes symptômes actuels', done: false },
        { id: 'w1_d1_3', text: 'Commencer le journal de mes mictions aujourd\'hui', done: false },
      ],
      tip: '💡 Astuce du jour : Pesez-vous le matin à jeun. La nycturie est souvent aggravée par la rétention d\'eau dans les jambes le soir qui remonte la nuit.',
    }
  },
  {
    week: 1,
    title: 'Protocole alimentaire semaine 1',
    description: 'Les 5 aliments à éliminer immédiatement pour réduire l\'inflammation prostatique, et les 3 super-aliments à intégrer dès ce soir. Plan de repas simple et pratique pour les 7 premiers jours.',
    duration: '10 min',
    type: 'guide',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Adopter une alimentation anti-inflammatoire qui soulage la prostate dès la première semaine.',
      keyPoints: [
        'La tomate cuite (lycopène) réduit le PSA et l\'inflammation prostatique',
        'Le zinc (huîtres, graines de courge) est essentiel au bon fonctionnement de la prostate',
        'L\'alcool et la caféine irritent la vessie et aggravent la nycturie',
        'Les aliments épicés augmentent les urgences urinaires',
        'Les oméga-3 réduisent l\'hyperplasie bénigne de la prostate',
      ],
      protocol: [
        '🚫 Éliminer cette semaine : alcool, café après 14h, plats épicés, charcuteries, sodas',
        '✅ Ajouter chaque jour : une portion de tomates cuites (sauce, soupe), une poignée de graines de courge, du poisson gras 3x/semaine',
        '💧 Boire 1,5L d\'eau par jour, TOUT avant 18h pour réduire les réveils nocturnes',
      ],
      dailyActions: [
        { id: 'w1_d2_1', text: 'Arrêter le café et l\'alcool pour 7 jours', done: false },
        { id: 'w1_d2_2', text: 'Manger une portion de tomates cuites aujourd\'hui', done: false },
        { id: 'w1_d2_3', text: 'Ne plus boire après 18h ce soir', done: false },
        { id: 'w1_d2_4', text: 'Acheter des graines de courge pour la semaine', done: false },
      ],
      tip: '💡 Astuce : 30g de graines de courge par jour apportent 100% des besoins en zinc. Mangez-les le matin sur votre yaourt ou directement.',
    }
  },

  // ─── SEMAINE 2 : Le plancher pelvien ───
  {
    week: 2,
    title: 'Exercices du plancher pelvien',
    description: 'Le protocole Kegel adapté aux hommes — différent de celui des femmes. 10 minutes par jour pour renforcer le sphincter urétral et réduire les fuites et urgences. Technique précise pour cibler les bons muscles.',
    duration: '16 min',
    type: 'video',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Maîtriser les exercices de Kegel masculins pour renforcer le contrôle urinaire.',
      keyPoints: [
        'Le plancher pelvien soutient la vessie, la prostate et le rectum',
        'Des exercices réguliers réduisent les urgences de 70% en 3 mois',
        'L\'erreur fréquente : contracter les fessiers au lieu du périnée',
        'La technique correcte : imaginez que vous retenez un gaz sans bouger les fesses',
        'Visible dès 4 semaines de pratique régulière',
      ],
      protocol: [
        'TROUVER LE BON MUSCLE : Arrêtez votre jet d\'urine à mi-miction une fois (juste pour identifier le muscle, pas en pratique régulière)',
        'EXERCICE DE BASE : Contracter 3 secondes, relâcher 3 secondes, répéter 10 fois = 1 série',
        'PROGRAMME : 3 séries par jour (matin au réveil, midi, soir avant dormir)',
        'PROGRESSION semaine 2 : passer à 5 secondes de contraction',
        'VARIATION : contractions rapides (1 sec) × 20 pour le contrôle d\'urgence',
      ],
      dailyActions: [
        { id: 'w2_d1_1', text: 'Série Kegel du matin (10 × 3 sec)', done: false },
        { id: 'w2_d1_2', text: 'Série Kegel du midi (10 × 3 sec)', done: false },
        { id: 'w2_d1_3', text: 'Série Kegel du soir (10 × 3 sec)', done: false },
      ],
      tip: '💡 Faites vos Kegel assis dans votre voiture, devant la TV, au bureau. Personne ne le verra. La régularité prime sur l\'intensité.',
      hasTimer: true,
      timerSeconds: 600, // 10 minutes
    }
  },
  {
    week: 2,
    title: 'Hydratation intelligente',
    description: 'Le paradoxe de l\'hydratation : boire moins aggrave les symptômes, mais boire au mauvais moment non plus. Le protocole exact d\'hydratation pour réduire les réveils nocturnes sans déshydratation.',
    duration: '8 min',
    type: 'guide',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Optimiser votre hydratation pour réduire les réveils nocturnes de 50%.',
      keyPoints: [
        'Se déshydrater concentre les urines et irrite la vessie davantage',
        'L\'objectif : 1,5 à 2L par jour, dont 80% avant 17h',
        'L\'eau citronnée alcalinise les urines et réduit l\'irritation',
        'Certaines boissons sont plus irritantes que d\'autres',
        'La position assise pour dormir peut réduire la nycturie en cas de jambes enflées',
      ],
      protocol: [
        '⏰ 6h-12h : Boire 800ml (4 grands verres) — votre quota principal',
        '⏰ 12h-17h : Boire 600ml avec les repas',
        '⏰ 17h-20h : Maximum 200ml (1 verre avec le dîner)',
        '⏰ Après 20h : Zéro eau, sauf si absolue nécessité (1 petite gorgée)',
        '🚫 À éviter : café, alcool, jus d\'agrumes, boissons gazeuses, thé noir',
        '✅ À privilégier : eau plate, tisane ortie (diurétique naturel le matin seulement), eau citronnée',
      ],
      dailyActions: [
        { id: 'w2_d2_1', text: 'Boire 2 grands verres d\'eau avant 10h', done: false },
        { id: 'w2_d2_2', text: 'Ne pas boire après 19h ce soir', done: false },
        { id: 'w2_d2_3', text: 'Remplacer café du soir par tisane à l\'ortie (matin uniquement)', done: false },
      ],
      tip: '💡 Pesez-vous le soir et le matin. Si vous prenez plus de 1kg la nuit, votre corps retient de l\'eau dans les jambes le jour qui remonte la nuit — parlez-en à votre médecin.',
    }
  },

  // ─── SEMAINE 3 : Stress et hormones ───
  {
    week: 3,
    title: 'Gestion du stress et prostate',
    description: 'Le lien direct entre cortisol chronique et hyperplasie prostatique. Les techniques de respiration et de cohérence cardiaque qui réduisent l\'inflammation prostatique. Protocole de 5 minutes par jour.',
    duration: '18 min',
    type: 'video',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Comprendre et couper le lien stress-prostate grâce à des techniques simples.',
      keyPoints: [
        'Le cortisol chronique stimule la croissance des cellules prostatiques',
        'Le stress augmente la tension dans le plancher pelvien (aggrave les symptômes)',
        'La cohérence cardiaque réduit le cortisol de 23% en 5 minutes',
        'Le système nerveux autonome contrôle la contraction de la vessie',
        'La relaxation active le système parasympathique (détente de la vessie)',
      ],
      protocol: [
        'COHÉRENCE CARDIAQUE : 5 secondes d\'inspiration, 5 secondes d\'expiration, pendant 5 minutes',
        'Pratiquer 3 fois par jour : matin, après-midi, avant dormir',
        'Application gratuite recommandée : RespiRelax+ (synchronisation visuelle)',
        'SCAN CORPOREL le soir : 5 minutes de relaxation progressive des muscles pelviens',
        'Éviter les écrans 1h avant le coucher (active le cortisol)',
      ],
      dailyActions: [
        { id: 'w3_d1_1', text: 'Cohérence cardiaque du matin (5 min)', done: false },
        { id: 'w3_d1_2', text: 'Cohérence cardiaque du soir (5 min)', done: false },
        { id: 'w3_d1_3', text: 'Éteindre les écrans à 21h', done: false },
      ],
      tip: '💡 Installez RespiRelax+ sur votre téléphone. Réglez-le sur 5-5 (5 sec inspiration, 5 sec expiration). 5 minutes le matin changent toute la journée.',
      hasTimer: true,
      timerSeconds: 300,
    }
  },
  {
    week: 3,
    title: 'Plantes et compléments naturels',
    description: 'Saw Palmetto, Ortie, Zinc, Pygeum africain — les études cliniques, les dosages efficaces, les formes galéniques recommandées. Ce qui marche vraiment vs ce qui est du marketing.',
    duration: '12 min',
    type: 'guide',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Choisir les bons compléments avec les bons dosages pour maximiser les résultats.',
      keyPoints: [
        'Saw Palmetto (320mg/jour d\'extrait liposterolique) réduit la nycturie de 25%',
        'Ortie (Urtica dioica, 300mg/jour) améliore le débit urinaire',
        'Zinc (30mg/jour) est essentiel à la santé prostatique',
        'Pygeum africain (100mg/jour) réduit l\'inflammation',
        'L\'association Saw Palmetto + Ortie est plus efficace que chaque plante seule',
      ],
      protocol: [
        '🌿 Saw Palmetto : 160mg matin + 160mg soir (avec repas gras pour absorption)',
        '🌱 Ortie : 300mg le matin',
        '🦪 Zinc : 30mg le soir (bisglycinate de zinc = meilleure absorption)',
        '🌳 Pygeum : 50mg matin + 50mg soir',
        '⏳ Délai d\'action : 4 à 8 semaines pour observer les effets',
        '⚠️ Toujours informer votre médecin avant de commencer',
      ],
      dailyActions: [
        { id: 'w3_d2_1', text: 'Commander Saw Palmetto 160mg (extrait liposterolique)', done: false },
        { id: 'w3_d2_2', text: 'Commencer le zinc 30mg ce soir', done: false },
        { id: 'w3_d2_3', text: 'Parler des compléments à mon médecin', done: false },
      ],
      tip: '💡 Choisissez toujours un Saw Palmetto avec la mention "extrait liposterolique standardisé à 85-95% d\'acides gras". Les gélules en poudre simple ne fonctionnent pas.',
    }
  },

  // ─── SEMAINE 4 : Sommeil et récupération ───
  {
    week: 4,
    title: 'Optimiser votre sommeil',
    description: 'L\'environnement de sommeil, les positions recommandées, la gestion de la température et de la lumière. Protocole complet pour minimiser les interruptions nocturnes et améliorer la qualité de récupération.',
    duration: '15 min',
    type: 'video',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Créer les conditions optimales pour un sommeil profond avec le moins d\'interruptions possible.',
      keyPoints: [
        'La température idéale de la chambre est 16-18°C pour un sommeil profond',
        'L\'obscurité totale augmente la mélatonine et améliore la qualité du sommeil',
        'Dormir légèrement surélevé (tête à 15°) réduit le reflux et la nycturie',
        'La position sur le côté gauche est la meilleure pour la prostate',
        'Un rituel de coucher fixe synchronise l\'horloge biologique',
      ],
      protocol: [
        '🛏️ Position recommandée : côté gauche, jambes légèrement fléchies',
        '🌡️ Chambre à 17-18°C maximum',
        '🌑 Obscurité totale (masque de nuit si nécessaire)',
        '📱 Mode avion sur le téléphone dès 21h30',
        '⏰ Coucher fixe, même le week-end (±30 min max)',
        '🚽 Si vous devez vous lever : évitez d\'allumer la lumière (veilleuse rouge uniquement)',
      ],
      dailyActions: [
        { id: 'w4_d1_1', text: 'Régler le chauffage à 18°C ce soir', done: false },
        { id: 'w4_d1_2', text: 'Mettre le téléphone en mode avion à 21h30', done: false },
        { id: 'w4_d1_3', text: 'Dormir sur le côté gauche', done: false },
        { id: 'w4_d1_4', text: 'Se coucher à la même heure qu\'hier', done: false },
      ],
      tip: '💡 Si vous vous levez la nuit, ne regardez pas votre téléphone. La lumière bleue supprime la mélatonine pour 90 minutes et vous empêche de vous rendormir rapidement.',
    }
  },
  {
    week: 4,
    title: 'Bilan du premier mois',
    description: 'Comment lire et interpréter vos données ProstaTrack. Calculer votre progression réelle. Identifier ce qui fonctionne le mieux pour vous. Ajuster votre protocole pour le mois 2.',
    duration: '10 min',
    type: 'guide',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Analyser vos 30 premiers jours et optimiser votre protocole pour le mois 2.',
      keyPoints: [
        'Un journal régulier permet de détecter les patterns invisibles à l\'œil nu',
        'La progression n\'est pas linéaire : des plateaux sont normaux',
        'Les meilleures améliorations viennent souvent au bout de 3-6 semaines',
        'L\'alimentation et les exercices ont le plus grand impact à court terme',
        'La cohérence sur 2-3 habitudes vaut mieux que 10 habitudes mal suivies',
      ],
      protocol: [
        '📊 Comparez votre score du jour 1 vs aujourd\'hui',
        '🔍 Identifiez votre habitude la plus régulièrement respectée : c\'est votre point fort',
        '⚠️ Identifiez l\'habitude la moins respectée : c\'est votre levier principal',
        '🎯 Choisissez UNE seule nouvelle habitude à ajouter pour le mois 2',
        '📅 Planifiez votre consultation médicale si vous n\'en avez pas eu depuis 1 an',
      ],
      dailyActions: [
        { id: 'w4_d2_1', text: 'Voir mon score de progression dans l\'app', done: false },
        { id: 'w4_d2_2', text: 'Identifier mon habitude la plus efficace', done: false },
        { id: 'w4_d2_3', text: 'Prendre RDV médecin si pas fait depuis 1 an', done: false },
      ],
      tip: '💡 Félicitez-vous pour chaque petit progrès. La science montre que la reconnaissance de ses propres efforts augmente la probabilité de continuer à long terme.',
    }
  },

  // ─── SEMAINE 5 à 8 ───
  {
    week: 5,
    title: 'Activité physique et prostate',
    description: 'Les exercices physiques qui réduisent le risque de cancer de la prostate de 30%. La marche rapide, la natation, le vélo adapté. Ce qu\'il faut éviter (vélo non adapté aggrave les symptômes).',
    duration: '14 min',
    type: 'video',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Intégrer une activité physique adaptée qui protège et soulage la prostate.',
      keyPoints: [
        '30 minutes de marche rapide 5 fois/semaine réduit les symptômes de 25%',
        'La natation est l\'exercice le plus complet sans pression sur le périnée',
        'Le vélo classique comprime le périnée — utiliser une selle avec encoche centrale',
        'Les hommes sédentaires ont 2x plus de risques d\'hyperplasie sévère',
        'L\'exercice réduit l\'IGF-1 (facteur de croissance qui stimule la prostate)',
      ],
      protocol: [
        '🚶 Marche rapide : 30 min/jour, rythme où vous pouvez parler mais pas chanter',
        '🏊 Natation : 45 min, 2-3 fois/semaine (idéal)',
        '🧘 Yoga/stretching du périnée : 15 min le soir',
        '⛔ Éviter : station assise prolongée > 2h sans pause, soulever de lourdes charges',
        '✅ Faire une pause et marcher 5 min toutes les 2h si vous travaillez assis',
      ],
      dailyActions: [
        { id: 'w5_d1_1', text: 'Marche rapide de 30 minutes aujourd\'hui', done: false },
        { id: 'w5_d1_2', text: 'Pause de 5 min toutes les 2h si assis', done: false },
        { id: 'w5_d1_3', text: 'Stretching du périnée ce soir (10 min)', done: false },
      ],
      tip: '💡 Si vous faites du vélo, investissez dans une selle "noseless" ou avec une encoche centrale. Cela peut réduire les symptômes de 70% chez les cyclistes.',
      hasTimer: true,
      timerSeconds: 1800,
    }
  },
  {
    week: 5,
    title: 'Anti-inflammatoires naturels',
    description: 'Curcuma, gingembre, oméga-3, quercétine — le protocole anti-inflammatoire complet pour la prostate. Recettes pratiques et dosages cliniquement validés.',
    duration: '11 min',
    type: 'guide',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Réduire l\'inflammation chronique de la prostate par l\'alimentation et les compléments.',
      keyPoints: [
        'La curcumine inhibe les voies inflammatoires NF-κB qui stimulent la prostate',
        'Les oméga-3 (EPA/DHA) réduisent les prostaglandines pro-inflammatoires',
        'La quercétine (oignon, pomme) inhibe la 5-alpha-réductase (comme les médicaments)',
        'Le resvératrol (raisin rouge) protège les cellules prostatiques',
        'Le thé vert (EGCG) ralentit la prolifération cellulaire prostatique',
      ],
      protocol: [
        '🌿 Curcuma : 500mg de curcumine + pipérine (poivre noir) avec repas gras',
        '🐟 Oméga-3 : 2g d\'EPA+DHA par jour (poisson gras ou complément)',
        '🍵 Thé vert : 3 tasses par jour (avant 16h pour éviter la caféine le soir)',
        '🧅 Quercétine : oignon rouge, pommes avec peau, câpres chaque jour',
        '🍷 Resvératrol : 150mg/jour ou verre de vin rouge (max 1/jour, avant 18h)',
      ],
      dailyActions: [
        { id: 'w5_d2_1', text: 'Prendre curcuma + pipérine au déjeuner', done: false },
        { id: 'w5_d2_2', text: 'Boire 2 tasses de thé vert aujourd\'hui', done: false },
        { id: 'w5_d2_3', text: 'Manger une pomme avec la peau', done: false },
      ],
      tip: '💡 Le curcuma sans pipérine (poivre noir) n\'est presque pas absorbé. Toujours associer les deux. La biodisponibilité augmente de 2000% avec la pipérine.',
    }
  },
  {
    week: 6,
    title: 'Sexualité et prostate',
    description: 'Le lien entre activité sexuelle et santé prostatique. Ce que la science dit sur la fréquence recommandée. Les bénéfices de l\'éjaculation régulière sur la prostate.',
    duration: '13 min',
    type: 'video',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Comprendre l\'impact de la sexualité sur la santé prostatique et optimiser votre vie intime.',
      keyPoints: [
        'Une étude Harvard montre que 21 éjaculations/mois réduisent le risque de cancer de 33%',
        'L\'éjaculation régulière "vide" la prostate et réduit la stase de fluide',
        'Les problèmes érectiles sont souvent liés à la même inflammation que les symptômes prostatiques',
        'L\'oxyde nitrique (produit lors de l\'excitation) est vasodilatateur et protecteur',
        'La dysfonction érectile peut être améliorée par les mêmes habitudes que les symptômes prostatiques',
      ],
      protocol: [
        '📊 Objectif recommandé : 3-4 éjaculations par semaine (avec partenaire ou seul)',
        '🧘 Si problèmes érectiles : consulter un urologue + pratiquer les exercices Kegel',
        '🌿 L\'arginine (3g/jour) et la citrulline (1,5g/jour) améliorent la circulation pelvienne',
        '❤️ La communication avec le partenaire réduit le stress pelvien',
      ],
      dailyActions: [
        { id: 'w6_d1_1', text: 'Continuer les exercices Kegel (3 séries)', done: false },
        { id: 'w6_d1_2', text: 'Note mes niveaux d\'énergie dans l\'app', done: false },
      ],
      tip: '💡 L\'inactivité sexuelle prolongée peut aggraver les symptômes prostatiques par stase des fluides. Une activité sexuelle régulière est médicalement recommandée.',
    }
  },
  {
    week: 6,
    title: 'Sommeil profond : protocole avancé',
    description: 'Mélatonine, magnésium, rituels du coucher avancés. Le protocole des cliniques du sommeil pour atteindre les phases 3 et 4 du sommeil malgré les interruptions nocturnes.',
    duration: '12 min',
    type: 'guide',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Maximiser la qualité du sommeil profond pour une meilleure récupération et moins de fatigue.',
      keyPoints: [
        'La mélatonine à petite dose (0,5mg) est plus efficace qu\'à haute dose (5mg)',
        'Le magnésium glycinate favorise la relaxation musculaire du périnée',
        'Le bain chaud 90 min avant le coucher accélère l\'endormissement de 50%',
        'La lumière rouge ne perturbe pas la mélatonine (contrairement au bleu)',
        'Le jeûne de 12h avant le coucher réduit les éveils nocturnes',
      ],
      protocol: [
        '🌙 20h30 : Dernier repas léger',
        '🛁 21h : Bain ou douche chaude (10-15 min à 40°C)',
        '📵 21h30 : Arrêt de tous les écrans',
        '🌿 22h : Magnésium glycinate 400mg + mélatonine 0,5mg',
        '📖 22h-22h30 : Lecture (papier uniquement) à lumière rouge',
        '😴 22h30-23h : Coucher, cohérence cardiaque 5 min avant de fermer les yeux',
      ],
      dailyActions: [
        { id: 'w6_d2_1', text: 'Bain chaud à 21h ce soir', done: false },
        { id: 'w6_d2_2', text: 'Prendre magnésium 400mg avant de dormir', done: false },
        { id: 'w6_d2_3', text: 'Arrêter les écrans à 21h30', done: false },
      ],
      tip: '💡 Le magnésium glycinate est la forme la plus absorbée et la moins laxative. Évitez le magnésium oxyde (forme la moins efficace, pourtant la plus vendue).',
    }
  },
  {
    week: 7,
    title: 'Détox et santé rénale',
    description: 'Comment soutenir les reins pour réduire la charge sur la prostate. Les aliments et boissons qui purifient les voies urinaires. Protocole de détox urologique de 7 jours.',
    duration: '14 min',
    type: 'video',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Soutenir la santé rénale et urologique pour réduire les irritations de la vessie.',
      keyPoints: [
        'Les reins filtrent 180L de sang par jour — leur santé impacte directement la vessie',
        'Les cranberries (canneberges) préviennent les infections urinaires récurrentes',
        'L\'excès de sel aggrave la rétention d\'eau et donc la nycturie',
        'Certains médicaments courants sont néphrotoxiques (anti-inflammatoires, certains antibiotiques)',
        'L\'eau minérale riche en magnésium est préférable à l\'eau du robinet calcaire',
      ],
      protocol: [
        '🫐 Jus de cranberry pur (sans sucre ajouté) : 150ml le matin',
        '🧂 Réduire le sel à moins de 5g/jour (équivalent d\'une cuillère à café)',
        '🥒 Légumes diurétiques : concombre, céleri, asperges, artichaut',
        '💊 Vérifier avec votre médecin si vos médicaments impactent les reins',
        '💧 Eau filtrée ou eau minérale faiblement minéralisée de préférence',
      ],
      dailyActions: [
        { id: 'w7_d1_1', text: 'Boire 150ml de jus de cranberry pur ce matin', done: false },
        { id: 'w7_d1_2', text: 'Manger un légume diurétique aujourd\'hui', done: false },
        { id: 'w7_d1_3', text: 'Vérifier la teneur en sel de mes aliments habituels', done: false },
      ],
      tip: '💡 Lisez les étiquettes : 1g de sodium = 2,5g de sel. Un homme de 65 ans mange en moyenne 9g de sel/jour — presque le double du maximum recommandé.',
    }
  },
  {
    week: 7,
    title: 'Suivi médical et examens',
    description: 'Quels examens demander à votre médecin, à quelle fréquence, comment interpréter votre PSA. La liste des questions à poser lors de votre prochaine consultation.',
    duration: '11 min',
    type: 'guide',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Être un patient informé et actif dans le suivi médical de votre prostate.',
      keyPoints: [
        'Le PSA (Antigène Spécifique Prostatique) doit être contrôlé tous les ans après 50 ans',
        'Un PSA < 4 ng/mL est généralement rassurant, mais le contexte compte',
        'La vitesse d\'augmentation du PSA (PSA velocity) est plus informative que la valeur seule',
        'Le toucher rectal reste recommandé malgré son impopularité',
        'L\'échographie prostatique permet de mesurer le volume exact',
      ],
      protocol: [
        '📋 EXAMENS ANNUELS RECOMMANDÉS : PSA, NFS, créatinine, bilan lipidique',
        '🩺 EXAMENS TOUS LES 2 ANS : toucher rectal, échographie prostatique',
        '❓ QUESTIONS À POSER : "Mon PSA a-t-il évolué ? Quelle est la taille de ma prostate ? Mes symptômes nécessitent-ils un traitement médicamenteux ?"',
        '📱 Apportez vos données ProstaTrack à la consultation — elles aident le médecin',
        '⚠️ Consulter immédiatement si : sang dans les urines, douleur pelvienne, arrêt brutal des urines',
      ],
      dailyActions: [
        { id: 'w7_d2_1', text: 'Prendre RDV pour bilan annuel si pas fait', done: false },
        { id: 'w7_d2_2', text: 'Retrouver mes derniers résultats de PSA', done: false },
        { id: 'w7_d2_3', text: 'Préparer mes questions pour le médecin', done: false },
      ],
      tip: '💡 Apportez ce graphique à votre médecin : montrez-lui l\'évolution de vos symptômes sur les 8 semaines. Un journal objectif change la qualité de la consultation.',
    }
  },
  {
    week: 8,
    title: 'Maintenir ses résultats à vie',
    description: 'Comment transformer 8 semaines de protocole en habitudes permanentes. Les 5 piliers de la santé prostatique à long terme. Le plan de maintenance mensuel.',
    duration: '16 min',
    type: 'video',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Ancrer les meilleures habitudes et construire un plan de santé durable.',
      keyPoints: [
        'Les habitudes prises en 8 semaines ont besoin de 6 mois pour devenir automatiques',
        'La règle des 80/20 : 20% des habitudes produisent 80% des résultats',
        'La rechute fait partie du processus — l\'important est de reprendre rapidement',
        'Le soutien social multiplie par 3 les chances de maintenir ses habitudes',
        'Un contrôle mensuel de vos données permet de détecter les régressions tôt',
      ],
      protocol: [
        '🏆 VOS 5 PILIERS À MAINTENIR : Kegel quotidien, hydratation intelligente, alimentation anti-inflammatoire, activité physique, gestion du stress',
        '📅 MAINTENANCE MENSUELLE : revoir votre score, ajuster si besoin',
        '🔄 PROTOCOLE DE REPRISE : si vous avez arrêté, recommencez par la semaine 2 (Kegel + hydratation)',
        '👨‍⚕️ SUIVI MÉDICAL : PSA annuel, consultation si score baisse de plus de 15 points en 2 semaines',
        '🎯 OBJECTIF LONG TERME : maintenir un score ≥ 70 sur ProstaTrack',
      ],
      dailyActions: [
        { id: 'w8_d1_1', text: 'Faire mon bilan final des 8 semaines', done: false },
        { id: 'w8_d1_2', text: 'Choisir mes 3 habitudes permanentes à maintenir', done: false },
        { id: 'w8_d1_3', text: 'Planifier mon prochain contrôle médical', done: false },
        { id: 'w8_d1_4', text: 'Me féliciter pour ces 8 semaines de travail !', done: false },
      ],
      tip: '💡 Vous avez accompli quelque chose que peu de gens font : investir sérieusement dans votre santé pendant 8 semaines. Votre prostate et votre qualité de vie vous en remercient.',
    }
  },
  {
    week: 8,
    title: 'Programme de maintenance mensuel',
    description: 'Le guide condensé de tous les protocoles à maintenir chaque mois. Checklist mensuelle, rappels saisonniers, et comment adapter le programme selon les saisons.',
    duration: '9 min',
    type: 'guide',
    done: false,
    youtubeUrl: '',
    content: {
      objective: 'Avoir un plan de maintenance clair et simple pour les mois et années à venir.',
      keyPoints: [
        'L\'hiver aggrave souvent les symptômes (moins d\'activité, plus de sel, moins d\'eau)',
        'L\'été facilite l\'hydratation et l\'activité physique — profitez-en pour consolider',
        'Un bilan trimestriel de 30 minutes suffit à ajuster le protocole',
        'La communauté et le partage d\'expérience sont les meilleurs motivateurs long terme',
        'ProstaTrack vous envoie un rappel si votre score baisse de plus de 10 points',
      ],
      protocol: [
        '📋 CHAQUE JOUR : Kegel matin, hydratation intelligente, pas d\'alcool/café après 14h',
        '📋 CHAQUE SEMAINE : 3x30min activité physique, compléments (Saw Palmetto, zinc)',
        '📋 CHAQUE MOIS : revoir le score, journal des symptômes, ajuster si besoin',
        '📋 CHAQUE TRIMESTRE : bilan avec médecin, ajuster les compléments',
        '📋 CHAQUE ANNÉE : PSA, échographie si recommandée',
      ],
      dailyActions: [
        { id: 'w8_d2_1', text: 'Imprimer/noter la checklist mensuelle', done: false },
        { id: 'w8_d2_2', text: 'Programmer un rappel mensuel dans l\'agenda', done: false },
        { id: 'w8_d2_3', text: 'Partager mon expérience avec un proche si l\'occasion se présente', done: false },
      ],
      tip: '💡 Félicitations pour avoir terminé le programme complet ! Vous faites maintenant partie des hommes qui prennent leur santé prostatique en main. Continuez à saisir votre journal — vos données sont votre meilleur outil.',
    }
  },
]