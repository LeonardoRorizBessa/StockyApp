import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

interface Props {
  tipo: 'entrada' | 'saida';
  produto: string;
  quantidade: number;
  data: string;
}

export default function CardMovimentacao({ tipo, produto, quantidade, data }: Props) {
  const isEntrada = tipo === 'entrada'
  const cor = isEntrada ? '#388E3C' : '#D32F2F'
  const nomeIcone = isEntrada ? 'arrow-down' : 'arrow-up'
  const sinalQuantidade = isEntrada ? '+' : '-'

  return (
    <View style={styles.card}>
      {/* VIEW ICON */}
      <View style={[styles.cardIcon, { backgroundColor: `${cor}20` }]}>
        <Ionicons name={nomeIcone} size={24} color={cor} />
      </View>
      {/* VIEW INFO */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={1}>
          {produto}
        </Text>
        <Text style={styles.productDate}>
          {data}
        </Text>
      </View>
      {/* VIEW QUANTIDADE */}
      <View style={styles.numberContainer}>
        <Text style={[styles.numberText, { color: cor }]}>
          {sinalQuantidade}
          {quantidade}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xxs,
  },
  cardIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: RADIUS.xl,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: SPACING.sm,
    gap: SPACING.xxs,
  },
  productName: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
  },
  productDate: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.xs,
  },
  numberContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  numberText: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
  },
})