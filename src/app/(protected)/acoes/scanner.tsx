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
    backgroundColor: '#1C1C1C',
    paddingHorizontal: 12,
    paddingTop: 36,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
})