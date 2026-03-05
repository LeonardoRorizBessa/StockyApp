import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import { useAuth } from '@/hooks/useAuth'

export default function SignIn() {
  const { signIn } = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SignIn</Text>
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
})