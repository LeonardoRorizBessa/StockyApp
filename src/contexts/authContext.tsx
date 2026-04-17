import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'

type AuthState = {
  isLoggedIn: boolean
  isReady: boolean
  signIn: (email: string, pass: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthState>({} as AuthState)

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
      setIsReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, pass: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    })
    
    if (error) {
      return { error } 
    }
    
    router.replace("/(protected)/home")
    return { error: null }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error("Erro ao deslogar:", error)
    
    router.replace("/welcome")
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, signIn, signOut, isReady }}>
      {children}
    </AuthContext.Provider>
  )
}