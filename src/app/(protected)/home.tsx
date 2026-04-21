import { useState, useCallback, useEffect } from 'react'
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Text, 
  ScrollView, 
  RefreshControl,
} from 'react-native'
import { supabase } from '@/lib/supabase'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'
import Avatar from '@/components/Avatar'
import CardInfos from '@/components/CardInfos'
import CardAcao from '@/components/CardAcao'
import CardMovimentacao from '@/components/CardMovimentacao'


export default function Home() {
  const [refreshing, setRefreshing] = useState(false)
  const [dadosResumo, setDadosResumo] = useState<any[]>([])
  const [dadosMovimentacoes, setDadosMovimentacoes] = useState<any[]>([])
  const [nomeMercado, setNomeMercado] = useState()

  // 1. FUNÇÃO DE BUSCAR DADOS
  const buscarDados = async () => {
    const resProdutos = await supabase.from('produtos').select('id, estoque_atual')
    if (resProdutos.error) throw resProdutos.error

    const resMov = await supabase
      .from('movimentacoes')
      .select('id, tipo, quantidade, produto_id, is_perda, created_at, produtos (nome)')
      .order('created_at', { ascending: false })
    if (resMov.error) throw resMov.error

    return {
      produtosBrutos: resProdutos.data || [],
      movimentacoesBrutas: resMov.data || []
    }
  }

  // 2. FUNÇÃO DE CALCULAR RESUMO
  const calcularResumo = (produtos: any[], movimentacoes: any[]) => {
    const totalUnidades = produtos.reduce((soma, p) => soma + (p.estoque_atual || 0), 0)
    const estoqueBaixo = produtos.filter(p => p.estoque_atual >= 1 && p.estoque_atual <= 4).length
    const semEstoque = produtos.filter(p => p.estoque_atual === 0).length

    const totalPerdas = movimentacoes
      .filter(m => m.is_perda === true)
      .reduce((soma, m) => soma + m.quantidade, 0)

    const saidasNormais = movimentacoes.filter(m => m.tipo === 'saida' && !m.is_perda)
    const vendasPorProduto: Record<number, number> = {}
    saidasNormais.forEach(s => {
      vendasPorProduto[s.produto_id] = (vendasPorProduto[s.produto_id] || 0) + s.quantidade
    })
    
    const produtosComSaida = Object.keys(vendasPorProduto).length
    const altaDemanda = produtosComSaida > 20 ? 20 : produtosComSaida

    return [
      { id: "1", icone: "cube-outline", cor: COLORS.brancoTexto, quantidade: totalUnidades, text: "Total de itens" },
      { id: "2", icone: "trending-up-outline", cor: COLORS.verdeSucesso, quantidade: altaDemanda, text: "Alta demanda" },
      { id: "3", icone: "trending-down-outline", cor: COLORS.laranjaStock, quantidade: estoqueBaixo, text: "Estoque baixo" },
      { id: "4", icone: "alert-circle-outline", cor: COLORS.vermelhoPerigo, quantidade: semEstoque, text: "Sem estoque" },
      { id: "5", icone: "trash-bin-outline", cor: COLORS.cinzaTexto, quantidade: totalPerdas, text: "Perdas / Avarias" }
    ]
  }

  // 3. FUNÇÃO DE FORMATAÇÃO DE MOVIMENTAÇÕES
  const formatarMovimentacoes = (movimentacoes: any[]) => {
    return movimentacoes.slice(0, 5).map(mov => ({
      id: mov.id.toString(),
      tipo: mov.tipo,
      produto: mov.produtos?.nome || 'Produto Indisponível',
      quantidade: mov.quantidade,
      data: new Date(mov.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
      })
    }))
  }

  // 4. FUNÇÃO DE CARREGAR DADOS
  const carregarDados = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: perfilData } = await supabase
          .from('perfil')
          .select('nome_mercado')
          .eq('id', user.id)
          .single()
          
        if (perfilData) {
          setNomeMercado(perfilData.nome_mercado)
        }
      }
      const { produtosBrutos, movimentacoesBrutas } = await buscarDados()

      const resumoProcessado = calcularResumo(produtosBrutos, movimentacoesBrutas)
      const movimentacoesProcessadas = formatarMovimentacoes(movimentacoesBrutas)

      setDadosResumo(resumoProcessado)
      setDadosMovimentacoes(movimentacoesProcessadas)

    } catch (error) {
      console.error("Erro ao orquestrar a Home:", error)
    }
  }, [])

  // GATILHOS
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await carregarDados()
    setRefreshing(false)
  }, [carregarDados])

  useEffect(() => {
    carregarDados()

    const canalTempoReal = supabase
      .channel('mudancas-estoque')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'movimentacoes' }, () => {
        carregarDados()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'produtos' }, () => {
        carregarDados()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(canalTempoReal)
    }
  }, [carregarDados])

  return (
    <>
      <View style={styles.container}>
        {/* SECTION HEADER */}
        <View style={styles.headerContainer}>
          <Avatar />
          <Text style={styles.userName}>
            {nomeMercado}
          </Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={[COLORS.laranjaStock]} 
              tintColor={COLORS.laranjaStock} 
            />
          }
        >
          {/* SECTION RESUMO */}
          <FlatList
            horizontal={true} 
            showsHorizontalScrollIndicator={false}
            style={styles.flatList}
            contentContainerStyle={styles.infosContainer}
            data={dadosResumo}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardInfos 
                icone={item.icone as any}
                cor={item.cor}
                quantidade={item.quantidade}
                text={item.text}
              />
            )}
          />

          {/* SECTION AÇÕES RÁPIDAS */}
          <Text style={styles.title}>Ações Rápidas</Text>
          <View style={styles.acaoContainer}>
            <View style={styles.acaoBox}>
              <CardAcao 
                titulo={"Cadastrar\nProduto"} 
                icone="add-circle-outline" 
                cor={COLORS.laranjaStock} 
                rota="/acoes/cadastrar" 
              />
              <CardAcao 
                titulo={"Entrada\nEstoque"} 
                icone="arrow-down-outline" 
                cor={COLORS.verdeSucesso} 
                rota="/acoes/entrada" 
              />
            </View>
            <View style={styles.acaoBox}>
              <CardAcao 
                titulo={"Escanear\nCódigo"} 
                icone="barcode-outline" 
                cor={COLORS.azulInfo}
                rota="/acoes/scanner" 
              />
              <CardAcao 
                titulo={"Saída\nEstoque"} 
                icone="arrow-up-outline" 
                cor={COLORS.vermelhoPerigo}
                rota="/acoes/saida" 
              />
            </View>
          </View>

          {/* SECTION MOVIMENTAÇÕES RECENTES */}
          <Text style={styles.title}>Movimentações recentes</Text>
          <View style={styles.movimentacoesContainer}>
            {dadosMovimentacoes.map((item) => (
              <CardMovimentacao 
                key={item.id}
                tipo={item.tipo as any}
                produto={item.produto}
                quantidade={item.quantidade}
                data={item.data}
              />
            ))}
          </View>
        </ScrollView>
      </View>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.xs,
    gap: SPACING.sm,
  },
  userName: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
  },
  scrollContent: {
    paddingBottom: SPACING.xs,
  },
  title: {
    textTransform: 'uppercase',
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  flatList: {
    flexGrow: 0,
    marginTop: SPACING.xs,
  },
  infosContainer: {
    gap: SPACING.xs,
  },
  acaoContainer: {
    gap: SPACING.xs,
  },
  acaoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: SPACING.xs,
  },
  movimentacoesContainer: {
    gap: SPACING.xxs,
  },
})