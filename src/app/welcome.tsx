import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'

export default function Welcome() {
  return (
    <View style={styles.container}>
      <View style={styles.logoPlaceholder}>
        <Text style={styles.logoText}>LOGO</Text>
      </View>

      <Text style={styles.title}>Estoque Inteligente</Text>
      <Text style={styles.subtitle}>Gestão de produtos.</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => router.push('/signIn')}>
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
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    marginBottom: 40,
  },
  logoText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 18,
  },
  title: { 
    color: '#F5F5F5', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 10,
  },
  subtitle: { 
    color: '#9E9E9E', 
    fontSize: 16, 
    textAlign: 'center',
    marginBottom: 40,
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