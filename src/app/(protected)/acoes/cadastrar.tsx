import { useState } from 'react'
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'
import ModalSeletor from '@/components/ModalSeletor'

// Dados provisórios para testar o visual
const MARCAS_MOCK = [{ id: 1, nome: 'Camil' }, { id: 2, nome: 'Nestlé' }, { id: 3, nome: 'Coca-Cola' }]
const CATEGORIAS_MOCK = [{ id: 1, nome: 'Grãos' }, { id: 2, nome: 'Bebidas' }, { id: 3, nome: 'Limpeza' }]

export default function Cadastrar() {
  const [nome, setNome] = useState('')
  const [codigoBarras, setCodigoBarras] = useState('')
  const [medida, setMedida] = useState('')
  
  // Estados para guardar O QUE foi selecionado (id e nome)
  const [marcaSelecionada, setMarcaSelecionada] = useState<any>(null)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<any>(null)

  // Estados para controlar os Modais
  const [modalMarcaVisivel, setModalMarcaVisivel] = useState(false)
  const [modalCategoriaVisivel, setModalCategoriaVisivel] = useState(false)

  const handleSalvar = () => {
    console.log({ 
      nome, codigoBarras, medida, 
      marca: marcaSelecionada?.nome, 
      categoria: categoriaSelecionada?.nome 
    })
  }

  // Ações do Modal de Marca
  const selecionarMarca = (item: any) => setMarcaSelecionada(item)
  const adicionarMarca = (novoNome: string) => {
    // Provisório: Cria uma marca falsa só para mostrar na tela
    setMarcaSelecionada({ id: 'novo', nome: novoNome })
  }

  // Ações do Modal de Categoria
  const selecionarCategoria = (item: any) => setCategoriaSelecionada(item)
  const adicionarCategoria = (novoNome: string) => {
    setCategoriaSelecionada({ id: 'novo', nome: novoNome })
  }

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* SECTION HEADER */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Cadastrar Produto</Text>
            <TouchableOpacity onPress={() => router.replace('/home')}>
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
            <TouchableOpacity style={styles.buttonSalvar} activeOpacity={0.8} onPress={handleSalvar}>
              <Text style={styles.buttonSalvarText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* COMPONENTES DOS MODAIS */}
        <ModalSeletor
          visible={modalMarcaVisivel}
          onClose={() => setModalMarcaVisivel(false)}
          titulo="Marca"
          dados={MARCAS_MOCK}
          onSelect={selecionarMarca}
          onAdd={adicionarMarca}
        />
        <ModalSeletor
          visible={modalCategoriaVisivel}
          onClose={() => setModalCategoriaVisivel(false)}
          titulo="Categoria"
          dados={CATEGORIAS_MOCK}
          onSelect={selecionarCategoria}
          onAdd={adicionarCategoria}
        />
      </KeyboardAvoidingView>
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
    marginTop: SPACING.md,
  },
  buttonSalvarText: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
  },
})