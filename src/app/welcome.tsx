import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { router } from 'expo-router'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

export default function Welcome() {
  return (
    <>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image 
            source={require('@/assets/logo.png')} 
            style={styles.logoImage} 
          />
          <View style={styles.welcomeView}>
            <Text style={styles.title}>Bem vindo de volta!</Text>
            <Text style={styles.subtitle}>Gerencie seu estoque de forma fácil e eficiente.</Text>
          </View>
        </View>
        
        {/* BUTTON */}
        <TouchableOpacity style={styles.button} onPress={() => router.push('/signIn')}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cinzaEscuro,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xxl,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  welcomeView: {
    alignItems: 'center',
    gap: SPACING.xxs,
  },
  title: { 
    color: COLORS.brancoTexto, 
    fontSize: FONTS.size.xl, 
    fontWeight: FONTS.weight.bold,
  },
  subtitle: { 
    textAlign: 'center',
    color: COLORS.cinzaTexto, 
    fontSize: FONTS.size.md,
  },
  button: {
    height: 60,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: COLORS.laranjaStock,
    borderWidth: 2,
    borderRadius: RADIUS.sm,
  },
  buttonText: { 
    color: COLORS.laranjaStock, 
    fontSize: FONTS.size.md, 
    fontWeight: FONTS.weight.bold,
  },
})