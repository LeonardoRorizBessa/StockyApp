import { useState, useCallback } from 'react'
import { View, StyleSheet, FlatList, Text, ScrollView, ActivityIndicator } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { supabase } from '@/lib/supabase'
import Avatar from '@/components/Avatar'
import CardInfos from '@/components/CardInfos'
import CardAcao from '@/components/CardAcao'
import CardMovimentacao from '@/components/CardMovimentacao'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [dadosResumo, setDadosResumo] = useState<any[]>([])
  const [dadosMovimentacoes, setDadosMovimentacoes] = useState<any[]>([])

  const carregarDadosHome = async () => {
    try {
      setLoading(true)
      
      // Busca produtos
      const { data: produtosData } = await supabase
        .from('produtos')
        .select('id, estoque_atual')

      // Busca TODAS as movimentações para o cálculo do resumo (Alta Demanda e Perdas)
      const { data: movData, error: movError } = await supabase
        .from('movimentacoes')
        .select(`
          id, tipo, quantidade, produto_id, is_perda, created_at,
          produtos (nome)
        `)
        .order('created_at', { ascending: false })

      if (movError) throw movError

      if (produtosData && movData) {
        // --- CÁLCULOS DO RESUMO ---
        const totalUnidades = produtosData.reduce((soma, p) => soma + (p.estoque_atual || 0), 0)
        const estoqueBaixo = produtosData.filter(p => p.estoque_atual >= 1 && p.estoque_atual <= 4).length
        const semEstoque = produtosData.filter(p => p.estoque_atual === 0).length

        // 👇 NOVA REGRA: Soma as quantidades apenas onde is_perda é TRUE
        const totalPerdasUnidades = movData
          .filter(m => m.is_perda === true)
          .reduce((soma, m) => soma + m.quantidade, 0)

        // Cálculo de Alta Demanda (Top 20 produtos com mais saídas)
        const saidasNormais = movData.filter(m => m.tipo === 'saida' && !m.is_perda)
        const vendasPorProduto: Record<number, number> = {}
        saidasNormais.forEach(s => {
          vendasPorProduto[s.produto_id] = (vendasPorProduto[s.produto_id] || 0) + s.quantidade
        })
        const totalProdutosAltaDemanda = Object.keys(vendasPorProduto).length
        const altaDemandaCount = totalProdutosAltaDemanda > 20 ? 20 : totalProdutosAltaDemanda

        setDadosResumo([
          { id: "1", icone: "cube-outline", cor: COLORS.brancoTexto, quantidade: totalUnidades, text: "Total de itens" },
          { id: "2", icone: "trending-up-outline", cor: COLORS.verdeSucesso, quantidade: altaDemandaCount, text: "Alta demanda" },
          { id: "3", icone: "trending-down-outline", cor: COLORS.laranjaStock, quantidade: estoqueBaixo, text: "Estoque baixo" },
          { id: "4", icone: "alert-circle-outline", cor: COLORS.vermelhoPerigo, quantidade: semEstoque, text: "Sem estoque" },
          { id: "5", icone: "trash-bin-outline", cor: COLORS.cinzaTexto, quantidade: totalPerdasUnidades, text: "Perdas / Avarias" }
        ])

        // --- MOVIMENTAÇÕES RECENTES (LIMITANDO A 5) ---
        // Como o SQL já trouxe ordenado por data, pegamos apenas os 5 primeiros
        const formatadas = movData.slice(0, 5).map(mov => ({
          id: mov.id.toString(),
          tipo: mov.tipo,
          produto: mov.produtos?.nome || 'Produto Indisponível',
          quantidade: mov.quantidade,
          data: new Date(mov.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
          })
        }))
        setDadosMovimentacoes(formatadas)
      }

    } catch (error) {
      console.error("Erro na Home:", error)
    } finally {
      setLoading(false)
    }
  }

  // O Efeito que atualiza os dados toda vez que a Home é aberta
  useFocusEffect(
    useCallback(() => {
      carregarDadosHome()
    }, [])
  )

  return (
    <>
      <View style={styles.container}>
        {/* VIEW HEADER */}
        <View style={styles.headerContainer}>
          <Avatar />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* SECTION RESUMO */}
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.laranjaStock} style={{ height: 100, justifyContent: 'center' }} />
          ) : (
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
          )}

          {/* SECTION AÇÕES RÁPIDAS */}
          <Text style={styles.title}>
            Ações Rápidas
          </Text>
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
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.laranjaStock} style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.movimentacoesContainer}>
              {dadosMovimentacoes.length > 0 ? (
                dadosMovimentacoes.map((item) => (
                  <CardMovimentacao 
                    key={item.id}
                    tipo={item.tipo as any}
                    produto={item.produto}
                    quantidade={item.quantidade}
                    data={item.data}
                  />
                ))
              ) : (
                <Text style={{ color: COLORS.cinzaTexto, textAlign: 'center', marginTop: 10 }}>
                  Nenhuma movimentação registrada.
                  <View style={{ height: 80 }} />
                </Text>
              )}
            </View>
          )}
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
  },
  title: {
    color: COLORS.brancoTexto, 
    fontSize: FONTS.size.lg,
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
    paddingRight: SPACING.md,
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
    paddingBottom: SPACING.xs,
  },
})