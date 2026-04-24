import { useState, useCallback } from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, Switch } from 'react-native'
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

export default function Saida() {
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)
  const [quantidade, setQuantidade] = useState('')
  const [isPerda, setIsPerda] = useState(false)
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
        position: 'top',
      })
    }
  }, [])

  // Carrega e observe os dados em tempo real
  useFocusEffect(
    useCallback(() => {
      carregarProdutos()

      const canalTempoReal = supabase
        .channel('atualizacoes-saida')
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
      text2: 'Para dar saída, o produto precisa ser cadastrado antes.',
      position: 'top',
    })
  }

  // Função para limpar o formulário
  const limparFormulario = () => {
    setProdutoSelecionado(null)
    setQuantidade('')
    setIsPerda(false)
  }

  // Função para salvar a saída
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

    if (qtdNumero > produtoSelecionado.estoque_atual) {
      Toast.show({
        type: 'error',
        text1: 'Estoque insuficiente',
        text2: `O estoque atual é de ${produtoSelecionado.estoque_atual} unidades.`,
        position: 'top',
      })
      return
    }
    setIsSubmitting(true)

    try {
      const novoEstoque = produtoSelecionado.estoque_atual - qtdNumero

      const { error: errorProduto } = await supabase
        .from('produtos')
        .update({ estoque_atual: novoEstoque })
        .eq('id', produtoSelecionado.id)

      if (errorProduto) throw errorProduto

      const { error: errorMovimentacao } = await supabase
        .from('movimentacoes')
        .insert({
          produto_id: produtoSelecionado.id,
          tipo: 'saida',
          quantidade: qtdNumero,
          is_perda: isPerda
        })

      if (errorMovimentacao) throw errorMovimentacao

      Toast.show({
        type: 'success',
        text1: 'Saída registrada',
        text2: 'A saída foi registrada com sucesso.',
        position: 'top',
      })
      limparFormulario()
      router.replace('/home')

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao registrar saída',
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
          <Text style={styles.headerTitle}>Saída de Estoque</Text>
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
                <InfoProdutos 
                  icone="cube-outline" 
                  label="Estoque Atual" 
                  valor={`${produtoSelecionado.estoque_atual} unidades`} 
                  corValor={produtoSelecionado.estoque_atual === 0 ? COLORS.vermelhoPerigo : undefined}
                />
              </View>
            </View>
          )}

          {/* QUANTIDADE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantidade (Saída)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2"
              placeholderTextColor={COLORS.cinzaTexto}
              keyboardType="numeric"
              value={quantidade}
              onChangeText={setQuantidade}
            />
          </View>

          {/* SWITCH DE PERDA / AVARIA */}
          <View style={styles.switchContainer}>
            <View style={styles.switchTextInfo}>
              <Text style={styles.switchLabel}>Marcar como perda?</Text>
              <Text style={styles.switchSubLabel}>Ative se o produto venceu, estragou ou foi danificado.</Text>
            </View>
            <Switch
              value={isPerda}
              onValueChange={setIsPerda}
              trackColor={{ false: COLORS.cinzaClaro, true: COLORS.laranjaStock }}
              thumbColor={COLORS.brancoTexto}
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
              <Text style={styles.buttonSalvarText}>Confirmar Saída</Text>
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
    borderColor: COLORS.vermelhoPerigo,
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cinzaMedio,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xl,
  },
  switchTextInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  switchLabel: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
  },
  switchSubLabel: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.xs,
    marginTop: 2,
  },
  buttonSalvar: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.vermelhoPerigo,
    borderRadius: RADIUS.md,
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