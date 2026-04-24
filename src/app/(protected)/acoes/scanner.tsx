import { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Alert, Button, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { supabase } from '@/lib/supabase'
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

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [isBuscando, setIsBuscando] = useState(false)
  const [produtoEncontrado, setProdutoEncontrado] = useState<Produto | null>(null)

  // Função para buscar dados
  const buscarProdutoPorCodigo = useCallback(async (codigo: string) => {
    setIsBuscando(true)
    try {
      const { data: produto, error } = await supabase
        .from('produtos')
        .select(`
          id, nome, medida, estoque_atual, codigo_barras,
          marcas (nome), categorias (nome)
        `)
        .eq('codigo_barras', codigo)
        .single() 

      if (error || !produto) {
        Toast.show({
          type: 'error',
          text1: 'Produto não encontrado',
          text2: 'Nenhum produto corresponde ao código de barras escaneado.',
          position: 'top',
        })
      } else {
        setProdutoEncontrado(produto as any)
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao buscar produto',
        text2: 'Ocorreu um erro inesperado. Tente novamente.',
        position: 'top',
      })
      setScanned(false)
    } finally {
      setIsBuscando(false)
    }
  }, [])

  // Função para codigo de barras
  const handleBarcodeScanned = async ({ type, data }: { type: string, data: string }) => {
    if (data.length !== 13 && data.length !== 8) return 
    
    setScanned(true) 
    buscarProdutoPorCodigo(data)
  }

  // Carrega e observe os dados em tempo real
  useEffect(() => {
    if (!produtoEncontrado) return

    const canalTempoReal = supabase
      .channel('scanner-realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'produtos',
        filter: `id=eq.${produtoEncontrado.id}`
      }, () => {
        buscarProdutoPorCodigo(produtoEncontrado.codigo_barras)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(canalTempoReal)
    }
  }, [produtoEncontrado, buscarProdutoPorCodigo])

  // Função para limpar
  const limparEscaner = () => {
    setProdutoEncontrado(null)
    setScanned(false)
  }

  // Verifica permissão
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
    <>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Scanner</Text>
          <TouchableOpacity onPress={() => {router.replace('/home'), limparEscaner()}}>
            <Ionicons name="close" size={24} color={COLORS.brancoTexto} />
          </TouchableOpacity>
        </View>

        <View style={styles.divisor} />

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
    backgroundColor: '#000',
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