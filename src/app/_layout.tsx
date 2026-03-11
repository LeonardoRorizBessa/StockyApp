import { Stack } from 'expo-router'
import { AuthProvider } from '@/contexts/authContext'

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(protected)" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="signIn" />
      </Stack>
    </AuthProvider>
  )
}