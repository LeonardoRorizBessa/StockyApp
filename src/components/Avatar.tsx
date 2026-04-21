import { router } from 'expo-router'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

export default function Avatar() {
  return ( 
    <>
      <TouchableOpacity 
        style={styles.btn}
        activeOpacity={1}
        onPress={() => router.push('/(protected)/perfil')}
      >
        <Ionicons name="person" size={24} color={COLORS.brancoTexto} />
      </TouchableOpacity>
    </>
   )
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    backgroundColor: COLORS.laranjaStock,
    borderRadius: RADIUS.xl,
  },
})