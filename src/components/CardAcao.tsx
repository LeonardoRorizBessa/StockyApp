import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, Href } from 'expo-router'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

interface Props {
  titulo: string;
  icone: keyof typeof Ionicons.glyphMap;
  cor: string;
  rota: Href;
}

export default function CardAcao({ titulo, icone, cor, rota }: Props) {
  return (
    <>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => router.push(rota)} 
      >
        <View style={[styles.cardIcon, { backgroundColor: `${cor}20` }]}>
          <Ionicons name={icone} size={32} color={cor} />
        </View>
        <Text style={styles.cardText}>
          {titulo}
        </Text>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cinzaMedio,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  cardIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
  },
  cardText: {
    textAlign: 'center',
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.semiBold,
  },
})