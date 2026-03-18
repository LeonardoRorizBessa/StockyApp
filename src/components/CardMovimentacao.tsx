import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface CardMovimentacaoProps {
  tipo: 'entrada' | 'saida';
  produto: string;
  quantidade: number;
  data: string;
}

export default function CardMovimentacao({ tipo, produto, quantidade, data }: CardMovimentacaoProps) {
  const isEntrada = tipo === 'entrada'
  const corIcone = isEntrada ? '#388E3C' : '#D32F2F'
  const nomeIcone = isEntrada ? 'arrow-down' : 'arrow-up'
  const sinalQuantidade = isEntrada ? '+' : '-'

  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: `${corIcone}20` }]}>
        <Ionicons name={nomeIcone} size={20} color={corIcone} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.produtoNome} numberOfLines={1}>{produto}</Text>
        <Text style={styles.dataTexto}>{data}</Text>
      </View>

      <View style={styles.quantidadeContainer}>
        <Text style={[styles.quantidadeTexto, { color: corIcone }]}>
          {sinalQuantidade}{quantidade}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
    gap: 4,
  },
  produtoNome: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dataTexto: {
    color: '#9E9E9E',
    fontSize: 10,
  },
  quantidadeContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  quantidadeTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})