import { useState, useMemo } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

interface Props {
  visible: boolean;
  onClose: () => void;
  titulo: string;
  dados: { id: string | number, nome: string }[]; // A lista de opções (ex: marcas)
  onSelect: (item: any) => void; // O que acontece ao clicar em um item existente
  onAdd: (novoNome: string) => void; // O que acontece ao clicar em "Adicionar"
}

export default function ModalSeletor({ visible, onClose, titulo, dados, onSelect, onAdd }: Props) {
  const [busca, setBusca] = useState('')

  // Filtra a lista com base no que foi digitado
  const itensFiltrados = useMemo(() => {
    if (!busca.trim()) return dados
    return dados.filter(item => item.nome.toLowerCase().includes(busca.toLowerCase()))
  }, [busca, dados])

  // Verifica se o texto digitado é exatamente igual a algum item existente (para esconder o botão de adicionar se já existir)
  const itemJaExiste = dados.some(item => item.nome.toLowerCase() === busca.trim().toLowerCase())
  const mostrarBotaoAdicionar = busca.trim().length > 0 && !itemJaExiste

  const handleSelect = (item: any) => {
    onSelect(item)
    setBusca('') // Limpa a busca para a próxima vez
    onClose()
  }

  const handleAdd = () => {
    onAdd(busca.trim())
    setBusca('')
    onClose()
  }

  const handleClose = () => {
    setBusca('')
    onClose()
  }

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView style={styles.overlay}>
          <View style={styles.modalContent}>
            
            {/* HEADER DO MODAL */}
            <View style={styles.header}>
              <Text style={styles.title}>Selecionar {titulo}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.brancoTexto} />
              </TouchableOpacity>
            </View>

            {/* BARRA DE PESQUISA */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={COLORS.cinzaTexto} />
              <TextInput
                style={styles.searchInput}
                placeholder={`Pesquisar ou adicionar ${titulo.toLowerCase()}...`}
                placeholderTextColor={COLORS.cinzaTexto}
                value={busca}
                onChangeText={setBusca}
                autoFocus={true} // Já abre com o teclado pronto para digitar!
              />
              {busca !== '' && (
                <TouchableOpacity onPress={() => setBusca('')}>
                  <Ionicons name="close-circle" size={20} color={COLORS.cinzaTexto} />
                </TouchableOpacity>
              )}
            </View>

            {/* LISTA DE RESULTADOS */}
            <FlatList
              data={itensFiltrados}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              keyboardShouldPersistTaps="handled" // Permite clicar na lista sem o teclado fechar
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

            {/* BOTÃO ADICIONAR NOVO (Só aparece se não existir) */}
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
        </KeyboardAvoidingView>
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
  modalContent: {
    backgroundColor: COLORS.cinzaEscuro,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    height: '80%', // Ocupa 80% da tela de baixo para cima
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
  },
  closeButton: {
    padding: SPACING.xxs,
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
    color: COLORS.cinzaTexto,
    textAlign: 'center',
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