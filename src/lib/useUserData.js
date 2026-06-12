import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { MOCK_LOGS, MOCK_PROGRAM } from './mockData'

// Hook principal — retourne les vraies données si connecté, mock si démo
export function useUserData(isDemo = false) {
  const { user } = useAuth()
  const [logs, setLogs] = useState([])
  const [program, setProgram] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemo || !user) {
      setLogs(MOCK_LOGS)
      setProgram(MOCK_PROGRAM)
      setLoading(false)
      return
    }
    fetchData()
  }, [user, isDemo])

  const fetchData = async () => {
    setLoading(true)
    await Promise.all([fetchLogs(), fetchProgram()])
    setLoading(false)
  }

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true })
      .limit(60)

    if (!error && data) {
      setLogs(data)
    }
  }

  const fetchProgram = async () => {
    // Récupérer la progression depuis Supabase
    const { data: progressData } = await supabase
      .from('program_progress')
      .select('*')
      .eq('user_id', user.id)

    // Merger avec la liste fixe du programme
    const mergedProgram = MOCK_PROGRAM.map(item => {
      const saved = progressData?.find(
        p => p.week === item.week && p.title === item.title
      )
      return { ...item, done: saved?.done ?? false }
    })

    setProgram(mergedProgram)
  }

  const addLog = async (logData) => {
    if (isDemo || !user) return { error: 'Demo mode' }

    const { data, error } = await supabase
      .from('daily_logs')
      .upsert({
        user_id: user.id,
        date: logData.date,
        night_wakings: logData.night_wakings,
        sleep_quality: logData.sleep_quality,
        urgency_level: logData.urgency_level,
        energy_level: logData.energy_level,
        notes: logData.notes || '',
      })
      .select()
      .single()

    if (!error) {
      await fetchLogs() // Rafraîchir
    }
    return { data, error }
  }

  const markProgramDone = async (week, title) => {
    if (isDemo || !user) return

    await supabase
      .from('program_progress')
      .upsert({
        user_id: user.id,
        week,
        title,
        done: true,
        completed_at: new Date().toISOString()
      })

    await fetchProgram()
  }

  return {
    logs,
    program,
    loading,
    addLog,
    markProgramDone,
    refetch: fetchData,
  }
}
