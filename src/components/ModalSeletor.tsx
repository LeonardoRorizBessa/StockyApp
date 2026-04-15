import { useState, useMemo } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  FlatList,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

interface Props {
  visible: boolean;
  titulo: string;
  dados: { id: string | number, nome: string }[];
  onSelect: (item: any) => void;
  onAdd: (novoNome: string) => void;
  onClose: () => void;
}

export default function ModalSeletor({ 
  visible, 
  onClose, 
  titulo, 
  dados, 
  onSelect, 
  onAdd,
}: Props) {

  const [busca, setBusca] = useState('')

  const itensFiltrados = useMemo(() => {
    if (!busca.trim()) return dados
    return dados.filter(item => item.nome.toLowerCase().includes(busca.toLowerCase()))
  }, [busca, dados])

  const itemJaExiste = dados.some(item => item.nome.toLowerCase() === busca.trim().toLowerCase())
  const mostrarBotaoAdicionar = busca.trim().length > 0 && !itemJaExiste

  const handleSelect = (item: any) => {
    onSelect(item)
    setBusca('') 
    onClose()
  }

  const handleAdd = () => {
    onAdd(busca.trim())
    setBusca('')
    onClose()
  }

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
        statusBarTranslucent={true}
      >
        <View style={styles.overlay}>
          {/* ÁREA DE FECHAMENTO */}
          <TouchableOpacity 
            style={styles.areaDeFechamento} 
            activeOpacity={1}
            onPress={onClose} 
          />

          {/* CONTEÚDO DO MODAL */}
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Selecionar {titulo}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.laranjaStock} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={COLORS.cinzaTexto} />
              <TextInput
                style={styles.searchInput}
                placeholder={`Pesquisar ou adicionar ${titulo.toLowerCase()}...`}
                placeholderTextColor={COLORS.cinzaTexto}
                value={busca}
                onChangeText={setBusca}
                autoFocus={true} 
              />
              {busca !== '' && (
                <TouchableOpacity onPress={() => setBusca('')}>
                  <Ionicons name="close-circle" size={20} color={COLORS.cinzaTexto} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={itensFiltrados}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              keyboardShouldPersistTaps="handled" 
              ListEmptyComponent={() => (
                !mostrarBotaoAdicionar && <Text style={styles.emptyText}>Nenhuma opção encontrada.</Text>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.itemButton} 
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.itemText}>{item.nome}</Text>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.cinzaTexto} />
                </TouchableOpacity>
              )}
            />

            {mostrarBotaoAdicionar && (
              <TouchableOpacity 
                style={styles.addButton}
                activeOpacity={0.8}
                onPress={handleAdd}
              >
                <Ionicons name="add-circle-outline" size={24} color={COLORS.brancoTexto} />
                <Text style={styles.addButtonText}>Adicionar "{busca.trim()}"</Text>
              </TouchableOpacity>
            )}
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
  modalContent: {
    backgroundColor: COLORS.cinzaEscuro,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.lg,
    maxHeight: '75%',
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
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.cinzaMedio,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cinzaMedio,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 50,
    marginBottom: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
    marginLeft: SPACING.xs,
  },
  listContainer: {
    paddingBottom: SPACING.md,
  },
  itemButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cinzaMedio,
  },
  itemText: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.cinzaTexto,
    marginTop: SPACING.xl,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.verdeSucesso,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  addButtonText: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
  },
})