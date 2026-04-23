import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'
import InfoProdutos from '@/components/InfoProdutos'

export interface ProdutoModalData {
  nome: string;
  medida: string;
  marca: string;
  categoria: string;
  codigoBarras: string;
  estoque: number;
}

interface Props {
  visible: boolean;
  produto: ProdutoModalData | null;
  onClose: () => void;
}

export default function ModalProdutos({ 
  visible, 
  onClose, 
  produto, 
}: Props) {

  if (!produto) return null

  return (
    <>
      <Modal animationType='slide' transparent={true} visible={visible} onRequestClose={onClose} statusBarTranslucent={true}>
        <View style={styles.overlay}>
          {/* Área de Fechamento */}
          <TouchableOpacity style={styles.areaDeFechamento} activeOpacity={1} onPress={onClose} />

          {/* CONTEUDO MODAL */}
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>{produto.nome}</Text>
                <Text style={styles.subtitle}>{produto.medida}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.laranjaStock} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoGroup}>
              <InfoProdutos 
                icone="pricetag-outline" 
                label="Marca" 
                valor={produto.marca} 
              />
              <InfoProdutos 
                icone="grid-outline" 
                label="Categoria" 
                valor={produto.categoria} 
              />
              <InfoProdutos 
                icone="barcode-outline" 
                label="Código de Barras" 
                valor={produto.codigoBarras} 
              />
              <InfoProdutos 
                icone="cube-outline" 
                label="Estoque Atual" 
                valor={`${produto.estoque} unidades`} 
                corValor={produto.estoque === 0 ? COLORS.vermelhoPerigo : (produto.estoque <= 4 ? COLORS.laranjaStock : COLORS.verdeSucesso)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  areaDeFechamento: {
    flex: 1,
    width: '100%',
  },
  modalContainer: {
    backgroundColor: COLORS.cinzaEscuro,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.weight.bold,
  },
  subtitle: {
    marginTop: 4,
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.md,
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.cinzaMedio,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.cinzaMedio,
    marginBottom: SPACING.lg,
  },
  infoGroup: {
    gap: SPACING.md, 
  },
})