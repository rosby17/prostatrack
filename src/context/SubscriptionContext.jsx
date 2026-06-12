import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

const SubscriptionContext = createContext({})

export function SubscriptionProvider({ children }) {
  const { user } = useAuth()
  
  const [isPremium, setIsPremium] = useState(false)
  const [planName, setPlanName] = useState('Gratuit')
  const [loading, setLoading] = useState(true)

  const checkStatus = async () => {
    if (!user) {
      setIsPremium(false)
      setPlanName('Gratuit')
      setLoading(false)
      return false
    }

    setLoading(true)
    // Fetch profile from Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .single()

    const premium = data?.is_premium || false
    setIsPremium(premium)
    setPlanName(premium ? 'Accès à vie' : 'Gratuit')
    setLoading(false)
    return premium
  }
  
  useEffect(() => {
    checkStatus()
  }, [user])

  return (
    <SubscriptionContext.Provider value={{ isPremium, planName, loading, checkStatus }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => useContext(SubscriptionContext)

