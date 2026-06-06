import InfoProdutos from '@/components/InfoProdutos'
import { supabase } from '@/lib/supabase'
import { COLORS, FONTS, RADIUS, SPACING } from '@/theme'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

export interface ProdutoModalData {
  id: string | number;
  nome: string;
  medida: string;
  marca: string;
  marcaId: string | number;
  categoria: string;
  categoriaId: string | number;
  codigoBarras: string;
  estoque: number;
}

interface Props {
  visible: boolean;
  produto: ProdutoModalData | null;
  onClose: () => void;
  onExcluido?: () => void;
}

export default function ModalProdutos({ visible, onClose, produto, onExcluido }: Props) {

  if (!produto) return null

  const handleEditar = () => {
    onClose()
    router.push({
      pathname: '/(protected)/acoes/editar',
      params: {
        id: produto.id.toString(),
        nome: produto.nome,
        medida: produto.medida,
        marcaId: produto.marcaId.toString(),
        marcaNome: produto.marca,
        categoriaId: produto.categoriaId.toString(),
        categoriaNome: produto.categoria,
        codigoBarras: produto.codigoBarras,
      }
    })
  }

  const handleExcluir = () => {
    Alert.alert(
      'Excluir Produto',
      `Tem certeza que deseja excluir "${produto.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('produtos')
                .delete()
                .eq('id', produto.id)

              if (error) throw error

              Toast.show({
                type: 'success',
                text1: 'Produto excluído',
                text2: `"${produto.nome}" foi removido do estoque.`,
                position: 'top',
              })
              onClose()
              onExcluido?.()
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Erro ao excluir',
                text2: 'Não foi possível excluir o produto. Tente novamente.',
                position: 'top',
              })
            }
          }
        }
      ]
    )
  }

  return (
    <>
      <Modal animationType='slide' transparent={true} visible={visible} onRequestClose={onClose} statusBarTranslucent={true}>
        <View style={styles.overlay}>
          {/* Área de Fechamento */}
          <TouchableOpacity style={styles.areaDeFechamento} activeOpacity={1} onPress={onClose} />

          {/* CONTEUDO MODAL */}
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <View style={styles.headerTexts}>
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

            {/* BOTÕES DE AÇÃO */}
            <View style={styles.acoes}>
              <TouchableOpacity style={styles.btnEditar} activeOpacity={0.8} onPress={handleEditar}>
                <Ionicons name="create-outline" size={20} color={COLORS.brancoTexto} />
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnExcluir} activeOpacity={0.8} onPress={handleExcluir}>
                <Ionicons name="trash-outline" size={20} color={COLORS.brancoTexto} />
                <Text style={styles.btnText}>Excluir</Text>
              </TouchableOpacity>
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
  headerTexts: {
    flex: 1,
    marginRight: SPACING.md,
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
    marginBottom: SPACING.lg,
  },
  acoes: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  btnEditar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    height: 48,
    backgroundColor: COLORS.azulInfo,
    borderRadius: RADIUS.md,
  },
  btnExcluir: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    height: 48,
    backgroundColor: COLORS.vermelhoPerigo,
    borderRadius: RADIUS.md,
  },
  btnText: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
  },
})