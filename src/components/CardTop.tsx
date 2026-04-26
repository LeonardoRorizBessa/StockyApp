import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

export interface TopItem {
  nome: string;
  quantidade: number;
}

interface Props {
  titulo: string;
  dados: TopItem[];
}

export default function CardTop({ titulo, dados }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{titulo}</Text>
      <View style={{ gap: SPACING.xxs }}>
        {dados.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.rankText}>{index + 1}º</Text>
            <Text style={styles.itemName} numberOfLines={1}>{item.nome}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 200,
    backgroundColor: COLORS.cinzaMedio,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  cardTitle: {
    textTransform: 'uppercase',
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.xs,
    marginBottom: SPACING.xs,
    fontWeight: FONTS.weight.bold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  rankText: {
    backgroundColor: COLORS.cinzaEscuro,
    borderRadius: RADIUS.sm,
    padding: SPACING.xs,
    color: COLORS.laranjaStock,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
  },
  itemName: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.sm,
  },
})