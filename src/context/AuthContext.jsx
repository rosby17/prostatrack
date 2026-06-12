import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // onAuthStateChange gère TOUS les cas : session existante, token hash du mail, OTP...
    // Il faut l'initialiser AVANT getSession pour ne manquer aucun event SIGNED_IN
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

    // Créer le profil immédiatement si l'user est créé
    if (data?.user && !error) {
      await supabase
        .from('profiles')
        .upsert({
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

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
