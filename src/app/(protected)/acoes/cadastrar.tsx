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

export default function Cadastrar() {
  const [nome, setNome] = useState('')
  const [marca, setMarca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [medida, setMedida] = useState('')
  const [codigoBarras, setCodigoBarras] = useState('')

  return (
    <>
      <View style={styles.container}>
        {/* VIEW HEADER */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#F5F5F5" />
          </TouchableOpacity>
        </View>

        {/* SECTION FORM */}
        <View style={styles.formContainer}>
          {/* 1. NOME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Produto</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ex: Arroz Arbório ou Atum Sólido"
                placeholderTextColor="#757575"
                value={nome}
                onChangeText={setNome}
              />
            </View>
          </View>

          {/* 2. MARCA */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marca</Text>
            <TouchableOpacity 
              style={styles.selectContainer} 
              activeOpacity={0.7}
              onPress={() => console.log('Abrir modal de marcas')}
            >
              <Text style={marca ? styles.inputText : styles.placeholderText}>
                {marca ? marca : 'Selecionar ou adicionar marca...'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
            </TouchableOpacity>
          </View>

          {/* 3. CATEGORIA */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoria</Text>
            <TouchableOpacity 
              style={styles.selectContainer} 
              activeOpacity={0.7}
              onPress={() => console.log('Abrir modal de categorias')}
            >
              <Text style={categoria ? styles.inputText : styles.placeholderText}>
                {categoria ? categoria : 'Selecionar ou adicionar categoria...'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
            </TouchableOpacity>
          </View>

          {/* 4. MEDIDA */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medida</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ex: 1kg, 170g, 500ml"
                placeholderTextColor="#757575"
                value={medida}
                onChangeText={setMedida}
              />
            </View>
          </View>

          {/* 5. CÓDIGO DE BARRAS */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Código de Barras</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="barcode-outline" size={20} color="#9E9E9E" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Opcional"
                placeholderTextColor="#757575"
                keyboardType="numeric"
                value={codigoBarras}
                onChangeText={setCodigoBarras}
              />
            </View>
          </View>

          {/* BOTÃO SALVAR */}
          <TouchableOpacity style={styles.submitButton} activeOpacity={0.8}>
            <Text style={styles.submitButtonText}>Cadastrar Produto</Text>
          </TouchableOpacity>
        </View>
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
    width: '100%',
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginTop: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 16,
    height: 54,
  },
  input: {
    flex: 1,
    color: '#F5F5F5',
    fontSize: 16,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 16,
    height: 54,
  },
  inputText: {
    color: '#F5F5F5',
    fontSize: 16,
  },
  placeholderText: {
    color: '#757575',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})