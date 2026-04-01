import { useState, useCallback, useMemo } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity 
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'
import CardProdutos from '@/components/CardProdutos'
import ModalProdutos from '@/components/ModalProdutos'

export default function Estoque() {
  const [busca, setBusca] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [dadosProdutos, setDadosProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalVisivel, setModalVisivel] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null)

  // FUNÇÃO DE BUSCA NO BANCO
  const carregarProdutos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          id, nome, medida, codigo_barras, estoque_atual,
          marcas (nome), categorias (nome)
        `)
        .order('nome', { ascending: true })

      if (error) throw error
      if (data) setDadosProdutos(data)
    } catch (error) {
      console.error("Erro ao buscar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  // ATUALIZAR AO ENTRAR NA TELA
  useFocusEffect(
    useCallback(() => {
      carregarProdutos()
    }, [])
  )

  // LÓGICA DE PESQUISA
  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    if (!termo) return dadosProdutos

    return dadosProdutos.filter(item => {
      const noNome = item.nome?.toLowerCase().includes(termo)
      const naMarca = item.marcas?.nome?.toLowerCase().includes(termo)
      const naCategoria = item.categorias?.nome?.toLowerCase().includes(termo)
      const noCodigo = item.codigo_barras?.includes(termo)

      return noNome || naMarca || naCategoria || noCodigo
    })
  }, [busca, dadosProdutos])

  // ABRIR MODAL
  const abrirModal = (item: any) => {
    setProdutoSelecionado({
      nome: item.nome,
      medida: item.medida,
      marca: item.marcas?.nome || 'Sem marca',
      categoria: item.categorias?.nome || 'Sem categoria',
      codigoBarras: item.codigo_barras,
      estoque: item.estoque_atual
    })
    setModalVisivel(true)
  }
  return (
    <>
      <View style={styles.container}>
        {/* BARRA DE PESQUISA */}
        <View 
          style={[ styles.searchContainer, isFocused && styles.searchContainerFocused ]}
        >
          <Ionicons name="search-outline" size={24} color={isFocused ? COLORS.laranjaStock : COLORS.cinzaTexto} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar..."
            placeholderTextColor={COLORS.cinzaTexto}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={busca}
            onChangeText={setBusca}
          />
          {/* BOTÃO DE LIMPAR BUSCA */}
          {busca !== '' && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.cinzaTexto} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* SECTION ESTOQUE */}
        <View
          style={styles.estoqueContainer}
        >
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.laranjaStock} style={{ marginTop: SPACING.xxl }} />
          ) : (
            <FlatList
              data={produtosFiltrados}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.itensContainer}
              ListEmptyComponent={() => (
                <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
              )}
              renderItem={({ item }) => (
                <CardProdutos 
                  nome={item.nome}
                  medida={item.medida}
                  marca={item.marcas?.nome}
                  estoque={item.estoque_atual}
                  iconePadrao="cube-outline"
                  onPress={() => abrirModal(item)}
                />
              )}
            />
          )}
        </View>
      </View>

      <ModalProdutos 
        visible={modalVisivel} 
        onClose={() => setModalVisivel(false)}
        produto={produtoSelecionado}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cinzaEscuro,
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.xxl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: COLORS.cinzaMedio,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchContainerFocused: {
    borderColor: COLORS.laranjaStock,
    backgroundColor: COLORS.cinzaClaro,
  },
  searchInput: {
    flex: 1,
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.lg,
    marginLeft: SPACING.xxs,
  },
  estoqueContainer: {
    flex: 1,
  },
  itensContainer: {
    gap: SPACING.xs,
    paddingTop: SPACING.xs,
    paddingBottom: 80,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.cinzaTexto,
    marginTop: SPACING.xxl,
    fontSize: FONTS.size.md,
  },
})