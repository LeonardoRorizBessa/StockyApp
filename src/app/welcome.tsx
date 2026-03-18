import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'

export default function Welcome() {
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>STOCKY</Text>
      </View>

      <Text style={styles.title}>Olá, seja bem-vindo!</Text>
      <Text style={styles.subtitle}>Controle de estoque inteligente.</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => router.push('/signIn')}>
        <Text style={styles.buttonText}>Login</Text>
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
    paddingHorizontal: 12,
    paddingTop: 36,
  },
  logoBox: {
    padding: 24,
    borderWidth: 2,
    borderColor: '#FF8C00',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    color: '#FF8C00',
    fontSize: 28,
    fontWeight: 'bold',
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
    height: 60,
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