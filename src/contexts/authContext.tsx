import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

type AuthState = {
  isLoggedIn: boolean
  isReady: boolean
  signIn: () => void
  signOut: () => void
}

const AUTH_STORAGE_KEY = "@controle-estoque:auth-state"

export const AuthContext = createContext<AuthState>({} as AuthState)

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isReady, setIsReady] = useState(false)

  async function storageState(newState: { isLoggedIn: boolean }) {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState))
    } catch (error) {
      console.error("ERROR_SET_STORAGE_AUTH:", error)
    }
  }

  function signIn() {
    setIsLoggedIn(true)
    storageState({ isLoggedIn: true })
    router.replace("/(protected)/home")
  }

  function signOut() {
    setIsLoggedIn(false)
    storageState({ isLoggedIn: false })
    router.replace("/welcome")
  }

  useEffect(() => {
    async function loadStorageState() {
      try {
        const storedState = await AsyncStorage.getItem(AUTH_STORAGE_KEY)
        const state = storedState ? JSON.parse(storedState) : null
        setIsLoggedIn(state?.isLoggedIn ?? false)
      } catch (error) {
        console.error("ERROR_GET_STORAGE_AUTH:", error)
        setIsLoggedIn(false)
      } finally {
        setIsReady(true)
      }
    }
    loadStorageState()
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, signIn, signOut, isReady }}>
      {children}
    </AuthContext.Provider>
  )
}