import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { format, differenceInDays } from 'date-fns'

// Définition de tous les badges
export const BADGES = [
  { key: 'first_log', icon: '🌱', label: 'Premier pas', desc: 'Premier journal saisi', color: '#22c55e' },
  { key: 'streak_3', icon: '🔥', label: 'En feu', desc: '3 jours consécutifs', color: '#f97316' },
  { key: 'streak_7', icon: '⚡', label: 'Semaine parfaite', desc: '7 jours consécutifs', color: '#eab308' },
  { key: 'streak_30', icon: '💎', label: 'Mois de fer', desc: '30 jours consécutifs', color: '#8b5cf6' },
  { key: 'score_70', icon: '🏆', label: 'Bonne santé', desc: 'Score supérieur à 70', color: '#0d7377' },
  { key: 'score_90', icon: '🌟', label: 'Excellence', desc: 'Score supérieur à 90', color: '#f59e0b' },
  { key: 'logs_10', icon: '📊', label: 'Régulier', desc: '10 journaux saisis', color: '#3b82f6' },
  { key: 'logs_30', icon: '🎯', label: 'Engagé', desc: '30 journaux saisis', color: '#ec4899' },
  { key: 'program_week1', icon: '📚', label: 'Semaine 1', desc: 'Semaine 1 du programme terminée', color: '#14b8a6' },
]

export function useGamification(logs = [], score = 0, programDoneCount = 0) {
  const { user } = useAuth()
  const [streak, setStreak] = useState({ current: 0, longest: 0 })
  const [badges, setBadges] = useState([])
  const [newBadges, setNewBadges] = useState([]) // badges fraîchement gagnés
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchGamification()
  }, [user])

  // Vérifier et attribuer les badges quand les données changent
  useEffect(() => {
    if (!user || logs.length === 0) return
    checkAndAwardBadges()
  }, [logs, score, programDoneCount])

  const fetchGamification = async () => {
    setLoading(true)
    const [{ data: streakData }, { data: badgeData }] = await Promise.all([
      supabase.from('user_streaks').select('*').eq('user_id', user.id).single(),
      supabase.from('user_badges').select('*').eq('user_id', user.id),
    ])

    if (streakData) {
      setStreak({ current: streakData.current_streak, longest: streakData.longest_streak })
    }
    if (badgeData) {
      setBadges(badgeData.map(b => b.badge_key))
    }
    setLoading(false)
  }

  const updateStreak = async (logDate) => {
    await supabase.rpc('update_streak', {
      p_user_id: user.id,
      p_log_date: logDate
    })
    await fetchGamification()
  }

  const awardBadge = async (badgeKey) => {
    const { error } = await supabase
      .from('user_badges')
      .insert({ user_id: user.id, badge_key: badgeKey })

    if (!error) {
      setBadges(prev => [...prev, badgeKey])
      setNewBadges(prev => [...prev, badgeKey])
      // Effacer la notification après 4s
      setTimeout(() => {
        setNewBadges(prev => prev.filter(k => k !== badgeKey))
      }, 4000)
    }
  }

  const checkAndAwardBadges = async () => {
    const { data: existingBadges } = await supabase
      .from('user_badges')
      .select('badge_key')
      .eq('user_id', user.id)

    const earned = existingBadges?.map(b => b.badge_key) || []
    const toCheck = [
      { key: 'first_log', condition: logs.length >= 1 },
      { key: 'logs_10', condition: logs.length >= 10 },
      { key: 'logs_30', condition: logs.length >= 30 },
      { key: 'score_70', condition: score >= 70 },
      { key: 'score_90', condition: score >= 90 },
      { key: 'streak_3', condition: streak.current >= 3 },
      { key: 'streak_7', condition: streak.current >= 7 },
      { key: 'streak_30', condition: streak.current >= 30 },
      { key: 'program_week1', condition: programDoneCount >= 2 },
    ]

    for (const { key, condition } of toCheck) {
      if (condition && !earned.includes(key)) {
        await awardBadge(key)
      }
    }
  }

  // Générer l'insight quotidien basé sur les données
  const getDailyInsight = () => {
    if (logs.length === 0) return null

    const last7 = logs.slice(-7)
    const prev7 = logs.slice(-14, -7)
    const avg = (arr, key) => arr.length ? arr.reduce((s, l) => s + (l[key] || 0), 0) / arr.length : 0

    const wakingsCurrent = avg(last7, 'night_wakings')
    const wakingsPrev = avg(prev7, 'night_wakings')
    const sleepCurrent = avg(last7, 'sleep_quality')
    const sleepPrev = avg(prev7, 'sleep_quality')
    const energyCurrent = avg(last7, 'energy_level')

    const insights = []

    if (prev7.length > 0) {
      if (wakingsCurrent < wakingsPrev - 0.3) {
        insights.push({ icon: '🌙', text: `Vos réveils nocturnes ont diminué de ${(wakingsPrev - wakingsCurrent).toFixed(1)} cette semaine. Continuez !`, color: '#0d7377' })
      }
      if (sleepCurrent > sleepPrev + 0.3) {
        insights.push({ icon: '😴', text: `Votre qualité de sommeil s'améliore de ${((sleepCurrent - sleepPrev) / sleepPrev * 100).toFixed(0)}% cette semaine.`, color: '#3b82f6' })
      }
    }

    if (streak.current >= 3) {
      insights.push({ icon: '🔥', text: `${streak.current} jours consécutifs ! Votre régularité est votre meilleur atout.`, color: '#f97316' })
    }

    if (energyCurrent >= 4) {
      insights.push({ icon: '⚡', text: `Votre niveau d'énergie est excellent cette semaine. Votre programme porte ses fruits.`, color: '#eab308' })
    }

    if (logs.length < 3) {
      insights.push({ icon: '💡', text: `Saisissez votre journal chaque matin pour obtenir des insights personnalisés.`, color: '#6b7280' })
    }

    return insights[0] || { icon: '📈', text: `Continuez votre suivi quotidien pour voir votre progression s'accélérer.`, color: '#0d7377' }
  }

  return {
    streak,
    badges,
    newBadges,
    loading,
    updateStreak,
    getDailyInsight,
    allBadges: BADGES,
  }
}
