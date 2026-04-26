import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

interface Props {
  icone: keyof typeof Ionicons.glyphMap;
  cor: string;
  quantidade?: number;
  text: string;
}

export default function CardResumo({ icone, cor, quantidade, text }: Props) {
  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardIcon}>
          <Ionicons name={icone} size={24} color={cor} />
        </View>
        <Text style={styles.cardNumber}>
          {quantidade}
        </Text>
        <Text style={styles.cardText}>
          {text}
        </Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: COLORS.cinzaMedio,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  cardIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.cinzaClaro,
    marginBottom: SPACING.xs,
  },
  cardNumber: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.weight.semiBold,
    marginBottom: SPACING.xs,
  },
  cardText: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.sm,
  }
})