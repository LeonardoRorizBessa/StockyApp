import { View, Text, StyleSheet } from 'react-native'

export default function Estoque() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estoque</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    padding: 20,
  },
  title: {
    color: '#F5F5F5', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 10,
  },
})