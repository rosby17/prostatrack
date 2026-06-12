import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

const SubscriptionContext = createContext({})

export function SubscriptionProvider({ children }) {
  const { user } = useAuth()

  const [isPremium, setIsPremium] = useState(false)
  const [planName, setPlanName] = useState('Gratuit')
  const [expiresAt, setExpiresAt] = useState(null)
  const [daysLeft, setDaysLeft] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkStatus = async () => {
    if (!user) {
      setIsPremium(false)
      setPlanName('Gratuit')
      setExpiresAt(null)
      setDaysLeft(null)
      setLoading(false)
      return false
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('is_premium, premium_expires_at')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Erreur checkStatus:', error)
      setLoading(false)
      return false
    }

    // Vérifier si l'abonnement est encore valide
    let premium = data?.is_premium || false
    const expiry = data?.premium_expires_at ? new Date(data.premium_expires_at) : null

    if (premium && expiry && expiry < new Date()) {
      // Expiré côté client aussi (double sécurité avant le cron)
      premium = false
    }

    // Calculer les jours restants
    let days = null
    if (premium && expiry) {
      const diff = expiry.getTime() - new Date().getTime()
      days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    }

    setIsPremium(premium)
    setPlanName(premium ? 'Mensuel' : 'Gratuit')
    setExpiresAt(expiry)
    setDaysLeft(days)
    setLoading(false)
    return premium
  }

  useEffect(() => {
    checkStatus()
  }, [user])

  return (
    <SubscriptionContext.Provider value={{
      isPremium,
      planName,
      expiresAt,
      daysLeft,
      loading,
      checkStatus
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => useContext(SubscriptionContext)
