import { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

export default function CustomSplash() {
  const { isReady, isLoggedIn } = useAuth()

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
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>STOCKY</Text>
      </View>
    </View>
  );
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
    borderColor: COLORS.laranjaStock,
    borderRadius: RADIUS.md,
    borderWidth: 2,
  },
  logoText: {
    color: COLORS.laranjaStock,
    fontSize: FONTS.size.xxl,
    fontWeight: FONTS.weight.bold,
  }
})