import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useAuth } from '@/hooks/useAuth'

export default function Perfil() {
  const { signOut } = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sair</Text>
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