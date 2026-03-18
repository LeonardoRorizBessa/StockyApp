import { View, StyleSheet, FlatList, Text } from 'react-native'
import DB from '@/api/api.json'
import Perfil from '@/components/Perfil'
import Adicionar from '@/components/Adicionar'
import CardInfos from '@/components/CardInfos'

export default function Index() {
  const dadosResumo = DB.Resumo

  return (
    <>
      <View style={styles.container}>
        {/* VIEW HEADER */}
        <View style={styles.headerContainer}>
          <Perfil />
          <Adicionar />
        </View>

        {/* BEM-VINDO */}
        <Text style={styles.title}>
          Olá, Leonardo!
        </Text>

        {/* LISTA DE INFORMAÇÕES */}
        <FlatList
          horizontal={true} 
          showsHorizontalScrollIndicator={false}
          style={styles.scrollViewer}
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
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
  },
  title: {
    color: '#F5F5F5', 
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollViewer: {
    flexGrow: 0,
  },
  infosContainer: {
    gap: 8,
  },
})