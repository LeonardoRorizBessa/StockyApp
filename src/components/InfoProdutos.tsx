import { Modal, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface InfoProdutosProps {
  visible: boolean;
  onClose: () => void;
  produto: {
    nome: string;
    medida: string;
    marca: string;
    categoria: string;
    codigoBarras: string;
    estoque: number;
  } | null;
}

export default function InfoProdutos({ visible, onClose, produto }: InfoProdutosProps) {
  // Se não tiver nenhum produto selecionado, não renderiza nada para evitar erros
  if (!produto) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      {/* Esse TouchableWithoutFeedback faz o modal fechar se você clicar fora dele (na parte escura) */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              
              {/* CABEÇALHO DO MODAL */}
              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>{produto.nome}</Text>
                  <Text style={styles.subtitle}>{produto.medida}</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#9E9E9E" />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              {/* INFORMAÇÕES SECUNDÁRIAS */}
              <View style={styles.infoGroup}>
                <View style={styles.infoRow}>
                  <Ionicons name="pricetag-outline" size={20} color="#FF8C00" style={styles.icon} />
                  <View>
                    <Text style={styles.infoLabel}>Marca</Text>
                    <Text style={styles.infoValue}>{produto.marca}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="grid-outline" size={20} color="#FF8C00" style={styles.icon} />
                  <View>
                    <Text style={styles.infoLabel}>Categoria</Text>
                    <Text style={styles.infoValue}>{produto.categoria}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="barcode-outline" size={20} color="#FF8C00" style={styles.icon} />
                  <View>
                    <Text style={styles.infoLabel}>Código de Barras</Text>
                    <Text style={styles.infoValue}>{produto.codigoBarras}</Text>
                  </View>
                </View>

                {/* Mostramos o estoque aqui de novo só para dar contexto */}
                <View style={styles.infoRow}>
                  <Ionicons name="cube-outline" size={20} color="#FF8C00" style={styles.icon} />
                  <View>
                    <Text style={styles.infoLabel}>Estoque Atual</Text>
                    <Text style={[
                      styles.infoValue, 
                      { color: produto.estoque === 0 ? '#D32F2F' : (produto.estoque <= 5 ? '#FF8C00' : '#388E3C') }
                    ]}>
                      {produto.estoque} unidades
                    </Text>
                  </View>
                </View>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo escurecido semi-transparente
    justifyContent: 'flex-end', // Joga o modal lá pra baixo
  },
  modalContent: {
    backgroundColor: '#1C1C1C',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: '40%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    color: '#F5F5F5',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#9E9E9E',
    fontSize: 16,
    marginTop: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    width: '100%',
    marginBottom: 20,
  },
  infoGroup: {
    gap: 16, // Espaçamento entre as linhas de informação
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  infoLabel: {
    color: '#9E9E9E',
    fontSize: 12,
  },
  infoValue: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
})