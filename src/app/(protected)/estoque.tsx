import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'
import CardProdutos from '@/components/CardProdutos'
import ModalProdutos from '@/components/ModalProdutos'

export default function Estoque() {
  const [isFocused, setIsFocused] = useState(false)
  const [dadosProdutos, setDadosProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [modalVisivel, setModalVisivel] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null)

  useEffect(() => {
    buscarProdutos()
  }, [])

  const buscarProdutos = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          id,
          nome,
          medida,
          codigo_barras,
          estoque_atual,
          marcas (nome),
          categorias (nome)
        `)

      if (error) {
        console.error("Erro do Supabase:", error)
        return
      }

      if (data) {
        setDadosProdutos(data)
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

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
        <View style={[ styles.searchContainer, isFocused && styles.searchContainerFocused ]}>
          <Ionicons name="search-outline" size={24} color={isFocused ? COLORS.laranjaStock : COLORS.cinzaTexto} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar..."
            placeholderTextColor={COLORS.cinzaTexto}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
        
        {/* SECTION ESTOQUE */}
        {loading 
          ? 
            (
              <ActivityIndicator size="large" color={COLORS.laranjaStock} style={{ marginTop: 40 }} />
            ) 
          : 
            (
              <FlatList
                data={dadosProdutos}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.itensContainer}
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
            )
        }
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
  itensContainer: {
    marginTop: SPACING.xs,
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
})