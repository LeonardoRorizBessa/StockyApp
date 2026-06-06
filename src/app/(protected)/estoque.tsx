import { useState, useCallback, useMemo, useEffect } from 'react'
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'
import CardProdutos from '@/components/CardProdutos'
import ModalProdutos, { ProdutoModalData } from '@/components/ModalProdutos'
import Toast from 'react-native-toast-message'

interface Produto {
  id: string | number;
  nome: string;
  medida: string;
  codigo_barras: string;
  estoque_atual: number;
  marcas?: { nome: string } | null;
  categorias?: { nome: string } | null;
}

// Função para os ícones das categorias
const getIconeCategoria = (categoriaNome?: string): keyof typeof Ionicons.glyphMap => {
  if (!categoriaNome) return 'bag-handle-outline'

  const nomeMinusculo = categoriaNome.toLowerCase().trim()
  
  switch (nomeMinusculo) {
    case 'grãos': return 'basket-outline'
    case 'massas': return 'restaurant-outline'
    case 'padaria': return 'cafe-outline'
    case 'carnes': return 'flame-outline'
    case 'frios': return 'snow-outline'
    case 'laticínios': return 'water-outline'
    case 'frutas': return 'nutrition-outline'
    case 'legumes': return 'nutrition-outline'
    case 'verduras': return 'leaf-outline'
    case 'bebidas': return 'wine-outline'
    case 'limpeza': return 'sparkles-outline'
    case 'higiene': return 'medkit-outline'
    case 'temperos': return 'flask-outline'
    case 'doces': return 'ice-cream-outline'
    case 'lanches': return 'fast-food-outline'
    case 'pet': return 'paw-outline'
    case 'diversos': return 'cube-outline'
    default: return 'bag-handle-outline'
  }
}

export default function Estoque() {
  const [busca, setBusca] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [modalVisivel, setModalVisivel] = useState(false)
  const [dadosProdutos, setDadosProdutos] = useState<Produto[]>([])
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoModalData | null>(null)

  // Função para buscar dados
  const buscarDados = async () => {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        id, nome, medida, codigo_barras, estoque_atual,
        marcas (id, nome), categorias (id, nome)
      `)
      .order('nome', { ascending: true })

    if (error) throw error
    return data || []
  }

  // Função para orquestrar o carregamento dos dados
  const orquestrarCarregamento = useCallback(async () => {
    try {
      const produtosBrutos = await buscarDados()
      setDadosProdutos(produtosBrutos as any)
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar produtos',
        text2: 'Tente novamente mais tarde.',
        position: 'top',
      })
    }
  }, [])

  // Função de filtrar produtos com base na busca
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

  // Função para limpar a busca
  const limparBusca = () => {
    setBusca('')
  }

  // Carrega e observe os dados em tempo real
  useEffect(() => {
    orquestrarCarregamento()

    const canalTempoReal = supabase
      .channel('atualizacoes-lista-produtos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'produtos' }, () => {
        orquestrarCarregamento()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(canalTempoReal)
    }
  }, [orquestrarCarregamento])

  // Funcao para abrir o modal com os dados do produto selecionado
  const abrirModal = (item: Produto) => {
    setProdutoSelecionado({
      id: item.id,
      nome: item.nome,
      medida: item.medida,
      marca: item.marcas?.nome || 'Sem marca',
      marcaId: (item.marcas as any)?.id || '',
      categoria: item.categorias?.nome || 'Sem categoria',
      categoriaId: (item.categorias as any)?.id || '',
      codigoBarras: item.codigo_barras,
      estoque: item.estoque_atual
    })
    setModalVisivel(true)
  }

  return (
    <>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={[ styles.searchContainer, isFocused && styles.searchContainerFocused ]}>
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
          {busca !== '' && (
            <TouchableOpacity onPress={limparBusca}>
              <Ionicons name="close-circle" size={20} color={COLORS.cinzaTexto} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* ESTOQUE */}
        <View style={styles.estoqueContainer}>
          <FlatList
            data={produtosFiltrados}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.itensContainer}
            renderItem={({ item }) => (
              <CardProdutos 
                nome={item.nome}
                medida={item.medida}
                marca={item.marcas?.nome || 'Sem marca'}
                estoque={item.estoque_atual}
                iconePadrao={getIconeCategoria(item.categorias?.nome)}
                onPress={() => abrirModal(item)}
              />
            )}
          />
        </View>
      </View>
      
      {/* MODAL */}
      <ModalProdutos 
        visible={modalVisivel} 
        onClose={() => setModalVisivel(false)}
        produto={produtoSelecionado}
        onExcluido={orquestrarCarregamento}
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
    paddingVertical: SPACING.xs,
  },
})