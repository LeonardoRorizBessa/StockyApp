import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/hooks/useAuth'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

// Sub-componente para os botões do menu ficarem padronizados
const MenuItem = ({ icone, titulo, onPress, isDestructive = false }: { icone: any, titulo: string, onPress: () => void, isDestructive?: boolean }) => (
  <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <Ionicons name={icone} size={24} color={isDestructive ? COLORS.vermelhoPerigo : COLORS.cinzaTexto} />
      <Text style={[styles.menuItemTitle, isDestructive && { color: COLORS.vermelhoPerigo }]}>
        {titulo}
      </Text>
    </View>
    {!isDestructive && <Ionicons name="chevron-forward" size={20} color={COLORS.cinzaTexto} />}
  </TouchableOpacity>
)

export default function Perfil() {
  const { signOut } = useAuth()

  // Função provisória para os botões que ainda não têm tela
  const handleEmBreve = (funcionalidade: string) => {
    Alert.alert("Em Breve", `A tela de ${funcionalidade} será implementada em breve!`)
  }

  // Função para confirmar antes de deslogar
  const handleSair = () => {
    Alert.alert(
      "Sair da Conta",
      "Tem certeza que deseja sair do aplicativo?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", onPress: signOut, style: "destructive" }
      ]
    )
  }

  return (
    <View style={styles.container}>
      {/* SECTION HEADER */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
      </View>
      <View style={styles.divisor} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. CARD DO USUÁRIO */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={COLORS.brancoTexto} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Leonardo Bessa</Text>
            <Text style={styles.userRole}>Administrador • Gran Village</Text>
          </View>
        </View>

        {/* 2. MENU DA LOJA */}
        <Text style={styles.sectionTitle}>Gestão do Mercadinho</Text>
        <View style={styles.menuGroup}>
          <MenuItem 
            icone="storefront-outline" 
            titulo="Dados da Loja" 
            onPress={() => handleEmBreve("Dados da Loja")} 
          />
          <MenuItem 
            icone="people-outline" 
            titulo="Gerenciar Acessos" 
            onPress={() => handleEmBreve("Gerenciar Acessos")} 
          />
          <MenuItem 
            icone="notifications-outline" 
            titulo="Avisos de Estoque Baixo" 
            onPress={() => handleEmBreve("Notificações")} 
          />
        </View>

        {/* 3. MENU DA CONTA */}
        <Text style={styles.sectionTitle}>Minha Conta</Text>
        <View style={styles.menuGroup}>
          <MenuItem 
            icone="lock-closed-outline" 
            titulo="Alterar Senha" 
            onPress={() => handleEmBreve("Alterar Senha")} 
          />
          <MenuItem 
            icone="help-buoy-outline" 
            titulo="Suporte Técnico" 
            onPress={() => handleEmBreve("Suporte")} 
          />
        </View>

        {/* 4. ÁREA DE SAÍDA */}
        <View style={styles.logoutGroup}>
          <MenuItem 
            icone="log-out-outline" 
            titulo="Sair da Conta" 
            onPress={handleSair} 
            isDestructive={true} 
          />
        </View>

      </ScrollView>
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
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.weight.bold,
  },
  divisor: {
    height: 1,
    backgroundColor: COLORS.cinzaMedio,
    marginBottom: SPACING.md,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  
  // ESTILOS DO CARD DE USUÁRIO
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cinzaMedio,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.laranjaStock,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
    marginBottom: 2,
  },
  userRole: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.sm,
  },

  // ESTILOS DOS GRUPOS DE MENU
  sectionTitle: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  menuGroup: {
    backgroundColor: COLORS.cinzaMedio,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xl,
    overflow: 'hidden', // Mantém o fundo dos botões dentro das bordas
  },
  logoutGroup: {
    backgroundColor: COLORS.cinzaMedio,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.sm,
  },

  // ESTILOS DO ITEM INDIVIDUAL DO MENU
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cinzaEscuro,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuItemTitle: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.medium,
  },
})