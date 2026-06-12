import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const SubscriptionContext = createContext({})

export function SubscriptionProvider({ children }) {
  const { user } = useAuth()
  
  // Simulated subscription state
  // In a real app, this would be fetched from Supabase / Stripe
  const [isPremium, setIsPremium] = useState(false)
  const [planName, setPlanName] = useState('Gratuit')
  
  useEffect(() => {
    // For demo purposes, we can toggle this or read from local storage
    const stored = localStorage.getItem('prostatrack_premium')
    if (stored === 'true') {
      setIsPremium(true)
      setPlanName('Premium')
    } else {
      setIsPremium(false)
      setPlanName('Gratuit')
    }
  }, [user])

  const upgrade = () => {
    localStorage.setItem('prostatrack_premium', 'true')
    setIsPremium(true)
    setPlanName('Premium')
  }

  return (
    <SubscriptionContext.Provider value={{ isPremium, planName, upgrade }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => useContext(SubscriptionContext)
