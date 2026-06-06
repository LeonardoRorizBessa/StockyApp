import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

export default function Sobre() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Sobre o App</Text>
        <TouchableOpacity onPress={() => router.replace('/perfil')}>
          <Ionicons name="close" size={24} color={COLORS.brancoTexto} />
        </TouchableOpacity>
      </View>

      <View style={styles.divisor} />

      <View style={styles.body}>
        {/* LOGO */}
        <View style={styles.logoBox}>
          <Image
            source={require('@/assets/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.appNome}>STOCKY</Text>
          <Text style={styles.versao}>Versão 1.0.0</Text>
        </View>

        {/* DESCRIÇÃO */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>O que é o STOCKY?</Text>
          <Text style={styles.cardTexto}>
            O STOCKY é um aplicativo mobile de controle de estoque desenvolvido para pequenos e médios mercados. Permite registrar entradas, saídas e perdas de produtos em tempo real, com dashboard de indicadores para facilitar a gestão do seu negócio.
          </Text>
        </View>

        {/* TECNOLOGIAS */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Desenvolvido com</Text>
          <View style={styles.techList}>
            {['React Native', 'Expo', 'TypeScript', 'Supabase'].map((tech) => (
              <View key={tech} style={styles.techBadge}>
                <Text style={styles.techText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CRÉDITOS */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Desenvolvido por</Text>
          <Text style={styles.cardTexto}>Equipe STOCKY — Projeto Acadêmico{'\n'}Análise e Desenvolvimento de Sistemas</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cinzaEscuro,
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.xxl,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  headerTitle: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.weight.bold,
  },
  divisor: {
    height: 1,
    backgroundColor: COLORS.cinzaMedio,
    marginBottom: SPACING.lg,
  },
  body: {
    flex: 1,
    gap: SPACING.sm,
  },
  logoBox: {
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  logo: {
    width: 72,
    height: 72,
  },
  appNome: {
    color: COLORS.laranjaStock,
    fontSize: FONTS.size.xxl,
    fontWeight: FONTS.weight.bold,
  },
  versao: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.sm,
  },
  card: {
    backgroundColor: COLORS.cinzaMedio,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  cardTitulo: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
    textTransform: 'uppercase',
  },
  cardTexto: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
    lineHeight: 22,
  },
  techList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  techBadge: {
    backgroundColor: COLORS.cinzaClaro,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
  },
  techText: {
    color: COLORS.laranjaStock,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semiBold,
  },
})