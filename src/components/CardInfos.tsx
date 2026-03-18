import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface CardInfosProps {
  icone: keyof typeof Ionicons.glyphMap;
  cor: string;
  quantidade: number;
  label: string;
}

export default function CardInfos({ icone, cor, quantidade, label }: CardInfosProps) {
  return (
    <>
      <TouchableOpacity 
        activeOpacity={0.8}
        style={styles.card}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={icone} size={24} color={cor} />
        </View>
        <Text style={styles.cardNumber}>{quantidade}</Text>
        <Text style={styles.cardLabel}>{label}</Text>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 130,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardNumber: {
    color: '#F5F5F5',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardLabel: {
    color: '#9E9E9E',
    fontSize: 12,
    fontWeight: '500',
  }
})