import { useState } from 'react'
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Alert,
  Button,
  ActivityIndicator
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'
import { CameraView, useCameraPermissions } from 'expo-camera'

// 1. Importações do Banco e dos Componentes Visuais
import { supabase } from '@/lib/supabase'
import InfoProdutos from '@/components/InfoProdutos'

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions()
  
  // 2. Novos Estados para controlar a busca
  const [scanned, setScanned] = useState(false)
  const [isBuscando, setIsBuscando] = useState(false)
  const [produtoEncontrado, setProdutoEncontrado] = useState<any>(null)

  // 3. Função Turbinada para Buscar no Banco
  const handleBarcodeScanned = async ({ type, data }: { type: string, data: string }) => {
    if (data.length !== 13 && data.length !== 8) return 
    
    setScanned(true) 
    setIsBuscando(true) // Mostra o "carregando"

    try {
      // Faz a busca no Supabase pelo Código de Barras
      const { data: produto, error } = await supabase
        .from('produtos')
        .select(`
          id, nome, medida, estoque_atual, codigo_barras,
          marcas (nome), categorias (nome)
        `)
        .eq('codigo_barras', data)
        .single() // Pega apenas um resultado, já que o código é único

      if (error || !produto) {
        Alert.alert(
          "Produto não encontrado", 
          `O código ${data} não está cadastrado.`,
          [
            { text: "Escanear Outro", onPress: () => { setScanned(false); setIsBuscando(false) } },
            { text: "Cadastrar Agora", onPress: () => router.replace('/acoes/cadastrar') }
          ]
        )
      } else {
        // Se achou, salva no estado para mostrar na tela
        setProdutoEncontrado(produto)
      }
    } catch (err) {
      console.error("Erro na busca:", err)
      Alert.alert("Erro", "Não foi possível conectar ao banco de dados.")
      setScanned(false)
    } finally {
      setIsBuscando(false)
    }
  }

  // 4. Função para limpar a tela e voltar para a câmera
  const limparEscaner = () => {
    setProdutoEncontrado(null)
    setScanned(false)
  }

  if (!permission) return <View style={styles.container} /> 

  if (!permission.granted) {
    return (
      <View style={styles.containerPermissao}>
        <Text style={styles.textoPermissao}>Precisamos da sua permissão para usar a câmera.</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" color={COLORS.laranjaStock} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* SECTION HEADER */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Scanner</Text>
        <TouchableOpacity onPress={() => router.replace('/home')}>
          <Ionicons name="close" size={24} color={COLORS.brancoTexto} />
        </TouchableOpacity>
      </View>

      <View style={styles.divisor} />

      {/* RENDERIZAÇÃO CONDICIONAL: Mostra o Produto OU a Câmera */}
      {produtoEncontrado ? (
        
        <View style={styles.resultadoContainer}>
          <Text style={styles.resultadoTitle}>Produto Encontrado!</Text>
          
          <View style={styles.produtoCard}>
            <Text style={styles.produtoNome}>{produtoEncontrado.nome} {produtoEncontrado.medida}</Text>
            
            <View style={styles.divisorInterno} />
            
            <View style={styles.infoGroup}>
              <InfoProdutos icone="pricetag-outline" label="Marca" valor={produtoEncontrado.marcas?.nome || 'N/A'} />
              <InfoProdutos icone="grid-outline" label="Categoria" valor={produtoEncontrado.categorias?.nome || 'N/A'} />
              <InfoProdutos icone="barcode-outline" label="Código de Barras" valor={produtoEncontrado.codigo_barras} />
              <InfoProdutos 
                icone="cube-outline" 
                label="Estoque Atual" 
                valor={`${produtoEncontrado.estoque_atual} unidades`} 
                corValor={produtoEncontrado.estoque_atual === 0 ? COLORS.vermelhoPerigo : (produtoEncontrado.estoque_atual <= 4 ? COLORS.laranjaStock : COLORS.verdeSucesso)}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.btnEscanearNovamente} 
            activeOpacity={0.8} 
            onPress={limparEscaner}
          >
            <Ionicons name="scan" size={24} color={COLORS.brancoTexto} />
            <Text style={styles.btnEscanearText}>Escanear Novo Produto</Text>
          </TouchableOpacity>
        </View>

      ) : (

        <>
          <View style={styles.cameraContainer}>
            {isBuscando ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.laranjaStock} />
                <Text style={styles.loadingText}>Buscando no banco...</Text>
              </View>
            ) : (
              <>
                <CameraView 
                  style={styles.camera} 
                  facing="back"
                  onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                  barcodeScannerSettings={{
                    barcodeTypes: ["ean13", "ean8"],
                  }}
                />
                <View style={styles.miraVisual}>
                  <View style={styles.linhaMira} />
                </View>
              </>
            )}
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Aponte a câmera para o código de barras do produto.
            </Text>
          </View>
        </>
        
      )}
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
  containerPermissao: {
    flex: 1,
    backgroundColor: COLORS.cinzaEscuro,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  textoPermissao: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.lg,
    textAlign: 'center',
    marginBottom: SPACING.lg,
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
  cameraContainer: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000', // Fundo preto enquanto a câmera não abre
  },
  camera: {
    flex: 1,
  },
  miraVisual: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linhaMira: {
    width: '80%',
    height: 2,
    backgroundColor: COLORS.laranjaStock,
    opacity: 0.7,
  },
  footerContainer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.md,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.cinzaMedio,
  },
  loadingText: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
    marginTop: SPACING.md,
  },
  resultadoContainer: {
    flex: 1,
    paddingTop: SPACING.md,
  },
  resultadoTitle: {
    color: COLORS.verdeSucesso,
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  produtoCard: {
    backgroundColor: COLORS.cinzaMedio,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  produtoNome: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.weight.bold,
    textAlign: 'center',
  },
  divisorInterno: {
    height: 1,
    backgroundColor: COLORS.cinzaEscuro,
    marginVertical: SPACING.md,
  },
  infoGroup: {
    gap: SPACING.sm,
  },
  btnEscanearNovamente: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.laranjaStock,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  btnEscanearText: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
  },
})