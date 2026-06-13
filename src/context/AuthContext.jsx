import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/#/auth/callback`,
      }
    })
    if (data?.user && !error) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        is_premium: false,
        premium_activated_at: null,
        chariow_sale_id: null,
        premium_expires_at: null,
      })
    }
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // Mettre à jour le nom complet
  const updateProfile = async (fullName) => {
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    })
    if (!error && data.user) setUser(data.user)
    return { data, error }
  }

  // Changer le mot de passe
  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    return { data, error }
  }

  // Changer l'email
  const updateEmail = async (newEmail) => {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
      options: { emailRedirectTo: `${window.location.origin}/#/auth/callback` }
    })
    return { data, error }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateProfile, updatePassword, updateEmail }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)