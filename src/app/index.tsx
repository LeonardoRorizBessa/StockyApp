import { useEffect } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { COLORS, SPACING, FONTS } from '@/theme'

export default function CustomSplash() {
  const { isReady, isLoggedIn } = useAuth()

  // Redireciona o usuário com base no estado de autenticação
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    
    if (isReady) {
      timeout = setTimeout(() => {
        if (isLoggedIn) {
          router.replace('/(protected)/home')
        } else {
          router.replace('/welcome')
        }
      }, 3000)
    }
    return () => clearTimeout(timeout)
  }, [isReady, isLoggedIn])

  return (
    <>
      <View style={styles.container}>
        <View style={styles.logoBox}>
          <Image 
            source={require('@/assets/logo.png')} 
            style={styles.logoImage} 
          />
          <Text style={styles.logoText}>
            STOCKY
          </Text>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.cinzaEscuro,
  },
  logoBox: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: SPACING.xxl,
  },
  logoText: {
    color: COLORS.laranjaStock,
    fontSize: FONTS.size.xxl,
    fontWeight: FONTS.weight.bold,
  }
})