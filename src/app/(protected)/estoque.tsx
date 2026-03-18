import { useState } from 'react'
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import DB from '@/api/api.json'
import CardItens from '@/components/CardItens'

export default function Estoque() {
  const [isFocused, setIsFocused] = useState(false)
  const listaDeProdutos = DB.Produtos

  return (
    <>
      <View style={styles.container}>
        {/* BARRA DE PESQUISA */}
        <View style={[ styles.searchContainer, isFocused && styles.searchContainerFocused ]}>
          <Ionicons name="search-outline" size={24} color={isFocused ? "#FF8C00" : "#9E9E9E"} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar..."
            placeholderTextColor="#9E9E9E"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
        
        {/* SECTION ESTOQUE */}
        <Text style={styles.title}>
          Estoque
        </Text>
        <FlatList
          data={listaDeProdutos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.itensContainer}
          renderItem={({ item }) => (
            <CardItens 
              nome={item.nome}
              categoria={item.categoria}
              marca={item.marca}
              estoque={item.estoque}
              codigoBarras={item.codigoBarras}
              iconePadrao={item.icone as any}
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
    paddingTop: 48,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 30,
    height: 50,
    paddingHorizontal: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchContainerFocused: {
    borderColor: '#FF8C00',
    backgroundColor: '#333333',
  },
  searchInput: {
    flex: 1,
    color: '#F5F5F5',
    fontSize: 16,
    marginLeft: 10,
  },
  title: {
    color: '#F5F5F5', 
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  itensContainer: {
    gap: 8,
    paddingBottom: 8,
  },
})