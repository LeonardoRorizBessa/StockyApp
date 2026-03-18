import { View, StyleSheet, FlatList, Text, ScrollView } from 'react-native'
import DB from '@/api/api.json'
import Perfil from '@/components/Perfil'
import CardInfos from '@/components/CardInfos'
import CardAcao from '@/components/CardAcao'
import CardMovimentacao from '@/components/CardMovimentacao'

export default function Index() {
  const dadosResumo = DB.Resumo
  const dadosMovimentacoes = DB.movimentacoes

  return (
    <>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* VIEW HEADER */}
        <View style={styles.headerContainer}>
          <Perfil />
          {/* <Text style={styles.title}>
            Leonardo Bessa
          </Text> */}
        </View>

        {/* SECTION RESUMO */}
        {/* <Text style={styles.title}>
          Olá, Leonardo!
        </Text> */}
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
              label={item.label}
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
              titulo={"Novo\nProduto"} 
              icone="add-circle-outline" 
              cor="#FF8C00" 
              rota="/acoes/cadastrar" 
            />
            <CardAcao 
              titulo={"Entrada\nEstoque"} 
              icone="arrow-down-outline" 
              cor="#388E3C" 
              rota="/acoes/entrada" 
            />
          </View>
          <View style={styles.acaoBox}>
            <CardAcao 
              titulo={"Escanear\nCódigo"} 
              icone="barcode-outline" 
              cor="#42A5F5" 
              rota="/acoes/scanner" 
            />
            <CardAcao 
              titulo={"Saída\nEstoque"} 
              icone="arrow-up-outline" 
              cor="#D32F2F" 
              rota="/acoes/saida" 
            />
          </View>
        </View>

        {/* SECTION MOVIMENTAÇÕES RECENTES */}
        <Text style={styles.title}>
          Movimentações recentes
        </Text>
        <FlatList
          data={dadosMovimentacoes}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.movimentacoesContainer}
          renderItem={({ item }) => (
            <CardMovimentacao 
              tipo={item.tipo as any}
              produto={item.produto}
              quantidade={item.quantidade}
              data={item.data}
            />
          )}
        />
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: '#F5F5F5', 
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  flatList: {
    flexGrow: 0,
    marginTop: 16,
  },
  infosContainer: {
    gap: 8,
  },
  acaoContainer: {
    gap: 8,
  },
  acaoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  movimentacoesContainer: {
    gap: 8,
    paddingBottom: 8,
  },
})