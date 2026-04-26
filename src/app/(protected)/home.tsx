import { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { supabase } from '@/lib/supabase'
import { COLORS, SPACING, FONTS } from '@/theme'
import Avatar from '@/components/Avatar'
import CardResumo from '@/components/CardResumo'
import CardAcao from '@/components/CardAcao'
import CardMovimentacao from '@/components/CardMovimentacao'
import Toast from 'react-native-toast-message'
import CardTop, { TopItem } from '@/components/CardTop'
import AntDesign from '@expo/vector-icons/AntDesign'

interface Resumo {
  totalUnidades: number;
  altaDemanda: number;
  estoqueBaixo: number;
  semEstoque: number;
  totalPerdas: number;
}

interface Movimentacao {
  id: string | number;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  created_at: string;
  produto: string;
}

export default function Home() {
  const [topProdutos, setTopProdutos] = useState<TopItem[]>([])
  const [topMarcas, setTopMarcas] = useState<TopItem[]>([])
  const [topCategorias, setTopCategorias] = useState<TopItem[]>([])
  const [dadosMovimentacoes, setDadosMovimentacoes] = useState<any[]>([])
  const [resumo, setResumo] = useState<Resumo>({
    totalUnidades: 0,
    altaDemanda: 0,
    estoqueBaixo: 0,
    semEstoque: 0,
    totalPerdas: 0
  })

  // Função para buscar dados
  const buscarDados = useCallback(async () => {
    try {
      // Busca o Resumo e as Movimentações
      const { data, error } = await supabase.rpc('get_dashboard_resumo')
      if (error) throw error

      if (data) {
        setResumo(data.resumo)
        setTopProdutos(data.topProdutos || [])
        setTopMarcas(data.topMarcas || [])
        setTopCategorias(data.topCategorias || [])
        const movimentacoesFormatadas = data.movimentacoes.map((mov: Movimentacao) => ({
          id: mov.id.toString(),
          tipo: mov.tipo,
          produto: mov.produto || 'Produto Indisponível',
          quantidade: mov.quantidade,
          data: new Date(mov.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
          })
        }))
        setDadosMovimentacoes(movimentacoesFormatadas)
      }

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar os dados do dashboard.',
        position: 'top',
      })
    }
  }, [])

  // Carrega e observe os dados em tempo real
  useEffect(() => {
    buscarDados()
    
    const canal = supabase
      .channel('home-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'movimentacoes' }, () => buscarDados())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'produtos' }, () => buscarDados())
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [buscarDados])

  return (
    <>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Avatar />
        </View>

        {/* BODY */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* RESUMO */}
          <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={styles.resumoContainer} horizontal={true}>
            <CardResumo 
              icone={'cube-outline'}
              cor={COLORS.brancoTexto}
              quantidade={resumo.totalUnidades}
              text={"Total de itens"}
            />
            <CardResumo 
              icone={'trending-down-outline'}
              cor={COLORS.laranjaStock}
              quantidade={resumo.estoqueBaixo}
              text={"Estoque baixo"}
            />
            <CardResumo
              icone={'alert-circle-outline'}
              cor={COLORS.vermelhoPerigo}
              quantidade={resumo.semEstoque}
              text={"Sem estoque"}
            />
            <CardResumo 
              icone={'trash-bin-outline'}
              cor={COLORS.cinzaTexto}
              quantidade={resumo.totalPerdas}
              text={"Perdas / Avarias"}
            />
          </ScrollView>

          {/* AÇÕES */}
          <View style={styles.titleContainer}>
            <AntDesign name="thunderbolt" size={20} color={COLORS.cinzaTexto} />
            <Text style={styles.subTitle}>Ações</Text>
          </View>
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

          {/* ALTA DEMANDA */}
          <View style={styles.titleContainer}>
            <AntDesign name="fire" size={20} color={COLORS.cinzaTexto} />
            <Text style={styles.subTitle}>Alta demanda</Text>
          </View>
          <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={styles.altaDemandaContainer} horizontal={true}>
            <CardTop 
              titulo="Produtos" 
              dados={topProdutos} 
            />
            <CardTop 
                titulo="Marcas" 
                dados={topMarcas} 
              />
              <CardTop 
                titulo="Categorias" 
                dados={topCategorias} 
              />
          </ScrollView>

          {/* MOVIMENTAÇÕES RECENTES */}
          <View style={styles.titleContainer}>
            <AntDesign name="field-time" size={20} color={COLORS.cinzaTexto} />
            <Text style={styles.subTitle}>Movimentações recentes</Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.xs,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    marginBottom: SPACING.xxs,
  },
  title: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.xxl,
    fontWeight: FONTS.weight.bold,
  },
  subTitle: {
    textTransform: 'uppercase',
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
  },
  scrollContent: {
    paddingBottom: SPACING.xs,
  },
  flatList: {
    flexGrow: 0,
    marginTop: SPACING.xs,
  },
  resumoContainer: {
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  acaoContainer: {
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  acaoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: SPACING.xs,
  },
  altaDemandaContainer: {
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  topRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  movimentacoesContainer: {
    gap: SPACING.xxs,
  },
})