import { useState, useCallback } from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'
import Toast from 'react-native-toast-message'

interface Marca {
  id: string | number;
  nome: string;
}

export default function Marcas() {
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [editandoId, setEditandoId] = useState<string | number | null>(null)
  const [nomeEditando, setNomeEditando] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const carregarMarcas = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('marcas')
        .select('id, nome')
        .order('nome')
      if (error) throw error
      if (data) setMarcas(data)
    } catch {
      Toast.show({ type: 'error', text1: 'Erro ao carregar marcas' })
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      carregarMarcas()
    }, [carregarMarcas])
  )

  const iniciarEdicao = (item: Marca) => {
    setEditandoId(item.id)
    setNomeEditando(item.nome)
  }

  const cancelarEdicao = () => {
    setEditandoId(null)
    setNomeEditando('')
  }

  const salvarEdicao = async (id: string | number) => {
    if (!nomeEditando.trim()) {
      Toast.show({ type: 'error', text1: 'O nome não pode ser vazio', position: 'top' })
      return
    }

    // Verifica duplicata em outra marca
    const { data: existe } = await supabase
      .from('marcas')
      .select('id')
      .ilike('nome', nomeEditando.trim())
      .neq('id', id)
      .limit(1)
      .single()

    if (existe) {
      Toast.show({ type: 'error', text1: 'Já existe uma marca com esse nome', position: 'top' })
      return
    }

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('marcas')
        .update({ nome: nomeEditando.trim() })
        .eq('id', id)
      if (error) throw error

      Toast.show({ type: 'success', text1: 'Marca atualizada', position: 'top' })
      cancelarEdicao()
      carregarMarcas()
    } catch {
      Toast.show({ type: 'error', text1: 'Erro ao atualizar marca', position: 'top' })
    } finally {
      setIsSaving(false)
    }
  }

  const excluirMarca = (item: Marca) => {
    Alert.alert(
      'Excluir Marca',
      `Tem certeza que deseja excluir "${item.nome}"? Os produtos vinculados ficarão sem marca.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('marcas')
                .delete()
                .eq('id', item.id)
              if (error) throw error

              Toast.show({ type: 'success', text1: 'Marca excluída', position: 'top' })
              carregarMarcas()
            } catch {
              Toast.show({ type: 'error', text1: 'Erro ao excluir marca', position: 'top' })
            }
          }
        }
      ]
    )
  }

  const renderItem = ({ item }: { item: Marca }) => {
    const estaEditando = editandoId === item.id

    return (
      <View style={styles.item}>
        {estaEditando ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.editInput}
              value={nomeEditando}
              onChangeText={setNomeEditando}
              autoFocus
              placeholderTextColor={COLORS.cinzaTexto}
            />
            <TouchableOpacity style={styles.btnSalvar} onPress={() => salvarEdicao(item.id)} disabled={isSaving}>
              {isSaving
                ? <ActivityIndicator size="small" color={COLORS.brancoTexto} />
                : <Ionicons name="checkmark" size={20} color={COLORS.brancoTexto} />
              }
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar} onPress={cancelarEdicao}>
              <Ionicons name="close" size={20} color={COLORS.brancoTexto} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.normalRow}>
            <Text style={styles.itemNome}>{item.nome}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity style={styles.btnEditar} onPress={() => iniciarEdicao(item)}>
                <Ionicons name="create-outline" size={18} color={COLORS.brancoTexto} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnExcluir} onPress={() => excluirMarca(item)}>
                <Ionicons name="trash-outline" size={18} color={COLORS.brancoTexto} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    )
  }

  return (
    <>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Marcas</Text>
          <TouchableOpacity onPress={() => router.replace('/perfil')}>
            <Ionicons name="close" size={24} color={COLORS.brancoTexto} />
          </TouchableOpacity>
        </View>

        <View style={styles.divisor} />

        {/* LISTA */}
        <FlatList
          data={marcas}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listaContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma marca cadastrada.</Text>
          }
          renderItem={renderItem}
        />
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
    marginBottom: SPACING.md,
  },
  listaContainer: {
    gap: SPACING.xs,
    paddingBottom: SPACING.lg,
  },
  item: {
    backgroundColor: COLORS.cinzaMedio,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  normalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemNome: {
    flex: 1,
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
  },
  acoes: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  btnEditar: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.azulInfo,
    borderRadius: RADIUS.sm,
  },
  btnExcluir: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.vermelhoPerigo,
    borderRadius: RADIUS.sm,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  editInput: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.cinzaClaro,
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
  },
  btnSalvar: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.verdeSucesso,
    borderRadius: RADIUS.sm,
  },
  btnCancelar: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.cinzaClaro,
    borderRadius: RADIUS.sm,
  },
  emptyText: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.md,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
})