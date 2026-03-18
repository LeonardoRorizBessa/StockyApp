import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, Href } from 'expo-router'

interface CardAcaoProps {
  titulo: string;
  icone: keyof typeof Ionicons.glyphMap;
  cor: string;
  rota: Href;
}

export default function CardAcao({ titulo, icone, cor, rota }: CardAcaoProps) {
  return (
    <>
      <TouchableOpacity
        style={styles.actionButton}
        activeOpacity={0.8}
        onPress={() => router.push(rota)} 
      >
        <View style={[styles.actionIconBg, { backgroundColor: `${cor}20` }]}>
          <Ionicons name={icone} size={32} color={cor} />
        </View>
        
        <Text style={styles.actionText}>{titulo}</Text>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionText: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})