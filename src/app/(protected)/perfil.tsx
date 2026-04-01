import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useAuth } from '@/hooks/useAuth'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

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
    backgroundColor: COLORS.cinzaEscuro,
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.xxl,
  },
  title: {
    color: COLORS.brancoTexto, 
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.laranjaStock,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
  },
  buttonText: {
    color: COLORS.brancoTexto, 
    fontSize: FONTS.size.lg, 
    fontWeight: FONTS.weight.bold, 
  },
})