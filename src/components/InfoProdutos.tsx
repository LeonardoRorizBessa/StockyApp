import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, FONTS } from '@/theme'

interface Props {
  icone: keyof typeof Ionicons.glyphMap;
  label: string;
  valor: string | number;
  corValor?: string;
}

export default function InfoProdutos({ icone, label, valor, corValor }: Props) {
  return (
    <>
      <View style={styles.infoRow}>
        <Ionicons name={icone} size={20} color={COLORS.laranjaStock} style={styles.icon} />
        <View>
          <Text style={styles.infoLabel}>
            {label}
          </Text>
          <Text style={[styles.infoValue, corValor ? { color: corValor } : null]}>
            {valor}
          </Text>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    textAlign: 'center',
    marginRight: SPACING.md,
  },
  infoLabel: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.sm,
  },
  infoValue: {
    marginTop: 2,
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.semiBold,
  },
})