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
    backgroundColor: '#1C1C1C',
    padding: 20,
  },
  title: {
    color: '#F5F5F5', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 10,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: '#FF8C00',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#F5F5F5', 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
})