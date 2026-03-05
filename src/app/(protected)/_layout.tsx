import { Redirect, Stack } from 'expo-router'

import { useAuth } from '@/hooks/useAuth'
import { ActivityIndicator } from 'react-native'

export default function ProtectedLayout(){
  const { isLoggedIn, isReady } = useAuth()

  if (!isReady) {
    return (
      <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
    )
  }

  if (!isLoggedIn) {
    return <Redirect href="/signIn" />
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
}