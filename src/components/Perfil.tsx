import { View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function Perfil() {
  return ( 
    <>
      <View style={styles.container}>
        <Ionicons name="person" size={24} color="#F5F5F5" />
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
    backgroundColor: '#FF8C00',
    borderRadius: '100%',
  },
})