import { Stack } from 'expo-router'

export default function AcoesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="cadastrar" />
      <Stack.Screen name="entrada" />
      <Stack.Screen name="saida" />
      <Stack.Screen name="scanner" />
    </Stack>
  )
}