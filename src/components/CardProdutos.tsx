import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

interface Props {
  nome: string;
  medida: string;
  marca: string;
  estoque: number;
  iconePadrao?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function CardProdutos({ 
  nome, 
  medida, 
  marca, 
  estoque, 
  iconePadrao,
  onPress,
}: Props) {
  
  const getCorEstoque = (quantidade: number) => {
    if (quantidade === 0) return '#D32F2F'
    if (quantidade <= 5) return '#FF8C00'
    return '#F5F5F5'
  }

  return (
    <>
      <TouchableOpacity 
        activeOpacity={0.8}
        style={styles.card}
        onPress={onPress}
      >
        {/* VIEW IMAGEM */}
        <View style={styles.cardImage}>
          <Ionicons name={iconePadrao} size={48} color={COLORS.laranjaStock} />
        </View>
        {/* VIEW INFORMAÇÕES */}
        <View style={styles.cardInfo}>
          <Text style={styles.productName}>
            {nome} {medida}
          </Text>
          <Text style={styles.productBrand}>
            {marca}
          </Text>
          <Text style={[styles.productStock, { color: getCorEstoque(estoque) }]}>
            Estoque: {estoque}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cinzaMedio,
    borderRadius: RADIUS.lg,
    padding: SPACING.xs,
  },
  cardImage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    backgroundColor: COLORS.cinzaClaro,
    borderRadius: RADIUS.md,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: SPACING.sm,
    gap: SPACING.xs,
  },
  productName: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
  },
  productBrand: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.medium,
  },
  productStock: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.medium,
  },
})