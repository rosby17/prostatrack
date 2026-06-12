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
  {
    week: 1,
    title: 'Comprendre votre prostate',
    description: 'Les bases anatomiques et pourquoi la nycturie apparaît après 50 ans.',
    duration: '12 min',
    type: 'video',
    done: true,
  },
  {
    week: 1,
    title: 'Protocole alimentaire semaine 1',
    description: 'Les 5 aliments à éliminer immédiatement et les 3 à ajouter dès ce soir.',
    duration: '8 min',
    type: 'guide',
    done: true,
  },
  {
    week: 2,
    title: 'Exercices du plancher pelvien',
    description: 'Protocole Kegel adapté aux hommes — 10 minutes par jour pour un résultat en 3 semaines.',
    duration: '15 min',
    type: 'video',
    done: true,
  },
  {
    week: 2,
    title: 'Hydratation intelligente',
    description: 'Le bon timing de consommation d\'eau pour réduire les réveils nocturnes.',
    duration: '6 min',
    type: 'guide',
    done: false,
  },
  {
    week: 3,
    title: 'Gestion du stress et prostate',
    description: 'Le lien direct entre cortisol et symptômes prostatiques. Techniques de respiration.',
    duration: '18 min',
    type: 'video',
    done: false,
  },
  {
    week: 3,
    title: 'Plantes et compléments naturels',
    description: 'Saw Palmetto, Ortie, Zinc — dosages, formes et protocoles basés sur les études.',
    duration: '10 min',
    type: 'guide',
    done: false,
  },
  {
    week: 4,
    title: 'Sommeil et récupération',
    description: 'Optimiser votre environnement de sommeil pour minimiser les interruptions.',
    duration: '14 min',
    type: 'video',
    done: false,
  },
  {
    week: 4,
    title: 'Bilan mois 1 et ajustements',
    description: 'Comment lire vos données ProstaTrack et ajuster votre protocole.',
    duration: '9 min',
    type: 'guide',
    done: false,
  },
]
