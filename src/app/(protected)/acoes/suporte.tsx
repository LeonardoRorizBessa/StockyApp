import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'
import Toast from 'react-native-toast-message'

const CANAIS = [
  {
    icone: 'mail-outline' as const,
    titulo: 'E-mail',
    valor: 'suporte@stockyapp.com',
    descricao: 'Respondemos em até 24 horas úteis.',
  },
  {
    icone: 'logo-whatsapp' as const,
    titulo: 'WhatsApp',
    valor: '(85) 99999-9999',
    descricao: 'Atendimento de seg. a sex., das 8h às 18h.',
  },
  {
    icone: 'chatbubble-ellipses-outline' as const,
    titulo: 'Chat no App',
    valor: 'Em breve',
    descricao: 'Suporte integrado diretamente pelo aplicativo.',
  },
]

export default function Suporte() {
  const handleContato = (titulo: string) => {
    Toast.show({
      type: 'info',
      text1: `${titulo}`,
      text2: 'Funcionalidade em breve!',
      position: 'top',
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Falar com o Suporte</Text>
        <TouchableOpacity onPress={() => router.replace('/perfil')}>
          <Ionicons name="close" size={24} color={COLORS.brancoTexto} />
        </TouchableOpacity>
      </View>

      <View style={styles.divisor} />

      <View style={styles.intro}>
        <Text style={styles.introTexto}>
          Está com algum problema ou dúvida? Entre em contato com a nossa equipe por um dos canais abaixo.
        </Text>
      </View>

      <View style={styles.lista}>
        {CANAIS.map((canal) => (
          <TouchableOpacity
            key={canal.titulo}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => handleContato(canal.titulo)}
          >
            <View style={styles.cardIcon}>
              <Ionicons name={canal.icone} size={24} color={COLORS.laranjaStock} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitulo}>{canal.titulo}</Text>
              <Text style={styles.cardValor}>{canal.valor}</Text>
              <Text style={styles.cardDescricao}>{canal.descricao}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.cinzaTexto} />
          </TouchableOpacity>
        ))}
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
  intro: {
    marginBottom: SPACING.lg,
  },
  introTexto: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.md,
    lineHeight: 22,
  },
  lista: {
    gap: SPACING.xs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cinzaMedio,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.cinzaClaro,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardTitulo: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
    textTransform: 'uppercase',
  },
  cardValor: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.semiBold,
  },
  cardDescricao: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.sm,
  },
})