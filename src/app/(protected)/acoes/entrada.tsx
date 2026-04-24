import { useState, useCallback } from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'
import ModalSeletor from '@/components/ModalSeletor'
import InfoProdutos from '@/components/InfoProdutos'
import Toast from 'react-native-toast-message'

interface Produto {
  id: string | number;
  nome: string;
  medida: string;
  estoque_atual: number;
  codigo_barras: string;
  marcas?: { nome: string } | null;
  categorias?: { nome: string } | null;
}

export default function Entrada() {
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)
  const [quantidade, setQuantidade] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalProdutoVisivel, setModalProdutoVisivel] = useState(false)
  const [listaProdutos, setListaProdutos] = useState<Produto[]>([])

  // Função para buscar dados
  const carregarProdutos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          id, nome, medida, estoque_atual, codigo_barras,
          marcas (nome), categorias (nome)
        `)
        .order('nome')

      if (error) throw error
      if (data) setListaProdutos(data as any)
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar produtos',
      })
    }
  }, [])

  // Carrega e observe os dados em tempo real
  useFocusEffect(
    useCallback(() => {
      carregarProdutos()

      const canalTempoReal = supabase
        .channel('atualizacoes-entrada')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'produtos' }, () => {
          carregarProdutos()
        })
        .subscribe()

      return () => {
        supabase.removeChannel(canalTempoReal)
      }
    }, [carregarProdutos])
  )

  // Ações do modal
  const selecionarProduto = (item: Produto) => {
    setProdutoSelecionado(item)
  }

  const adicionarProduto = (novoNome: string) => {
    Toast.show({
      type: 'error',
      text1: 'Produto não cadastrado',
      text2: 'Para dar entrada, o produto precisa ser cadastrado antes.',
      position: 'top',
    })
  }

  // Função para limpar o formulário
  const limparFormulario = () => {
    setProdutoSelecionado(null)
    setQuantidade('')
  }

  // Função para salvar a entrada
  const handleSalvar = async () => {
    if (!produtoSelecionado || !quantidade.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Preencha todos os campos',
        position: 'top',
      })
      return
    }

    const qtdNumero = parseInt(quantidade, 10)
    if (isNaN(qtdNumero) || qtdNumero <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Quantidade inválida',
        text2: 'A quantidade deve ser um número maior que zero.',
        position: 'top',
      })
      return
    }
    setIsSubmitting(true)

    try {
      const novoEstoque = produtoSelecionado.estoque_atual + qtdNumero

      const { error: errorProduto } = await supabase
        .from('produtos')
        .update({ estoque_atual: novoEstoque })
        .eq('id', produtoSelecionado.id)

      if (errorProduto) throw errorProduto

      const { error: errorMovimentacao } = await supabase
        .from('movimentacoes')
        .insert({
          produto_id: produtoSelecionado.id,
          tipo: 'entrada',
          quantidade: qtdNumero,
          is_perda: false
        })

      if (errorMovimentacao) throw errorMovimentacao

      Toast.show({
        type: 'success',
        text1: 'Entrada registrada',
        text2: 'A entrada foi registrada com sucesso.',
        position: 'top',
      })
      limparFormulario()
      router.replace('/home')

    } catch (error) {
      console.error("Erro ao registrar entrada:", error)
      Toast.show({
        type: 'error',
        text1: 'Erro ao registrar entrada',
        text2: 'Tente novamente mais tarde.',
        position: 'top',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Entrada de Estoque</Text>
          <TouchableOpacity onPress={() => {router.replace('/home'), limparFormulario()}}>
            <Ionicons name="close" size={24} color={COLORS.brancoTexto} />
          </TouchableOpacity>
        </View>

        <View style={styles.divisor} />
        
        {/* FORM */}
        <View style={styles.formContainer}>
          {/* SELECIONAR PRODUTO */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Produto</Text>
            <TouchableOpacity style={styles.selector} activeOpacity={0.8} onPress={() => setModalProdutoVisivel(true)}>
              <Text style={produtoSelecionado ? styles.inputText : styles.placeholderText}>
                {produtoSelecionado ? produtoSelecionado.nome : 'Selecionar Produto'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.cinzaTexto} />
            </TouchableOpacity>
          </View>

          {/* INFORMAÇÕES DO PRODUTO SELECIONADO */}
          {produtoSelecionado && (
            <View style={styles.produtoInfoContainer}>
              <Text style={styles.infoSectionTitle}>Detalhes do Produto</Text>
              <View style={styles.infoGroup}>
                <InfoProdutos icone="cube-outline" label="Medida" valor={produtoSelecionado.medida} />
                <InfoProdutos icone="pricetag-outline" label="Marca" valor={produtoSelecionado.marcas?.nome || 'N/A'} />
                <InfoProdutos icone="grid-outline" label="Categoria" valor={produtoSelecionado.categorias?.nome || 'N/A'} />
                <InfoProdutos icone="barcode-outline" label="Código de Barras" valor={produtoSelecionado.codigo_barras} />
                <InfoProdutos icone="cube-outline" label="Estoque Atual" valor={`${produtoSelecionado.estoque_atual} unidades`} />
              </View>
            </View>
          )}

          {/* QUANTIDADE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantidade (Entrada) </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 5"
              placeholderTextColor={COLORS.cinzaTexto}
              keyboardType="numeric"
              value={quantidade}
              onChangeText={setQuantidade}
            />
          </View>

          {/* BOTÃO */}
          <TouchableOpacity 
            style={[styles.buttonSalvar, isSubmitting && styles.buttonSalvarDisabled]} 
              activeOpacity={0.8} 
              onPress={handleSalvar}
              disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.brancoTexto} />
            ) : (
              <Text style={styles.buttonSalvarText}>Confirmar Entrada</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL DE PRODUTOS */}
      <ModalSeletor
        visible={modalProdutoVisivel}
        onClose={() => setModalProdutoVisivel(false)}
        titulo="Produto"
        dados={listaProdutos}
        onSelect={selecionarProduto}
        onAdd={adicionarProduto} 
      />
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
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
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
  selector: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cinzaMedio,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  inputText: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
  },
  placeholderText: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.md,
  },
  produtoInfoContainer: {
    backgroundColor: COLORS.cinzaMedio,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.verdeSucesso,
  },
  infoSectionTitle: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  infoGroup: {
    gap: SPACING.sm,
  },
  buttonSalvar: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.verdeSucesso,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
  },
  buttonSalvarDisabled: {
    opacity: 0.7,
  },
  buttonSalvarText: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
  },
})