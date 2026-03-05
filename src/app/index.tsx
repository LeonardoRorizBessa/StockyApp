import { View, Text, StyleSheet } from 'react-native'

import Button from '@/components/Button'

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Estoque</Text>
      <Button />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
})