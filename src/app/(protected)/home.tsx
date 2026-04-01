import { View, StyleSheet, FlatList, Text, ScrollView } from 'react-native'
import DB from '@/api/api.json'
import Perfil from '@/components/Perfil'
import CardInfos from '@/components/CardInfos'
import CardAcao from '@/components/CardAcao'
import CardMovimentacao from '@/components/CardMovimentacao'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

export default function Index() {
  const dadosResumo = DB.Resumo
  const dadosMovimentacoes = DB.movimentacoes

  return (
    <>
      <View style={styles.container}>
        {/* VIEW HEADER */}
        <View style={styles.headerContainer}>
          <Perfil />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
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
          <Text style={styles.title}>
            Movimentações recentes
          </Text>
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