export const COLORS = {
  // Fundos
  cinzaEscuro: '#1C1C1C', // Fundo principal da tela
  cinzaMedio: '#2A2A2A',  // Fundo de cards, modais e inputs
  cinzaClaro: '#333333', // Fundo de ícones ou bordas
  
  // Marca
  laranjaStock: '#FF8C00',    // O Laranja principal
  
  // Textos
  brancoTexto: '#F5F5F5',   // Textos principais e títulos
  cinzaTexto: '#9E9E9E', // Textos de apoio, placeholders e ícones inativos
  
  // Status (Feedback visual)
  verdeSucesso: '#388E3C', // Verde para estoque cheio/sucesso
  vermelhoPerigo: '#D32F2F',  // Vermelho para estoque zerado/erro
  amareloAlerta: '#FBC02D', // Amarelo para alertas
  azulInfo: '#42A5F5', // Azul para informações gerais
}

export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
}

export const FONTS = {
  size: {
    xs: 10, // Rótulos muito pequenos
    sm: 12, // Rótulos pequenos
    md: 14, // Textos secundários
    lg: 16, // Textos padrão (inputs, botões)
    xl: 20, // Subtítulos
    xxl: 24, // Títulos de telas
  },
  weight: {
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  }
}

export const RADIUS = {
  sm: 8,
  md: 12, // Padrão para inputs
  lg: 16, // Padrão para cards e botões
  xl: 9999, // Para bordas totalmente arredondadas (ex: perfil)
}