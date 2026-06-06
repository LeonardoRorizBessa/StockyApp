import { useState, useCallback } from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'
import Toast from 'react-native-toast-message'

export default function DadosLoja() {
  const [nomeMercado, setNomeMercado] = useState('')
  const [nomeADM, setNomeADM] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return
          setUserId(user.id)

          const { data, error } = await supabase
            .from('perfil')
            .select('nome_mercado, nome_adm')
            .eq('id', user.id)
            .single()

          if (data && !error) {
            setNomeMercado(data.nome_mercado || '')
            setNomeADM(data.nome_adm || '')
          }
        } catch {
          Toast.show({ type: 'error', text1: 'Erro ao carregar dados' })
        }
      }
      carregar()
    }, [])
  )

  const handleSalvar = async () => {
    if (!nomeMercado.trim() || !nomeADM.trim()) {
      Toast.show({ type: 'error', text1: 'Preencha todos os campos', position: 'top' })
      return
    }
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('perfil')
        .update({ nome_mercado: nomeMercado.trim(), nome_adm: nomeADM.trim() })
        .eq('id', userId)

      if (error) throw error

      Toast.show({ type: 'success', text1: 'Dados atualizados!', position: 'top' })
      router.replace('/perfil')
    } catch {
      Toast.show({ type: 'error', text1: 'Erro ao salvar', position: 'top' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Dados da Loja</Text>
        <TouchableOpacity onPress={() => router.replace('/perfil')}>
          <Ionicons name="close" size={24} color={COLORS.brancoTexto} />
        </TouchableOpacity>
      </View>

      <View style={styles.divisor} />

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Mercado</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Mercadinho do João"
            placeholderTextColor={COLORS.cinzaTexto}
            value={nomeMercado}
            onChangeText={setNomeMercado}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Administrador</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: João Silva"
            placeholderTextColor={COLORS.cinzaTexto}
            value={nomeADM}
            onChangeText={setNomeADM}
          />
        </View>

        <TouchableOpacity
          style={[styles.btnSalvar, isSaving && { opacity: 0.7 }]}
          activeOpacity={0.8}
          onPress={handleSalvar}
          disabled={isSaving}
        >
          {isSaving
            ? <ActivityIndicator color={COLORS.brancoTexto} />
            : <Text style={styles.btnSalvarText}>Salvar Alterações</Text>
          }
        </TouchableOpacity>
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
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semiBold,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xxs,
  },
  input: {
    height: 50,
    backgroundColor: COLORS.cinzaMedio,
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  btnSalvar: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.laranjaStock,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xs,
  },
  btnSalvarText: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
  },
})