import { Stack } from 'expo-router'

export default function AcoesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="cadastrar" />
      <Stack.Screen name="editar" />
      <Stack.Screen name="entrada" />
      <Stack.Screen name="saida" />
      <Stack.Screen name="scanner" />
      <Stack.Screen name="marcas" />
      <Stack.Screen name="categorias" />
      <Stack.Screen name="dadosLoja" />
      <Stack.Screen name="avisos" />
      <Stack.Screen name="faq" />
      <Stack.Screen name="sobre" />
      <Stack.Screen name="suporte" />
    </Stack>
  )
}