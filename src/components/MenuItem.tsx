import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

interface Props {
  icone: keyof typeof Ionicons.glyphMap;
  titulo: string;
  onPress: () => void;
  islogout?: boolean;
}

export default function MenuItem({ icone, titulo, onPress, islogout = false }: Props) {
  return (
    <>
      <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} onPress={onPress}>
        <View style={styles.menuItemLeft}>
          <Ionicons name={icone} size={24} color={islogout ? COLORS.vermelhoPerigo : COLORS.cinzaTexto} />
          <Text style={[styles.menuItemTitle, islogout && { color: COLORS.vermelhoPerigo }]}>
            {titulo}
          </Text>
        </View>
        {!islogout && <Ionicons name="chevron-forward" size={20} color={COLORS.cinzaTexto} />}
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cinzaEscuro,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuItemTitle: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.medium,
  },
})