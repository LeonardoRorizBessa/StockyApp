import { View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function Adicionar() {
  return ( 
    <>
      <View style={styles.container}>
        <Ionicons name="add-outline" size={24} color="#FF8C00" />
      </View>
    </>
   )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#2A2A2A',
    borderRadius: '100%',
  },
})