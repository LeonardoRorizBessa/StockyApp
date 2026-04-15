import { useState, useEffect } from 'react'
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'
import ModalSeletor from '@/components/ModalSeletor'

export default function Cadastrar() {
  const [nome, setNome] = useState('')
  const [codigoBarras, setCodigoBarras] = useState('')
  const [medida, setMedida] = useState('')
  const [marcaSelecionada, setMarcaSelecionada] = useState<any>(null)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalMarcaVisivel, setModalMarcaVisivel] = useState(false)
  const [modalCategoriaVisivel, setModalCategoriaVisivel] = useState(false)
  const [listaMarcas, setListaMarcas] = useState<any[]>([])
  const [listaCategorias, setListaCategorias] = useState<any[]>([])

  // BUSCAR MARCAS E CATEGORIAS
  useEffect(() => {
    const carregarListas = async () => {
      const { data: marcasData } = await supabase.from('marcas').select('id, nome').order('nome')
      const { data: categoriasData } = await supabase.from('categorias').select('id, nome').order('nome')
      
      if (marcasData) setListaMarcas(marcasData)
      if (categoriasData) setListaCategorias(categoriasData)
    }
    carregarListas()
  }, [])

  // AÇÕES DOS MODAIS
  const selecionarMarca = (item: any) => setMarcaSelecionada(item)
  const adicionarMarca = (novoNome: string) => {
    setMarcaSelecionada({ id: 'novo', nome: novoNome })
  }

  const selecionarCategoria = (item: any) => setCategoriaSelecionada(item)
  const adicionarCategoria = (novoNome: string) => {
    setCategoriaSelecionada({ id: 'novo', nome: novoNome })
  }

  // FUNÇÃO PARA LIMPAR O FORMULÁRIO
  const limparFormulario = () => {
    setNome('')
    setCodigoBarras('')
    setMedida('')
    setMarcaSelecionada(null)
    setCategoriaSelecionada(null)
  }

  // FUNÇÃO AUXILIAR DE VERIFICAÇÃO DE DUPLICATAS
  const verificarDuplicatas = async (tabela: string, coluna: string, valor: string) => {
    const { data, error } = await supabase
      .from(tabela)
      .select('id')
      .ilike(coluna, valor)
      .limit(1)
      .single()
    
    return data ? data.id : null
  }

  // SALVAR TUDO NO BANCO DE DADOS
  const handleSalvar = async () => {
    if (!nome.trim() || !marcaSelecionada || !categoriaSelecionada || !medida.trim() || !codigoBarras.trim()) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.")
      return
    }

    setIsSubmitting(true)

    try {
      const barrasExiste = await verificarDuplicatas('produtos', 'codigo_barras', codigoBarras.trim())
      if (barrasExiste) {
        Alert.alert("Atenção", "Já existe um produto cadastrado com este Código de Barras.")
        setIsSubmitting(false)
        return
      }

      let finalMarcaId = marcaSelecionada.id
      if (finalMarcaId === 'novo') {
        const marcaJaExiste = await verificarDuplicatas('marcas', 'nome', marcaSelecionada.nome)
        if (marcaJaExiste) {
          finalMarcaId = marcaJaExiste
        } else {
          const { data, error } = await supabase
            .from('marcas')
            .insert({ nome: marcaSelecionada.nome })
            .select()
            .single()
          if (error) throw error
          finalMarcaId = data.id
        }
      }

      let finalCategoriaId = categoriaSelecionada.id
      if (finalCategoriaId === 'novo') {
        const categoriaJaExiste = await verificarDuplicatas('categorias', 'nome', categoriaSelecionada.nome)
        if (categoriaJaExiste) {
          finalCategoriaId = categoriaJaExiste
        } else {
          const { data, error } = await supabase
            .from('categorias')
            .insert({ nome: categoriaSelecionada.nome })
            .select()
            .single()
          if (error) throw error
          finalCategoriaId = data.id
        }
      }

      const { error: produtoError } = await supabase
        .from('produtos')
        .insert({
          nome: nome.trim(),
          marca_id: finalMarcaId,
          categoria_id: finalCategoriaId,
          medida: medida.trim(),
          codigo_barras: codigoBarras.trim(),
          estoque_atual: 0,
        })

      if (produtoError) throw produtoError

      Alert.alert("Sucesso", "Produto cadastrado com sucesso!", [
        { text: "OK", onPress: () => {router.replace('/home'); limparFormulario()} }
      ])

    } catch (error) {
      console.error("Erro ao salvar:", error)
      Alert.alert("Erro", "Não foi possível cadastrar o produto. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <View style={styles.container}>
        {/* SECTION HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Cadastrar Produto</Text>
          <TouchableOpacity onPress={() => {router.replace('/home'), limparFormulario()}}>
            <Ionicons name="close" size={24} color={COLORS.brancoTexto} />
          </TouchableOpacity>
        </View>

        <View style={styles.divisor} />
        
        {/* SECTION FORMULÁRIO */}
        <View style={styles.formContainer}>
          {/* NOME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Arroz Branco"
              placeholderTextColor={COLORS.cinzaTexto}
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* MARCA */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marca</Text>
            <TouchableOpacity style={styles.selector} activeOpacity={0.8} onPress={() => setModalMarcaVisivel(true)}>
              <Text style={marcaSelecionada ? styles.inputText : styles.placeholderText}>
                {marcaSelecionada ? marcaSelecionada.nome : 'Selecionar ou Adicionar'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.cinzaTexto} />
            </TouchableOpacity>
          </View>

          {/* CATEGORIA */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoria</Text>
            <TouchableOpacity style={styles.selector} activeOpacity={0.8} onPress={() => setModalCategoriaVisivel(true)}>
              <Text style={categoriaSelecionada ? styles.inputText : styles.placeholderText}>
                {categoriaSelecionada ? categoriaSelecionada.nome : 'Selecionar ou Adicionar'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.cinzaTexto} />
            </TouchableOpacity>
          </View>

          {/* MEDIDA */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medida</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 1kg, 500ml, Unidade"
              placeholderTextColor={COLORS.cinzaTexto}
              value={medida}
              onChangeText={setMedida}
            />
          </View>

          {/* CÓDIGO DE BARRAS */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Código de Barras</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 7891020304050"
              placeholderTextColor={COLORS.cinzaTexto}
              keyboardType="numeric"
              value={codigoBarras}
              onChangeText={setCodigoBarras}
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
              <Text style={styles.buttonSalvarText}>Cadastrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAIS */}
      <ModalSeletor
        visible={modalMarcaVisivel}
        onClose={() => setModalMarcaVisivel(false)}
        titulo="Marca"
        dados={listaMarcas}
        onSelect={selecionarMarca}
        onAdd={adicionarMarca}
      />
      <ModalSeletor
        visible={modalCategoriaVisivel}
        onClose={() => setModalCategoriaVisivel(false)}
        titulo="Categoria"
        dados={listaCategorias}
        onSelect={selecionarCategoria}
        onAdd={adicionarCategoria}
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
  buttonSalvar: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.laranjaStock,
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