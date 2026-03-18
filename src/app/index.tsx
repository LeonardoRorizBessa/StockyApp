import { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'

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
    backgroundColor: '#1C1C1C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    padding: 24,
    borderWidth: 2,
    borderColor: '#FF8C00',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoText: {
    color: '#FF8C00',
    fontSize: 28,
    fontWeight: 'bold',
  }
})