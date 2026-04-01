import { View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

export default function Perfil() {
  return ( 
    <>
      <View style={styles.container}>
        <Ionicons name="person" size={24} color="#F5F5F5" />
      </View>
    </>
   )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    backgroundColor: COLORS.laranjaStock,
    borderRadius: RADIUS.xl,
  },
})