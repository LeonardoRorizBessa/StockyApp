import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

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
    backgroundColor: COLORS.cinzaEscuro,
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.xxl,
  },
  logoBox: {
    alignItems: 'center',
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
    borderColor: COLORS.laranjaStock,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
  },
  logoText: {
    color: COLORS.laranjaStock,
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.weight.bold,
  },
  title: { 
    color: COLORS.brancoTexto, 
    fontSize: FONTS.size.xl, 
    fontWeight: FONTS.weight.bold, 
    marginBottom: SPACING.sm,
  },
  subtitle: { 
    textAlign: 'center',
    color: COLORS.cinzaTexto, 
    fontSize: FONTS.size.md, 
    marginBottom: SPACING.xl,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height: 60,
    backgroundColor: COLORS.laranjaStock,
    borderRadius: RADIUS.sm,
  },
  buttonText: { 
    color: COLORS.brancoTexto, 
    fontSize: FONTS.size.md, 
    fontWeight: FONTS.weight.bold, 
  },
})