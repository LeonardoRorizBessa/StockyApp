import { View, StyleSheet, Text } from 'react-native'

export default function Scanner() {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Scanner de Ação</Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
})