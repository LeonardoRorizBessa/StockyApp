import { useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'
import MenuItem from '@/components/MenuItem'
import Toast from 'react-native-toast-message'

export default function Perfil() {
  const { signOut } = useAuth()
  const [nomeMercado, setNomeMercado] = useState()
  const [nomeADM, setNomeADM] = useState()

  // Função para buscar dados
  useFocusEffect(
    useCallback(() => {
      const carregarPerfil = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser()

          if (!user) return

          const { data, error } = await supabase
            .from('perfil')
            .select('nome_mercado, nome_adm')
            .eq('id', user.id)
            .single()

          if (data && !error) {
            setNomeMercado(data.nome_mercado)
            setNomeADM(data.nome_adm)
          }
        } catch (error) {
          console.error("Erro ao carregar perfil:", error)
        }
      }

      carregarPerfil()
    }, [])
  )

  // Função para mostrar mensagem de "Em Breve"
  const handleEmBreve = (funcionalidade: string) => {
    Toast.show({
      type: 'info',
      text1: `${funcionalidade} - Em Breve!`,
      position: 'top',
    })
  }

  // Função para confirmar o logout
  const handleSair = () => {
    Alert.alert(
      "Sair da Conta",
      "Tem certeza que deseja sair da conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", onPress: signOut, style: "destructive" }
      ]
    )
  }
  
  return (
    <>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={24} color={COLORS.brancoTexto} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{nomeMercado}</Text>
            <Text style={styles.userRole}>Administrador • {nomeADM}</Text>
          </View>
        </View>

        {/* MENU */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* GESTÃO DO MERCADO */}
          <Text style={styles.sectionTitle}>Gestão do Mercado</Text>
          <View style={styles.menuGroup}>
            <MenuItem 
              icone="cube-outline" 
              titulo="Produtos" 
              onPress={() => handleEmBreve("Apagar/Editar Produtos")} 
            />
            <MenuItem 
              icone="pricetags-outline" 
              titulo="Marcas" 
              onPress={() => handleEmBreve("Apagar/Editar Marcas")} 
            />
            <MenuItem 
              icone="list-outline" 
              titulo="Categorias" 
              onPress={() => handleEmBreve("Apagar/Editar Categorias")} 
            />
            <MenuItem 
              icone="storefront-outline" 
              titulo="Dados da Loja" 
              onPress={() => handleEmBreve("Dados da Loja")} 
            />
          </View>

          {/* APLICATIVO */}
          <Text style={styles.sectionTitle}>Aplicativo</Text>
          <View style={styles.menuGroup}>
            <MenuItem 
              icone="notifications-outline" 
              titulo="Avisos e Notificações" 
              onPress={() => handleEmBreve("Avisos e Notificações")} 
            />
            <MenuItem 
              icone="help-circle-outline" 
              titulo="Central de Ajuda (FAQ)" 
              onPress={() => handleEmBreve("Central de Ajuda")} 
            />
            <MenuItem 
              icone="chatbubbles-outline" 
              titulo="Falar com o Suporte" 
              onPress={() => handleEmBreve("Falar com o Suporte")} 
            />
            <MenuItem 
              icone="information-circle-outline" 
              titulo="Sobre o App" 
              onPress={() => handleEmBreve("Sobre o App")} 
            />
          </View>

          {/* MINHA CONTA */}
          <Text style={styles.sectionTitle}>Minha Conta</Text>
          <View style={styles.menuGroup}>
            <MenuItem 
              icone="lock-closed-outline" 
              titulo="Segurança e Senha" 
              onPress={() => handleEmBreve("Segurança e Senha")} 
            />
            <MenuItem 
              icone="log-out-outline" 
              titulo="Sair da Conta" 
              onPress={handleSair} 
              islogout={true} 
            />
          </View>
        </ScrollView>
      </View>
    </>
   
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cinzaEscuro,
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.xxl,
  },
  scrollContent: {
    paddingBottom: SPACING.xs,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cinzaMedio,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xs,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.laranjaStock,
    marginRight: SPACING.md,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
  },
  userRole: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.sm,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  menuGroup: {
    overflow: 'hidden',
    backgroundColor: COLORS.cinzaMedio,
    borderRadius: RADIUS.lg,
  },
})