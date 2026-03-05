import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

export default function Button() {
  const router = useRouter()

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.8}
      onPress={() => router.push('/signup')}
    >
      <Text style={styles.label}>Entrar</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 48,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  label: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
})