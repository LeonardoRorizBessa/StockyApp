import { useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

const PERGUNTAS = [
  {
    pergunta: 'Como cadastrar um novo produto?',
    resposta: 'Na tela inicial (Dashboard), toque em "Cadastrar Produto". Preencha o nome, marca, categoria, medida e código de barras. Caso a marca ou categoria não exista, você pode criar uma nova diretamente pelo campo de seleção.',
  },
  {
    pergunta: 'Como registrar uma entrada de estoque?',
    resposta: 'No Dashboard, toque em "Entrada Estoque". Selecione o produto desejado, informe a quantidade que entrou e confirme. O estoque será atualizado automaticamente.',
  },
  {
    pergunta: 'Como registrar uma saída de estoque?',
    resposta: 'No Dashboard, toque em "Saída Estoque". Selecione o produto, informe a quantidade e, se o produto venceu ou foi avariado, ative o toggle "Marcar como perda". Confirme para atualizar o estoque.',
  },
  {
    pergunta: 'Como usar o scanner de código de barras?',
    resposta: 'Toque em "Escanear Código" no Dashboard. Aponte a câmera para o código de barras EAN do produto. O app buscará automaticamente o produto cadastrado com aquele código.',
  },
  {
    pergunta: 'O que significa "Estoque Baixo"?',
    resposta: 'Produtos com 4 unidades ou menos são considerados de estoque baixo e aparecem destacados em laranja. Produtos com 0 unidades aparecem em vermelho como "Sem Estoque".',
  },
  {
    pergunta: 'Como editar ou excluir um produto?',
    resposta: 'Na tela de Estoque, toque no produto desejado. Na janela que abrir, você verá os botões "Editar" e "Excluir" na parte inferior.',
  },
  {
    pergunta: 'Como editar marcas e categorias?',
    resposta: 'Acesse Perfil → Gestão do Mercado → Marcas (ou Categorias). Toque no ícone de lápis ao lado do item que deseja editar, ou no ícone de lixeira para excluir.',
  },
  {
    pergunta: 'O app funciona sem internet?',
    resposta: 'Não. O STOCKY depende de conexão com a internet para sincronizar os dados em tempo real com o banco de dados. Certifique-se de estar conectado ao Wi-Fi ou dados móveis.',
  },
]

export default function FAQ() {
  const [aberto, setAberto] = useState<number | null>(null)

  const toggle = (index: number) => {
    setAberto(prev => prev === index ? null : index)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Perguntas Frequentes</Text>
        <TouchableOpacity onPress={() => router.replace('/perfil')}>
          <Ionicons name="close" size={24} color={COLORS.brancoTexto} />
        </TouchableOpacity>
      </View>

      <View style={styles.divisor} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.lista}>
        {PERGUNTAS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => toggle(index)}
          >
            <View style={styles.perguntaRow}>
              <Text style={styles.perguntaText}>{item.pergunta}</Text>
              <Ionicons
                name={aberto === index ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.laranjaStock}
              />
            </View>
            {aberto === index && (
              <>
                <View style={styles.divisorInterno} />
                <Text style={styles.respostaText}>{item.resposta}</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    marginBottom: SPACING.md,
  },
  lista: {
    gap: SPACING.xs,
    paddingBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.cinzaMedio,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  perguntaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  perguntaText: {
    flex: 1,
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.semiBold,
  },
  divisorInterno: {
    height: 1,
    backgroundColor: COLORS.cinzaClaro,
    marginVertical: SPACING.sm,
  },
  respostaText: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.md,
    lineHeight: 22,
  },
})