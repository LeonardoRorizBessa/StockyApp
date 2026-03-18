import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface CardItensProps {
  nome: string;
  categoria: string;
  marca: string;
  estoque: number;
  codigoBarras: string;
  iconePadrao?: keyof typeof Ionicons.glyphMap;
}

export default function CardItens({ 
  nome, 
  categoria,
  marca, 
  estoque, 
  codigoBarras, 
  iconePadrao = "fast-food" 
}: CardItensProps) {
  // DEFINE COR ESTOQUE
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
      >
        {/* VIEW IMAGEM */}
        <View style={styles.imageBox}>
          <Ionicons name={iconePadrao} size={48} color="#FF8C00" />
        </View>

        {/* VIEW INFORMAÇÕES */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{nome}</Text>
            <Text style={styles.productCategory}>({categoria})</Text>
          </View>

          <Text style={styles.productBrand}>
            {marca}
          </Text>

          <Text style={[styles.stockText, { color: getCorEstoque(estoque) }]}>
            Estoque: {estoque}
          </Text>

          <View style={styles.barcodeRow}>
            <Ionicons name="barcode-outline" size={20} color="#9E9E9E" />
            <Text style={styles.barcodeText}>{codigoBarras}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  imageBox: {
    width: 96,
    height: 96,
    backgroundColor: '#333333',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  productName: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productCategory: {
    color: '#9E9E9E',
    fontSize: 12,
    marginLeft: 6,
  },
  productBrand: {
    color: '#F5F5F5',
    fontSize: 12,
    marginTop: 4,
  },
  stockText: {
    color: '#F5F5F5',
    fontSize: 12,
    marginTop: 4,
  },
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  barcodeText: {
    color: '#9E9E9E',
    fontSize: 12,
    marginLeft: 4,
    letterSpacing: 1,
  },
})